import { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  value = '', 
  onChange, 
  placeholder = '',
  required = false,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== '';
  const shouldFloatLabel = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={shouldFloatLabel ? placeholder : ''}
        required={required}
        className={`
          w-full px-3 pt-6 pb-2 text-gray-900 bg-white border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          transition-all duration-200
          ${error ? 'border-accent' : 'border-gray-300'}
        `}
        {...props}
      />
      
      {label && (
        <motion.label
          animate={{
            top: shouldFloatLabel ? '0.5rem' : '1rem',
            fontSize: shouldFloatLabel ? '0.75rem' : '1rem',
            color: error ? '#FF6B6B' : focused ? '#5B4FE9' : '#6B7280'
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-3 pointer-events-none font-medium"
        >
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </motion.label>
      )}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-accent"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;