"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface DistributionList {
  id: string;
  name: string;
  type: "email" | "webhook" | "file";
  recipients: string[];
  formats: string[];
  enabled: boolean;
}

export function DistributionLists() {
  const { showToast } = useToast();
  const [lists, setLists] = useState<DistributionList[]>([
    {
      id: "dist-001",
      name: "Management Team",
      type: "email",
      recipients: ["admin@example.com", "manager@example.com"],
      formats: ["PDF", "Excel"],
      enabled: true,
    },
    {
      id: "dist-002",
      name: "API Webhook",
      type: "webhook",
      recipients: ["https://api.example.com/webhooks/reports"],
      formats: ["JSON"],
      enabled: true,
    },
    {
      id: "dist-003",
      name: "File Server Export",
      type: "file",
      recipients: ["/reports/export/daily"],
      formats: ["CSV", "JSON"],
      enabled: true,
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newList, setNewList] = useState<Partial<DistributionList>>({
    name: "",
    type: "email",
    recipients: [],
    formats: [],
    enabled: true,
  });

  const availableFormats = ["PDF", "Excel", "CSV", "JSON", "HTML"];

  const handleCreateList = () => {
    if (!newList.name || !newList.type) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    const list: DistributionList = {
      id: `dist-${Date.now()}`,
      name: newList.name,
      type: newList.type as DistributionList["type"],
      recipients: newList.recipients || [],
      formats: newList.formats || [],
      enabled: newList.enabled ?? true,
    };

    setLists([...lists, list]);
    setNewList({ name: "", type: "email", recipients: [], formats: [], enabled: true });
    setIsCreating(false);
    showToast("Distribution list created", "success");
  };

  const toggleList = (id: string) => {
    setLists(lists.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
    showToast("Distribution list updated", "success");
  };

  const deleteList = (id: string) => {
    setLists(lists.filter((l) => l.id !== id));
    showToast("Distribution list deleted", "success");
  };

  const addRecipient = (value: string) => {
    if (!value.trim()) return;
    setNewList({
      ...newList,
      recipients: [...(newList.recipients || []), value.trim()],
    });
  };

  const removeRecipient = (index: number) => {
    setNewList({
      ...newList,
      recipients: newList.recipients?.filter((_, i) => i !== index) || [],
    });
  };

  const toggleFormat = (format: string) => {
    const formats = newList.formats || [];
    if (formats.includes(format)) {
      setNewList({ ...newList, formats: formats.filter((f) => f !== format) });
    } else {
      setNewList({ ...newList, formats: [...formats, format] });
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Distribution Lists</h3>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            {isCreating ? "Cancel" : "+ New List"}
          </button>
        </div>

        {isCreating && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
            <h4 className="text-md font-semibold text-slate-900">Create Distribution List</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  List Name *
                </label>
                <input
                  type="text"
                  value={newList.name || ""}
                  onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                  placeholder="e.g., Management Team"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
                <select
                  value={newList.type || "email"}
                  onChange={(e) =>
                    setNewList({ ...newList, type: e.target.value as DistributionList["type"] })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="email">Email</option>
                  <option value="webhook">Webhook</option>
                  <option value="file">File Export</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {newList.type === "email" ? "Email Recipients" : newList.type === "webhook" ? "Webhook URLs" : "File Paths"}
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type={newList.type === "email" ? "email" : "text"}
                  placeholder={
                    newList.type === "email"
                      ? "email@example.com"
                      : newList.type === "webhook"
                      ? "https://api.example.com/webhook"
                      : "/path/to/file"
                  }
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addRecipient(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input) {
                      addRecipient(input.value);
                      input.value = "";
                    }
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newList.recipients?.map((recipient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {recipient}
                    <button
                      onClick={() => removeRecipient(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Export Formats</label>
              <div className="flex flex-wrap gap-2">
                {availableFormats.map((format) => (
                  <button
                    key={format}
                    onClick={() => toggleFormat(format)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      newList.formats?.includes(format)
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                Create List
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="space-y-3">
            {lists.map((list) => (
              <div
                key={list.id}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="text-sm font-semibold text-slate-900">{list.name}</h5>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          list.enabled
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {list.enabled ? "Enabled" : "Disabled"}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                        {list.type}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-slate-700">Recipients:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {list.recipients.map((recipient, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs"
                            >
                              {recipient}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Formats:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {list.formats.map((format, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
                            >
                              {format}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleList(list.id)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        list.enabled
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {list.enabled ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => deleteList(list.id)}
                      className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {lists.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">No distribution lists created yet</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

