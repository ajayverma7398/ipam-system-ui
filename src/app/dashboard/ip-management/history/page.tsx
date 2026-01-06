"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/common/layout";
import {
  AllocationTimeline,
  AuditLog,
  ChangeReports,
  Statistics,
} from "@/components/ip-management";

type TabType = "timeline" | "audit" | "reports" | "statistics";

export default function AllocationHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("timeline");

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "timeline", label: "Timeline", icon: "📅" },
    { id: "audit", label: "Audit Log", icon: "📋" },
    { id: "reports", label: "Change Reports", icon: "📊" },
    { id: "statistics", label: "Statistics", icon: "📈" },
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
                      : "border-transparent text-white hover:text-white hover:border-white"
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
          {activeTab === "timeline" && <AllocationTimeline />}
          {activeTab === "audit" && <AuditLog />}
          {activeTab === "reports" && <ChangeReports />}
          {activeTab === "statistics" && <Statistics />}
        </div>
    </div>
  );
}

