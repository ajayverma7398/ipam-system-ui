"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AllocationWizard, type AllocationData } from "@/components/ip-management";
import { useToast } from "@/components/ui";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export function AllocateIPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  const poolId = searchParams.get("pool") || "";

  const handleComplete = async (allocation: AllocationData) => {
    try {
      console.log("Allocating IP:", allocation);
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      showToast("IP allocated successfully", "success");
      router.push("/dashboard/ip-management");
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/ip-management");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <AllocationWizard
        initialData={poolId ? { poolId } : undefined}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}

