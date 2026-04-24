import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask, reset } from '../../store/slices/taskSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import { TASK_STATUS } from '../../utils/constants';

const TaskForm = ({ task, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.PENDING,
  });

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.tasks);

  const isEditing = !!task;

  useEffect(() => {
    if (isEditing && task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || TASK_STATUS.PENDING,
      });
    }
  }, [isEditing, task]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      setErrors({ general: message });
    }

    if (isSuccess) {
      toast.success(isEditing ? 'Task updated successfully!' : 'Task created successfully!');
      onClose();
      dispatch(reset());
    }
  }, [isError, isSuccess, message, isEditing, onClose, dispatch]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (formData.description && formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      status: formData.status,
    };

    if (isEditing) {
      dispatch(updateTask({ id: task.id, taskData }));
    } else {
      dispatch(createTask(taskData));
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      dispatch(reset());
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isEditing ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={onChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter task title"
                      disabled={isLoading}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={onChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Add a detailed description (optional)"
                      disabled={isLoading}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  {/* Status (only for editing) */}
                  {isEditing && (
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={onChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        disabled={isLoading}
                      >
                        <option value={TASK_STATUS.PENDING}>Pending</option>
                        <option value={TASK_STATUS.COMPLETED}>Completed</option>
                      </select>
                    </div>
                  )}

                  {/* General Error */}
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="small" className="mr-2" />
                          {isEditing ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          {isEditing ? (
                            <>
                              <svg className="h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Update Task
                            </>
                          ) : (
                            <>
                              <svg className="h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Create Task
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
