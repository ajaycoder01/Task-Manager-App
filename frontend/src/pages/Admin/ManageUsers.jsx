import React, { useEffect, useState } from 'react'
import DashboardLaylout from '../../components/layouts/DashboardLaylout'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import UserCard from '../../components/Cards/UserCard';
import toast from 'react-hot-toast';

function ManageUsers() {

  const [allUsers, setAllUsers] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = loggedInUser?._id;

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
        // console.log("response: ", response.data);

      }
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  // download task report 
  const handleDownloadReport = async () => {

    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      })

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }

  }

  const handleDeleteUser = async (userId) => {

    //  khud ko delete karne se roko
    if (userId === loggedInUserId) {
      toast.error("You cannot delete yourself");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axiosInstance.delete(
        API_PATHS.USERS.DELETE_USER(userId) //  yahan ID pass karna zaroori hai
      );

      // UI se user hata do
      setAllUsers((prev) => prev.filter((u) => u._id !== userId));

      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete user");
    }
  };



  useEffect(() => {
    getAllUsers();
    return () => { };
  }, [])

  // console.log("allUsers: ", allUsers);

  return (
    <DashboardLaylout activeMenu='Team Members' >
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className='text-xl md:text-xl font-medium'>Team Members</h2>
          <button className='flex md:flex download-btn' onClick={handleDownloadReport}>
            <LuFileSpreadsheet className='text-lg' />
            Download Report
          </button>
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <UserCard key={user._id} userInfo={user} onDelete={handleDeleteUser} />
          ))}
        </div>
      </div>

    </DashboardLaylout>
  )
}

export default ManageUsers