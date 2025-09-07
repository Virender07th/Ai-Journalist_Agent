// Dashboard.jsx - Enhanced version
import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-gray-100/50 bg-grid-16"></div>
        
        {/* Content Container */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 min-h-[calc(100vh-8rem)]">
              <div className="p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;