import { Outlet } from "@remix-run/react";
import Sidebar from "~/components/sideBar";
import Navbar from "~/components/topNavBar";
import { useLoaderData } from "@remix-run/react";



export default function DashboardLayout() {

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar at the top */}
      <Navbar />

      {/* Content area with Sidebar and Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}