"use client";

import { useMemo } from "react";
import Card from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

interface ReportConfig {
  visualizationType: string | null;
  dataSource: string[];
  fields: {
    x?: string;
    y?: string;
    category?: string;
  };
  filters: Array<{ field: string; operator: string; value: string }>;
}

export function ReportPreview({ config }: { config: ReportConfig }) {
  const sampleData = useMemo(() => {
    if (!config.visualizationType) return [];

    const data = Array.from({ length: 5 }, (_, i) => ({
      name: `Item ${i + 1}`,
      value: ((i * 17 + 23) % 80) + 20,
      category: `Category ${(i % 3) + 1}`,
    }));

    return data;
  }, [config]);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const renderVisualization = () => {
    if (!config.visualizationType) {
      return (
        <div className="h-64 flex items-center justify-center text-slate-400">
          <p>Select a visualization type to preview</p>
        </div>
      );
    }

    switch (config.visualizationType) {
      case "bar":
        return (
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: "12px" }} />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" name="Value" />
              </BarChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        );

      case "line":
        return (
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: "12px" }} />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} name="Value" />
              </LineChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        );

      case "pie":
        return (
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sampleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sampleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        );

      case "table":
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700">Value</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sampleData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-slate-900">{row.name}</td>
                    <td className="px-4 py-2 text-slate-900">{row.value}</td>
                    <td className="px-4 py-2 text-slate-900">{row.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "kpi":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleData.slice(0, 3).map((item, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-medium text-blue-700 mb-1">{item.name}</p>
                <p className="text-2xl font-bold text-blue-900">{item.value}</p>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="h-64 flex items-center justify-center text-slate-400">
            <p>Preview not available for this visualization type</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Report Preview</h3>
          <p className="text-sm text-slate-600">Live preview of your custom report</p>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
          {renderVisualization()}
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-xs font-medium text-slate-700 mb-2">Configuration Summary:</p>
          <div className="text-xs text-slate-600 space-y-1">
            <p>Visualization: {config.visualizationType || "Not selected"}</p>
            <p>Data Sources: {config.dataSource.length > 0 ? config.dataSource.join(", ") : "None selected"}</p>
            {config.filters.length > 0 && (
              <p>Filters: {config.filters.length} active filter(s)</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

