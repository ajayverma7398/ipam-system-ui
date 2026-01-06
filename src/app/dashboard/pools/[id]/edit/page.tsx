"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { CreatePoolForm, type PoolFormData } from "@/components/pools";
import { pools } from "@/lib/data/pools";
import { useToast } from "@/components/ui";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function EditPoolPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  
  const poolId = decodeURIComponent(params.id as string);
  
  const pool = pools.find((p) => p.cidr === poolId || p.id === poolId);

  if (!pool) {
    notFound();
  }

  const initialFormData: Partial<PoolFormData> = {
    cidr: pool.cidr,
    description: pool.description,
    type: pool.type,
    tags: pool.tags,
  };

  const handleSubmit = async (poolData: PoolFormData) => {
    try {
      console.log("Updating pool:", poolData);
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      showToast(`Pool ${poolData.cidr} updated successfully`, "success");
      router.push(`/dashboard/pools/${encodeURIComponent(pool.cidr)}`);
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    router.push(`/pools/${encodeURIComponent(pool.cidr)}`);
  };

  const suggestedCIDRs = pools
    .filter((p) => p.cidr !== pool.cidr)
    .map((p) => p.cidr)
    .slice(0, 4);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <CreatePoolForm
        initialData={initialFormData}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        suggestedCIDRs={suggestedCIDRs}
      />
    </div>
  );
}

