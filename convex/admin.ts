import { query } from "@/convex/_generated/server";
import { authComponent, createAuth } from "@/convex/betterAuth/auth";

export const getStats = query({
  args: {},
  handler: async ctx => {
    // 1. Admin Authorization Check
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const session = await auth.api.getSession({ headers });

    if (session?.user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can access stats.");
    }

    // 2. Aggregate Stats
    const totalProfiles = await ctx.db.query("profiles").collect();
    const totalRequests = await ctx.db.query("requests").collect();
    const totalDonations = await ctx.db.query("donations").collect();

    const openRequests = totalRequests.filter(r => r.status === "Open").length;
    const completedRequests = totalRequests.filter(r => r.status === "Completed").length;

    return {
      totalProfiles: totalProfiles.length,
      totalRequests: totalRequests.length,
      totalDonations: totalDonations.length,
      openRequests,
      completedRequests,
    };
  },
});
