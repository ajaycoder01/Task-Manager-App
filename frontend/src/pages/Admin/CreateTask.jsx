

import React, { useEffect, useState } from 'react';
import DashboardLaylout from '../../components/layouts/DashboardLaylout';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRIORITY_DATA } from '../../utils/data';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';
import toast from 'react-hot-toast';
import { LuTrash2 } from 'react-icons/lu';

function CreateTask() {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
    assignedTo: [], // full user objects [{_id, name, profileImageUrl}]
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData(prev => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: '',
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const normalizeAttachments = (attachments = []) =>
    attachments.map(item =>
      typeof item === 'string' ? item : item?.url || item
    );

  /*-----------CREATE TASK ----------- */
  const createTask = async () => {
    setLoading(true);
    try {
      const todoList = (taskData.todoChecklist || []).map(item => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        assignedTo: taskData.assignedTo.map(u => u._id), // only IDs
        attachments: normalizeAttachments(taskData.attachments),
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : null,
        todoChecklist: todoList,
      });

      toast.success('Task Created Successfully');
      clearData();
      navigate('/admin/tasks');
    } catch (error) {
      toast.error('Failed to create task');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ------------UPDATE TASK--------------- */
  const updateTask = async () => {
    setLoading(true);
    try {
      const prevTodoChecklist = currentTask?.todoChecklist || [];

      const todoList = (taskData.todoChecklist || []).map(item => {
        const matched = prevTodoChecklist.find(t => t.text === item);
        return {
          text: item,
          completed: matched ? matched.completed : false,
        };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        assignedTo: taskData.assignedTo.map(u => u._id), // only IDs
        attachments: normalizeAttachments(taskData.attachments),
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : currentTask?.dueDate,
        todoChecklist: todoList,
      });

      toast.success('Task Updated Successfully');
      navigate('/admin/tasks');
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* --------------- SUBMIT ------------*/
  const handleSubmit = () => {
    setError('');

    if (!taskData.title.trim()) return setError('Title is required');
    if (!taskData.description.trim()) return setError('Description is required');
    if (!taskData.dueDate) return setError('Due date is required');
    if (taskData.assignedTo.length === 0)
      return setError('Assign task to at least one member');
    if (taskData.todoChecklist.length === 0)
      return setError('Add at least one todo');

    taskId ? updateTask() : createTask();
  };

  /* ================= GET TASK ================= */
  const getTaskDetailsByID = async () => {
    try {
      const { data } = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      setCurrentTask(data);
      setTaskData({
        title: data.title || '',
        description: data.description || '',
        priority: data.priority || 'Low',
        dueDate: data.dueDate
          ? moment(data.dueDate).format('YYYY-MM-DD')
          : '',
        assignedTo: data?.assignedTo || [], // full user objects
        todoChecklist: data?.todoChecklist?.map(t => t.text) || [],
        attachments: data?.attachments || [],
      });
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= DELETE ================= */
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success('Task deleted successfully');
      navigate('/admin/tasks');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  useEffect(() => {
    if (taskId) getTaskDetailsByID();
  }, [taskId]);

  return (
    <DashboardLaylout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="form-card col-span-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">
                {taskId ? 'Update Task' : 'Create Task'}
              </h2>

              {taskId && (
                <button
                  onClick={() => setOpenDeleteAlert(true)}
                  className="flex items-center gap-1 text-rose-500 bg-rose-50 px-2 py-1 rounded text-xs"
                >
                  <LuTrash2 /> Delete
                </button>
              )}
            </div>

            <input
              className="form-input mt-4"
              placeholder="Task Title"
              value={taskData.title}
              onChange={e =>
                handleValueChange('title', e.target.value)
              }
            />

            <textarea
              className="form-input mt-3"
              placeholder="Description"
              rows={4}
              value={taskData.description}
              onChange={e =>
                handleValueChange('description', e.target.value)
              }
            />

            <div className="grid grid-cols-12 gap-4 mt-3">
              <div className="col-span-4">
                 <label className='text-xs font-medium text-slate-600'>
                Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={val =>
                    handleValueChange('priority', val)
                  }
                />
              </div>

              <div className="col-span-4">
                 <label className='text-xs font-medium text-slate-600'>
                 Due Date
               </label>
                <input
                  type="date"
                  className="form-input"
                  value={taskData.dueDate || ''}
                  onChange={e =>
                    handleValueChange('dueDate', e.target.value)
                  }
                />
              </div>

              <div className="col-span-4">
                    <label className='text-xs font-medium text-slate-600'>
                Assign To
               </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={val =>
                    handleValueChange('assignedTo', val)
                  }
                />
               
              </div>
            </div>
               <label className='text-xs font-medium text-slate-600'>
                Todo Checklist
                </label>
            <TodoListInput
              todoList={taskData.todoChecklist}
              setTodoList={val =>
                handleValueChange('todoChecklist', val)
              }
            />
               <label className='text-xs font-medium text-slate-600'>
              Add Attachments
            </label>
            <AddAttachmentsInput
              attachments={taskData.attachments}
              setAttachments={val =>
                handleValueChange('attachments', val)
              }
            />

            {error && (
              <p className="text-red-500 text-xs mt-3">{error}</p>
            )}

            <div className="flex justify-end mt-6">
              <button
                disabled={loading}
                className="add-btn"
                onClick={handleSubmit}
              >
                {taskId ? 'UPDATE TASK' : 'CREATE TASK'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
        />
      </Modal>
    </DashboardLaylout>
  );
}

export default CreateTask;

