import { LoadingState } from "@/components/common/loading-state";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingState message="Preparing Velocity Fit..." />
    </div>
  );
}
