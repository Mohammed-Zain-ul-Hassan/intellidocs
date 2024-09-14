// pages/dashboard.tsx
'use client'
import Navbar from "@/components/Navbar"; // Adjust the path based on your folder structure
import DocumentTable from "@/components/DocumentTable";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCurrentUser } from "@/app/appwrite/Services/authServices";

const Dashboard = () => {
  const router = useRouter();

  // Check if the user is logged in
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await getCurrentUser(); // Fetch current user from Appwrite
        if (!user) {
          router.push("/signup"); // Redirect if no user is logged in
        }
      } catch (error) {
        console.error("User is not logged in or session expired", error);
        router.push("/signup"); // Redirect to sign-up page on error
      }
    };
  
    checkUserSession();
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
