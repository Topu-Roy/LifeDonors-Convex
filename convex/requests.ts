import { mutation, query } from "@/convex/_generated/server";
import { v } from "convex/values";

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
      v.literal("O-")
    ),
    urgency: v.union(v.literal("Low"), v.literal("Medium"), v.literal("High"), v.literal("Critical")),
    contactNumber: v.string(),
    numberOfBags: v.number(),
    division: v.optional(v.string()),
    district: v.optional(v.string()),
    subDistrict: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", identity.subject))
      .first();

    if (!profile) throw new Error("Profile not found");

    return await ctx.db.insert("requests", {
      ...args,
      requesterId: profile._id,
      status: "Open",
      createdAt: Date.now(),
    });
  },
});

export const getAllRequests = query({
  args: {
    bloodType: v.optional(v.string()),
    division: v.optional(v.string()),
    district: v.optional(v.string()),
    subDistrict: v.optional(v.string()),
    urgency: v.optional(v.string()),
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let requests = ctx.db.query("requests").withIndex("by_status", q => q.eq("status", "Open"));

    if (args.bloodType) {
      requests = requests.filter(q => q.eq(q.field("bloodTypeNeeded"), args.bloodType));
    }

    if (args.urgency) {
      requests = requests.filter(q => q.eq(q.field("urgency"), args.urgency));
    }

    if (args.division) {
      requests = requests.filter(q => q.eq(q.field("division"), args.division));
    }

    if (args.district) {
      requests = requests.filter(q => q.eq(q.field("district"), args.district));
    }

    if (args.subDistrict) {
      requests = requests.filter(q => q.eq(q.field("subDistrict"), args.subDistrict));
    }

    if (args.take) {
      return await requests.order("desc").take(args.take);
    }

    return await requests.order("desc").collect();
  },
});

export const getMyRequests = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", identity.subject))
      .first();

    if (!profile) throw new Error("Profile not found");

    const requests = await ctx.db
      .query("requests")
      .withIndex("by_requesterId", q => q.eq("requesterId", profile._id))
      .order("desc")
      .collect();

    return await Promise.all(
      requests.map(async request => {
        const donations = await ctx.db
          .query("donations")
          .withIndex("by_requestId", q => q.eq("requestId", request._id))
          .collect();

        const volunteers = await Promise.all(
          donations.map(async donation => {
            const donorProfile = await ctx.db
              .query("profiles")
              .withIndex("by_userId", q => q.eq("userId", donation.donorId))
              .first();
            return {
              ...donation,
              donor: donorProfile,
            };
          })
        );

        return {
          ...request,
          volunteers,
        };
      })
    );
  },
});

export const getRequestById = query({
  args: { requestId: v.id("requests") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", identity.subject))
      .first();

    const request = await ctx.db.get("requests", args.requestId);
    if (!request || request.requesterId !== profile?._id) return null;

    const donations = await ctx.db
      .query("donations")
      .withIndex("by_requestId", q => q.eq("requestId", args.requestId))
      .collect();

    const volunteers = await Promise.all(
      donations.map(async donation => {
        const donorProfile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", q => q.eq("userId", donation.donorId))
          .first();
        return {
          ...donation,
          donor: donorProfile,
        };
      })
    );

    return {
      ...request,
      volunteers,
    };
  },
});

export const cancelRequest = mutation({
  args: { requestId: v.id("requests") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const request = await ctx.db.get("requests", args.requestId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", identity.subject))
      .first();

    if (!request) throw new Error("Request not found");
    if (request.requesterId !== profile?._id) throw new Error("Forbidden");

    await ctx.db.patch("requests", args.requestId, { status: "Cancelled" });

    // Cancel any pending/offered/accepted donations
    const activeDonations = await ctx.db
      .query("donations")
      .withIndex("by_requestId", q => q.eq("requestId", args.requestId))
      .filter(q => q.or(q.eq(q.field("status"), "Offered"), q.eq(q.field("status"), "Accepted")))
      .collect();

    for (const donation of activeDonations) {
      await ctx.db.patch("donations", donation._id, { status: "Cancelled" });
    }
  },
});
