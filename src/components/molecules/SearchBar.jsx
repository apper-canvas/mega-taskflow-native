import { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  value = '', 
  onChange, 
  placeholder = 'Search tasks...', 
  debounceMs = 300,
  className = '' 
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange && localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs, value]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={20} className="text-gray-400" />
      </div>
      
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-4 py-3 
          bg-white border border-gray-200 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          transition-all duration-200
          placeholder-gray-500
        "
      />
      
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            if (onChange) onChange('');
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <ApperIcon 
            name="X" 
            size={16} 
            className="text-gray-400 hover:text-gray-600 transition-colors" 
          />
        </button>
      )}
    </div>
  );
};

export default SearchBar;