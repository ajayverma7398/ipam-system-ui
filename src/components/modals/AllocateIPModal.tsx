"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui";

interface AllocateIPModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolCidr?: string;
}

export default function AllocateIPModal({ isOpen, onClose, poolCidr }: AllocateIPModalProps) {
  const [allocationType, setAllocationType] = useState<"auto" | "manual">("auto");
  const [ipAddress, setIpAddress] = useState("");
  const [hostname, setHostname] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [description, setDescription] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const { showToast } = useToast();

  const handleCheckAvailability = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      showToast("IP address is available", "success");
    }, 1000);
  };

  const handleAllocate = () => {
    if (allocationType === "manual" && !ipAddress) {
      showToast("Please specify an IP address", "warning");
      return;
    }
    showToast("IP address allocated successfully", "success");
    onClose();
    setIpAddress("");
    setHostname("");
    setDeviceId("");
    setDescription("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Allocate IP Address" size="md">
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
            Allocation Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="auto"
                checked={allocationType === "auto"}
                onChange={(e) => setAllocationType(e.target.value as "auto")}
                className="mr-2"
              />
              <span className="text-sm text-slate-700">Auto Assign</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="manual"
                checked={allocationType === "manual"}
                onChange={(e) => setAllocationType(e.target.value as "manual")}
                className="mr-2"
              />
              <span className="text-sm text-slate-700">Specify IP</span>
            </label>
          </div>
        </div>

        {allocationType === "manual" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              IP Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="e.g., 10.0.0.100"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleCheckAvailability}
                disabled={isChecking || !ipAddress}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isChecking ? "Checking..." : "Check"}
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Hostname
          </label>
          <input
            type="text"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
            placeholder="e.g., server-01.example.com"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Device ID
          </label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="e.g., svr-001"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
            rows={3}
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

