import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ checked = false, onChange, disabled = false, className = '' }) => {
  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`
        relative w-6 h-6 rounded-md border-2 transition-all duration-200
        ${checked 
          ? 'bg-primary border-primary' 
          : 'bg-white border-gray-300 hover:border-primary'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <ApperIcon 
            name="Check" 
            size={16} 
            className="text-white stroke-[3]"
          />
        </motion.div>
      )}
    </motion.button>
  );
};

export default Checkbox;