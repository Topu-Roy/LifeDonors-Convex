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
