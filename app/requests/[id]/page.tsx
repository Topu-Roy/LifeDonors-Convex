import { RequestDetails } from "@/app/requests/[id]/_components/requestDetails";
import { type Id } from "@/convex/_generated/dataModel";

export default async function RequestReviewPage({ params }: PageProps<"/requests/[id]">) {
  const { id } = await params;

  return <RequestDetails requestId={id as Id<"requests">} />;
}
