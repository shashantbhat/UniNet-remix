import { Outlet, useLocation } from "@remix-run/react";
import Sidebar from "~/components/sideBar";
import Navbar from "~/components/topNavBar";
import { useLoaderData } from "@remix-run/react";
import { PopoverExample } from "~/components/pop-over";
import { PopoverExample1 } from "~/components/pop-over1";
import { useState, useEffect } from "react";
import { TextGlitch } from "~/components/animatedText";
import { TextGenerateEffectExample } from "~/components/animatedText";
import { CardRevealedPointer } from "~/components/card";

export default function DashboardLayout() {
  const location = useLocation();
  
  // Check if we're on a route that should hide the dashboard content
  const shouldHideContent = location.pathname.includes('/community-operated') || 
                            location.pathname.includes('/files/') || 
                            location.pathname.includes('/upload-material');
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Navbar with blur effect */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>

      {/* Fixed Sidebar */}
      <div className="fixed bg-[#fafafa] top-[50px] left-0 h-full z-40">
        <Sidebar />
      </div>

      {/* Main Content with margin for navbar and sidebar */}
      <div className="flex flex-grow mt-[50px] ml-[240px]">
        <main className="flex-grow p-4 bg-[#fafafa]">
          {!shouldHideContent && (
            <div>
              <div className="flex justify-center pt-8">
                <div className="text-4xl font-bold">
                  <TextGenerateEffectExample />
                </div>
              </div>
              <div className="flex flex-row items-center justify-center pt-12 space-x-8">
                <TextGlitch />
                <div>
                  <PopoverExample />
                </div>
                <div>
                  <PopoverExample1 />
                </div>
              </div>
              <div>
                <CardRevealedPointer />
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
