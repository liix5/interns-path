"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendProfessionRequest } from "@/app/lib/actions";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "جاري الإرسال..." : "إرسال"}
    </Button>
  );
}

export function ProfessionRequestForm({ source }: { source: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(sendProfessionRequest, {
    message: null,
  });

  // Show toast + close dialog if success
  useEffect(() => {
    if (state?.message) {
      if (state.message.startsWith("❌")) {
        toast.error(state.message, {
          richColors: true,
        });
      } else {
        toast.success(state.message, {
          richColors: true,
        });
        setOpen(false); // ✅ close dialog
      }
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="underline cursor-pointer text-xs text-primary p-0"
        >
          إرفع طلب لإضافته
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>طلب إضافة تخصص</DialogTitle>
        </DialogHeader>
        <form
          action={formAction}
          onSubmit={(e) => e.stopPropagation()}
          className="space-y-4"
        >
          <input type="hidden" name="source" value={source} />
          <Input name="profession" placeholder="اكتب تخصصك هنا" required />
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
