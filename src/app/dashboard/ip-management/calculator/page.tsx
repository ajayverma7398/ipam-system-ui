"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/common/layout";
import {
  CIDRCalculator,
  SubnetPlanner,
  VLSMCalculator,
  IPv6Calculator,
  NetworkTools,
} from "@/components/ip-management";
import Card from "@/components/ui/Card";

type CalculatorType = "cidr" | "subnet" | "vlsm" | "ipv6" | "tools";

export default function CalculatorPage() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>("cidr");
  const [cidrInput, setCidrInput] = useState("192.168.1.0/24");

  const calculators: { id: CalculatorType; label: string; icon: string }[] = [
    { id: "cidr", label: "CIDR Calculator", icon: "🔢" },
    { id: "subnet", label: "Subnet Planner", icon: "📊" },
    { id: "vlsm", label: "VLSM Calculator", icon: "⚡" },
    { id: "ipv6", label: "IPv6 Calculator", icon: "🌐" },
    { id: "tools", label: "Network Tools", icon: "🔧" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>

        <div className="mb-6">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 overflow-x-auto">
              {calculators.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => setActiveCalculator(calc.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeCalculator === calc.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-white hover:text-white hover:border-white"
                  }`}
                >
                  <span className="mr-2">{calc.icon}</span>
                  {calc.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          {activeCalculator === "cidr" && (
            <div className="space-y-6">
              <Card>
                <label className="block text-sm font-medium text-slate-700 mb-2">CIDR Notation</label>
                <input
                  type="text"
                  value={cidrInput}
                  onChange={(e) => setCidrInput(e.target.value)}
                  placeholder="e.g., 192.168.1.0/24"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </Card>
              <CIDRCalculator cidr={cidrInput} />
            </div>
          )}
          {activeCalculator === "subnet" && <SubnetPlanner />}
          {activeCalculator === "vlsm" && <VLSMCalculator />}
          {activeCalculator === "ipv6" && <IPv6Calculator />}
          {activeCalculator === "tools" && <NetworkTools />}
        </div>
    </div>
  );
}

