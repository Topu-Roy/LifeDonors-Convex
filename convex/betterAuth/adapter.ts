import { createAuthOptions } from "@/convex/betterAuth/auth";
import schema from "@/convex/betterAuth/schema";
import { createApi } from "@convex-dev/better-auth";

export const { create, findOne, findMany, updateOne, updateMany, deleteOne, deleteMany } = createApi(
  schema,
  createAuthOptions
);
