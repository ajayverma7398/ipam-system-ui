"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";


interface ComplianceConfig {
  gdpr: {
    enabled: boolean;
    dataSubjectAccess: boolean;
    rightToErasure: boolean;
    dataPortability: boolean;
    retentionPeriod: number;
  };
  dataRetention: {
    enabled: boolean;
    defaultRetention: number; 
    ipAllocationRetention: number;
    auditLogRetention: number;
    userDataRetention: number;
  };
  privacy: {
    anonymizeIPs: boolean;
    anonymizeAfter: number; 
    allowDataSharing: boolean;
    requireConsent: boolean;
  };
  complianceReports: {
    enabled: boolean;
    schedule: "daily" | "weekly" | "monthly" | "quarterly";
    recipients: string[];
    includeDataRetention: boolean;
    includeAccessLogs: boolean;
    includePrivacyAudit: boolean;
  };
  regulations: string[];
}

export function ComplianceSettings() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<ComplianceConfig>({
    gdpr: {
      enabled: true,
      dataSubjectAccess: true,
      rightToErasure: true,
      dataPortability: true,
      retentionPeriod: 730, 
    },
    dataRetention: {
      enabled: true,
      defaultRetention: 2555, 
      ipAllocationRetention: 2555,
      auditLogRetention: 2555,
      userDataRetention: 3650, 
    },
    privacy: {
      anonymizeIPs: false,
      anonymizeAfter: 90,
      allowDataSharing: false,
      requireConsent: true,
    },
    complianceReports: {
      enabled: false,
      schedule: "monthly",
      recipients: ["compliance@example.com"],
      includeDataRetention: true,
      includeAccessLogs: true,
      includePrivacyAudit: true,
    },
    regulations: ["GDPR", "CCPA"],
  });

  const [newRecipient, setNewRecipient] = useState("");
  const [newRegulation, setNewRegulation] = useState("");

  const availableRegulations = ["GDPR", "CCPA", "HIPAA", "SOC 2", "ISO 27001", "PCI DSS"];

  const handleSave = () => {
    showToast("Compliance settings saved successfully", "success");
  };

  const handleAddRecipient = () => {
    if (!newRecipient || config.complianceReports.recipients.includes(newRecipient)) {
      showToast("Invalid or duplicate email address", "error");
      return;
    }
    setConfig({
      ...config,
      complianceReports: {
        ...config.complianceReports,
        recipients: [...config.complianceReports.recipients, newRecipient],
      },
    });
    setNewRecipient("");
    showToast("Recipient added", "success");
  };

  const handleRemoveRecipient = (email: string) => {
    setConfig({
      ...config,
      complianceReports: {
        ...config.complianceReports,
        recipients: config.complianceReports.recipients.filter((e) => e !== email),
      },
    });
    showToast("Recipient removed", "success");
  };

  const handleAddRegulation = () => {
    if (!newRegulation || config.regulations.includes(newRegulation)) {
      showToast("Invalid or duplicate regulation", "error");
      return;
    }
    setConfig({
      ...config,
      regulations: [...config.regulations, newRegulation],
    });
    setNewRegulation("");
    showToast("Regulation added", "success");
  };

  const handleRemoveRegulation = (regulation: string) => {
    setConfig({
      ...config,
      regulations: config.regulations.filter((r) => r !== regulation),
    });
    showToast("Regulation removed", "success");
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Compliance Settings</h3>
            <p className="text-sm text-slate-600">Configure regulatory compliance and data retention policies</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>
        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">GDPR Compliance</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.gdpr.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    gdpr: { ...config.gdpr, enabled: e.target.checked },
                  })
                }
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Enable GDPR Compliance</p>
                <p className="text-xs text-slate-600">Enable GDPR-related features and policies</p>
              </div>
            </label>

            {config.gdpr.enabled && (
              <>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors bg-white">
                    <div>
                      <span className="text-sm font-medium text-slate-900 block mb-1">
                        Data Subject Access Rights
                      </span>
                      <span className="text-xs text-slate-600">
                        Allow users to request access to their personal data
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.gdpr.dataSubjectAccess}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          gdpr: { ...config.gdpr, dataSubjectAccess: e.target.checked },
                        })
                      }
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors bg-white">
                    <div>
                      <span className="text-sm font-medium text-slate-900 block mb-1">Right to Erasure</span>
                      <span className="text-xs text-slate-600">Allow users to request deletion of their data</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.gdpr.rightToErasure}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          gdpr: { ...config.gdpr, rightToErasure: e.target.checked },
                        })
                      }
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors bg-white">
                    <div>
                      <span className="text-sm font-medium text-slate-900 block mb-1">Data Portability</span>
                      <span className="text-xs text-slate-600">
                        Allow users to export their data in a portable format
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.gdpr.dataPortability}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          gdpr: { ...config.gdpr, dataPortability: e.target.checked },
                        })
                      }
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    GDPR Data Retention Period (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.gdpr.retentionPeriod}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        gdpr: { ...config.gdpr, retentionPeriod: Number(e.target.value) },
                      })
                    }
                    className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Data Retention Policies</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.dataRetention.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    dataRetention: { ...config.dataRetention, enabled: e.target.checked },
                  })
                }
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Enable Data Retention Policies</p>
                <p className="text-xs text-slate-600">Automatically manage data retention according to policies</p>
              </div>
            </label>

            {config.dataRetention.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Default Retention (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.dataRetention.defaultRetention}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        dataRetention: { ...config.dataRetention, defaultRetention: Number(e.target.value) },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    IP Allocation Retention (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.dataRetention.ipAllocationRetention}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        dataRetention: { ...config.dataRetention, ipAllocationRetention: Number(e.target.value) },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Audit Log Retention (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.dataRetention.auditLogRetention}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        dataRetention: { ...config.dataRetention, auditLogRetention: Number(e.target.value) },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    User Data Retention (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.dataRetention.userDataRetention}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        dataRetention: { ...config.dataRetention, userDataRetention: Number(e.target.value) },
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
          <h4 className="text-md font-semibold text-slate-900 mb-4">Privacy Settings</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Anonymize IPs After (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.privacy.anonymizeAfter}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      privacy: { ...config.privacy, anonymizeAfter: Number(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.privacy.anonymizeIPs}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      privacy: { ...config.privacy, anonymizeIPs: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">Anonymize IP Addresses</p>
                  <p className="text-xs text-slate-600">Anonymize IP addresses after retention period</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.privacy.allowDataSharing}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      privacy: { ...config.privacy, allowDataSharing: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">Allow Data Sharing</p>
                  <p className="text-xs text-slate-600">Allow sharing anonymized data for analytics</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.privacy.requireConsent}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      privacy: { ...config.privacy, requireConsent: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">Require User Consent</p>
                  <p className="text-xs text-slate-600">Require explicit consent for data processing</p>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Compliance Reports</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.complianceReports.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    complianceReports: { ...config.complianceReports, enabled: e.target.checked },
                  })
                }
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Enable Compliance Reports</p>
                <p className="text-xs text-slate-600">Automatically generate and send compliance reports</p>
              </div>
            </label>

            {config.complianceReports.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Report Schedule</label>
                  <select
                    value={config.complianceReports.schedule}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        complianceReports: {
                          ...config.complianceReports,
                          schedule: e.target.value as ComplianceConfig["complianceReports"]["schedule"],
                        },
                      })
                    }
                    className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Report Contents</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.complianceReports.includeDataRetention}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            complianceReports: {
                              ...config.complianceReports,
                              includeDataRetention: e.target.checked,
                            },
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Include Data Retention Status</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.complianceReports.includeAccessLogs}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            complianceReports: {
                              ...config.complianceReports,
                              includeAccessLogs: e.target.checked,
                            },
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Include Access Logs Summary</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.complianceReports.includePrivacyAudit}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            complianceReports: {
                              ...config.complianceReports,
                              includePrivacyAudit: e.target.checked,
                            },
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Include Privacy Audit</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Report Recipients</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="email"
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddRecipient()}
                      placeholder="compliance@example.com"
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddRecipient}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {config.complianceReports.recipients.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm"
                      >
                        {email}
                        <button
                          onClick={() => handleRemoveRecipient(email)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Applicable Regulations</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex gap-2 mb-3">
              <select
                value={newRegulation}
                onChange={(e) => setNewRegulation(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select regulation...</option>
                {availableRegulations
                  .filter((r) => !config.regulations.includes(r))
                  .map((regulation) => (
                    <option key={regulation} value={regulation}>
                      {regulation}
                    </option>
                  ))}
              </select>
              <button
                onClick={handleAddRegulation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.regulations.map((regulation) => (
                <span
                  key={regulation}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium"
                >
                  {regulation}
                  <button
                    onClick={() => handleRemoveRegulation(regulation)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

