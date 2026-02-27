import { Landing } from "@/components/landing";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function PageContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <Landing session={session} />;
}

function PageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
      {/* Hero skeleton */}
      <div className="container mx-auto px-4 py-16 space-y-8">
        <Skeleton className="h-16 w-3/4 mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto" />
        <Skeleton className="h-12 w-40 mx-auto" />
        <Skeleton className="h-96 w-full mt-8" />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}
