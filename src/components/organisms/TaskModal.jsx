import { motion, AnimatePresence } from 'framer-motion';
import TaskForm from '@/components/molecules/TaskForm';
import ApperIcon from '@/components/ApperIcon';

const TaskModal = ({ 
  isOpen = false, 
  task = null, 
  onSubmit, 
  onClose,
  className = '' 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (formData) => {
    await onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`
            bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] 
            overflow-y-auto ${className}
          `}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {task ? 'Edit Task' : 'Create New Task'}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ApperIcon name="X" size={20} />
              </motion.button>
            </div>
          </div>

          <div className="p-6">
            <TaskForm
              task={task}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskModal;