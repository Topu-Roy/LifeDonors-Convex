import { History, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonationTab } from "./donationTab";
import { RequestTab } from "./requestTab";

export function DashboardTabs() {
  return (
    <Tabs defaultValue={"requests"} className="w-full space-y-8">
      <TabsList className="bg-background h-12 w-full max-w-md rounded-full border p-1 shadow-sm md:h-14">
        <TabsTrigger
          value="requests"
          className="data-[state=active]:bg-primary h-full gap-2 rounded-full px-4 text-xs font-bold transition-all data-[state=active]:text-white md:px-8 md:text-sm"
        >
          <MessageSquare className="h-4 w-4" />
          My Requests
        </TabsTrigger>
        <TabsTrigger
          value="donations"
          className="data-[state=active]:bg-primary h-full gap-2 rounded-full px-4 text-xs font-bold transition-all data-[state=active]:text-white md:px-8 md:text-sm"
        >
          <History className="h-4 w-4" />
          My Donations
        </TabsTrigger>
      </TabsList>

      <TabsContent value="requests" className="space-y-6 focus-visible:outline-none">
        <RequestTab />
      </TabsContent>

      <TabsContent value="donations" className="space-y-6 focus-visible:outline-none">
        <DonationTab />
      </TabsContent>
    </Tabs>
  );
}
