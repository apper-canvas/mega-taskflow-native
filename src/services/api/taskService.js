import mockTasks from '../mockData/tasks.json';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Storage key
const STORAGE_KEY = 'taskflow_tasks';

// Load tasks from localStorage or use mock data
const loadTasks = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [...mockTasks];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [...mockTasks];
  }
};

// Save tasks to localStorage
const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

// Initialize tasks store
let tasks = loadTasks();

const taskService = {
  async getAll() {
    await delay(200);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(300);
    const newTask = {
      Id: tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) + 1 : 1,
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    tasks.push(newTask);
    saveTasks(tasks);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }

    // Don't allow Id modification
    const { Id, ...allowedUpdates } = updates;
    
    // Handle completion status change
    if (updates.completed !== undefined && updates.completed !== tasks[index].completed) {
      allowedUpdates.completedAt = updates.completed ? new Date().toISOString() : null;
    }

    tasks[index] = { ...tasks[index], ...allowedUpdates };
    saveTasks(tasks);
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }

    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    saveTasks(tasks);
    return { ...deletedTask };
  },

  async search(query) {
    await delay(200);
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase())
    );
    return filtered.map(task => ({ ...task }));
  },

  async filter(status = 'all', sortBy = 'createdAt') {
    await delay(200);
    let filtered = [...tasks];

    // Filter by status
    if (status === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (status === 'completed') {
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
  }
};

export default taskService;