"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";


interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
  allowed: boolean;
  inherited?: boolean;
  temporary?: {
    expiresAt: string;
    reason: string;
  };
}

export function PermissionEditor() {
  const { showToast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "manage_users",
      name: "Manage Users",
      category: "Administration",
      description: "Create, edit, and delete user accounts",
      allowed: false,
    },
    {
      id: "manage_pools",
      name: "Manage IP Pools",
      category: "Pool Management",
      description: "Create, edit, and delete IP pools",
      allowed: true,
    },
    {
      id: "manage_allocations",
      name: "Manage Allocations",
      category: "IP Management",
      description: "Allocate and release IP addresses",
      allowed: true,
    },
    {
      id: "view_reports",
      name: "View Reports",
      category: "Reporting",
      description: "Access reports and analytics",
      allowed: true,
      inherited: true,
    },
    {
      id: "manage_settings",
      name: "Manage Settings",
      category: "Administration",
      description: "Modify system settings",
      allowed: false,
    },
  ]);

  const [testingPermission, setTestingPermission] = useState<string>("");
  const [testResult, setTestResult] = useState<string | null>(null);

  const users = [
    { id: "user-001", name: "John Doe", username: "johndoe" },
    { id: "user-002", name: "Jane Smith", username: "janesmith" },
    { id: "user-003", name: "Bob Johnson", username: "bobjohnson" },
  ];

  const handleTogglePermission = (permissionId: string) => {
    setPermissions(
      permissions.map((p) =>
        p.id === permissionId ? { ...p, allowed: !p.allowed, inherited: false } : p
      )
    );
    showToast("Permission updated", "success");
  };

  const handleAddTemporaryPermission = (permissionId: string) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); 
    const reason = prompt("Reason for temporary permission:");
    if (reason) {
      setPermissions(
        permissions.map((p) =>
          p.id === permissionId
            ? {
                ...p,
                allowed: true,
                temporary: {
                  expiresAt: expiresAt.toISOString(),
                  reason,
                },
              }
            : p
        )
      );
      showToast("Temporary permission added", "success");
    }
  };

  const handleTestPermission = () => {
    if (!testingPermission) {
      showToast("Please select a permission to test", "warning");
      return;
    }
    const perm = permissions.find((p) => p.id === testingPermission);
    if (perm) {
      const result = perm.allowed
        ? `User has permission: ${perm.name}`
        : `User does NOT have permission: ${perm.name}`;
      setTestResult(result);
      showToast("Permission test completed", "success");
    }
  };

  const categories = Array.from(new Set(permissions.map((p) => p.category)));

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Permission Editor</h3>
        </div>   
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a user...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.username})
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <>
            {categories.map((category) => {
              const categoryPermissions = permissions.filter((p) => p.category === category);
              return (
                <div key={category}>
                  <h4 className="text-md font-semibold text-slate-900 mb-3">{category}</h4>
                  <div className="space-y-2">
                    {categoryPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-sm font-medium text-slate-900">
                                {permission.name}
                              </span>
                              {permission.inherited && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                  Inherited
                                </span>
                              )}
                              {permission.temporary && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                                  Temporary (expires {new Date(permission.temporary.expiresAt).toLocaleDateString()})
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mb-2">{permission.description}</p>
                            {permission.temporary && (
                              <p className="text-xs text-slate-500 italic">
                                Reason: {permission.temporary.reason}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={permission.allowed}
                                onChange={() => handleTogglePermission(permission.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                            </label>
                            {!permission.temporary && (
                              <button
                                onClick={() => handleAddTemporaryPermission(permission.id)}
                                className="px-2 py-1 text-xs text-yellow-700 bg-yellow-50 rounded hover:bg-yellow-100 transition-colors"
                                title="Add temporary permission"
                              >
                                Temp
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="text-md font-semibold text-slate-900 mb-3">Permission Testing</h4>
              <div className="flex items-center gap-3">
                <select
                  value={testingPermission}
                  onChange={(e) => setTestingPermission(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select permission to test...</option>
                  {permissions.map((perm) => (
                    <option key={perm.id} value={perm.id}>
                      {perm.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleTestPermission}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test
                </button>
              </div>
              {testResult && (
                <div className={`mt-3 p-3 rounded-lg ${
                  testResult.includes("has permission")
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}>
                  <p className="text-sm font-medium">{testResult}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

