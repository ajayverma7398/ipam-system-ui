"use client";

import { useMemo } from "react";
import { allocations } from "@/lib/data/allocations";
import Card from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

const OUI_MAP: Record<string, string> = {
  "00:50:56": "VMware",
  "00:0C:29": "VMware",
  "00:1B:21": "Cisco",
  "00:1E:13": "Cisco",
  "00:23:04": "Cisco",
  "00:26:CA": "Cisco",
  "00:1D:7D": "Dell",
  "00:21:70": "Dell",
  "00:24:E8": "Dell",
  "00:14:22": "Netgear",
  "00:09:5B": "Netgear",
  "00:22:3F": "Hewlett-Packard",
  "00:1A:4B": "Hewlett-Packard",
  "00:1E:68": "Hewlett-Packard",
  "00:1B:78": "Intel",
  "00:1E:67": "Intel",
  "00:25:00": "Intel",
};

export function DeviceAnalysis() {
  const deviceTypeDistribution = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    
    allocations.forEach((alloc) => {
      if (alloc.device_type) {
        typeCounts[alloc.device_type] = (typeCounts[alloc.device_type] || 0) + 1;
      }
    });

    return Object.entries(typeCounts)
      .map(([type, count]) => ({ name: type.charAt(0).toUpperCase() + type.slice(1), value: count }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const topDeviceTypes = useMemo(() => {
    return deviceTypeDistribution.slice(0, 5);
  }, [deviceTypeDistribution]);

  const deviceLifecycle = useMemo(() => {
    const now = new Date();
    const lifecycleCategories = {
      "New (< 30 days)": 0,
      "Active (30-180 days)": 0,
      "Mature (180-365 days)": 0,
      "Legacy (> 365 days)": 0,
    };

    allocations.forEach((alloc) => {
      if (!alloc.allocated_at) return;
      const allocatedDate = new Date(alloc.allocated_at);
      const ageDays = Math.floor((now.getTime() - allocatedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (ageDays < 30) lifecycleCategories["New (< 30 days)"]++;
      else if (ageDays < 180) lifecycleCategories["Active (30-180 days)"]++;
      else if (ageDays < 365) lifecycleCategories["Mature (180-365 days)"]++;
      else lifecycleCategories["Legacy (> 365 days)"]++;
    });

    return Object.entries(lifecycleCategories).map(([category, count]) => ({
      category,
      count,
    }));
  }, []);

  const vendorAnalysis = useMemo(() => {
    const vendorCounts: Record<string, number> = {};
    
    allocations.forEach((alloc) => {
      if (alloc.metadata?.mac_address) {
        const mac = alloc.metadata.mac_address;
        const oui = mac.split(":").slice(0, 3).join(":").toUpperCase();
        const vendor = OUI_MAP[oui] || "Unknown";
        vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
      }
    });

    return Object.entries(vendorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([vendor, count]) => ({ vendor, count }));
  }, []);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Device Analysis</h3>
          <p className="text-sm text-slate-600">Device type distribution and lifecycle analysis</p>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Device Type Distribution</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ClientOnlyChart>
            <div className="space-y-2">
              {topDeviceTypes.map((type, index) => (
                <div
                  key={type.name}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-slate-900">{type.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(type.value / deviceTypeDistribution[0]!.value) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 w-12 text-right">
                      {type.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Device Lifecycle Analysis</h4>
          <ClientOnlyChart className="h-48" style={{ minHeight: 192 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceLifecycle}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="category"
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
                <Bar dataKey="count" fill="#8b5cf6" name="Device Count" />
              </BarChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        {vendorAnalysis.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Top Vendors (by MAC OUI)</h4>
            <div className="space-y-2">
              {vendorAnalysis.map((vendor, index) => (
                <div
                  key={vendor.vendor}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-900">{vendor.vendor}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{vendor.count} devices</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

