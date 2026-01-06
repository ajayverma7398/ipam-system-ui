"use client";

import { useMemo, useState } from "react";
import { pools } from "@/lib/data/pools";
import { whatIfScenarios } from "@/lib/data/whatif-scenarios";
import Card from "@/components/ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

type Scenario = "add-capacity" | "remove-capacity" | "growth-adjust" | "redesign";

export function WhatIfAnalysis() {
  const [scenario, setScenario] = useState<Scenario>("add-capacity");
  const [scenarioParams, setScenarioParams] = useState({
    newPools: 3,
    poolSize: 256,
    growthRate: 1.5,
    removePools: 1,
  });

  const currentState = useMemo(() => {
    const totalHosts = pools.reduce((sum, pool) => sum + pool.total_hosts, 0);
    const totalAllocated = pools.reduce((sum, pool) => sum + pool.utilization.allocated, 0);
    const totalAvailable = pools.reduce((sum, pool) => sum + pool.utilization.available, 0);
    const utilization = (totalAllocated / totalHosts) * 100;

    return {
      totalHosts,
      totalAllocated,
      totalAvailable,
      utilization: Math.round(utilization * 10) / 10,
    };
  }, []);

  const scenarioProjections = useMemo(() => {
    let data: typeof whatIfScenarios["add-capacity"]["default"] = [];
    
    if (scenario === "add-capacity") {
      data = scenarioParams.growthRate > 2.0 
        ? whatIfScenarios["add-capacity"]["high-growth"] 
        : whatIfScenarios["add-capacity"]["default"];
    } else if (scenario === "remove-capacity") {
      data = whatIfScenarios["remove-capacity"]["default"];
    } else if (scenario === "growth-adjust") {
      if (scenarioParams.growthRate < 1.0) {
        data = whatIfScenarios["growth-adjust"]["low-growth"];
      } else if (scenarioParams.growthRate > 2.0) {
        data = whatIfScenarios["growth-adjust"]["high-growth"];
      } else {
        data = whatIfScenarios["growth-adjust"]["medium-growth"];
      }
    } else if (scenario === "redesign") {
      data = whatIfScenarios["redesign"]["default"];
    }

    return data.map((point, i) => ({
      ...point,
      monthIndex: i,
      hosts: currentState.totalHosts,
      allocated: Math.round(currentState.totalHosts * (point.utilization / 100)),
    }));
  }, [scenario, scenarioParams, currentState]);

  const roiCalculation = useMemo(() => {
    if (scenario !== "add-capacity") return null;

    const newCapacity = scenarioParams.newPools * scenarioParams.poolSize;
    const costPerPool = 1000;
    const monthlyMaintenance = 50;
    const ipValue = 0.1;

    const totalCost = scenarioParams.newPools * costPerPool;
    const monthlyCost = scenarioParams.newPools * monthlyMaintenance;
    const monthlyValue = newCapacity * ipValue;
    const netMonthlyValue = monthlyValue - monthlyCost;
    
    let paybackMonths = 0;
    let annualROI = 0;
    
    if (netMonthlyValue > 0 && totalCost > 0) {
      paybackMonths = totalCost / netMonthlyValue;
      annualROI = ((netMonthlyValue * 12 - totalCost) / totalCost) * 100;
    } else if (netMonthlyValue <= 0) {
      paybackMonths = Infinity;
      annualROI = -100;
    } else if (totalCost === 0) {
      paybackMonths = 0;
      annualROI = Infinity;
    }

    return {
      totalCost,
      monthlyCost,
      monthlyValue,
      netMonthlyValue,
      paybackMonths: paybackMonths === Infinity ? Infinity : Math.round(paybackMonths * 10) / 10,
      annualROI: annualROI === Infinity ? Infinity : Math.round(annualROI * 10) / 10,
    };
  }, [scenario, scenarioParams]);

  const exhaustionComparison = useMemo(() => {
    const currentExhaustion = currentState.utilization >= 100 
      ? 0 
      : (100 - currentState.utilization) / scenarioParams.growthRate;
    
    const projectedExhaustion = scenarioProjections.find((p) => p.utilization >= 100);
    const projectedMonths = projectedExhaustion 
      ? projectedExhaustion.monthIndex 
      : (100 - scenarioProjections[scenarioProjections.length - 1]!.utilization) / scenarioParams.growthRate;

    return {
      current: Math.round(currentExhaustion * 10) / 10,
      projected: Math.round(projectedMonths * 10) / 10,
      difference: Math.round((projectedMonths - currentExhaustion) * 10) / 10,
    };
  }, [currentState, scenarioProjections, scenarioParams]);

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">What-If Analysis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Scenario</label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as Scenario)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="add-capacity">Add Capacity</option>
              <option value="remove-capacity">Remove Capacity</option>
              <option value="growth-adjust">Adjust Growth Rate</option>
              <option value="redesign">Network Redesign</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Growth Rate (%/month)</label>
            <input
              type="number"
              value={scenarioParams.growthRate}
              onChange={(e) =>
                setScenarioParams({ ...scenarioParams, growthRate: parseFloat(e.target.value) || 0 })
              }
              min={0}
              step={0.1}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {scenario === "add-capacity" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Number of New Pools</label>
              <input
                type="number"
                value={scenarioParams.newPools}
                onChange={(e) =>
                  setScenarioParams({ ...scenarioParams, newPools: parseInt(e.target.value) || 0 })
                }
                min={0}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Pool Size (IPs)</label>
              <input
                type="number"
                value={scenarioParams.poolSize}
                onChange={(e) =>
                  setScenarioParams({ ...scenarioParams, poolSize: parseInt(e.target.value) || 256 })
                }
                min={256}
                step={256}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {scenario === "remove-capacity" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Pools to Remove</label>
            <input
              type="number"
              value={scenarioParams.removePools}
              onChange={(e) =>
                setScenarioParams({ ...scenarioParams, removePools: parseInt(e.target.value) || 0 })
              }
              min={0}
              max={pools.length}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">12-Month Projection</h4>
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenarioProjections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Utilization %"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="available"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Available IPs"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Current Capacity</p>
            <p className="text-2xl font-bold text-blue-900">{currentState.totalHosts.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-1">
              {scenarioProjections[scenarioProjections.length - 1]?.hosts.toLocaleString()} projected
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Exhaustion Timeline</p>
            <p className="text-2xl font-bold text-green-900">
              {exhaustionComparison.projected} months
            </p>
            <p className="text-xs text-green-600 mt-1">
              {exhaustionComparison.difference > 0 ? "+" : ""}
              {exhaustionComparison.difference} months vs current
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Projected Utilization</p>
            <p className="text-2xl font-bold text-purple-900">
              {scenarioProjections[scenarioProjections.length - 1]?.utilization.toFixed(1)}%
            </p>
            <p className="text-xs text-purple-600 mt-1">After 12 months</p>
          </div>
        </div>

        {roiCalculation && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">ROI Calculation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-xs font-medium text-slate-700 mb-1">Initial Investment</p>
                <p className="text-2xl font-bold text-slate-900">${roiCalculation.totalCost.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-xs font-medium text-slate-700 mb-1">Monthly Net Value</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${Math.round(roiCalculation.netMonthlyValue).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-medium text-green-700 mb-1">Payback Period</p>
                <p className="text-2xl font-bold text-green-900">
                  {roiCalculation.paybackMonths === Infinity 
                    ? "-" 
                    : isNaN(roiCalculation.paybackMonths) 
                    ? "-" 
                    : `${roiCalculation.paybackMonths} months`}
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-medium text-blue-700 mb-1">Annual ROI</p>
                <p className="text-2xl font-bold text-blue-900">
                  {roiCalculation.annualROI === Infinity 
                    ? "∞%" 
                    : isNaN(roiCalculation.annualROI) 
                    ? "-" 
                    : `${roiCalculation.annualROI}%`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

