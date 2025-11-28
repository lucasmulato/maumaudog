import React, { useState, useRef, useEffect } from 'react';
import { MoreVerticalIcon } from './icons';

const ORDER_STATUSES = ['PREPARING', 'COMPLETED', 'CANCELLED'];

const OrderStatusSelector = ({ orderId, currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleStatusClick = (newStatus) => {
    onStatusChange(orderId, newStatus);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500"
      >
        <MoreVerticalIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
          <div className="py-1">
            <p className="px-4 py-2 text-xs text-gray-400">Change Status</p>
            {ORDER_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusClick(status)}
                disabled={status === currentStatus}
                className={`w-full text-left block px-4 py-2 text-sm ${
                  status === currentStatus
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatusSelector;