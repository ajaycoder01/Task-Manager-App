
import React from 'react'
import { MdDelete } from "react-icons/md";
import { BASE_URL } from "../../utils/apiPaths";
import defaultAvatar from "../../assets/default-avatar.png";

const UserCard = ({ userInfo, onDelete }) => {

  const profileImage =
    userInfo?.profileImageUrl && userInfo.profileImageUrl.trim() !== ""
       ? `${BASE_URL}/${userInfo.profileImageUrl}`
      : defaultAvatar;

  const handleDeleteUser = () => {
    if (window.confirm(`Delete ${userInfo.name}?`)) {
      onDelete(userInfo._id);
    }
  };

  return (
    <div className="relative user-card p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">

      {/* Delete Button */}
      <button
        onClick={handleDeleteUser}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
        title="Delete User"
      >
        <MdDelete size={18} />
      </button>

      {/* Header */}
      <div className="flex items-center gap-4">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Avatar"
            className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center border-2 border-white shadow-sm">
            <span className="text-white text-sm font-semibold">
              {userInfo?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-gray-900">
            {userInfo?.name}
          </p>
          <p className="text-xs text-gray-500">
            {userInfo?.email}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mt-5">
        <StatCard label="Pending" count={userInfo?.pendingTasks || 0} status="Pending" />
        <StatCard label="In Progress" count={userInfo?.inProgressTasks || 0} status="In Progress" />
        <StatCard label="Completed" count={userInfo?.completedTasks || 0} status="Completed" />
      </div>
    </div>
  );
};

export default UserCard;

// -------------------
const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-600 bg-cyan-100";
      case "Completed":
        return "text-green-600 bg-green-100";
      default:
        return "text-rose-600 bg-rose-100";
    }
  };

  return (
    <div className={`flex-1 flex flex-col items-center py-2 rounded-md ${getStatusTagColor()}`}>
      <span className="text-sm font-bold">{count}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
};
