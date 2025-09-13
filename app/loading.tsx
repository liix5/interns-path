import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className=" flex justify-center items-center">
      <Loader2 className="animate-spin text-primary mx-auto m-30" />
    </div>
  );
}
