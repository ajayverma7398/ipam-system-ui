"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/layout";
import { FormInput } from "@/components/common/forms";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";
import { users, type UserRole } from "@/lib/data/users";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  
  const userId = decodeURIComponent(params.id as string);
  const user = users.find((u) => u.id === userId || u.username === userId);

  const [formData, setFormData] = useState(() => {
    if (user) {
      return {
        username: user.username,
        email: user.email,
        name: user.name,
        password: "",
        role: user.role,
        department: user.department,
      };
    }
    return {
      username: "",
      email: "",
      name: "",
      password: "",
      role: "viewer" as UserRole,
      department: "",
    };
  });

  if (!user) {
    notFound();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.name) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    try {
      console.log("Updating user:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      showToast("User updated successfully", "success");
      router.push("/dashboard/settings/users");
    } catch {
      showToast("Failed to update user", "error");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/settings/users");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Edit User</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Username"
                name="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                disabled
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <FormInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <FormInput
                label="Department"
                name="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2b6cb0] focus:border-transparent"
                >
                  <option value="viewer">Viewer</option>
                  <option value="operator">Operator</option>
                  <option value="network_engineer">Network Engineer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <FormInput
                label="New Password (leave blank to keep current)"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                helperText="Leave blank if you don't want to change the password"
              />
            </div>
            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors font-medium"
              >
                Update User
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

