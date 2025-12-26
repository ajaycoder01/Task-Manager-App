
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/default-avatar.png";
  import { BASE_URL } from "../../utils/apiPaths";

const SideMenu = ({ activeMenu, isOpen, onClose }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);


  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
    onClose?.();
  };

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
    onClose?.(); //  mobile me click par sidebar close
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);

const profileImage =
  user?.profileImageUrl
    ? user.profileImageUrl.startsWith("http")
      ? user.profileImageUrl              //  already full URL
      : `${BASE_URL}/${user.profileImageUrl}` //  relative path
    : defaultAvatar;

// console.log("User object:", user);
// console.log("Profile image URL:", user?.profileImageUrl);

  return (
    <>
    {/* Overlay (Mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar  */}
      <div
        className={`
          fixed lg:sticky top-[61px] left-0 z-50
           w-64 min-w-[16rem] shrink-0 h-[calc(100vh-61px)]
          bg-white border-r border-gray-200/50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col items-center mb-7 pt-5">
          {/* Profile */}
          <img
            src={profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover bg-slate-300"
              onError={(e) => (e.target.src = defaultAvatar)}
          />

          {user?.role === "admin" && (
            <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
              Admin
            </div>
          )}

          <h5 className="text-gray-950 font-medium mt-3">
            {user?.name}
          </h5>
          <p className="text-[12px] text-gray-600">{user?.email}</p>

          {/* Menu */}
          <div className="w-full mt-5">
            {sideMenuData.map((item, index) => (
              <button
                key={`menu_${index}`}
                className={`
                  w-full flex items-center gap-4 text-[15px]
                  py-3 px-6
                  hover:bg-blue-50
                  ${
                    activeMenu === item.label
                      ? "text-primary bg-blue-50 border-r-4 border-primary"
                      : "text-gray-700"
                  }
                `}
                onClick={() => handleClick(item.path)}
              >
                <item.icon className="text-xl" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
