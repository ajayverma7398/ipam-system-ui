"use client";

import { useRouter } from "next/navigation";
import { CreatePoolForm, type PoolFormData } from "@/components/pools";
import { Breadcrumb } from "@/components/common/layout";
import { useToast } from "@/components/ui";

export default function CreatePoolPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (poolData: PoolFormData) => {
    try {
      console.log("Creating pool:", poolData);
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      showToast(`Pool ${poolData.cidr} created successfully`, "success");
      router.push("/dashboard/pools");
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/pools");
  };

  const suggestedCIDRs = [
    "192.168.100.0/24",
    "192.168.101.0/24",
    "10.0.10.0/24",
    "172.16.20.0/24",
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>

      <CreatePoolForm
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        suggestedCIDRs={suggestedCIDRs}
      />
    </div>
  );
}
