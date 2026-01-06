"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  PoolList,
  BulkActions,
  CreatePoolButton,
  ImportExport,
  PoolSearchFilter,
} from "@/components/pools";
import { pools } from "@/lib/data/pools";
import { useToast } from "@/components/ui";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

function PoolsContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  const [selectedPools, setSelectedPools] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const searchTerm = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "all";
  const ipClassFilter = searchParams.get("ipClass") || "all";
  const sortBy = searchParams.get("sort") || "cidr";
  const sortOrder = (searchParams.get("order") as "asc" | "desc") || "asc";

  const filteredPools = useMemo(() => {
    const filtered = pools.filter((pool) => {
      const matchesSearch =
        !searchTerm ||
        pool.cidr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pool.network_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pool.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = typeFilter === "all" || pool.type === typeFilter;
      const matchesIpClass = ipClassFilter === "all" || pool.ip_class === ipClassFilter;
      
      return matchesSearch && matchesType && matchesIpClass;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "cidr":
          comparison = a.cidr.localeCompare(b.cidr);
          break;
        case "utilization":
          comparison = a.utilization.percentage - b.utilization.percentage;
          break;
        case "created_at":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "total_hosts":
          comparison = a.total_hosts - b.total_hosts;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, typeFilter, ipClassFilter, sortBy, sortOrder]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast("Pools data refreshed", "success");
    setIsRefreshing(false);
  }, [showToast]);

  const handleSelectionChange = useCallback((selectedIds: Set<string>) => {
    setSelectedPools(selectedIds);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedPools(new Set());
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <div className="mb-6 flex items-center justify-end">
        <div className="flex items-center gap-3">
          <ImportExport />
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 text-slate-700 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
            title="Refresh pools data"
          >
            <svg
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <CreatePoolButton />
        </div>
      </div>

      <div className="mb-6">
        <PoolSearchFilter />
      </div>

      {selectedPools.size > 0 && (
        <div className="mb-6">
          <BulkActions
            selectedCount={selectedPools.size}
            selectedIds={selectedPools}
            onClearSelection={handleClearSelection}
          />
        </div>
      )}

      <div className="flex-1">
        <PoolList
          pools={filteredPools}
          selectable
          onSelectionChange={handleSelectionChange}
          pageSize={10}
        />
      </div>
    </div>
  );
}

function PoolsLoadingFallback() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    </div>
  );
}

export default function PoolsPage() {
  return (
    <Suspense fallback={<PoolsLoadingFallback />}>
      <PoolsContent />
    </Suspense>
  );
}
