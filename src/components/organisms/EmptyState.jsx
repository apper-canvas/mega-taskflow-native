import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const EmptyState = ({ 
  onCreateTask,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className={`text-center py-16 ${className}`}
    >
      <motion.div
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 4,
          ease: "easeInOut"
        }}
        className="mb-8"
      >
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-primary/10 rounded-full" />
          <div className="absolute inset-2 bg-primary/20 rounded-full" />
          <div className="absolute inset-4 bg-primary/30 rounded-full flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={32} className="text-primary" />
          </div>
        </div>
      </motion.div>

      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-gray-900 mb-3"
      >
        Ready to get productive?
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 mb-8 max-w-md mx-auto"
      >
        Create your first task and start organizing your day. Every great accomplishment starts with a single task.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={onCreateTask}
          size="lg"
          className="flex items-center gap-2 mx-auto"
        >
          <ApperIcon name="Plus" size={20} />
          Create Your First Task
        </Button>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default EmptyState;