"use client";

import { useState } from "react";
import { type IPPool } from "@/lib/data/pools";
import { type IPAllocation } from "@/lib/data/allocations";
import Card from "@/components/ui/Card";
import { UtilizationBar } from "@/components/common/data-display";
import { AllocationChart } from "./AllocationChart";
import { PoolActions } from "./PoolActions";
import { IPTable } from "../ip-management/IPTable";

interface PoolDetailProps {
  pool: IPPool;
  allocations: IPAllocation[];
  onAllocateIP?: (ipData: {
    ip_address: string;
    hostname?: string;
    device_id?: string;
    description?: string;
  }) => Promise<void>;
  onBulkAllocate?: (count: number, pattern: {
    starting_ip?: string;
    mode: "sequential" | "random";
  }) => Promise<void>;
  onReleaseIP?: (ipAddress: string) => Promise<void>;
  onCreateSubnet?: (subnetData: {
    cidr: string;
    description?: string;
  }) => Promise<void>;
}

type TabType = "overview" | "ip-list" | "subnets" | "activity";

export function PoolDetail({
  pool,
  allocations,
  onAllocateIP,
  onBulkAllocate,
  onReleaseIP,
  onCreateSubnet,
}: PoolDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: "📊" },
    { id: "ip-list" as TabType, label: "IP List", icon: "📋" },
    { id: "subnets" as TabType, label: "Subnets", icon: "🌐" },
    { id: "activity" as TabType, label: "Activity", icon: "📝" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{pool.cidr}</h1>
          <p className="text-slate-200">{pool.description}</p>
        </div>
        <PoolActions pool={pool} />
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pool Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Network Address</p>
            <p className="text-lg font-semibold font-mono text-slate-900">{pool.network_address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Broadcast Address</p>
            <p className="text-lg font-semibold font-mono text-slate-900">{pool.broadcast_address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Subnet Mask</p>
            <p className="text-lg font-semibold font-mono text-slate-900">{pool.subnet_mask}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Type</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                pool.type === "public"
                  ? "bg-green-100 text-green-800"
                  : pool.type === "private"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {pool.type}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Total Hosts</p>
            <p className="text-lg font-semibold text-slate-900">{pool.total_hosts.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Usable Hosts</p>
            <p className="text-lg font-semibold text-slate-900">{pool.usable_hosts.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Allocated</p>
            <p className="text-lg font-semibold text-slate-900">{pool.utilization.allocated.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Available</p>
            <p className="text-lg font-semibold text-slate-900">{pool.utilization.available.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-600">Utilization</p>
            <p className="text-sm font-semibold text-slate-900">{pool.utilization.percentage.toFixed(1)}%</p>
          </div>
          <UtilizationBar
            used={pool.utilization.allocated}
            total={pool.total_hosts}
            showPercentage={false}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Created By</p>
            <p className="text-sm text-slate-900">{pool.created_by}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Created At</p>
            <p className="text-sm text-slate-900">{new Date(pool.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Last Updated</p>
            <p className="text-sm text-slate-900">{new Date(pool.updated_at).toLocaleDateString()}</p>
          </div>
          {pool.tags.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Tags</p>
              <div className="flex flex-wrap gap-2">
                {pool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-white hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AllocationChart pool={pool} allocations={allocations} />
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">CIDR Visualization</h3>
              <div className="space-y-2">
                <div className="text-sm text-slate-600 mb-4">
                  Network: {pool.network_address} / {pool.cidr.split("/")[1]}
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {Array.from({ length: Math.min(32, pool.total_hosts) }).map((_, i) => {
                    const isAllocated = i < pool.utilization.allocated;
                    const isReserved = i >= pool.utilization.allocated && i < pool.utilization.allocated + pool.utilization.reserved;
                    return (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded ${
                          isAllocated
                            ? "bg-red-500"
                            : isReserved
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        title={`IP ${i + 1}: ${isAllocated ? "Allocated" : isReserved ? "Reserved" : "Available"}`}
                      />
                    );
                  })}
                  {pool.total_hosts > 32 && (
                    <span className="text-xs text-slate-500">+{pool.total_hosts - 32} more</span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className="text-slate-600">Allocated</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-yellow-500" />
                    <span className="text-slate-600">Reserved</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className="text-slate-600">Available</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "ip-list" && (
          <IPTable
            allocations={allocations}
            poolId={pool.id}
            onAllocateIP={onAllocateIP}
            onBulkAllocate={onBulkAllocate}
            onReleaseIP={onReleaseIP}
          />
        )}

        {activeTab === "subnets" && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Subnets</h3>
              <button
                onClick={() => onCreateSubnet?.({ cidr: pool.cidr })}
                className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors text-sm"
              >
                Create Subnet
              </button>
            </div>
            <p className="text-sm text-slate-500">Subnet management coming soon...</p>
          </Card>
        )}

        {activeTab === "activity" && (
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Activity Log</h3>
            <p className="text-sm text-slate-500">Activity log for this pool coming soon...</p>
          </Card>
        )}
      </div>
    </div>
  );
}

