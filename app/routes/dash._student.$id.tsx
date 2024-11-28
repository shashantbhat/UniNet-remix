import DashboardLayout from "~/components/dashboard_layout";
import React, { useState, useEffect } from "react";
import { LoadingSpinner } from '~/components/loadingSpinner'; 

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate a network request or some async operation
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust the timeout as necessary
  }, []);
  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      ) : (
      <DashboardLayout />   
    )}
    </div> 
  );
}