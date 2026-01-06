"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

interface DataSource {
  id: string;
  name: string;
  description: string;
  type: "pools" | "allocations" | "activities" | "users";
  icon: string;
  fields: string[];
}

export function DataSources({
  selectedSources,
  onSourceToggle,
}: {
  selectedSources: Set<string>;
  onSourceToggle: (sourceId: string) => void;
}) {
  const dataSources: DataSource[] = [
    {
      id: "pools",
      name: "IP Pools",
      description: "IP pool data including CIDR, utilization, and metadata",
      type: "pools",
      icon: "🏊",
      fields: ["cidr", "type", "total_hosts", "utilization", "description", "created_at"],
    },
    {
      id: "allocations",
      name: "IP Allocations",
      description: "IP address allocation records with device information",
      type: "allocations",
      icon: "📋",
      fields: ["ip_address", "pool_id", "hostname", "device_id", "status", "allocated_at"],
    },
    {
      id: "activities",
      name: "Activity Log",
      description: "System activities and audit trail",
      type: "activities",
      icon: "📊",
      fields: ["type", "user", "timestamp", "description", "severity", "ip_address"],
    },
    {
      id: "users",
      name: "Users",
      description: "User accounts and permissions",
      type: "users",
      icon: "👤",
      fields: ["username", "email", "role", "department", "last_login"],
    },
  ];

  const [previewSource, setPreviewSource] = useState<string | null>(null);

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Data Sources</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataSources.map((source) => (
            <div
              key={source.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedSources.has(source.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-blue-300"
              }`}
              onClick={() => onSourceToggle(source.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{source.icon}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{source.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">{source.description}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedSources.has(source.id)}
                  onChange={() => onSourceToggle(source.id)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-700 mb-2">Available Fields:</p>
                <div className="flex flex-wrap gap-1">
                  {source.fields.map((field) => (
                    <span
                      key={field}
                      className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewSource(previewSource === source.id ? null : source.id);
                }}
                className="mt-3 text-xs text-blue-600 hover:text-blue-700"
              >
                {previewSource === source.id ? "Hide" : "Show"} Sample Data
              </button>

              {previewSource === source.id && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                  <p className="text-slate-600 mb-1">Sample data (first 3 rows):</p>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(
                      {
                        [source.fields[0]]: "sample_value_1",
                        [source.fields[1]]: "sample_value_2",
                        [source.fields[2]]: "sample_value_3",
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Use Real-time Data</p>
              <p className="text-xs text-slate-600">Fetch latest data when report is generated</p>
            </div>
          </label>
        </div>
      </div>
    </Card>
  );
}

