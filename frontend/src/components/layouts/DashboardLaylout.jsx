

import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen min-w-screen bg-gray-50">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      {user && (
        <div className="flex">
          <SideMenu
            activeMenu={activeMenu}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <div className="grow mx-5 pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;

