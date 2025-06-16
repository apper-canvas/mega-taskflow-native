import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, parseISO, isPast } from 'date-fns';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  className = '' 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleToggleComplete = async () => {
    try {
      await onToggleComplete(task.Id, !task.completed);
      
      if (!task.completed) {
        // Show confetti animation for completion
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 600);
        toast.success('Task completed! 🎉');
      } else {
        toast.success('Task marked as active');
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setIsDeleting(true);
    try {
      await onDelete(task.Id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
      setIsDeleting(false);
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'default';
    }
  };

  const isDueSoon = task.dueDate && !task.completed && isPast(parseISO(task.dueDate));

  return (
    <AnimatePresence>
      {!isDeleting && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100, height: 0 }}
          transition={{ duration: 0.2 }}
          className={`
            relative bg-white rounded-xl shadow-sm border border-gray-100
            hover:shadow-md transition-all duration-200
            ${task.completed ? 'opacity-75' : ''}
            ${className}
          `}
        >
          {/* Confetti animation */}
          <AnimatePresence>
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 0, 
                      scale: 0, 
                      x: '50%', 
                      y: '50%',
                      rotate: 0 
                    }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1, 0.5], 
                      x: `${50 + (Math.random() - 0.5) * 200}%`,
                      y: `${50 + (Math.random() - 0.5) * 200}%`,
                      rotate: 180 + Math.random() * 180
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: i * 0.05,
                      ease: "easeOut"
                    }}
                    className="absolute w-2 h-2 bg-primary rounded-full"
                    style={{
                      left: 0,
                      top: 0,
                      backgroundColor: ['#5B4FE9', '#8B85F0', '#FF6B6B', '#4CAF50'][i % 4]
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <div className="flex-shrink-0 mt-1">
                <Checkbox
                  checked={task.completed}
                  onChange={handleToggleComplete}
                />
              </div>

              {/* Task content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className={`
                    font-semibold text-gray-900 break-words
                    ${task.completed ? 'line-through text-gray-500' : ''}
                  `}>
                    {task.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={getPriorityVariant(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                  </div>
                </div>

                {task.description && (
                  <p className={`
                    text-gray-600 mb-3 break-words
                    ${task.completed ? 'line-through text-gray-400' : ''}
                  `}>
                    {task.description}
                  </p>
                )}

                {/* Task meta and actions */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    {task.dueDate && (
                      <div className={`
                        flex items-center gap-1
                        ${isDueSoon ? 'text-accent font-medium' : ''}
                      `}>
                        <ApperIcon name="Calendar" size={14} />
                        <span>
                          {format(parseISO(task.dueDate), 'MMM d, yyyy')}
                        </span>
                        {isDueSoon && !task.completed && (
                          <ApperIcon name="AlertCircle" size={14} className="text-accent" />
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Clock" size={14} />
                      <span>
                        {format(parseISO(task.createdAt), 'MMM d')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(task)}
                      className="p-2"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="p-2 text-gray-400 hover:text-accent"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskCard;