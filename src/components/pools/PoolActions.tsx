/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type IPPool } from "@/lib/data/pools";
import { ConfirmationModal } from "@/components/common/modals";
import { useToast } from "@/components/ui";

interface PoolActionsProps {
  pool: IPPool;
  onEdit?: (pool: IPPool) => void;
  onDelete?: (poolId: string) => Promise<void>;
  onDuplicate?: (pool: IPPool) => Promise<void>;
  onExport?: (pool: IPPool) => void;
}

export function PoolActions({
  pool,
  onEdit,
  onDelete,
  onDuplicate,
  onExport,
}: PoolActionsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(pool);
    } else {
      router.push(`/dashboard/pools/${encodeURIComponent(pool.cidr)}/edit`);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      if (onDelete) {
        await onDelete(pool.id);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        showToast(`Pool ${pool.cidr} deleted successfully`, "success");
        router.push("/dashboard/pools");
      }
    } catch (error) {
      showToast("Failed to delete pool", "error");
    } finally {
      setIsProcessing(false);
      setDeleteModalOpen(false);
    }
  };

  const handleDuplicate = async () => {
    setIsProcessing(true);
    try {
      if (onDuplicate) {
        await onDuplicate(pool);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        showToast(`Pool ${pool.cidr} duplicated successfully`, "success");
      }
    } catch (error) {
      showToast("Failed to duplicate pool", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(pool);
    } else {
      const poolData = JSON.stringify(pool, null, 2);
      const blob = new Blob([poolData], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pool-${pool.cidr.replace(/\//g, "-")}-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast("Pool exported successfully", "success");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleEdit}
          className="px-4 py-2 text-slate-700 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-sm font-medium flex items-center gap-2"
          title="Edit pool"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          onClick={handleDuplicate}
          disabled={isProcessing}
          className="px-4 py-2 text-slate-700 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
          title="Duplicate pool"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Duplicate
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 text-slate-700 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-sm font-medium flex items-center gap-2"
          title="Export pool"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="px-4 py-2 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-2"
          title="Delete pool"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Pool"
        message={`Are you sure you want to delete pool ${pool.cidr}? This action cannot be undone and will remove all associated IP allocations.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isProcessing}
      />
    </>
  );
}

