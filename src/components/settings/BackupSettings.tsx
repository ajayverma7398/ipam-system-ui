"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface BackupConfig {
  enabled: boolean;
  schedule: {
    frequency: "daily" | "weekly" | "monthly";
    time: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
  retention: {
    enabled: boolean;
    keepDaily: number;
    keepWeekly: number;
    keepMonthly: number;
    keepYearly: number;
  };
  destinations: Array<{
    id: string;
    type: "local" | "s3" | "azure" | "gcp" | "ftp";
    path: string;
    enabled: boolean;
  }>;
  encryption: {
    enabled: boolean;
    algorithm: "aes256" | "gpg";
    keyId: string;
  };
  recovery: {
    testRestore: boolean;
    testSchedule: "weekly" | "monthly" | "quarterly";
    recoveryProcedures: string;
  };
}

export function BackupSettings() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<BackupConfig>({
    enabled: true,
    schedule: {
      frequency: "daily",
      time: "02:00",
    },
    retention: {
      enabled: true,
      keepDaily: 7,
      keepWeekly: 4,
      keepMonthly: 12,
      keepYearly: 5,
    },
    destinations: [
      {
        id: "dest-001",
        type: "local",
        path: "/backups/ipam",
        enabled: true,
      },
      {
        id: "dest-002",
        type: "s3",
        path: "s3://ipam-backups/production",
        enabled: true,
      },
    ],  
    encryption: {
      enabled: true,
      algorithm: "aes256",
      keyId: "backup-key-001",
    },
    recovery: {
      testRestore: true,
      testSchedule: "monthly",
      recoveryProcedures: "Recovery procedures documented in DR plan",
    },
  });

  const [isAddingDestination, setIsAddingDestination] = useState(false);
  const [newDestination, setNewDestination] = useState<Partial<BackupConfig["destinations"][0]>>({
    type: "local",
    path: "",
    enabled: true,
  });

  const handleSave = () => {
    showToast("Backup settings saved successfully", "success");
  };

  const handleAddDestination = () => {
    if (!newDestination.path) {
      showToast("Please provide a backup path", "error");
      return;
    }
    const destination: BackupConfig["destinations"][0] = {
      id: `dest-${Date.now()}`,
      type: newDestination.type || "local",
      path: newDestination.path,
      enabled: newDestination.enabled ?? true,
    };
    setConfig({
      ...config,
      destinations: [...config.destinations, destination],
    });
    setNewDestination({ type: "local", path: "", enabled: true });
    setIsAddingDestination(false);
    showToast("Backup destination added", "success");
  };

  const handleRemoveDestination = (id: string) => {
    if (config.destinations.length <= 1) {
      showToast("At least one backup destination is required", "error");
      return;
    }
    setConfig({
      ...config,
      destinations: config.destinations.filter((d) => d.id !== id),
    });
    showToast("Backup destination removed", "success");
  };

  const toggleDestination = (id: string) => {
    setConfig({
      ...config,
      destinations: config.destinations.map((d) =>
        d.id === id ? { ...d, enabled: !d.enabled } : d
      ),
    });
  };

  const destinationTypes = [
    { value: "local", label: "Local Filesystem" },
    { value: "s3", label: "Amazon S3" },
    { value: "azure", label: "Azure Blob Storage" },
    { value: "gcp", label: "Google Cloud Storage" },
    { value: "ftp", label: "FTP/SFTP Server" },
  ];

  const getDestinationTypeLabel = (type: string) => {
    return destinationTypes.find((t) => t.value === type)?.label || type;
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Backup & Recovery Settings</h3>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Enable Automatic Backups</p>
              <p className="text-xs text-slate-600">Automatically backup system data on schedule</p>
            </div>
          </label>
        </div>

        {config.enabled && (
          <>
            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Backup Schedule</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Frequency</label>
                    <select
                      value={config.schedule.frequency}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          schedule: {
                            ...config.schedule,
                            frequency: e.target.value as BackupConfig["schedule"]["frequency"],
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Backup Time</label>
                    <input
                      type="time"
                      value={config.schedule.time}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          schedule: { ...config.schedule, time: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {config.schedule.frequency === "weekly" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Day of Week</label>
                      <select
                        value={config.schedule.dayOfWeek || 0}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            schedule: { ...config.schedule, dayOfWeek: Number(e.target.value) },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="0">Sunday</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                      </select>
                    </div>
                  )}
                  {config.schedule.frequency === "monthly" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Day of Month</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={config.schedule.dayOfMonth || 1}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            schedule: { ...config.schedule, dayOfMonth: Number(e.target.value) },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Backup Destinations</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">Configure where backups are stored</p>
                  <button
                    onClick={() => setIsAddingDestination(!isAddingDestination)}
                    className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    {isAddingDestination ? "Cancel" : "+ Add Destination"}
                  </button>
                </div>

                {isAddingDestination && (
                  <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Destination Type
                        </label>
                        <select
                          value={newDestination.type || "local"}
                          onChange={(e) =>
                            setNewDestination({
                              ...newDestination,
                              type: e.target.value as BackupConfig["destinations"][0]["type"],
                            })
                          }
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {destinationTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Backup Path</label>
                        <input
                          type="text"
                          value={newDestination.path || ""}
                          onChange={(e) => setNewDestination({ ...newDestination, path: e.target.value })}
                          placeholder={
                            newDestination.type === "local"
                              ? "/backups/ipam"
                              : newDestination.type === "s3"
                              ? "s3://bucket-name/path"
                              : "https://example.com/path"
                          }
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setIsAddingDestination(false)}
                        className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddDestination}
                        className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
                      >
                        Add Destination
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {config.destinations.map((destination) => (
                    <div
                      key={destination.id}
                      className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="text-sm font-semibold text-slate-900">
                              {getDestinationTypeLabel(destination.type)}
                            </h5>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                destination.enabled
                                  ? "bg-green-100 text-green-800"
                                  : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              {destination.enabled ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                          <p className="text-sm font-mono text-slate-600">{destination.path}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => toggleDestination(destination.id)}
                            className={`px-3 py-1 text-xs rounded transition-colors ${
                              destination.enabled
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {destination.enabled ? "Disable" : "Enable"}
                          </button>
                          <button
                            onClick={() => handleRemoveDestination(destination.id)}
                            className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Backup Retention</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.retention.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        retention: { ...config.retention, enabled: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable Backup Retention</p>
                    <p className="text-xs text-slate-600">Automatically manage backup retention periods</p>
                  </div>
                </label>

                {config.retention.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Keep Daily Backups
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={config.retention.keepDaily}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            retention: { ...config.retention, keepDaily: Number(e.target.value) },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Keep Weekly Backups
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={config.retention.keepWeekly}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            retention: { ...config.retention, keepWeekly: Number(e.target.value) },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Keep Monthly Backups
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={config.retention.keepMonthly}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            retention: { ...config.retention, keepMonthly: Number(e.target.value) },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Keep Yearly Backups
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={config.retention.keepYearly}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            retention: { ...config.retention, keepYearly: Number(e.target.value) },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Backup Encryption</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.encryption.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        encryption: { ...config.encryption, enabled: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable Backup Encryption</p>
                    <p className="text-xs text-slate-600">Encrypt backups for additional security</p>
                  </div>
                </label>

                {config.encryption.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Encryption Algorithm</label>
                      <select
                        value={config.encryption.algorithm}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            encryption: {
                              ...config.encryption,
                              algorithm: e.target.value as BackupConfig["encryption"]["algorithm"],
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="aes256">AES-256</option>
                        <option value="gpg">GPG</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Encryption Key ID</label>
                      <input
                        type="text"
                        value={config.encryption.keyId}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            encryption: { ...config.encryption, keyId: e.target.value },
                          })
                        }
                        placeholder="backup-key-001"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Recovery Procedures</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.recovery.testRestore}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        recovery: { ...config.recovery, testRestore: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable Test Restores</p>
                    <p className="text-xs text-slate-600">Periodically test backup restoration procedures</p>
                  </div>
                </label>

                {config.recovery.testRestore && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Test Schedule</label>
                    <select
                      value={config.recovery.testSchedule}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          recovery: {
                            ...config.recovery,
                            testSchedule: e.target.value as BackupConfig["recovery"]["testSchedule"],
                          },
                        })
                      }
                      className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Recovery Procedures Documentation
                  </label>
                  <textarea
                    value={config.recovery.recoveryProcedures}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        recovery: { ...config.recovery, recoveryProcedures: e.target.value },
                      })
                    }
                    placeholder="Document recovery procedures..."
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

