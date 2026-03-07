import betterAuth from "@/convex/betterAuth/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();

app.use(betterAuth);

export default app;
