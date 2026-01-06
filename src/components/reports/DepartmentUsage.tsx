/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMemo, useState } from "react";
import { allocations } from "@/lib/data/allocations";
import Card from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

export function DepartmentUsage() {
  const [costPerIP, setCostPerIP] = useState(10);

  const departmentUsage = useMemo(() => {
    const deptCounts: Record<string, { count: number; cost: number; devices: Set<string> }> = {};
    
    allocations.forEach((alloc) => {
      const department = alloc.metadata?.department || "Unassigned";
      if (!deptCounts[department]) {
        deptCounts[department] = { count: 0, cost: 0, devices: new Set() };
      }
      deptCounts[department].count++;
      deptCounts[department].cost += costPerIP;
      if (alloc.device_id) {
        deptCounts[department].devices.add(alloc.device_id);
      }
    });

    return Object.entries(deptCounts)
      .map(([department, data]) => ({
        department,
        count: data.count,
        cost: data.cost,
        devices: data.devices.size,
      }))
      .sort((a, b) => b.count - a.count);
  }, [costPerIP]);

  const departmentGrowth = useMemo(() => {
    const now = new Date();
    const deptGrowth: Record<string, { current: number; previous: number; growth: number }> = {};
    
    const currentPeriodStart = new Date(now);
    currentPeriodStart.setDate(currentPeriodStart.getDate() - 30);
    const previousPeriodStart = new Date(currentPeriodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);

    allocations.forEach((alloc) => {
      if (!alloc.allocated_at) return;
      const allocatedDate = new Date(alloc.allocated_at);
      const department = alloc.metadata?.department || "Unassigned";
      
      if (!deptGrowth[department]) {
        deptGrowth[department] = { current: 0, previous: 0, growth: 0 };
      }

      if (allocatedDate >= currentPeriodStart) {
        deptGrowth[department].current++;
      } else if (allocatedDate >= previousPeriodStart && allocatedDate < currentPeriodStart) {
        deptGrowth[department].previous++;
      }
    });

    return Object.entries(deptGrowth)
      .map(([department, data]) => {
        const growth = data.previous > 0 
          ? ((data.current - data.previous) / data.previous) * 100 
          : data.current > 0 ? 100 : 0;
        return {
          department,
          current: data.current,
          previous: data.previous,
          growth: Math.round(growth * 10) / 10,
        };
      })
      .filter((d) => d.current > 0 || d.previous > 0)
      .sort((a, b) => b.growth - a.growth);
  }, []);

  const totalCost = useMemo(() => {
    return departmentUsage.reduce((sum, dept) => sum + dept.cost, 0);
  }, [departmentUsage]);

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Department Usage</h3>
            <p className="text-sm text-slate-600">IP usage by department and cost allocation</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-700">Cost per IP ($):</label>
            <input
              type="number"
              value={costPerIP}
              onChange={(e) => setCostPerIP(parseFloat(e.target.value) || 0)}
              min={0}
              step={0.01}
              className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Total Departments</p>
            <p className="text-2xl font-bold text-blue-900">{departmentUsage.length}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Total Monthly Cost</p>
            <p className="text-2xl font-bold text-green-900">${totalCost.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Total IPs Allocated</p>
            <p className="text-2xl font-bold text-purple-900">
              {departmentUsage.reduce((sum, dept) => sum + dept.count, 0)}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">IP Usage by Department</h4>
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="department"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                <Bar dataKey="count" fill="#3b82f6" name="IP Count" />
                <Bar dataKey="cost" fill="#10b981" name="Monthly Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Department Details</h4>
          <div className="space-y-2">
            {departmentUsage.map((dept, index) => (
              <div
                key={dept.department}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <h5 className="text-sm font-semibold text-slate-900">{dept.department}</h5>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs text-slate-600 ml-9">
                    <span>IPs: {dept.count}</span>
                    <span>Devices: {dept.devices}</span>
                    <span>Cost: ${dept.cost.toLocaleString()}/month</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(dept.count / departmentUsage[0]!.count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {departmentGrowth.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Department Growth Rates (30-day comparison)</h4>
            <div className="space-y-2">
              {departmentGrowth.map((dept, index) => (
                <div
                  key={dept.department}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-900">{dept.department}</span>
                      <span className="text-xs text-slate-500">
                        Current: {dept.current} | Previous: {dept.previous}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-semibold ${
                        dept.growth > 0 ? "text-green-600" : dept.growth < 0 ? "text-red-600" : "text-slate-600"
                      }`}
                    >
                      {dept.growth > 0 ? "+" : ""}{dept.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

