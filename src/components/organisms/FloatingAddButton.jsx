import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FloatingAddButton = ({ 
  onClick, 
  isEmpty = false,
  className = '' 
}) => {
  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-40 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {/* Pulsing ring for empty state */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 rounded-full bg-primary opacity-20 animate-pulse-ring"
            />
          )}
        </AnimatePresence>

        <Button
          onClick={onClick}
          size="lg"
          className="
            w-14 h-14 rounded-full shadow-lg hover:shadow-xl
            flex items-center justify-center
            bg-primary hover:bg-primary/90
            transition-all duration-200
          "
        >
          <ApperIcon name="Plus" size={24} className="text-white" />
        </Button>
      </motion.div>

      {/* Tooltip for empty state */}
      <AnimatePresence>
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              y: [0, -4, 0]
            }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ 
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }}
            className="
              absolute right-16 top-1/2 transform -translate-y-1/2
              bg-gray-900 text-white text-sm px-3 py-2 rounded-lg
              whitespace-nowrap shadow-lg
              after:content-[''] after:absolute after:left-full after:top-1/2 
              after:transform after:-translate-y-1/2 after:border-l-4 
              after:border-l-gray-900 after:border-t-4 after:border-t-transparent 
              after:border-b-4 after:border-b-transparent
            "
          >
            Add your first task!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FloatingAddButton;