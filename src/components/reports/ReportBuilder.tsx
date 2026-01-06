"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface ReportConfig {
  visualizationType: string | null;
  dataSource: string[];
  fields: {
    x?: string;
    y?: string;
    category?: string;
  };
  filters: Array<{ field: string; operator: string; value: string }>;
  layout: "single" | "multi";
  theme: "light" | "dark" | "auto";
}

export function ReportBuilder({
  config,
  onConfigChange,
}: {
  config: ReportConfig;
  onConfigChange: (config: ReportConfig) => void;
}) {
  const { showToast } = useToast();
  const [availableFields] = useState<string[]>([
    "cidr",
    "type",
    "total_hosts",
    "utilization",
    "ip_address",
    "hostname",
    "device_id",
    "status",
    "allocated_at",
    "user",
    "timestamp",
  ]);

  const handleAddFilter = () => {
    const newFilter = { field: availableFields[0] || "", operator: "equals", value: "" };
    onConfigChange({
      ...config,
      filters: [...config.filters, newFilter],
    });
  };

  const handleRemoveFilter = (index: number) => {
    onConfigChange({
      ...config,
      filters: config.filters.filter((_, i) => i !== index),
    });
  };

  const handleFilterChange = (index: number, field: string, value: string) => {
    const newFilters = [...config.filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    onConfigChange({
      ...config,
      filters: newFilters,
    });
  };

  const handleFieldSelect = (axis: "x" | "y" | "category", field: string) => {
    onConfigChange({
      ...config,
      fields: {
        ...config.fields,
        [axis]: field,
      },
    });
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Report Builder</h3>
          <p className="text-sm text-slate-600">Configure your custom report</p>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Field Selection</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">X-Axis / Category</label>
              <select
                value={config.fields.x || ""}
                onChange={(e) => handleFieldSelect("x", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Select field...</option>
                {availableFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Y-Axis / Value</label>
              <select
                value={config.fields.y || ""}
                onChange={(e) => handleFieldSelect("y", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Select field...</option>
                {availableFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category / Group By</label>
              <select
                value={config.fields.category || ""}
                onChange={(e) => handleFieldSelect("category", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Select field...</option>
                {availableFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-semibold text-slate-900">Filters & Parameters</h4>
            <button
              onClick={handleAddFilter}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
            >
              + Add Filter
            </button>
          </div>
          <div className="space-y-3">
            {config.filters.map((filter, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <select
                  value={filter.field}
                  onChange={(e) => handleFilterChange(index, "field", e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Select field...</option>
                  {availableFields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
                <select
                  value={filter.operator}
                  onChange={(e) => handleFilterChange(index, "operator", e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="equals">Equals</option>
                  <option value="not_equals">Not Equals</option>
                  <option value="contains">Contains</option>
                  <option value="greater_than">Greater Than</option>
                  <option value="less_than">Less Than</option>
                  <option value="between">Between</option>
                </select>
                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                  placeholder="Value..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={() => handleRemoveFilter(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700 border border-red-200 rounded hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            {config.filters.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">
              No filters added. Click &quot;Add Filter&quot; to add one.
            </p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Layout & Design</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Layout</label>
              <select
                value={config.layout}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    layout: e.target.value as "single" | "multi",
                  })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="single">Single Column</option>
                <option value="multi">Multi Column</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
              <select
                value={config.theme}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    theme: e.target.value as "light" | "dark" | "auto",
                  })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Date Range</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">From</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              onConfigChange({
                visualizationType: null,
                dataSource: [],
                fields: {},
                filters: [],
                layout: "single",
                theme: "light",
              });
              showToast("Report configuration cleared", "success");
            }}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => showToast("Report saved successfully", "success")}
            className="px-6 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Report
          </button>
        </div>
      </div>
    </Card>
  );
}

