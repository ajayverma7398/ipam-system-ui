"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface Role {
  id: string;
  name: string;
  description: string;
  isPredefined: boolean;
  permissions: string[];
  parentRole?: string;
  userCount: number;
}

export function RoleManager() {
  const { showToast } = useToast();
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "admin",
      name: "Admin",
      description: "Full system access with all permissions",
      isPredefined: true,
      permissions: [
        "manage_users",
        "manage_pools",
        "manage_allocations",
        "view_reports",
        "manage_settings",
        "manage_integrations",
      ],
      userCount: 3,
    },
    {
      id: "network_engineer",
      name: "Network Engineer",
      description: "Network management and IP pool administration",
      isPredefined: true,
      permissions: ["manage_pools", "manage_allocations", "view_reports"],
      userCount: 5,
    },
    {
      id: "operator",
      name: "Operator",
      description: "IP allocation and basic pool management",
      isPredefined: true,
      permissions: ["manage_allocations", "view_reports"],
      userCount: 2,
    },
    {
      id: "viewer",
      name: "Viewer",
      description: "Read-only access to view IP information",
      isPredefined: true,
      permissions: ["view_reports"],
      userCount: 1,
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: "",
    description: "",
    permissions: [],
    parentRole: "",
  });

  const allPermissions = [
    { id: "manage_users", label: "Manage Users", category: "Administration" },
    { id: "manage_pools", label: "Manage IP Pools", category: "Pool Management" },
    { id: "manage_allocations", label: "Manage Allocations", category: "IP Management" },
    { id: "view_reports", label: "View Reports", category: "Reporting" },
    { id: "manage_settings", label: "Manage Settings", category: "Administration" },
    { id: "manage_integrations", label: "Manage Integrations", category: "Administration" },
  ];

  const handleCreateRole = () => {
    if (!newRole.name) {
      showToast("Please enter a role name", "error");
      return;
    }
    const role: Role = {
      id: newRole.name.toLowerCase().replace(/\s+/g, "_"),
      name: newRole.name,
      description: newRole.description || "",
      isPredefined: false,
      permissions: newRole.permissions || [],
      parentRole: newRole.parentRole || undefined,
      userCount: 0,
    };
    setRoles([...roles, role]);
    setNewRole({ name: "", description: "", permissions: [], parentRole: "" });
    setIsCreating(false);
    showToast("Role created successfully", "success");
  };

  const togglePermission = (permissionId: string) => {
    const permissions = newRole.permissions || [];
    if (permissions.includes(permissionId)) {
      setNewRole({ ...newRole, permissions: permissions.filter((p) => p !== permissionId) });
    } else {
      setNewRole({ ...newRole, permissions: [...permissions, permissionId] });
    }
  };

  const deleteRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (role?.isPredefined) {
      showToast("Predefined roles cannot be deleted", "error");
      return;
    }
    if ((role?.userCount ?? 0) > 0) {
      showToast("Cannot delete role with assigned users", "error");
      return;
    }
    if (confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter((r) => r.id !== roleId));
      showToast("Role deleted successfully", "success");
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Role Management</h3>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            {isCreating ? "Cancel" : "+ New Role"}
          </button>
        </div>

        {isCreating && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
            <h4 className="text-md font-semibold text-slate-900">Create Custom Role</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role Name *</label>
                <input
                  type="text"
                  value={newRole.name || ""}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="e.g., Senior Operator"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Parent Role (Optional)</label>
                <select
                  value={newRole.parentRole || ""}
                  onChange={(e) => setNewRole({ ...newRole, parentRole: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">None</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={newRole.description || ""}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Role description..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Permissions</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allPermissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={newRole.permissions?.includes(permission.id) || false}
                      onChange={() => togglePermission(permission.id)}
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-900">{permission.label}</span>
                      <p className="text-xs text-slate-500">{permission.category}</p>
                    </div>
                  </label>
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
                onClick={handleCreateRole}
                className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                Create Role
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="text-sm font-semibold text-slate-900">{role.name}</h5>
                    {role.isPredefined && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        Predefined
                      </span>
                    )}
                    {role.parentRole && (
                      <span className="text-xs text-slate-500">
                        Inherits from: {roles.find((r) => r.id === role.parentRole)?.name || role.parentRole}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{role.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {role.permissions.map((permId) => {
                      const perm = allPermissions.find((p) => p.id === permId);
                      return perm ? (
                        <span
                          key={permId}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs"
                        >
                          {perm.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                  <p className="text-xs text-slate-500">
                    {role.userCount || 0} user(s) assigned to this role
                  </p>
                </div>
                {!role.isPredefined && (
                  <button
                    onClick={() => deleteRole(role.id)}
                    className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors ml-4"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

