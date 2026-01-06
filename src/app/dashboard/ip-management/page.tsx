"use client";

import {
  IPFinder,
  QuickAllocate,
  RecentAllocations,
  IPUtilization,
  CIDRCalculator,
} from "@/components/ip-management";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function IPManagementPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto">
          <div className="lg:col-span-2 space-y-6">
            <IPFinder />
            <IPUtilization />
          </div>

          <div className="space-y-6">
            <QuickAllocate />
            <RecentAllocations />
            <div className="lg:hidden">
              <CIDRCalculator cidr="" />
            </div>
          </div>
        </div>
      </div>
  );
}

