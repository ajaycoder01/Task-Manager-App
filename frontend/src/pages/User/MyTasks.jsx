
import React, { useEffect, useState } from 'react'
import DashboardLaylout from '../../components/layouts/DashboardLaylout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import TaskStatusTabs from '../../components/TaskStatusTabs'
import TaskCard from '../../components/Cards/TaskCard'

function MyTasks() {

  const [allTasks, setAllTasks] = useState([])
  const [tabs, setTabs] = useState([])
  const [filterStatus, setFilterStatus] = useState("")

  const navigate = useNavigate()

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_ALL_TASKS,
        {
          params: {
            status: filterStatus
          }
        }
      )

      setAllTasks(response.data?.tasks || [])

      const summary = response.data?.statusSummary || {}

      //  STATUS VALUE = BACKEND VALUE
      setTabs([
        { label: "All", value: "", count: summary.all || 0 },
        { label: "Pending", value: "Pending", count: summary.pendingTasks || 0 },
        { label: "In Progress", value: "In Progress", count: summary.inProgressTasks || 0 },
        { label: "Completed", value: "Completed", count: summary.completedTasks || 0 },
      ])

    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  useEffect(() => {
    getAllTasks()
  }, [filterStatus])

  return (
    <DashboardLaylout activeMenu="My Tasks">
      <div className="my-5 space-y-4 overflow-x-hidden">

        {/* Header + Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-medium">My Tasks</h2>

          {tabs.length > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allTasks.length > 0 ? (
            allTasks.map(task => (
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
                onClick={() => navigate(`/user/task-details/${task._id}`)}
              />
            ))
          ) : (
            <p className="text-gray-400 text-sm">No tasks found</p>
          )}
        </div>

      </div>
    </DashboardLaylout>
  )
}

export default MyTasks

