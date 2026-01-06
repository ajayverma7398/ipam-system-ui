"use client";

import { useMemo } from "react";
import { pools } from "@/lib/data/pools";
import { allocations } from "@/lib/data/allocations";
import Card from "@/components/ui/Card";

export function ComplianceReports() {
  const ipPolicyCompliance = useMemo(() => {
    const violations: Array<{
      type: string;
      description: string;
      poolId?: string;
      severity: "low" | "medium" | "high";
    }> = [];

    pools.forEach((pool1, i) => {
      pools.slice(i + 1).forEach((pool2) => {
        if (pool1.network_address === pool2.network_address) {
          violations.push({
            type: "Overlapping Pools",
            description: `${pool1.cidr} overlaps with ${pool2.cidr}`,
            severity: "high",
          });
        }
      });
    });

    pools.forEach((pool) => {
      if (!pool.description || pool.description.trim() === "") {
        violations.push({
          type: "Missing Description",
          description: `Pool ${pool.cidr} is missing a description`,
          poolId: pool.id,
          severity: "low",
        });
      }
    });

    pools.forEach((pool) => {
      if (pool.utilization.percentage > 90) {
        violations.push({
          type: "High Utilization",
          description: `Pool ${pool.cidr} exceeds 90% utilization threshold`,
          poolId: pool.id,
          severity: "medium",
        });
      }
    });

    return {
      total: violations.length,
      bySeverity: {
        high: violations.filter((v) => v.severity === "high").length,
        medium: violations.filter((v) => v.severity === "medium").length,
        low: violations.filter((v) => v.severity === "low").length,
      },
      violations,
    };
  }, []);

  const leaseCompliance = useMemo(() => {
    const now = new Date();
    const complianceIssues: Array<{
      type: string;
      description: string;
      count: number;
      severity: "low" | "medium" | "high";
    }> = [];

    const expiredLeases = allocations.filter((alloc) => {
      return alloc.expires_at && new Date(alloc.expires_at) < now && alloc.status === "allocated";
    });

    if (expiredLeases.length > 0) {
      complianceIssues.push({
        type: "Expired Leases Not Released",
        description: "IPs with expired leases that are still marked as allocated",
        count: expiredLeases.length,
        severity: "medium",
      });
    }

    const leasesWithoutExpiration = allocations.filter((alloc) => {
      return alloc.status === "allocated" && !alloc.expires_at;
    });

    if (leasesWithoutExpiration.length > 0) {
      complianceIssues.push({
        type: "Missing Lease Expiration",
        description: "Allocated IPs without expiration dates",
        count: leasesWithoutExpiration.length,
        severity: "high",
      });
    }

    const longLeases = allocations.filter((alloc) => {
      if (!alloc.allocated_at || !alloc.expires_at) return false;
      const allocated = new Date(alloc.allocated_at);
      const expires = new Date(alloc.expires_at);
      const days = (expires.getTime() - allocated.getTime()) / (1000 * 60 * 60 * 24);
      return days > 365;
    });

    if (longLeases.length > 0) {
      complianceIssues.push({
        type: "Excessive Lease Duration",
        description: "Leases with duration exceeding 365 days",
        count: longLeases.length,
        severity: "low",
      });
    }

    return {
      total: complianceIssues.length,
      issues: complianceIssues,
    };
  }, []);

  const securityCompliance = useMemo(() => {
    const issues: Array<{
      type: string;
      description: string;
      count: number;
      severity: "low" | "medium" | "high";
    }> = [];

    const ipsWithoutHostname = allocations.filter((alloc) => {
      return alloc.status === "allocated" && !alloc.hostname;
    });

    if (ipsWithoutHostname.length > 0) {
      issues.push({
        type: "Missing Hostnames",
        description: "Allocated IPs without hostname assignments",
        count: ipsWithoutHostname.length,
        severity: "medium",
      });
    }

    const ipsWithoutDevice = allocations.filter((alloc) => {
      return alloc.status === "allocated" && !alloc.device_id;
    });

    if (ipsWithoutDevice.length > 0) {
      issues.push({
        type: "Missing Device IDs",
        description: "Allocated IPs without device identification",
        count: ipsWithoutDevice.length,
        severity: "low",
      });
    }

    return {
      total: issues.length,
      issues,
    };
  }, []);

  const regulatoryCompliance = useMemo(() => {
    const checks = [
      {
        requirement: "Data Retention",
        status: "compliant",
        description: "Audit logs retained for required period (2+ years)",
      },
      {
        requirement: "Access Logging",
        status: "compliant",
        description: "All user activities are logged",
      },
      {
        requirement: "Change Tracking",
        status: "compliant",
        description: "All IP allocations and releases are tracked",
      },
      {
        requirement: "Encryption",
        status: "warning",
        description: "Data at rest encryption recommended",
      },
    ];

    return {
      compliant: checks.filter((c) => c.status === "compliant").length,
      warnings: checks.filter((c) => c.status === "warning").length,
      checks,
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      high: { bg: "bg-red-100", text: "text-red-800" },
      medium: { bg: "bg-yellow-100", text: "text-yellow-800" },
      low: { bg: "bg-blue-100", text: "text-blue-800" },
    };
    return colors[severity] || { bg: "bg-slate-100", text: "text-slate-800" };
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Compliance Reports</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">IP Policy Violations</p>
            <p className="text-2xl font-bold text-blue-900">{ipPolicyCompliance.total}</p>
            <p className="text-xs text-blue-600 mt-1">
              {ipPolicyCompliance.bySeverity.high} high, {ipPolicyCompliance.bySeverity.medium} medium
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Lease Compliance Issues</p>
            <p className="text-2xl font-bold text-green-900">{leaseCompliance.total}</p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-medium text-yellow-700 mb-1">Security Issues</p>
            <p className="text-2xl font-bold text-yellow-900">{securityCompliance.total}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Regulatory Status</p>
            <p className="text-2xl font-bold text-purple-900">
              {regulatoryCompliance.compliant}/{regulatoryCompliance.checks.length}
            </p>
            <p className="text-xs text-purple-600 mt-1">Compliant checks</p>
          </div>
        </div>

        {ipPolicyCompliance.violations.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">IP Address Policy Violations</h4>
            <div className="space-y-2">
              {ipPolicyCompliance.violations.slice(0, 10).map((violation, index) => {
                const colors = getSeverityColor(violation.severity);
                return (
                  <div
                    key={index}
                    className={`p-3 border-2 rounded-lg ${colors.bg} border-${violation.severity === "high" ? "red" : violation.severity === "medium" ? "yellow" : "blue"}-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-900">{violation.type}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {violation.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{violation.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {leaseCompliance.issues.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Lease Management Compliance</h4>
            <div className="space-y-2">
              {leaseCompliance.issues.map((issue, index) => {
                const colors = getSeverityColor(issue.severity);
                return (
                  <div
                    key={index}
                    className={`p-3 border-2 rounded-lg ${colors.bg} border-${issue.severity === "high" ? "red" : issue.severity === "medium" ? "yellow" : "blue"}-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-900">{issue.type}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {issue.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{issue.description}</p>
                      </div>
                      <span className="text-lg font-bold text-slate-900 ml-4">{issue.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {securityCompliance.issues.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Security Policy Compliance</h4>
            <div className="space-y-2">
              {securityCompliance.issues.map((issue, index) => {
                const colors = getSeverityColor(issue.severity);
                return (
                  <div
                    key={index}
                    className={`p-3 border-2 rounded-lg ${colors.bg} border-${issue.severity === "high" ? "red" : issue.severity === "medium" ? "yellow" : "blue"}-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-900">{issue.type}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {issue.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{issue.description}</p>
                      </div>
                      <span className="text-lg font-bold text-slate-900 ml-4">{issue.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Regulatory Requirements</h4>
          <div className="space-y-2">
            {regulatoryCompliance.checks.map((check, index) => (
              <div
                key={index}
                className={`p-3 border-2 rounded-lg ${
                  check.status === "compliant"
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">{check.requirement}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          check.status === "compliant"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {check.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{check.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

