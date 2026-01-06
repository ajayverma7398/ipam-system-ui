import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">          
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                About IPAM UI
              </h2>
              <p className="text-gray-600 mb-4">
                IPAM UI is a modern web application for managing IP addresses and network resources.
              </p>
              <p className="text-gray-600 mb-4">
                This application provides a user-friendly interface for tracking and managing your network infrastructure.
              </p>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">
                Features
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>IP Address Management</li>
                <li>Network Resource Tracking</li>
                <li>Dashboard Analytics</li>
                <li>User Authentication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

