import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    high: 'bg-accent/10 text-accent priority-glow priority-high',
    medium: 'bg-warning/10 text-warning priority-glow priority-medium',
    low: 'bg-success/10 text-success priority-glow priority-low',
    primary: 'bg-primary/10 text-primary priority-glow'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  
  const classes = `
    inline-flex items-center font-medium rounded-full
    ${variants[variant]} ${sizes[size]} ${className}
  `;

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.15 }}
      className={classes}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;