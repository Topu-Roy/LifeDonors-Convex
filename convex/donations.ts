import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const offerDonation = mutation({
  args: {
    requestId: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const request = await ctx.db.get("requests", args.requestId);
    if (!request) throw new Error("Request not found");
    if (request.status !== "Open") throw new Error("Request no longer open");

    // Create donation record as "Offered"
    await ctx.db.insert("donations", {
      donorId: identity.subject,
      requestId: args.requestId,
      status: "Offered",
      acceptedAt: Date.now(),
    });
    // Note: Request remains "Open" until enough donors are "Selected"
  },
});

export const getMyDonations = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const donations = await ctx.db
      .query("donations")
      .withIndex("by_donorId", q => q.eq("donorId", identity.subject))
      .collect();

    const enrichedDonations = await Promise.all(
      donations.map(async donation => {
        const request = await ctx.db.get("requests", donation.requestId);
        return {
          ...donation,
          request,
        };
      })
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

    const donation = await ctx.db.get("donations", args.donationId);
    if (!donation) throw new Error("Donation record not found");

    const request = await ctx.db.get("requests", donation.requestId);
    if (!request) throw new Error("Request not found");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", identity.subject))
      .first();

    const isDonor = donation.donorId === identity.subject;
    const isRequester = request.requesterId === profile?._id;

    if (!isDonor && !isRequester) throw new Error("Forbidden");

    await ctx.db.patch("donations", args.donationId, {
      status: args.status,
    });

    // Recalculate request status
    const allAcceptedDonations = await ctx.db
      .query("donations")
      .withIndex("by_requestId", q => q.eq("requestId", donation.requestId))
      .filter(q => q.or(q.eq(q.field("status"), "Accepted"), q.eq(q.field("status"), "Donated")))
      .collect();

    const filledBags = allAcceptedDonations.length;

    if (args.status === "Donated") {
      // If this was the last bag needed, mark request as Completed or keep as Accepted
      const allDonated = allAcceptedDonations.every(d => d.status === "Donated");
      if (filledBags >= request.numberOfBags && allDonated) {
        await ctx.db.patch("requests", donation.requestId, {
          status: "Completed",
        });
      }
    } else if (args.status === "No Show") {
      // If a donor didn't show, we definitely need to open it back up if we were at capacity
      if (filledBags < request.numberOfBags) {
        await ctx.db.patch("requests", donation.requestId, { status: "Open" });
      }
    }
  },
});

export const selectDonor = mutation({
  args: { donationId: v.id("donations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const donation = await ctx.db.get("donations", args.donationId);
    if (!donation) throw new Error("Donation not found");

    const request = await ctx.db.get("requests", donation.requestId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", identity.subject))
      .first();

    if (!request || request.requesterId !== profile?._id) {
      throw new Error("Forbidden");
    }

    if (donation.status !== "Offered") {
      throw new Error("Can only select donors who have offered help");
    }

    await ctx.db.patch("donations", args.donationId, { status: "Accepted" });

    // Check if we reached capacity
    const allAcceptedDonations = await ctx.db
      .query("donations")
      .withIndex("by_requestId", q => q.eq("requestId", donation.requestId))
      .filter(q => q.or(q.eq(q.field("status"), "Accepted"), q.eq(q.field("status"), "Donated")))
      .collect();

    if (allAcceptedDonations.length >= request.numberOfBags) {
      await ctx.db.patch("requests", donation.requestId, {
        status: "Accepted",
      });
    }
  },
});

export const rejectDonor = mutation({
  args: { donationId: v.id("donations"), requestId: v.id("requests") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const donation = await ctx.db.get("donations", args.donationId);
    if (!donation) throw new Error("Donation not found");

    const request = await ctx.db.get("requests", args.requestId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", identity.subject))
      .first();

    if (!request || request.requesterId !== profile?._id) {
      throw new Error("Forbidden");
    }

    const wasAccepted = donation.status === "Accepted";
    await ctx.db.patch("donations", args.donationId, { status: "Rejected" });

    if (wasAccepted) {
      // Re-open request if we drop below capacity
      const allAcceptedDonations = await ctx.db
        .query("donations")
        .withIndex("by_requestId", q => q.eq("requestId", donation.requestId))
        .filter(q => q.or(q.eq(q.field("status"), "Accepted"), q.eq(q.field("status"), "Donated")))
        .collect();

      if (allAcceptedDonations.length < request.numberOfBags) {
        await ctx.db.patch("requests", donation.requestId, { status: "Open" });
      }
    }
  },
});

export const withdrawDonation = mutation({
  args: { donationId: v.id("donations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const donation = await ctx.db.get("donations", args.donationId);
    if (donation?.donorId !== identity.subject) {
      throw new Error("Forbidden");
    }

    if (donation.status !== "Offered" && donation.status !== "Accepted") {
      throw new Error("Can only withdraw active commitments");
    }

    const wasAccepted = donation.status === "Accepted";
    await ctx.db.patch("donations", args.donationId, { status: "Withdrawn" });

    if (wasAccepted) {
      const request = await ctx.db.get("requests", donation.requestId);
      if (request) {
        const allAcceptedDonations = await ctx.db
          .query("donations")
          .withIndex("by_requestId", q => q.eq("requestId", donation.requestId))
          .filter(q => q.or(q.eq(q.field("status"), "Accepted"), q.eq(q.field("status"), "Donated")))
          .collect();

        if (allAcceptedDonations.length < request.numberOfBags) {
          await ctx.db.patch("requests", donation.requestId, {
            status: "Open",
          });
        }
      }
    }
  },
});
