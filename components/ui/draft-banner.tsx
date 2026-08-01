"use client";

import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";

interface DraftBannerProps {
  preview?: string;
  currentStep?: number;
  totalSteps?: number;
  onRestore: () => void;
  onDiscard: () => void;
  restoreLabel?: string;
  discardLabel?: string;
}

export function DraftBanner({
  preview,
  currentStep,
  totalSteps,
  onRestore,
  onDiscard,
  restoreLabel = "استعادة",
  discardLabel = "تجاهل",
}: DraftBannerProps) {
  const showStepInfo = currentStep !== undefined && totalSteps !== undefined;

  return (
    <div
      dir="rtl"
      className="relative rounded-lg border border-primary/20 bg-primary/5 p-4 mb-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-foreground">
              لديك تقدم محفوظ
            </p>
            {showStepInfo && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                الخطوة {currentStep + 1} من {totalSteps}
              </span>
            )}
          </div>
          {preview && (
            <p className="text-sm text-muted-foreground leading-relaxed break-words mb-3">
              "{preview}"
            </p>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={onRestore}
            >
              {restoreLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDiscard}
            >
              {discardLabel}
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={onDiscard}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
