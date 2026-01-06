"use client";

import { useMemo } from "react";
import { pools } from "@/lib/data/pools";
import { allocations } from "@/lib/data/allocations";
import type { AllocationData } from "./AllocationWizard";
import Card from "@/components/ui/Card";

interface ReviewAllocationProps {
  allocationData: AllocationData;
}

export function ReviewAllocation({ allocationData }: ReviewAllocationProps) {
  const pool = useMemo(() => pools.find((p) => p.id === allocationData.poolId), [allocationData.poolId]);

  const conflicts = useMemo(() => {
    const conflictsList: string[] = [];
    
    if (allocationData.allocationMode !== "range" && allocationData.ipAddress) {
      const existing = allocations.find(
        (a) => a.ip_address === allocationData.ipAddress && a.status === "allocated"
      );
      if (existing) {
        conflictsList.push(`IP ${allocationData.ipAddress} is already allocated`);
      }
    }

    if (pool && allocationData.allocationMode === "range" && allocationData.ipRange) {
      if (pool.utilization.available < 10) {
        conflictsList.push("Pool may not have enough available IPs for this range");
      }
    }

    return conflictsList;
  }, [allocationData, pool]);

  const utilizationImpact = useMemo(() => {
    if (!pool) return null;

    const currentUtilization = pool.utilization.percentage;
    const ipCount = allocationData.allocationMode === "range" ? 10 : 1;
    const newAllocated = pool.utilization.allocated + ipCount;
    const newUtilization = (newAllocated / pool.total_hosts) * 100;

    return {
      current: currentUtilization,
      projected: newUtilization,
      change: newUtilization - currentUtilization,
    };
  }, [allocationData, pool]);

  const leaseEndDate = useMemo(() => {
    if (allocationData.leaseUnit === "indefinite") return "Never";
    
    const now = new Date();
    const endDate = new Date(now);
    
    switch (allocationData.leaseUnit) {
      case "hours":
        endDate.setHours(now.getHours() + allocationData.leaseDuration);
        break;
      case "days":
        endDate.setDate(now.getDate() + allocationData.leaseDuration);
        break;
      case "months":
        endDate.setMonth(now.getMonth() + allocationData.leaseDuration);
        break;
    }

    return endDate.toLocaleDateString();
  }, [allocationData]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Review Allocation</h3>
        <p className="text-sm text-slate-600">Review your allocation details before confirming</p>
      </div>

      {conflicts.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-900 mb-2">Conflicts Detected</p>
          <ul className="list-disc list-inside space-y-1">
            {conflicts.map((conflict, index) => (
              <li key={index} className="text-xs text-red-700">{conflict}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Pool Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Pool:</span>
              <span className="font-mono font-semibold text-slate-900">{pool?.cidr || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Type:</span>
              <span className="text-slate-900 capitalize">{pool?.type || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Available:</span>
              <span className="text-slate-900">{pool?.utilization.available || 0}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h4 className="text-md font-semibold text-slate-900 mb-3">IP Address</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Mode:</span>
              <span className="text-slate-900 capitalize">{allocationData.allocationMode}</span>
            </div>
            {allocationData.allocationMode === "range" ? (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-600">Start:</span>
                  <span className="font-mono font-semibold text-slate-900">{allocationData.ipRange?.start || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">End:</span>
                  <span className="font-mono font-semibold text-slate-900">{allocationData.ipRange?.end || "-"}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span className="text-slate-600">IP:</span>
                <span className="font-mono font-semibold text-slate-900">{allocationData.ipAddress || "-"}</span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Device Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Hostname:</span>
              <span className="font-semibold text-slate-900">{allocationData.hostname || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Device Type:</span>
              <span className="text-slate-900 capitalize">{allocationData.deviceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Device ID:</span>
              <span className="text-slate-900">{allocationData.deviceId || "-"}</span>
            </div>
            {allocationData.macAddress && (
              <div className="flex justify-between">
                <span className="text-slate-600">MAC:</span>
                <span className="font-mono text-slate-900">{allocationData.macAddress}</span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Lease Settings</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Duration:</span>
              <span className="text-slate-900">
                {allocationData.leaseUnit === "indefinite"
                  ? "Indefinite"
                  : `${allocationData.leaseDuration} ${allocationData.leaseUnit}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Expires:</span>
              <span className="text-slate-900">{leaseEndDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Type:</span>
              <span className="text-slate-900 capitalize">{allocationData.reservationType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Auto-Renew:</span>
              <span className="text-slate-900">{allocationData.autoRenew ? "Yes" : "No"}</span>
            </div>
          </div>
        </Card>
      </div>

      {utilizationImpact && (
        <Card>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Utilization Impact</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Current Utilization:</span>
              <span className="font-semibold text-slate-900">{utilizationImpact.current.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Projected Utilization:</span>
              <span className="font-semibold text-slate-900">{utilizationImpact.projected.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Change:</span>
              <span className={`font-semibold ${utilizationImpact.change > 0 ? "text-red-600" : "text-green-600"}`}>
                {utilizationImpact.change > 0 ? "+" : ""}{utilizationImpact.change.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>
      )}

      {(allocationData.description || allocationData.notes) && (
        <Card>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Additional Information</h4>
          {allocationData.description && (
            <div className="mb-2">
              <p className="text-xs font-medium text-slate-600 mb-1">Description</p>
              <p className="text-sm text-slate-900">{allocationData.description}</p>
            </div>
          )}
          {allocationData.notes && (
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Notes</p>
              <p className="text-sm text-slate-900">{allocationData.notes}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

