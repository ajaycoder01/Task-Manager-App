

import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUser } from "react-icons/lu";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";
import getAvatarUrl from "../../utils/getAvatarUrl";


const SelectUsers = ({ selectedUsers = [], setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  // FETCH USERS
  const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (Array.isArray(res.data)) {
        setAllUsers(res.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // TOGGLE USER
  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };


  //  HANDLE ASSIGN (IMPORTANT FIX)
const handleAssign = () => {
  const selectedUserObjects = allUsers.filter(u =>
    tempSelectedUsers.includes(u._id)
  );
  setSelectedUsers(selectedUserObjects); // 👈 full objects
  setIsModalOpen(false);
};


  //  SELECTED AVATARS (FIXED)
  const selectedUserAvatars = allUsers
    .filter((u) => selectedUsers.includes(u._id))
    .map((u) => getAvatarUrl(u.profileImageUrl));

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setTempSelectedUsers(selectedUsers);
  }, [selectedUsers]);

  return (
    <div className="space-y-3 mt-2">
      {/* ADD MEMBERS BUTTON */}
      <button
        type="button"
        className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 text-[13px] bg-white text-black rounded-md border border-gray-200 hover:bg-gray-50"
        onClick={() => setIsModalOpen(true)}
      >
        <LuUser className="text-sm" />
        Add Members
      </button>

      {/* SELECTED AVATARS */}
      {selectedUserAvatars.length > 0 && (
        <div
          className="cursor-pointer inline-block"
          onClick={() => setIsModalOpen(true)}
        >
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      {/* MODAL */}
   <Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title={
   <div className="flex items-center justify-between w-full px-4 py-3  rounded-t-lg">
  {/* TITLE */}
  <h3 className="text-lg font-semibold text-white">
    Select Team Members
  </h3>


</div>

  }
>
  {/* USER LIST */}
  <div className="space-y-3 max-h-[60vh] overflow-y-auto p-4 bg-white">
    {allUsers.map((user) => {
      const isChecked = tempSelectedUsers.includes(user._id);

      return (
        <div
          key={user._id}
          onClick={() => toggleUserSelection(user._id)}
          className={`
            flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition
            ${
              isChecked
                ? "bg-blue-50 border-blue-300 shadow-sm"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }
          `}
        >
          {/* AVATAR */}
          <img
            src={getAvatarUrl(user.profileImageUrl)}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border bg-gray-100"
          />

          {/* USER INFO */}
          <div className="flex-1">
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* CHECKBOX */}
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => toggleUserSelection(user._id)}
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 accent-blue-600 cursor-pointer"
          />
        </div>
      );
    })}
  </div>

  {/* FOOTER */}
  <div className="flex justify-between items-center pt-4 border-t mt-4 px-4 pb-4 bg-white">
    <p className="text-sm text-gray-500">
      Selected{" "}
      <span className="font-semibold text-gray-800">{tempSelectedUsers.length}</span>
    </p>

    <div className="flex gap-3">
      <button
        className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700
                   hover:bg-gray-100 transition"
        onClick={() => setIsModalOpen(false)}
      >
        Cancel
      </button>

      <button
        className="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white
                   hover:bg-blue-700 transition"
        onClick={handleAssign}
      >
        Done
      </button>
    </div>
  </div>
</Modal>


    </div>
  );
};

export default SelectUsers;

