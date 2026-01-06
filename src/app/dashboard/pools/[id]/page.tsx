"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { pools } from "@/lib/data/pools";
import { allocations } from "@/lib/data/allocations";
import { PoolDetail } from "@/components/pools";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function PoolDetailPage() {
  const params = useParams();
  const poolId = decodeURIComponent(params.id as string);
  
  const pool = pools.find((p) => p.cidr === poolId || p.id === poolId);
  
  const poolAllocations = useMemo(() => {
    if (!pool) return [];
    return allocations.filter((alloc) => alloc.pool_id === pool.id);
  }, [pool]);

  if (!pool) {
    notFound();
  }

  const handleAllocateIP = async (ipData: {
    ip_address: string;
    hostname?: string;
    device_id?: string;
    description?: string;
  }) => {   
    console.log("Allocating IP:", ipData);
  };

  const handleBulkAllocate = async (count: number, pattern: {
    starting_ip?: string;
    mode: "sequential" | "random";
  }) => {
    console.log("Bulk allocating:", count, pattern);
  };

  const handleReleaseIP = async (ipAddress: string) => {
    console.log("Releasing IP:", ipAddress);
  };

  const handleCreateSubnet = async (subnetData: {
    cidr: string;
    description?: string;
  }) => {
    console.log("Creating subnet:", subnetData);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <PoolDetail
        pool={pool}
        allocations={poolAllocations}
        onAllocateIP={handleAllocateIP}
        onBulkAllocate={handleBulkAllocate}
        onReleaseIP={handleReleaseIP}
        onCreateSubnet={handleCreateSubnet}
      />
    </div>
  );
}
