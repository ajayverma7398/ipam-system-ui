"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/common/layout";
import { BulkImport, BulkExport, PoolMerger, BatchOperations } from "@/components/pools";

type TabType = "import" | "export" | "merge" | "batch";

export default function BulkOperationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("import");

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "import", label: "Bulk Import", icon: "📥" },
    { id: "export", label: "Bulk Export", icon: "📤" },
    { id: "merge", label: "Merge Pools", icon: "🔀" },
    { id: "batch", label: "Batch Operations", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>

        <div className="mb-6">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "import" && <BulkImport />}
          {activeTab === "export" && <BulkExport />}
          {activeTab === "merge" && <PoolMerger />}
          {activeTab === "batch" && <BatchOperations />}
        </div>
    </div>
  );
}
