"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/common/layout";
import {
  BulkAllocate,
  BulkRelease,
  BulkUpdate,
  ImportIPs,
} from "@/components/ip-management";

type TabType = "allocate" | "release" | "update" | "import";

export default function BulkIPOperationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("allocate");

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "allocate", label: "Bulk Allocate", icon: "➕" },
    { id: "release", label: "Bulk Release", icon: "🗑️" },
    { id: "update", label: "Bulk Update", icon: "✏️" },
    { id: "import", label: "Import/Export", icon: "📥" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>

        <div className="mb-6">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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
          {activeTab === "allocate" && <BulkAllocate />}
          {activeTab === "release" && <BulkRelease />}
          {activeTab === "update" && <BulkUpdate />}
          {activeTab === "import" && <ImportIPs />}
        </div>
    </div>
  );
}

