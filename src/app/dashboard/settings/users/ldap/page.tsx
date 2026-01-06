"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/common/layout";
import { FormInput } from "@/components/common/forms";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

export default function LDAPImportPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    server: "",
    port: "389",
    bindDN: "",
    password: "",
    baseDN: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.server || !formData.baseDN) {
      showToast("Please fill in server and base DN", "error");
      return;
    }

    try {
      console.log("Importing from LDAP:", formData);
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      showToast("LDAP import initiated. This would connect to your LDAP server in a real application.", "info");
      router.push("/dashboard/settings/users");
    } catch {
      showToast("Failed to import from LDAP", "error");
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
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Import Users from LDAP/AD</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="LDAP Server"
                  name="server"
                  value={formData.server}
                  onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                  placeholder="ldap.example.com"
                  required
                />
                <FormInput
                  label="Port"
                  name="port"
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  required
                />
              </div>
              <FormInput
                label="Bind DN"
                name="bindDN"
                value={formData.bindDN}
                onChange={(e) => setFormData({ ...formData, bindDN: e.target.value })}
                placeholder="cn=admin,dc=example,dc=com"
              />
              <FormInput
                label="Bind Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <FormInput
                label="Base DN"
                name="baseDN"
                value={formData.baseDN}
                onChange={(e) => setFormData({ ...formData, baseDN: e.target.value })}
                placeholder="ou=users,dc=example,dc=com"
                required
              />
            </div>
            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors font-medium"
              >
                Import Users
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

