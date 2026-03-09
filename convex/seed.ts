import { allSeedData } from "@/assets/seed/seedData";
import { mutation } from "@/convex/_generated/server";
import { authComponent, createAuth } from "@/convex/betterAuth/auth";

type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
type Urgency = "Low" | "Medium" | "High" | "Critical";
type Status = "Open" | "Accepted" | "Completed" | "Cancelled";
type Cause = "Operation" | "Delivery" | "Accident" | "Other";
type Gender = "Male" | "Female" | "Other";

type SeedRequest = {
  patientName: string;
  hospitalName: string;
  hospitalLocation: string;
  bloodTypeNeeded: BloodType;
  urgency: Urgency;
  contactNumber: string;
  phoneNumber: string;
  numberOfBags: number;
  cause: Cause;
  patientAge: number;
  patientGender: Gender;
  division: string;
  district: string;
  subDistrict: string;
  status: Status;
  isSeed: boolean;
};

export const seedDatabase = mutation({
  args: {},
  handler: async ctx => {
    // 1. Admin Authorization Check
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const session = await auth.api.getSession({ headers });

    if (session?.user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can seed the database.");
    }

    // 2. Check if requests table is empty
    const existingRequests = await ctx.db.query("requests").first();
    if (existingRequests !== null) {
      return {
        success: false,
        message: "Database already contains requests. Seeding aborted to prevent duplicates.",
      };
    }

    // 3. Get Admin Profile for requesterId
    const adminProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", session.user.id))
      .first();

    if (!adminProfile) throw new Error("Failed to resolve admin profile.");

    // 4. Seed the database
    console.log(`Starting seed of ${allSeedData.length} requests...`);

    let count = 0;
    const typedSeedData = allSeedData as SeedRequest[];

    for (const request of typedSeedData) {
      const searchableText =
        `${request.patientName} ${request.hospitalName} ${request.bloodTypeNeeded}`.toLowerCase();
      await ctx.db.insert("requests", {
        ...request,
        requesterId: adminProfile._id,
        createdAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30),
        isSeed: true,
        searchableText,
      });
      count++;
    }

    return {
      success: true,
      message: `Successfully seeded ${count} requests into the database.`,
    };
  },
});

export const deleteSeedData = mutation({
  args: {},
  handler: async ctx => {
    // 1. Admin Authorization Check
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const session = await auth.api.getSession({ headers });

    if (session?.user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can delete seed data.");
    }

    // 2. Query and delete all requests with isSeed: true
    const seedRequests = await ctx.db
      .query("requests")
      .filter(q => q.eq(q.field("isSeed"), true))
      .collect();

    for (const request of seedRequests) {
      await ctx.db.delete("requests", request._id);
    }

    return {
      success: true,
      message: `Successfully deleted ${seedRequests.length} seeded requests.`,
    };
  },
});
