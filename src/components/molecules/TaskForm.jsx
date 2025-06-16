import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TaskForm = ({ 
  task = null, 
  onSubmit, 
  onCancel,
  className = '' 
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate || null
      });
      
      toast.success(task ? 'Task updated successfully' : 'Task created successfully');
    } catch (error) {
      toast.error('Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-success' },
    { value: 'medium', label: 'Medium Priority', color: 'text-warning' },
    { value: 'high', label: 'High Priority', color: 'text-accent' }
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
    >
      <div className="space-y-4">
        <Input
          label="Task Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          required
          placeholder="What needs to be done?"
        />

        <div className="relative">
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Add a description (optional)"
            rows={3}
            className="
              w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-200 resize-none
            "
          />
          <label className="absolute left-3 top-3 text-sm text-gray-500 pointer-events-none">
            Description
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChange('priority', option.value)}
                  className={`
                    p-3 rounded-lg border-2 text-sm font-medium
                    transition-all duration-200
                    ${formData.priority === option.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className={`
                    w-3 h-3 rounded-full mx-auto mb-1
                    ${option.value === 'high' ? 'bg-accent' : ''}
                    ${option.value === 'medium' ? 'bg-warning' : ''}
                    ${option.value === 'low' ? 'bg-success' : ''}
                  `} />
                  {option.value}
                </motion.button>
              ))}
            </div>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            error={errors.dueDate}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting && <ApperIcon name="Loader" size={16} className="animate-spin" />}
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </motion.form>
  );
};

export default TaskForm;