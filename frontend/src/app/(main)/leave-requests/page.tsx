import { Suspense } from "react";

import { Skeleton } from "@/components/ui/Skeleton";
import LeaveRequestsPage from "./LeaveRequestsContent";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <LeaveRequestsPage />
    </Suspense>
  );
}
