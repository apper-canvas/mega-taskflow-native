import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { taskService } from '@/services';
import TaskHeader from '@/components/organisms/TaskHeader';
import SearchBar from '@/components/molecules/SearchBar';
import FilterBar from '@/components/molecules/FilterBar';
import TaskList from '@/components/organisms/TaskList';
import FloatingAddButton from '@/components/organisms/FloatingAddButton';
import TaskModal from '@/components/organisms/TaskModal';
import EmptyState from '@/components/organisms/EmptyState';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getAll();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (statusFilter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'createdAt':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [tasks, searchQuery, statusFilter, sortBy]);

  // Task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    return { total, completed };
  }, [tasks]);

  // Task operations
  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    
    try {
      const updatedTask = await taskService.update(editingTask.Id, taskData);
      setTasks(prev => prev.map(task => 
        task.Id === editingTask.Id ? updatedTask : task
      ));
    } catch (error) {
      throw error;
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.update(taskId, { completed });
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
    } catch (error) {
      throw error;
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleModalSubmit = async (taskData) => {
    if (editingTask) {
      await handleUpdateTask(taskData);
    } else {
      await handleCreateTask(taskData);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="bg-white border-b border-gray-100">
            <div className="px-6 py-8">
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="grid grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="p-6 space-y-6">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadTasks}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  const isEmpty = tasks.length === 0;
  const hasFilteredResults = filteredTasks.length > 0;
  const isFiltered = searchQuery.trim() || statusFilter !== 'all';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <TaskHeader 
        totalTasks={taskStats.total}
        completedTasks={taskStats.completed}
      />

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {isEmpty ? (
          <EmptyState onCreateTask={openCreateModal} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search and filters */}
            <div className="space-y-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tasks..."
              />
              
              <FilterBar
                status={statusFilter}
                sortBy={sortBy}
                onStatusChange={setStatusFilter}
                onSortChange={setSortBy}
              />
            </div>

            {/* Task list or empty filtered state */}
            {hasFilteredResults ? (
              <TaskList
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
              />
            ) : isFiltered ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </div>

      {/* Floating add button */}
      <FloatingAddButton 
        onClick={openCreateModal} 
        isEmpty={isEmpty}
      />

      {/* Task modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onSubmit={handleModalSubmit}
        onClose={closeModal}
      />
    </div>
  );
};

export default HomePage;