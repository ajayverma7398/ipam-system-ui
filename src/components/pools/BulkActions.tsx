"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/common/modals";
import { useToast } from "@/components/ui";
import Card from "@/components/ui/Card";

interface BulkActionsProps {
  selectedCount: number;
  selectedIds: Set<string>;
  onClearSelection: () => void;
}

export function BulkActions({ selectedCount, selectedIds, onClearSelection }: BulkActionsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    showToast(`Delete operation queued for ${selectedCount} pool(s)`, "warning");
    setDeleteModalOpen(false);
    onClearSelection();
  };

  const handleExport = () => {
    showToast(`Exporting ${selectedCount} pool(s)`, "success");
    onClearSelection();
  };

  const handleTag = () => {
    router.push(`/dashboard/pools/bulk?action=tag&pools=${Array.from(selectedIds).join(",")}`);
  };

  const handleMove = () => {
    showToast(`Move operation for ${selectedCount} pool(s)`, "info");
    onClearSelection();
  };

  const handleMerge = () => {
    showToast(`Merge operation for ${selectedCount} pool(s)`, "info");
    onClearSelection();
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-900">
              {selectedCount} pool(s) selected
            </span>
            <button
              onClick={onClearSelection}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTag}
              className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              title="Add tags to selected pools"
            >
              Tag
            </button>
            <button
              onClick={handleMove}
              className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              title="Move selected pools"
            >
              Move
            </button>
            <button
              onClick={handleMerge}
              className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              title="Merge selected pools"
            >
              Merge
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              title="Export selected pools"
            >
              Export
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              title="Delete selected pools"
            >
              Delete
            </button>
          </div>
        </div>
      </Card>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Pools"
        message={`Are you sure you want to delete ${selectedCount} pool(s)? This action cannot be undone and will remove all associated IP allocations.`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}

