import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, toggleTaskStatus } from '../../store/slices/taskSlice';
import toast from 'react-hot-toast';
import { TASK_STATUS } from '../../utils/constants';

const TaskCard = ({ task, onEditTask, onSelectTask, isSelected }) => {
  const dispatch = useDispatch();

  const handleToggleStatus = () => {
    dispatch(toggleTaskStatus(task.id))
      .unwrap()
      .then(() => {
        toast.success('Task status updated successfully');
      })
      .catch((error) => {
        toast.error(error || 'Failed to update task status');
      });
  };

  const handleDeleteTask = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id))
        .unwrap()
        .then(() => {
          toast.success('Task deleted successfully');
        })
        .catch((error) => {
          toast.error(error || 'Failed to delete task');
        });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [TASK_STATUS.PENDING]: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pending',
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      [TASK_STATUS.COMPLETED]: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Completed',
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      }
    };

    const config = statusConfig[status] || statusConfig[TASK_STATUS.PENDING];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          {/* Checkbox */}
          <div className="flex-shrink-0 mt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectTask(task.id)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          
          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-medium text-gray-900 truncate ${
              task.status === TASK_STATUS.COMPLETED ? 'line-through opacity-60' : ''
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-1 text-sm text-gray-600 line-clamp-2 ${
                task.status === TASK_STATUS.COMPLETED ? 'line-through opacity-60' : ''
              }`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 ml-3">
          {getStatusBadge(task.status)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-400">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {new Date(task.created_at).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleToggleStatus}
            className={`p-2 rounded-md transition-colors duration-200 ${
              task.status === TASK_STATUS.COMPLETED
                ? 'text-yellow-600 hover:bg-yellow-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={task.status === TASK_STATUS.COMPLETED ? 'Mark as pending' : 'Mark as complete'}
          >
            {task.status === TASK_STATUS.COMPLETED ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onEditTask(task)}
            className="p-2 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
            title="Edit task"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDeleteTask}
            className="p-2 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
            title="Delete task"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
