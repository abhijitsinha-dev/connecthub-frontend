import React from 'react';
import { createPortal } from 'react-dom';
import { BiX, BiLoaderAlt } from 'react-icons/bi';
import UserCard from './UserCard';
import useScrollLock from '../hooks/useScrollLock';

/**
 * A generic modal to display a list of users (e.g., Likers, Followers, Following)
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Function to close the modal
 * @param {Array} props.users - List of user objects to display
 * @param {string} props.title - Modal title (defaults to "Likes")
 * @param {Function} props.onUserClick - Optional handler for when a user card is clicked
 */
const UserListModal = ({
  isOpen,
  onClose,
  users,
  title = 'Likes',
  onUserClick,
  isLoading = false,
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="w-full sm:w-[420px] h-[50vh] sm:h-[400px] bg-bg-primary rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border-primary animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-primary bg-bg-primary/50 backdrop-blur-md sticky top-0 z-10">
          <div className="w-8"></div> {/* Spacer for centering title */}
          <h2 className="text-text-primary font-bold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-all focus:outline-none"
            aria-label="Close modal"
          >
            <BiX className="text-2xl" />
          </button>
        </div>

        {/* User List Body */}
        <div className="overflow-y-auto p-2 custom-scrollbar flex-1 min-h-[150px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <BiLoaderAlt className="text-3xl text-brand-primary animate-spin" />
              <p className="mt-2 text-sm text-text-secondary">
                Loading {title.toLowerCase()}...
              </p>
            </div>
          ) : users && users.length > 0 ? (
            <div className="space-y-1">
              {users.map(user => (
                <UserCard
                  key={user.id || user.username}
                  user={user}
                  onClick={onUserClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
              <p className="text-text-secondary font-medium">
                No results found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UserListModal;
