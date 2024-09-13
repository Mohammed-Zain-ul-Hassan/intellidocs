// pages/dashboard.tsx
import Navbar from "@/components/Navbar"; // Adjust the path based on your folder structure
import DocumentTable from "@/components/DocumentTable";

const Dashboard = () => {
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
