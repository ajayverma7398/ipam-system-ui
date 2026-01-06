"use client";

import { Breadcrumb } from "@/components/common/layout";
import { AdvancedIPSearch } from "@/components/ip-management";

export default function FindIPPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>

      <div className="flex-1 overflow-y-auto">
        <AdvancedIPSearch />
      </div>
    </div>
  );
}

