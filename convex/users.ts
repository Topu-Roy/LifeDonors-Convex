import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateProfile = mutation({
  args: {
    age: v.number(),
    bmi: v.number(),
    bloodType: v.union(
      v.literal("A+"),
      v.literal("A-"),
      v.literal("B+"),
      v.literal("B-"),
      v.literal("AB+"),
      v.literal("AB-"),
      v.literal("O+"),
      v.literal("O-"),
    ),
    hemoglobinLevel: v.number(),
    diseases: v.array(v.string()),
    phoneNumber: v.string(),
    lastDonationDate: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, {
        ...args,
      });
    } else {
      await ctx.db.insert("profiles", {
        ...args,
        userId: identity.subject,
      });
    }
  },
});

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();
  },
});

export const checkEligibility = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { eligible: false, reason: "Not logged in" };

    const userData = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();
    if (!userData) return { eligible: false, reason: "User not found" };

    const { age, bmi, hemoglobinLevel, lastDonationDate, diseases } = userData;

    // Check if profile is complete
    if (
      age === undefined ||
      bmi === undefined ||
      hemoglobinLevel === undefined
    ) {
      return {
        eligible: false,
        reason: "Profile incomplete. Please fill in your donor details.",
      };
    }

    if (age < 18 || age > 65) {
      return {
        eligible: false,
        reason: "Age must be between 18 and 65 years.",
      };
    }

    if (bmi < 18.5 || bmi > 30) {
      return {
        eligible: false,
        reason: "BMI must be between 18.5 and 30 for safe donation.",
      };
    }

    if (hemoglobinLevel < 12.5) {
      return {
        eligible: false,
        reason: "Hemoglobin level must be at least 12.5 g/dL.",
      };
    }

    if (diseases && diseases.length > 0) {
      return {
        eligible: false,
        reason:
          "You listed conditions that may prevent donation. Please consult a doctor.",
      };
    }

    if (lastDonationDate) {
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const DONATION_COOLDOWN_DAYS = 56;

      const daysSinceLastDonation =
        (Date.now() - lastDonationDate) / MS_PER_DAY;
      const daysRemaining = Math.ceil(
        DONATION_COOLDOWN_DAYS - daysSinceLastDonation,
      );

      if (daysRemaining > 0) {
        return {
          eligible: false,
          reason: `Next donation possible in ${daysRemaining} days.`,
        };
      }
    }

    return { eligible: true };
  },
});

export const createBloodRequest = mutation({
  args: {
    phoneNumber: v.string(),
    patientName: v.string(),
    hospitalName: v.string(),
    hospitalLocation: v.string(),
    bloodTypeNeeded: v.union(
      v.literal("A+"),
      v.literal("A-"),
      v.literal("B+"),
      v.literal("B-"),
      v.literal("AB+"),
      v.literal("AB-"),
      v.literal("O+"),
      v.literal("O-"),
    ),
    urgency: v.union(
      v.literal("Low"),
      v.literal("Medium"),
      v.literal("High"),
      v.literal("Critical"),
    ),
    contactNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("requests", {
      ...args,
      requesterId: identity.subject,
      status: "Open",
      createdAt: Date.now(),
    });
  },
});

export const getAllRequests = query({
  args: {
    bloodType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let requests = ctx.db
      .query("requests")
      .withIndex("by_status", (q) => q.eq("status", "Open"));

    if (args.bloodType) {
      requests = requests.filter((q) =>
        q.eq(q.field("bloodTypeNeeded"), args.bloodType),
      );
    }

    return await requests.order("desc").collect();
  },
});

export const acceptRequest = mutation({
  args: {
    requestId: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");
    if (request.status !== "Open") throw new Error("Request no longer open");

    // Create donation record
    await ctx.db.insert("donations", {
      donorId: identity.subject,
      requestId: args.requestId,
      status: "Pending",
      acceptedAt: Date.now(),
    });

    // Update request status
    await ctx.db.patch(args.requestId, {
      status: "Accepted",
    });
  },
});

export const getMyRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const requests = await ctx.db
      .query("requests")
      .withIndex("by_requesterId", (q) => q.eq("requesterId", identity.subject))
      .order("desc")
      .collect();

    return await Promise.all(
      requests.map(async (request) => {
        if (request.status === "Accepted" || request.status === "Completed") {
          const donation = await ctx.db
            .query("donations")
            .withIndex("by_requestId", (q) => q.eq("requestId", request._id))
            .filter((q) =>
              q.or(
                q.eq(q.field("status"), "Pending"),
                q.eq(q.field("status"), "Donated"),
              ),
            )
            .first();

          if (donation) {
            const donorProfile = await ctx.db
              .query("profiles")
              .withIndex("by_userId", (q) => q.eq("userId", donation.donorId))
              .first();
            return {
              ...request,
              donation,
              donor: donorProfile,
            };
          }
        }
        return {
          ...request,
          donation: undefined,
          donor: undefined,
        };
      }),
    );
  },
});

export const getMyDonations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const donations = await ctx.db
      .query("donations")
      .withIndex("by_donorId", (q) => q.eq("donorId", identity.subject))
      .collect();

    const enrichedDonations = await Promise.all(
      donations.map(async (donation) => {
        const request = await ctx.db.get(donation.requestId);
        return {
          ...donation,
          request,
        };
      }),
    );

    return enrichedDonations;
  },
});

export const updateDonationStatus = mutation({
  args: {
    donationId: v.id("donations"),
    status: v.union(v.literal("Donated"), v.literal("No Show")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const donation = await ctx.db.get(args.donationId);
    if (!donation) throw new Error("Donation record not found");

    const request = await ctx.db.get(donation.requestId);
    if (!request) throw new Error("Request not found");

    const isDonor = donation.donorId === identity.subject;
    const isRequester = request.requesterId === identity.subject;

    if (!isDonor && !isRequester) throw new Error("Forbidden");

    await ctx.db.patch(args.donationId, {
      status: args.status,
    });

    // If completed, update the request status as well
    if (args.status === "Donated") {
      await ctx.db.patch(donation.requestId, {
        status: "Completed",
      });
    } else if (args.status === "No Show") {
      // If donor didn't show up, put request back to Open
      await ctx.db.patch(donation.requestId, {
        status: "Open",
      });
    }
  },
});

export const cancelRequest = mutation({
  args: { requestId: v.id("requests") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");
    if (request.requesterId !== identity.subject) throw new Error("Forbidden");

    await ctx.db.patch(args.requestId, { status: "Cancelled" });

    // Cancel any pending donation
    const pendingDonation = await ctx.db
      .query("donations")
      .withIndex("by_requestId", (q) => q.eq("requestId", args.requestId))
      .filter((q) => q.eq(q.field("status"), "Pending"))
      .first();

    if (pendingDonation) {
      await ctx.db.patch(pendingDonation._id, { status: "Cancelled" });
    }
  },
});

export const rejectDonor = mutation({
  args: { donationId: v.id("donations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const donation = await ctx.db.get(args.donationId);
    if (!donation) throw new Error("Donation not found");

    const request = await ctx.db.get(donation.requestId);
    if (!request || request.requesterId !== identity.subject) {
      throw new Error("Forbidden");
    }

    await ctx.db.patch(args.donationId, { status: "Rejected" });
    await ctx.db.patch(donation.requestId, { status: "Open" });
  },
});

export const withdrawDonation = mutation({
  args: { donationId: v.id("donations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const donation = await ctx.db.get(args.donationId);
    if (!donation || donation.donorId !== identity.subject) {
      throw new Error("Forbidden");
    }

    if (donation.status !== "Pending") {
      throw new Error("Can only withdraw pending donations");
    }

    await ctx.db.patch(args.donationId, { status: "Withdrawn" });
    await ctx.db.patch(donation.requestId, { status: "Open" });
  },
});
