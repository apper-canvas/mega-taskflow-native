import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FilterBar = ({ 
  status = 'all', 
  sortBy = 'createdAt', 
  onStatusChange, 
  onSortChange,
  className = '' 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Tasks', icon: 'List' },
    { value: 'active', label: 'Active', icon: 'Clock' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' }
  ];

  return (
    <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${className}`}>
      {/* Status filters */}
      <div className="flex gap-2">
        {statusOptions.map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStatusChange(option.value)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${status === option.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }
            `}
          >
            <ApperIcon name={option.icon} size={16} />
            <span className="hidden sm:inline">{option.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="
            px-3 py-2 bg-white border border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            text-sm font-medium text-gray-700
            cursor-pointer
          "
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;