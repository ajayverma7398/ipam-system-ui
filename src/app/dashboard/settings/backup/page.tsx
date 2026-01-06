"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { BackupSettings } from "@/components/settings";
import { useToast } from "@/components/ui";
import Breadcrumb from "@/components/common/layout/Breadcrumb";


export default function BackupPage() {
  const { showToast } = useToast();
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showToast("Backup created successfully", "success");
    } catch  {
      showToast("Failed to create backup", "error");
    } finally {
      setIsCreatingBackup(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRestore = async (backupId: string) => {
    if (!confirm("Are you sure you want to restore from this backup? This will overwrite current data.")) {
      return;
    }

    setIsRestoring(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showToast("System restored successfully", "success");
    } catch {
      showToast("Failed to restore backup", "error");
    } finally {
      setIsRestoring(false);
    }
  };

  const backupHistory = [
    {
      id: "backup-001",
      name: "Full System Backup",
      type: "full",
      size: "2.4 GB",
      createdAt: "2024-12-15T02:00:00Z",
      status: "completed",
    },
    {
      id: "backup-002",
      name: "Incremental Backup",
      type: "incremental",
      size: "156 MB",
      createdAt: "2024-12-14T02:00:00Z",
      status: "completed",
    },
    {
      id: "backup-003",
      name: "Full System Backup",
      type: "full",
      size: "2.3 GB",
      createdAt: "2024-12-13T02:00:00Z",
      status: "completed",
    },
    {
      id: "backup-004",
      name: "Incremental Backup",
      type: "incremental",
      size: "142 MB",
      createdAt: "2024-12-12T02:00:00Z",
      status: "completed",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg
                className={`w-4 h-4 ${isCreatingBackup ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {isCreatingBackup ? "Creating Backup..." : "Create Backup Now"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <BackupSettings />

          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Backup History</h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {backupHistory.map((backup) => (
                      <tr key={backup.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-slate-900">{backup.name}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 capitalize">
                            {backup.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-700">{backup.size}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-700">{formatDate(backup.createdAt)}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                            {backup.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRestore(backup.id)}
                              disabled={isRestoring}
                              className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded transition-colors"
                            >
                              {isRestoring ? "Restoring..." : "Restore"}
                            </button>
                            <button
                              onClick={() => {
                                showToast("Backup download started", "success");
                              }}
                              className="text-xs px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded transition-colors"
                            >
                              Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
  );
}

