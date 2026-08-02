"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendFeedback } from "@/app/lib/actions";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { MessageSquarePlus, X, Loader2 } from "lucide-react";

function SubmitButton({ disabled, isSubmitting }: { disabled: boolean; isSubmitting: boolean }) {
  const { pending } = useFormStatus();
  const isLoading = pending || isSubmitting;
  return (
    <Button type="submit" className="w-full" disabled={isLoading || disabled}>
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          جاري الإرسال...
        </>
      ) : (
        "إرسال"
      )}
    </Button>
  );
}

const feedbackTypes = [
  { value: "suggestion", label: "اقتراح" },
  { value: "complaint", label: "شكوى" },
  { value: "question", label: "سؤال" },
  { value: "general", label: "ملاحظة عامة" },
];

export function FeedbackDialog() {
  const [open, setOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [message, setMessage] = useState("");
  const [showBadge, setShowBadge] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(sendFeedback, {
    message: null,
  });

  // Show badge after 5 seconds, unless dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("feedbackBadgeDismissed");
    if (dismissed) return;

    const timer = setTimeout(() => {
      setShowBadge(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const dismissBadge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBadge(false);
    localStorage.setItem("feedbackBadgeDismissed", "true");
  };

  useEffect(() => {
    if (state?.message) {
      setIsSubmitting(false);
      if (state.message.startsWith("❌") || state.message.startsWith("⚠️")) {
        toast.error(state.message, {
          richColors: true,
        });
      } else {
        toast.success(state.message, {
          richColors: true,
        });
        setOpen(false);
        formRef.current?.reset();
        setFeedbackType("");
        setMessage("");
      }
    }
  }, [state]);

  const isMessageValid = message.trim().length >= 3;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="fixed bottom-4 left-4 z-50">
          {/* Speech bubble badge */}
          {showBadge && (
            <div className="absolute -top-12 left-6">
              <div className="relative bg-background/80 backdrop-blur-sm border border-border text-foreground text-xs px-5 py-2 rounded-2xl shadow-lg">
                <button
                  onClick={dismissBadge}
                  className="absolute -top-1.5 -right-1.5 size-5 bg-muted hover:bg-muted-foreground/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="size-3" />
                </button>
                <p className="font-medium whitespace-nowrap">
                  عندك فكرة أو ملاحظة؟
                </p>
                <p className="text-muted-foreground whitespace-nowrap">
                  نحب نسمعها منك
                </p>
                {/* Speech bubble tail */}
                <div className="absolute -bottom-2 left-3 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-border" />
                <div className="absolute -bottom-[6px] left-[13px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-background/80" />
              </div>
            </div>
          )}
          {/* Main icon button */}
          <Button
            variant="outline"
            size="icon"
            className="size-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 bg-background/80 backdrop-blur-sm border border-border"
            aria-label="شاركنا رأيك"
          >
            <MessageSquarePlus className="size-5" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="pt-4">
          <DialogTitle>رأيك يهمنا </DialogTitle>
          <DialogDescription>
            إذا عندك اقتراح، فكرة، أو حتى واجهت مشكلة في الموقع,شاركنا. ملاحظاتك
            تساعدنا نحسّن التجربة للجميع.{" "}
          </DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          action={formAction}
          onSubmit={(e) => {
            e.stopPropagation();
            setIsSubmitting(true);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">نوع الملاحظة</label>
            <Select
              name="type"
              value={feedbackType}
              onValueChange={setFeedbackType}
              dir="rtl"
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر نوع الملاحظة" />
              </SelectTrigger>
              <SelectContent>
                {feedbackTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.type && (
              <p className="text-sm text-destructive">{state.errors.type[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">الرسالة</label>
            <Textarea
              name="message"
              placeholder="اكتب رسالتك هنا..."
              required
              className="min-h-24"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {state?.errors?.message && (
              <p className="text-sm text-destructive">
                {state.errors.message[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              للتواصل معك{" "}
              <span className="text-muted-foreground font-normal">
                (اختياري)
              </span>
            </label>
            <Input
              name="email"
              type="email"
              placeholder="بريدك الإلكتروني لو تحب نرد عليك"
            />
            {state?.errors?.email && (
              <p className="text-sm text-destructive">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <SubmitButton disabled={!isMessageValid} isSubmitting={isSubmitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
