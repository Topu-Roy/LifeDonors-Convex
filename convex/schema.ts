import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    userId: v.string(), // Better Auth userId
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
    lastDonationDate: v.number(), // Timestamp
  })
    .index("by_bloodType", ["bloodType"])
    .index("by_userId", ["userId"]),

  requests: defineTable({
    requesterId: v.string(), // Better Auth userId
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
    status: v.union(
      v.literal("Open"),
      v.literal("Accepted"),
      v.literal("Completed"),
      v.literal("Cancelled"),
    ),
    contactNumber: v.string(),
    numberOfBags: v.number(),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_bloodTypeNeeded", ["bloodTypeNeeded"])
    .index("by_requesterId", ["requesterId"])
    .index("by_urgency", ["urgency"]),

  donations: defineTable({
    donorId: v.string(), // Better Auth userId
    requestId: v.id("requests"),
    status: v.union(
      v.literal("Offered"),
      v.literal("Accepted"),
      v.literal("Donated"),
      v.literal("No Show"),
      v.literal("Withdrawn"),
      v.literal("Rejected"),
      v.literal("Cancelled"),
    ),
    acceptedAt: v.optional(v.number()),
  })
    .index("by_requestId", ["requestId"])
    .index("by_donorId", ["donorId"]),
});
