import { RequestDetails } from "@/app/requests/[id]/_components/requestDetails";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { type Metadata } from "next";

export async function generateMetadata({ params }: PageProps<"/requests/[id]">): Promise<Metadata> {
  const { id } = await params;
  const request = await fetchQuery(api.requests.getRequestById, { requestId: id as Id<"requests"> });

  if (!request) {
    return {
      title: "Request Not Found",
    };
  }

  return {
    title: `${request.patientName} - ${request.bloodTypeNeeded} (${request.numberOfBags} bags)`,
    description: `${request.urgency} urgency request for ${request.numberOfBags} bags of ${request.bloodTypeNeeded} blood at ${request.hospitalName}, ${request.hospitalLocation}.`,
  };
}

export default async function RequestReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <RequestDetails requestId={id as Id<"requests">} />;
}
