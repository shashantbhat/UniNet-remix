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
import {CardBackgroundShine} from "~/components/card";
import InfiniteSliderExample from "~/components/infinite-slider";
import CardHoverEffect from "~/components/card-hover-effects";

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
              <p className="text-center text-gray-700 max-w-2xl mx-auto my-6 leading-relaxed">
              UniNet was created to simplify university life by addressing key challenges like data management, study material access, and connectivity. Designed with students, admins, and developers in mind, it provides tailored dashboards, seamless file management, and a reliable platform to empower academic communities.
              </p>
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 p-8 max-w-6xl mx-auto">
                  <div className="w-full md:w-1/2 max-w-xl hover:scale-105 transition-transform">
                    <CardRevealedPointer />
                  </div>
                  <div className="w-full md:w-1/2 max-w-xl hover:scale-105 transition-transform">
                    <CardBackgroundShine />
                  </div>
                </div>
              </div>
              {/* <div>
                <CardHoverEffect />
              </div> */}
              <div>
                <InfiniteSliderExample />
              </div>
            </div>
          )}
          <Outlet />
          <div>
            <footer className="border-t border-gray-700/30 mt-12 bg-transparent">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-800 font-semibold">UniNet</span>
                    <span className="text-gray-600">|</span>
                    <a href="/dash/id" className="text-gray-600 hover:text-blue-600">Dashboard</a>
                    <a href="/resources" className="text-gray-600 hover:text-blue-600">Resources</a>
                    <a href="/community" className="text-gray-600 hover:text-blue-600">Community</a>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">support@uninet.edu</span>
                    <span className="text-gray-600">&copy; {new Date().getFullYear()} UniNet</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </main>
        
      </div>
    </div>
  );
}
