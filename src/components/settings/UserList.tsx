"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";
import { DataTable, type Column } from "@/components/common/data-display";
import { users, type User } from "@/lib/data/users";

export function UserList() {
  const router = useRouter();
  const { showToast } = useToast();
  const [userList, setUserList] = useState<User[]>(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? user.is_active : !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [userList, searchTerm, roleFilter, statusFilter]);

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUserList(userList.filter((u) => u.id !== userId));
      showToast("User deleted successfully", "success");
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.size === 0) {
      showToast("No users selected", "warning");
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedUsers.size} user(s)?`)) {
      setUserList(userList.filter((u) => !selectedUsers.has(u.id)));
      setSelectedUsers(new Set());
      showToast(`${selectedUsers.size} user(s) deleted successfully`, "success");
    }
  };

  const handleBulkActivate = () => {
    if (selectedUsers.size === 0) {
      showToast("No users selected", "warning");
      return;
    }
    setUserList(
      userList.map((u) => (selectedUsers.has(u.id) ? { ...u, is_active: true } : u))
    );
    showToast(`${selectedUsers.size} user(s) activated`, "success");
  };

  const handleBulkDeactivate = () => {
    if (selectedUsers.size === 0) {
      showToast("No users selected", "warning");
      return;
    }
    setUserList(
      userList.map((u) => (selectedUsers.has(u.id) ? { ...u, is_active: false } : u))
    );
    showToast(`${selectedUsers.size} user(s) deactivated`, "success");
  };

  const handleEditUser = (user: User) => {
    router.push(`/dashboard/settings/users/${encodeURIComponent(user.id)}/edit`);
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, { bg: string; text: string }> = {
      admin: { bg: "bg-red-100", text: "text-red-800" },
      network_engineer: { bg: "bg-blue-100", text: "text-blue-800" },
      operator: { bg: "bg-green-100", text: "text-green-800" },
      viewer: { bg: "bg-slate-100", text: "text-slate-800" },
    };
    const config = roleColors[role] || { bg: "bg-slate-100", text: "text-slate-800" };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {role.replace(/_/g, " ")}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const columns: Column<User>[] = [
    {
      key: "username",
      label: "Username",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm font-medium text-slate-900">{value as string}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">{value as string}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">{value as string}</span>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (value: unknown) => getRoleBadge(value as string),
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">{value as string}</span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      sortable: true,
      render: (value: unknown, row: User) => getStatusBadge(row.is_active),
    },
    {
      key: "last_login",
      label: "Last Login",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">
          {value ? new Date(value as string).toLocaleDateString() : "Never"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (value: unknown, row: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditUser(row);
            }}
            className="text-blue-600 cursor-pointer hover:text-blue-700 p-1 rounded transition-colors"
            title="Edit user"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteUser(row.id)}
            className="text-red-600 cursor-pointer hover:text-red-700 p-1 rounded transition-colors"
            title="Delete user"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">User Accounts</h3>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/settings/users/ldap"
              className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Import from LDAP/AD
            </Link>
            <Link
              href="/dashboard/settings/users/create"
              className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New User
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="network_engineer">Network Engineer</option>
              <option value="operator">Operator</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {selectedUsers.size > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedUsers.size} user(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkActivate}
                  className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded hover:bg-green-200 transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={handleBulkDeactivate}
                  className="px-3 py-1 text-sm text-yellow-700 bg-yellow-100 rounded hover:bg-yellow-200 transition-colors"
                >
                  Deactivate
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <DataTable
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            data={filteredUsers as unknown as Record<string, unknown>[]}
            selectable={true}
            onSelectionChange={(selectedIndices: Set<number>) => {
              const selectedIds = new Set(
                Array.from(selectedIndices)
                  .map((index) => filteredUsers[index]?.id)
                  .filter(Boolean)
              );
              setSelectedUsers(selectedIds);
            }}
            pagination={{ pageSize: 10 }}
            emptyMessage="No users found"
          />
        </div>
      </div>
    </Card>
  );
}

