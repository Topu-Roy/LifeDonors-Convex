import { internalMutation, mutation, query } from "@/convex/_generated/server";
import { paginationOptsValidator } from "convex/server";
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
    cause: v.union(v.literal("Operation"), v.literal("Delivery"), v.literal("Accident"), v.literal("Other")),
    patientAge: v.number(),
    patientGender: v.union(v.literal("Male"), v.literal("Female"), v.literal("Other")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", identity.subject))
      .first();

    if (!profile) throw new Error("Profile not found");

    const searchableText = `${args.patientName} ${args.hospitalName} ${args.bloodTypeNeeded}`.toLowerCase();

    return await ctx.db.insert("requests", {
      ...args,
      requesterId: profile._id,
      status: "Open",
      createdAt: Date.now(),
      searchableText,
    });
  },
});

export const updateBloodRequest = mutation({
  args: {
    requestId: v.id("requests"),
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
    cause: v.union(v.literal("Operation"), v.literal("Delivery"), v.literal("Accident"), v.literal("Other")),
    patientAge: v.number(),
    patientGender: v.union(v.literal("Male"), v.literal("Female"), v.literal("Other")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", identity.subject))
      .first();

    if (!profile) throw new Error("Profile not found");

    const existingRequest = await ctx.db.get("requests", args.requestId);
    if (!existingRequest) throw new Error("Request not found");

    if (existingRequest.requesterId !== profile._id) {
      throw new Error("Unauthorized to edit this request");
    }

    const { requestId, ...updateData } = args;
    const searchableText =
      `${updateData.patientName} ${updateData.hospitalName} ${updateData.bloodTypeNeeded}`.toLowerCase();

    await ctx.db.patch("requests", requestId, {
      ...updateData,
      searchableText,
    });
  },
});

export const getRequestsForHome = query({
  args: {
    bloodType: v.optional(v.string()),
    division: v.optional(v.string()),
    district: v.optional(v.string()),
    subDistrict: v.optional(v.string()),
    urgency: v.optional(v.string()),
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

    return await requests.order("desc").take(4);
  },
});

export const getPaginatedRequests = query({
  args: {
    paginationOpts: paginationOptsValidator,
    bloodType: v.optional(v.string()),
    division: v.optional(v.string()),
    district: v.optional(v.string()),
    subDistrict: v.optional(v.string()),
    urgency: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { bloodType, division, district, subDistrict, urgency, searchQuery } = args;

    if (searchQuery) {
      return await ctx.db
        .query("requests")
        .withSearchIndex("search_text", q => {
          let search = q.search("searchableText", searchQuery);
          if (bloodType) search = search.eq("bloodTypeNeeded", bloodType as "A+");
          if (urgency) search = search.eq("urgency", urgency as "Low");
          if (division) search = search.eq("division", division);
          if (district) search = search.eq("district", district);
          if (subDistrict) search = search.eq("subDistrict", subDistrict);
          return search.eq("status", "Open");
        })
        .paginate(args.paginationOpts);
    }

    let requests = ctx.db.query("requests").withIndex("by_status", q => q.eq("status", "Open"));

    if (bloodType) {
      requests = requests.filter(q => q.eq(q.field("bloodTypeNeeded"), bloodType));
    }
    if (urgency) {
      requests = requests.filter(q => q.eq(q.field("urgency"), urgency));
    }
    if (division) {
      requests = requests.filter(q => q.eq(q.field("division"), division));
    }
    if (district) {
      requests = requests.filter(q => q.eq(q.field("district"), district));
    }
    if (subDistrict) {
      requests = requests.filter(q => q.eq(q.field("subDistrict"), subDistrict));
    }

    return await requests.order("desc").paginate(args.paginationOpts);
  },
});

export const backfillSearchableText = internalMutation({
  args: {},
  handler: async ctx => {
    const requests = await ctx.db.query("requests").collect();
    for (const request of requests) {
      if (!request.searchableText) {
        const searchableText =
          `${request.patientName} ${request.hospitalName} ${request.bloodTypeNeeded}`.toLowerCase();
        await ctx.db.patch("requests", request._id, { searchableText });
      }
    }
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

export const getPaginatedMyRequests = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", identity.subject))
      .first();

    if (!profile) throw new Error("Profile not found");

    const paginatedRequests = await ctx.db
      .query("requests")
      .withIndex("by_requesterId", q => q.eq("requesterId", profile._id))
      .order("desc")
      .paginate(args.paginationOpts);

    const enrichedPage = await Promise.all(
      paginatedRequests.page.map(async request => {
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

    return {
      ...paginatedRequests,
      page: enrichedPage,
    };
  },
});

export const getRequestById = query({
  args: { requestId: v.id("requests") },
  handler: async (ctx, args) => {
    const request = await ctx.db.get("requests", args.requestId);
    if (!request) return null;

    let isOwner = false;
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", q => q.eq("userId", identity.subject))
        .first();
      if (request.requesterId === profile?._id) {
        isOwner = true;
      }
    }

    const donations = await ctx.db
      .query("donations")
      .withIndex("by_requestId", q => q.eq("requestId", args.requestId))
      .collect();

    const volunteers = await Promise.all(
      donations.map(async donation => {
        if (!isOwner) {
          return {
            ...donation,
            donor: null,
          };
        }

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
      isOwner,
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
