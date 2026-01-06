"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import Card from "@/components/ui/Card";
import { type IPPool } from "@/lib/data/pools";
import { type IPAllocation } from "@/lib/data/allocations";
import { ClientOnlyChart } from "@/components/common/data-display";

interface AllocationChartProps {
  pool: IPPool;
  allocations: IPAllocation[];
}

export function AllocationChart({ pool, allocations }: AllocationChartProps) {
  const pieData = [
    { name: "Allocated", value: pool.utilization.allocated, color: "#ef4444" },
    { name: "Available", value: pool.utilization.available, color: "#10b981" },
    { name: "Reserved", value: pool.utilization.reserved, color: "#f59e0b" },
  ];

  const statusDistribution = allocations.reduce((acc, alloc) => {
    acc[alloc.status] = (acc[alloc.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = [
    { status: "Allocated", count: statusDistribution.allocated || 0 },
    { status: "Available", count: statusDistribution.available || 0 },
    { status: "Reserved", count: statusDistribution.reserved || 0 },
    { status: "Expired", count: statusDistribution.expired || 0 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Allocation Distribution</h3>
        <ClientOnlyChart className="w-full h-64" style={{ minHeight: 256 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={(props: { name?: string; percent?: number }) => {
                  const name = props.name || "";
                  const percent = props.percent || 0;
                  return `${name}: ${(percent * 100).toFixed(0)}%`;
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number | undefined) => (value || 0).toLocaleString()} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ClientOnlyChart>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Status Distribution</h3>
        <ClientOnlyChart className="w-full h-64" style={{ minHeight: 256 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="status" stroke="#64748b" style={{ fontSize: "12px" }} />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#2b6cb0" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ClientOnlyChart>
      </Card>
    </div>
  );
}

