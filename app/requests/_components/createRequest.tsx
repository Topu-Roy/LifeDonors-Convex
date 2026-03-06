"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BloodRequestForm } from "./BloodRequestForm";

export function CreateRequest() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={props => (
          <Button {...props} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Post a Request
          </Button>
        )}
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Request Blood</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <BloodRequestForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
