import React from 'react';
import { DEFAULT_PROFILE_PICTURE } from '../utils/constants';

/**
 * Generic User Card component for displaying user information in lists
 * @param {Object} props
 * @param {Object} props.user - User data object
 * @param {Function} props.onClick - Optional click handler
 */
const UserCard = ({ user, onClick }) => {
  if (!user) return null;

  return (
    <div
      onClick={() => onClick?.(user)}
      className="p-3 rounded-lg bg-bg-secondary hover:bg-brand-primary/10 cursor-pointer transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        <img
          src={user.avatar?.url || DEFAULT_PROFILE_PICTURE}
          alt={user.fullName || user.username}
          className="w-10 h-10 rounded-full object-cover shrink-0 border border-border-primary group-hover:border-brand-primary/20 transition-colors"
          draggable="false"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text-primary truncate">
            {user.fullName || user.username}
          </p>
          <p className="text-sm text-text-secondary truncate">
            @{user.username}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
