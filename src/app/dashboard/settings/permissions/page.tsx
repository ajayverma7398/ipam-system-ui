"use client";

import {
  PermissionEditor,
  RoleManager,
} from "@/components/settings";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function PermissionsPage() {
  return (
    <div className="flex flex-col min-h-full w-full max-w-full min-w-0">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <div className="space-y-6 w-full max-w-full min-w-0">
        <PermissionEditor />
        <RoleManager />
      </div>
    </div>
  );
}

