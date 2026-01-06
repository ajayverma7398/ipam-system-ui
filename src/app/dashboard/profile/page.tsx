"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { FormInput } from "@/components/common/forms";
import { Breadcrumb } from "@/components/common/layout";
import { useToast } from "@/components/ui";
import { users, type User } from "@/lib/data/users";

export default function ProfilePage() {
  const { showToast } = useToast();
  
  const currentUser = users[0] as User;
    
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    department: currentUser.department,
  });

  const handleSave = async () => {
    try {
      console.log("Updating profile:", formData);
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      showToast("Profile updated successfully", "success");
      setIsEditing(false);
    } catch {
      showToast("Failed to update profile", "error");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      department: currentUser.department,
    });
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-800",
      network_engineer: "bg-blue-100 text-blue-800",
      operator: "bg-green-100 text-green-800",
      viewer: "bg-slate-100 text-slate-800",
    };
    return colors[role] || "bg-slate-100 text-slate-800";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <FormInput
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                  <FormInput
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                  <FormInput
                    label="Department"
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Enter your department"
                  />
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Full Name</label>
                    <p className="text-base text-slate-900 mt-1">{currentUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email Address</label>
                    <p className="text-base text-slate-900 mt-1">{currentUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Department</label>
                    <p className="text-base text-slate-900 mt-1">{currentUser.department}</p>
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Username</label>
                  <p className="text-base text-slate-900 mt-1 font-mono">{currentUser.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Role</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(currentUser.role)}`}>
                      {currentUser.role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Account Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      currentUser.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {currentUser.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Member Since</label>
                  <p className="text-base text-slate-900 mt-1">
                    {new Date(currentUser.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Last Login</label>
                  <p className="text-base text-slate-900 mt-1">
                    {new Date(currentUser.last_login).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Summary</h2>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{currentUser.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{currentUser.email}</p>
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Permissions</h2>
              <div className="space-y-2">
                {currentUser.permissions.length > 0 ? (
                  currentUser.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No specific permissions assigned</p>
                )}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                  Security Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                  Notification Preferences
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
}

