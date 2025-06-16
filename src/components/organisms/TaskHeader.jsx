import { motion } from 'framer-motion';
import ProgressRing from '@/components/atoms/ProgressRing';
import ApperIcon from '@/components/ApperIcon';

const TaskHeader = ({ 
  totalTasks = 0, 
  completedTasks = 0,
  className = '' 
}) => {
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const activeTasks = totalTasks - completedTasks;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border-b border-gray-100 ${className}`}
    >
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Title and stats */}
          <div className="flex-1">
            <motion.h1 
              className="text-4xl font-bold font-heading text-gray-900 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              TaskFlow
            </motion.h1>
            
            <motion.p 
              className="text-gray-600 text-lg mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Organize and complete your daily tasks efficiently
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center lg:text-left"
              >
                <div className="flex items-center gap-2 text-primary mb-1">
                  <ApperIcon name="CheckSquare" size={20} />
                  <span className="text-2xl font-bold">{totalTasks}</span>
                </div>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center lg:text-left"
              >
                <div className="flex items-center gap-2 text-success mb-1">
                  <ApperIcon name="CheckCircle" size={20} />
                  <span className="text-2xl font-bold">{completedTasks}</span>
                </div>
                <p className="text-sm text-gray-600">Completed</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center lg:text-left"
              >
                <div className="flex items-center gap-2 text-accent mb-1">
                  <ApperIcon name="Clock" size={20} />
                  <span className="text-2xl font-bold">{activeTasks}</span>
                </div>
                <p className="text-sm text-gray-600">Active</p>
              </motion.div>
            </div>
          </div>

          {/* Progress ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex-shrink-0"
          >
            <ProgressRing 
              progress={progress} 
              size={120} 
              strokeWidth={8} 
            />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default TaskHeader;