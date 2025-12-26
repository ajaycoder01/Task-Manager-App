
import React, { useEffect, useState } from 'react'
import DashboardLaylout from '../../components/layouts/DashboardLaylout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { LuFileSpreadsheet } from 'react-icons/lu'
import TaskStatusTabs from '../../components/TaskStatusTabs'
import TaskCard from '../../components/Cards/TaskCard'

function ManageTask() {

  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_ALL_TASKS,
        {
          params: {
            status: filterStatus === "All" ? "" : filterStatus
          }
        }
      );

      const tasks = response.data?.tasks || [];
      const summary = response.data?.statusSummary || {};

      setAllTasks(tasks);

      //  FIXED KEYS (MATCH BACKEND)
      setTabs([
        { label: "All", count: summary.all || 0 },
        { label: "Pending", count: summary.pendingTasks || 0 },
        { label: "In Progress", count: summary.inProgressTasks || 0 },
        { label: "Completed", count: summary.completedTasks || 0 },
      ]);

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  const handleClick = (task) => {
    navigate('/admin/create-task', {
      state: { taskId: task._id }
    });
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.REPORTS.EXPORT_TASKS,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "task_details.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <DashboardLaylout activeMenu="Manage Tasks">
      <div className="my-5 space-y-4 overflow-x-hidden">

  {/* Header + Tabs + Download Button */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
    <h2 className="text-xl font-medium">My Tasks</h2>

    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
      {tabs?.length > 0 && (
        <TaskStatusTabs
          tabs={tabs}
          activeTab={filterStatus}
          setActiveTab={setFilterStatus}
        />
      )}

      <button className='download-btn w-full sm:w-auto flex items-center justify-center gap-1 mt-2 sm:mt-0'
        onClick={handleDownloadReport}>
        <LuFileSpreadsheet className='text-lg'/>
        Download Report
      </button>
    </div>
  </div>

  {/* Task Cards Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
    {allTasks.map(task => (
      <TaskCard
        key={task._id}
        title={task.title}
        description={task.description}
        priority={task.priority}
        status={task.status}
        progress={task.progress}
        dueDate={task.dueDate}
        assignedTo={task.assignedTo || []}
        attachmentCount={task.attachments?.length || 0}
        completedTodoCount={task.completedTodoCount || 0}
        todoChecklist={task.todoChecklist || []}
        onClick={() => handleClick(task)}
      />
    ))}
  </div>

</div>

    </DashboardLaylout>
  );
}

export default ManageTask;
