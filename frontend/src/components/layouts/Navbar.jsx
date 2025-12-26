
import React from "react";
import { HiOutlineMenu } from "react-icons/hi";

const Navbar = ({ onMenuClick }) => {
  return (
    <div className="flex gap-5 bg-white border border-gray-200/50 py-4 px-7 sticky top-0 z-30">
      
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-black"
        onClick={onMenuClick}
      >
        <HiOutlineMenu className="text-2xl" />
      </button>

      <h2 className="text-lg font-medium text-black">Dashboard</h2>
    </div>
  );
};

export default Navbar;
