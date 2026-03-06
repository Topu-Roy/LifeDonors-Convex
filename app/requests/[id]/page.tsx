import { type Id } from "@/convex/_generated/dataModel";
import { RequestDetails } from "./_components/requestDetails";

export default async function RequestReviewPage({ params }: PageProps<"/requests/[id]">) {
  const { id } = await params;

  return <RequestDetails requestId={id as Id<"requests">} />;
}
