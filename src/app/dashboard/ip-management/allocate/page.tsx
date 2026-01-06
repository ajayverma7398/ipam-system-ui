import { Suspense } from "react";
import Breadcrumb from "@/components/common/layout/Breadcrumb";
import { AllocateIPContent } from "./AllocateIPContent";

function AllocateIPLoadingFallback() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading allocation wizard...</p>
        </div>
      </div>
    </div>
  );
}

export default function AllocateIPPage() {
  return (
    <Suspense fallback={<AllocateIPLoadingFallback />}>
      <AllocateIPContent />
    </Suspense>
  );
}

