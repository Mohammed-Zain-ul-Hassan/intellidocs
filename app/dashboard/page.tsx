// pages/dashboard.tsx
'use client'
import Navbar from "@/components/Navbar"; // Adjust the path based on your folder structure
import DocumentTable from "@/components/DocumentTable";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();

  // Check if the user is logged in
  useEffect(() => {
    const userIsLoggedIn = typeof window !== "undefined" && localStorage.getItem("authToken");
    
    if (!userIsLoggedIn) {
      // Redirect to signUp page if not logged in
      router.push("/signup");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-500 to-white">
      {/* Navbar */}
      <Navbar />

      {/* DocumentTable */}
      <div className="flex-grow container mx-auto p-4">
        <DocumentTable />
      </div>
    </div>
  );
};

export default Dashboard;
