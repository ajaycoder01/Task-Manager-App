
import React from "react";
import Progress from "../Progress";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";
import AvatarGroup from "../AvatarGroup";

import getAvatarUrl from "../../utils/getAvatarUrl";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo = [],
  attachmentCount,
  completedTodoCount,
  todoChecklist = [],
  onClick,
}) => {

 const avatarUrls = assignedTo
  .map(user => getAvatarUrl(user?.profileImageUrl))
  .filter(Boolean);

  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/10";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
      case "Medium":
        return "text-amber-500 bg-amber-50 border border-amber-500/10";
      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  return (
    <div
      className="bg-white rounded-xl py-4 shadow-gray-100 border border-gray-200/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-wrap gap-2 px-4 items-end">
        <div className={`text-[11px] font-medium ${getStatusTagColor()} px-3 py-0.5 rounded`}>
          {status}
        </div>
        <div className={`text-[11px] font-medium ${getPriorityTagColor()} px-3 py-0.5 rounded`}>
          {priority} Priority
        </div>
      </div>

      <div
        className={`px-4 mt-3 border-l-4 ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-indigo-500"
            : "border-violet-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-800 line-clamp-2">
          {title}
        </p>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {description}
        </p>

        <p className="text-[13px] mt-2 mb-2">
          Task Done:{" "}
          <span className="font-semibold">
            {completedTodoCount} / {todoChecklist.length}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>

      <div className="px-4 mt-3">
        <div className="flex justify-between">
          <div>
            <label className="text-xs text-gray-500">Start Date</label>
            <p className="text-[13px] font-medium">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500">Due Date</label>
            <p className="text-[13px] font-medium">
              {moment(dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <AvatarGroup avatars={avatarUrls} />

          {attachmentCount > 0 && (
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
              <LuPaperclip className="text-primary" />
              <span className="text-xs">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

