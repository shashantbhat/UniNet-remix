import { Outlet, useLocation } from "@remix-run/react";
import Sidebar from "~/components/sideBar";
import Navbar from "~/components/topNavBar";
import { useLoaderData } from "@remix-run/react";
import { PopoverExample } from "~/components/pop-over";
import { PopoverExample1 } from "~/components/pop-over1";
import { PopoverExample2 } from "~/components/pop-over2";
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
                <div>
                  <PopoverExample2 />
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
                    {/* <a href="/resources" className="text-gray-600 hover:text-blue-600">Resources</a> */}
                    <a href="https://github.com/shashantbhat/UniNet-Remix" className="text-gray-600 hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 256 256"><path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z"></path></svg>
                    {/* Github */}
                    </a>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a
                      href="mailto:ask.uninet@gmail.com"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      ask.uninet@gmail.com
                    </a>
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
