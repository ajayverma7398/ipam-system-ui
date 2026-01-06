"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface SavedReport {
  id: string;
  name: string;
  description: string;
  category: string;
  createdBy: string;
  createdAt: string;
  lastRun?: string;
  isFavorite: boolean;
}

export function SavedReports() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const savedReports: SavedReport[] = [
    {
      id: "report-001",
      name: "Monthly Utilization Summary",
      description: "Comprehensive monthly utilization report for all pools",
      category: "utilization",
      createdBy: "admin@example.com",
      createdAt: "2024-01-15",
      lastRun: "2024-03-01",
      isFavorite: true,
    },
    {
      id: "report-002",
      name: "IP Allocation Trends",
      description: "Historical allocation trends over the past 6 months",
      category: "allocation",
      createdBy: "engineer@example.com",
      createdAt: "2024-02-01",
      lastRun: "2024-03-15",
      isFavorite: true,
    },
    {
      id: "report-003",
      name: "Capacity Forecast Q2",
      description: "Quarterly capacity forecast for Q2 2024",
      category: "capacity",
      createdBy: "admin@example.com",
      createdAt: "2024-02-15",
      isFavorite: false,
    },
    {
      id: "report-004",
      name: "Compliance Audit Report",
      description: "Monthly compliance and audit trail report",
      category: "audit",
      createdBy: "admin@example.com",
      createdAt: "2024-01-20",
      lastRun: "2024-03-01",
      isFavorite: false,
    },
    {
      id: "report-005",
      name: "Top 10 Pools by Utilization",
      description: "Report showing pools with highest utilization",
      category: "utilization",
      createdBy: "engineer@example.com",
      createdAt: "2024-02-10",
      lastRun: "2024-03-14",
      isFavorite: false,
    },
  ];

  const filteredReports = savedReports.filter((report) => {
    const matchesSearch =
      !searchTerm ||
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleRunReport = (reportId: string) => {
    showToast(`Running report: ${savedReports.find((r) => r.id === reportId)?.name}`, "success");
  };

  const handleDeleteReport = (reportId: string) => {
    showToast(`Deleted report: ${savedReports.find((r) => r.id === reportId)?.name}`, "success");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleFavorite = (reportId: string) => {
    showToast("Favorite status updated", "success");
  };

  const categories = ["all", "utilization", "allocation", "capacity", "audit", "custom"];

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Saved Reports</h3>
          <p className="text-sm text-slate-600">Browse and manage your saved reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search Reports</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
              
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-slate-900">{report.name}</h4>
                    {report.isFavorite && (
                      <span className="text-yellow-500" title="Favorite">
                        ⭐
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium capitalize">
                      {report.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{report.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Created by {report.createdBy}</span>
                    <span>•</span>
                    <span>Created {new Date(report.createdAt).toLocaleDateString()}</span>
                    {report.lastRun && (
                      <>
                        <span>•</span>
                        <span>Last run {new Date(report.lastRun).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleFavorite(report.id)}
                    className="p-2 text-slate-400 hover:text-yellow-500 transition-colors"
                    title={report.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    ⭐
                  </button>
                  <button
                    onClick={() => handleRunReport(report.id)}
                    className="px-3 py-1 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                  >
                    Run
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete report"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No saved reports found</p>
          </div>
        )}
      </div>
    </Card>
  );
}

