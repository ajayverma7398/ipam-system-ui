"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui";

interface BulkAllocateModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolCidr?: string;
}

export default function BulkAllocateModal({ isOpen, onClose, poolCidr }: BulkAllocateModalProps) {
  const [numberOfIPs, setNumberOfIPs] = useState("");
  const [startingIP, setStartingIP] = useState("");
  const [allocationMode, setAllocationMode] = useState<"sequential" | "random">("sequential");
  const [environment, setEnvironment] = useState("");
  const [purpose, setPurpose] = useState("");
  const { showToast } = useToast();

  const handleAllocate = () => {
    if (!numberOfIPs || parseInt(numberOfIPs) <= 0) {
      showToast("Please specify a valid number of IPs", "warning");
      return;
    }
    showToast(`Allocated ${numberOfIPs} IP address(es) successfully`, "success");
    onClose();
    setNumberOfIPs("");
    setStartingIP("");
    setEnvironment("");
    setPurpose("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Allocate IP Addresses" size="md">
      <div className="space-y-6">
        {poolCidr && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <span className="font-medium">Pool:</span> {poolCidr}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Number of IPs
          </label>
          <input
            type="number"
            value={numberOfIPs}
            onChange={(e) => setNumberOfIPs(e.target.value)}
            placeholder="e.g., 10"
            min="1"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Starting IP (Optional)
          </label>
          <input
            type="text"
            value={startingIP}
            onChange={(e) => setStartingIP(e.target.value)}
            placeholder="e.g., 10.0.0.100 (leave empty for auto)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Allocation Mode
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="sequential"
                checked={allocationMode === "sequential"}
                onChange={(e) => setAllocationMode(e.target.value as "sequential")}
                className="mr-2"
              />
              <span className="text-sm text-slate-700">Sequential</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="random"
                checked={allocationMode === "random"}
                onChange={(e) => setAllocationMode(e.target.value as "random")}
                className="mr-2"
              />
              <span className="text-sm text-slate-700">Random</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Environment
          </label>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select environment...</option>
            <option value="production">Production</option>
            <option value="staging">Staging</option>
            <option value="development">Development</option>
            <option value="testing">Testing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Purpose
          </label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g., Web servers, Database cluster"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAllocate}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Allocate
          </button>
        </div>
      </div>
    </Modal>
  );
}

