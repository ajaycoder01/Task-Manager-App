
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLaylout from "../../components/layouts/DashboardLaylout";
import moment from "moment";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import AvatarGroup from "../../components/AvatarGroup";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  //  FETCH TASK DETAILS
  const getTaskDetailsByID = async () => {
    if (!id) return navigate("/tasks"); // safeguard
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      if (res?.data?._id) setTask(res.data);
      else navigate("/tasks"); // safety redirect
    } catch (error) {
      console.error("Task fetch error:", error);
      navigate("/tasks");
    }
  };

  //  TODO CHECKLIST UPDATE
  const updateTodoChecklist = async (index) => {
    if (!task || !id) return;

    const updatedChecklist = [...task.todoChecklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;

    try {
      const res = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST({ taskId: id }),
        { todoChecklist: updatedChecklist }
      );

      if (res.status === 200 && res.data?.task) {
        setTask(res.data.task); // update frontend state
      } else {
        updatedChecklist[index].completed = !updatedChecklist[index].completed; // revert
        console.error("Checklist update failed: API returned non-200");
      }
    } catch (err) {
      updatedChecklist[index].completed = !updatedChecklist[index].completed; // revert
      console.error("Checklist update failed:", err.response?.data?.message || err.message);
    }
  };

  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) link = "https://" + link;
    window.open(link, "_blank");
  };

  useEffect(() => {
    getTaskDetailsByID();
  }, [id]);

  return (
    <DashboardLaylout activeMenu="My Tasks">
      <div className="mt-5">
        {!task ? (
          <p className="text-sm text-gray-400">Task not found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card md:col-span-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm md:text-xl font-medium">{task.title}</h2>
                <span
                  className={`text-[11px] md:text-[13px] font-medium px-4 py-0.5 rounded ${getStatusTagColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              <div className="mt-4">
                <InfoBox label="Description" value={task.description || "N/A"} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={task.priority} />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={task.dueDate ? moment(task.dueDate).format("Do MMM YYYY") : "N/A"}
                  />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">Assigned To</label>
                  <AvatarGroup
                    avatars={task.assignedTo?.map((u) => u?.profileImageUrl) || []}
                    maxVisible={5}
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-xs font-medium text-slate-500">Todo Checklist</label>
                {task.todoChecklist?.length > 0 ? (
                  task.todoChecklist.map((item, index) => (
                    <TodoCheckList
                      key={index}
                      text={item.text}
                      isChecked={item.completed}
                      onChange={() => updateTodoChecklist(index)}
                    />
                  ))
                ) : (
                  <p className="text-xs text-gray-400 mt-2">No checklist items</p>
                )}
              </div>

              {task.attachments?.length > 0 && (
                <div className="mt-3">
                  <label className="text-xs font-medium text-slate-500">Attachments</label>
                  {task.attachments.map((link, index) => (
                    <Attachment key={index} index={index} link={link} onClick={() => handleLinkClick(link)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLaylout>
  );
};

export default ViewTaskDetails;

/* ---------------- SMALL COMPONENTS ---------------- */

const InfoBox = ({ label, value }) => (
  <>
    <label className="text-xs font-medium text-slate-500">{label}</label>
    <p className="text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5">{value}</p>
  </>
);

const TodoCheckList = ({ text, isChecked, onChange }) => (
  <div className="flex items-center gap-3 p-3">
    <input type="checkbox" checked={isChecked} onChange={onChange} className="w-4 h-4 cursor-pointer" />
    <p className="text-[13px] text-gray-800">{text}</p>
  </div>
);

const Attachment = ({ link, index, onClick }) => (
  <div className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mt-2 cursor-pointer" onClick={onClick}>
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 font-semibold">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
      <p className="text-xs break-all">{link}</p>
    </div>
    <LuSquareArrowOutUpRight className="text-gray-400" />
  </div>
);
