import { Loader2 } from "lucide-react";

function SkeletonCard() {
  return (
    <div className="w-full h-[280px] rounded-xl border bg-card animate-pulse">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 w-24 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-20 bg-muted rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="p-4">
      {/* Hero section placeholder */}
      <div className="py-11 flex justify-center">
        <div className="flex flex-col items-center gap-6 max-w-xl">
          <div className="h-6 w-32 bg-muted rounded-full animate-pulse" />
          <div className="h-12 w-80 bg-muted rounded animate-pulse" />
          <div className="h-6 w-64 bg-muted rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Filter section placeholder - fixed height to prevent CLS */}
      <div className="flex justify-center mb-4">
        <div className="h-10 w-64 bg-muted rounded-lg animate-pulse" />
      </div>
      <div className="flex justify-center gap-2 mb-6 min-h-[44px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-24 bg-muted rounded-full animate-pulse" />
        ))}
      </div>

      {/* Cards grid placeholder */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Loading indicator */}
      <div className="flex justify-center mt-8">
        <Loader2 className="animate-spin text-primary size-6" />
      </div>
    </div>
  );
}
