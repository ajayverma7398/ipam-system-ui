"use client";

import { useState } from "react";
import {
  AuditTrail,
  ComplianceReports,
  SecurityAnalysis,
  ChangeManagement,
} from "@/components/reports";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

type TabType = "audit" | "compliance" | "security" | "changes";

export default function AuditReportsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("audit");

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "audit", label: "Audit Trail", icon: "📋" },
    { id: "compliance", label: "Compliance", icon: "✅" },
    { id: "security", label: "Security Analysis", icon: "🔒" },
    { id: "changes", label: "Change Management", icon: "🔄" },
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-full min-w-0">
      <div className="mb-4">
        <Breadcrumb />
      </div>
        <div className="mb-6 w-full max-w-full min-w-0">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 overflow-x-auto w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-white hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 w-full max-w-full min-w-0">
          {activeTab === "audit" && <AuditTrail />}
          {activeTab === "compliance" && <ComplianceReports />}
          {activeTab === "security" && <SecurityAnalysis />}
          {activeTab === "changes" && <ChangeManagement />}
        </div>
    </div>
  );
}

