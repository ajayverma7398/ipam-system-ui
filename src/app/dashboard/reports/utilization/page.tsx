"use client";

import { useState } from "react";
import {
  UtilizationOverview,
  PoolUtilization,
  TrendAnalysis,
  Forecasting,
} from "@/components/reports";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

type TabType = "overview" | "pools" | "trends" | "forecast";

export default function UtilizationReportsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "pools", label: "Pool Utilization", icon: "🏊" },
    { id: "trends", label: "Trend Analysis", icon: "📈" },
    { id: "forecast", label: "Forecasting", icon: "🔮" },
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

        <div className="flex-1 overflow-y-auto space-y-6">
          {activeTab === "overview" && <UtilizationOverview />}
          {activeTab === "pools" && <PoolUtilization />}
          {activeTab === "trends" && <TrendAnalysis />}
          {activeTab === "forecast" && <Forecasting />}
        </div>
    </div>
  );
}

