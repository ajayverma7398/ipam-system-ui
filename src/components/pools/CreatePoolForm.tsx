"use client";

import { useState, useMemo } from "react";
import { FormInput } from "@/components/common/forms";
import CIDRInput from "@/components/common/forms/CIDRInput";
import { CIDRCalculator } from "@/components/ip-management/CIDRCalculator";
import { PoolValidator } from "@/components/pools/PoolValidator";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

export interface PoolFormData {
  cidr: string;
  name?: string;
  description: string;
  type: "public" | "private" | "multicast";
  tags: string[];
  default_gateway?: string;
  dns_servers: string[];
  allocation_policy: "sequential" | "random";
  default_lease_days: number;
  auto_expiration_enabled: boolean;
  expiration_days?: number;
  dhcp_integration: boolean;
  dns_integration: boolean;
}

interface CreatePoolFormProps {
  initialData?: Partial<PoolFormData>;
  onCancel: () => void;
  onSubmit: (poolData: PoolFormData) => Promise<void>;
  suggestedCIDRs?: string[];
}

type FormStep = "cidr" | "configuration" | "advanced" | "preview";

export function CreatePoolForm({
  initialData,
  onCancel,
  onSubmit,
  suggestedCIDRs = [],
}: CreatePoolFormProps) {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<FormStep>("cidr");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<PoolFormData>({
    cidr: initialData?.cidr || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "private",
    tags: initialData?.tags || [],
    default_gateway: initialData?.default_gateway || "",
    dns_servers: initialData?.dns_servers || [],
    allocation_policy: initialData?.allocation_policy || "sequential",
    default_lease_days: initialData?.default_lease_days || 30,
    auto_expiration_enabled: initialData?.auto_expiration_enabled || false,
    expiration_days: initialData?.expiration_days || 90,
    dhcp_integration: initialData?.dhcp_integration || false,
    dns_integration: initialData?.dns_integration || false,
  });

  const [tagInput, setTagInput] = useState("");
  const [dnsServerInput, setDnsServerInput] = useState("");

  const steps: { id: FormStep; label: string; icon: string }[] = [
    { id: "cidr", label: "CIDR", icon: "🌐" },
    { id: "configuration", label: "Configuration", icon: "⚙️" },
    { id: "advanced", label: "Advanced", icon: "🔧" },
    { id: "preview", label: "Preview", icon: "👁️" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case "cidr":
        return formData.cidr.trim() !== "";
      case "configuration":
        return formData.description.trim() !== "";
      case "advanced":
        return true;
      case "preview":
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
      await onSubmit(formData);
      showToast("Pool created successfully", "success");
    } catch {
      showToast("Failed to create pool", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const addDnsServer = () => {
    if (dnsServerInput.trim() && !formData.dns_servers.includes(dnsServerInput.trim())) {
      setFormData({ ...formData, dns_servers: [...formData.dns_servers, dnsServerInput.trim()] });
      setDnsServerInput("");
    }
  };

  const removeDnsServer = (server: string) => {
    setFormData({ ...formData, dns_servers: formData.dns_servers.filter((s) => s !== server) });
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
        {currentStep === "cidr" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">CIDR Configuration</h3>
              <p className="text-sm text-slate-600">Enter the CIDR notation for your IP pool</p>
            </div>

            <CIDRInput
              value={formData.cidr}
              onChange={(cidr) => setFormData({ ...formData, cidr })}
              onCalculate={(details) => {
                console.log("CIDR details:", details);
              }}
            />

            {suggestedCIDRs.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Suggested CIDRs:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedCIDRs.map((cidr) => (
                    <button
                      key={cidr}
                      onClick={() => setFormData({ ...formData, cidr })}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {cidr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {formData.cidr && (
              <div className="mt-4">
                <CIDRCalculator cidr={formData.cidr} />
              </div>
            )}

            {formData.cidr && (
              <div className="mt-4">
                <PoolValidator cidr={formData.cidr} />
              </div>
            )}
          </div>
        )}

        {currentStep === "configuration" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Pool Configuration</h3>
              <p className="text-sm text-slate-600">Configure basic pool settings</p>
            </div>

            <FormInput
              label="Pool Name (Optional)"
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Production Network Pool"
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the purpose of this pool..."
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PoolFormData["type"] })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="multicast">Multicast</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-900"
                        type="button"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <FormInput
              label="Default Gateway (Optional)"
              type="text"
              value={formData.default_gateway || ""}
              onChange={(e) => setFormData({ ...formData, default_gateway: e.target.value })}
              placeholder="e.g., 192.168.1.1"
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">DNS Servers</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={dnsServerInput}
                  onChange={(e) => setDnsServerInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDnsServer())}
                  placeholder="e.g., 8.8.8.8"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addDnsServer}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.dns_servers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.dns_servers.map((server) => (
                    <span
                      key={server}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                    >
                      {server}
                      <button
                        onClick={() => removeDnsServer(server)}
                        className="hover:text-green-900"
                        type="button"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === "advanced" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Advanced Settings</h3>
              <p className="text-sm text-slate-600">Configure advanced pool options</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Allocation Policy</label>
              <select
                value={formData.allocation_policy}
                onChange={(e) =>
                  setFormData({ ...formData, allocation_policy: e.target.value as "sequential" | "random" })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sequential">Sequential (First Available)</option>
                <option value="random">Random</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">
                Sequential: Allocate IPs in order. Random: Allocate from available pool randomly.
              </p>
            </div>

            <FormInput
              label="Default Lease Duration (Days)"
              type="number"
              value={formData.default_lease_days.toString()}
              onChange={(e) => setFormData({ ...formData, default_lease_days: parseInt(e.target.value) || 30 })}
              min={1}
              max={365}
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="auto_expiration"
                checked={formData.auto_expiration_enabled}
                onChange={(e) => setFormData({ ...formData, auto_expiration_enabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="auto_expiration" className="text-sm font-medium text-slate-700">
                Enable Auto-Expiration
              </label>
            </div>

            {formData.auto_expiration_enabled && (
              <FormInput
                label="Expiration Days"
                type="number"
                value={formData.expiration_days?.toString() || "90"}
                onChange={(e) => setFormData({ ...formData, expiration_days: parseInt(e.target.value) || 90 })}
                min={1}
                max={365}
              />
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="dhcp_integration"
                  checked={formData.dhcp_integration}
                  onChange={(e) => setFormData({ ...formData, dhcp_integration: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="dhcp_integration" className="text-sm font-medium text-slate-700">
                  Enable DHCP Integration
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="dns_integration"
                  checked={formData.dns_integration}
                  onChange={(e) => setFormData({ ...formData, dns_integration: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="dns_integration" className="text-sm font-medium text-slate-700">
                  Enable DNS Integration
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === "preview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Preview & Validation</h3>
              <p className="text-sm text-slate-600">Review your pool configuration before creating</p>
            </div>

            <PoolValidator cidr={formData.cidr} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-600">CIDR</p>
                <p className="text-lg font-semibold text-slate-900">{formData.cidr}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Type</p>
                <p className="text-lg font-semibold text-slate-900 capitalize">{formData.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Description</p>
                <p className="text-sm text-slate-900">{formData.description || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Allocation Policy</p>
                <p className="text-sm text-slate-900 capitalize">{formData.allocation_policy}</p>
              </div>
              {formData.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-600">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
          <button
            onClick={currentStepIndex === 0 ? onCancel : handleBack}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            {currentStepIndex === 0 ? "Cancel" : "Back"}
          </button>
          <div className="flex gap-2">
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
                {isSubmitting ? "Creating..." : "Create Pool"}
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

