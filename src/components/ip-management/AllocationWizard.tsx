"use client";

import { useState, useMemo } from "react";
import { PoolSelector } from "./PoolSelector";
import { IPSelector } from "./IPSelector";
import { DeviceForm } from "./DeviceForm";
import { ReviewAllocation } from "./ReviewAllocation";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

export interface AllocationData {
  poolId: string;
  ipAddress: string;
  allocationMode: "auto" | "manual" | "range";
  ipRange?: { start: string; end: string };
  hostname: string;
  deviceType: string;
  deviceId: string;
  macAddress: string;
  description: string;
  notes: string;
  leaseDuration: number;
  leaseUnit: "hours" | "days" | "months" | "indefinite";
  autoRenew: boolean;
  reservationType: "static" | "dynamic";
  notifyOnExpiry: boolean;
  metadata: Record<string, string>;
}

export interface AllocationTemplate {
  id: string;
  name: string;
  deviceType: string;
  hostnamePrefix: string;
  leaseDuration: number;
  leaseUnit: "hours" | "days" | "months" | "indefinite";
  autoRenew: boolean;
  reservationType: "static" | "dynamic";
}

type WizardStep = "pool" | "ip" | "device" | "lease" | "review";

interface AllocationWizardProps {
  initialData?: Partial<AllocationData>;
  onComplete: (allocation: AllocationData) => Promise<void>;
  onCancel: () => void;
  suggestedPools?: string[];
  template?: AllocationTemplate;
}

export function AllocationWizard({
  initialData,
  onComplete,
  onCancel,
  suggestedPools = [],
  template,
}: AllocationWizardProps) {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>("pool");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<AllocationData>({
    poolId: initialData?.poolId || "",
    ipAddress: initialData?.ipAddress || "",
    allocationMode: initialData?.allocationMode || "auto",
    ipRange: initialData?.ipRange,
    hostname: initialData?.hostname || "",
    deviceType: initialData?.deviceType || "server",
    deviceId: initialData?.deviceId || "",
    macAddress: initialData?.macAddress || "",
    description: initialData?.description || "",
    notes: initialData?.notes || "",
    leaseDuration: initialData?.leaseDuration || template?.leaseDuration || 30,
    leaseUnit: initialData?.leaseUnit || template?.leaseUnit || "days",
    autoRenew: initialData?.autoRenew ?? template?.autoRenew ?? false,
    reservationType: initialData?.reservationType || template?.reservationType || "static",
    notifyOnExpiry: initialData?.notifyOnExpiry ?? true,
    metadata: initialData?.metadata || {},
  });

  const steps: { id: WizardStep; label: string; icon: string }[] = [
    { id: "pool", label: "Select Pool", icon: "🌐" },
    { id: "ip", label: "Choose IP", icon: "📍" },
    { id: "device", label: "Device Info", icon: "💻" },
    { id: "lease", label: "Lease Settings", icon: "⏰" },
    { id: "review", label: "Review", icon: "✅" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case "pool":
        return formData.poolId !== "";
      case "ip":
        return formData.allocationMode === "range"
          ? formData.ipRange?.start && formData.ipRange?.end
          : formData.ipAddress !== "";
      case "device":
        return formData.hostname !== "" && formData.deviceId !== "";
      case "lease":
        return formData.leaseDuration > 0 || formData.leaseUnit === "indefinite";
      case "review":
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  const handleNext = () => {
    if (!canProceed) {
      showToast("Please complete all required fields", "warning");
      return;
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
      showToast("IP allocated successfully", "success");
    } catch (error) {
      showToast("Failed to allocate IP", "error");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = () => {
    localStorage.setItem("allocationDraft", JSON.stringify(formData));
    showToast("Draft saved", "success");
  };

  const loadDraft = () => {
    const draft = localStorage.getItem("allocationDraft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData({ ...formData, ...parsed });
        showToast("Draft loaded", "success");
      } catch {
        showToast("Failed to load draft", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <button
                onClick={() => {
                  if (index <= currentStepIndex) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  index === currentStepIndex
                    ? "bg-[#2b6cb0] text-white"
                    : index < currentStepIndex
                    ? "bg-green-500 text-white"
                    : "bg-slate-200 text-slate-600"
                } ${index <= currentStepIndex ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"}`}
                disabled={index > currentStepIndex}
              >
                {index < currentStepIndex ? "✓" : step.icon}
              </button>
              <span className="mt-2 text-xs font-medium text-white">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 ${
                  index < currentStepIndex ? "bg-green-500" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        {currentStep === "pool" && (
          <PoolSelector
            selectedPoolId={formData.poolId}
            onSelect={(poolId) => setFormData({ ...formData, poolId })}
            suggestedPools={suggestedPools}
          />
        )}

        {currentStep === "ip" && (
          <IPSelector
            poolId={formData.poolId}
            allocationMode={formData.allocationMode}
            ipAddress={formData.ipAddress}
            ipRange={formData.ipRange}
            onModeChange={(mode) => setFormData({ ...formData, allocationMode: mode })}
            onIPSelect={(ip) => setFormData({ ...formData, ipAddress: ip })}
            onRangeSelect={(range) => setFormData({ ...formData, ipRange: range })}
          />
        )}

        {currentStep === "device" && (
          <DeviceForm
            hostname={formData.hostname}
            deviceType={formData.deviceType}
            deviceId={formData.deviceId}
            macAddress={formData.macAddress}
            description={formData.description}
            notes={formData.notes}
            metadata={formData.metadata}
            template={template}
            onUpdate={(updates) => setFormData({ ...formData, ...updates })}
          />
        )}

        {currentStep === "lease" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Lease Settings</h3>
              <p className="text-sm text-slate-600">Configure IP lease duration and renewal options</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Lease Duration</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.leaseDuration}
                    onChange={(e) =>
                      setFormData({ ...formData, leaseDuration: parseInt(e.target.value) || 0 })
                    }
                    min={1}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={formData.leaseUnit === "indefinite"}
                  />
                  <select
                    value={formData.leaseUnit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        leaseUnit: e.target.value as AllocationData["leaseUnit"],
                      })
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                    <option value="indefinite">Indefinite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reservation Type</label>
                <select
                  value={formData.reservationType}
                  onChange={(e) =>
                    setFormData({ ...formData, reservationType: e.target.value as "static" | "dynamic" })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="static">Static (Permanent)</option>
                  <option value="dynamic">Dynamic (Temporary)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoRenew}
                  onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Enable Auto-Renewal</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifyOnExpiry}
                  onChange={(e) => setFormData({ ...formData, notifyOnExpiry: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Notify on Expiry</span>
              </label>
            </div>
          </div>
        )}

        {currentStep === "review" && (
          <ReviewAllocation allocationData={formData} />
        )}

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={saveDraft}
              className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-700"
            >
              Save Draft
            </button>
            <button
              onClick={loadDraft}
              className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-700"
            >
              Load Draft
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={currentStepIndex === 0 ? onCancel : handleBack}
              className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              {currentStepIndex === 0 ? "Cancel" : "Back"}
            </button>
            {currentStepIndex < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="px-6 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Allocating..." : "Allocate IP"}
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

