import React from 'react';
import { BiArrowBack, BiX } from 'react-icons/bi';
import { useUserSearch } from './hooks/useUserSearch';
import UserCard from '../../components/UserCard';

/**
 * Search component that displays a slide-in panel for user search.
 * UI is separated from logic using the useUserSearch custom hook.
 */
const Search = () => {
  const {
    isSearchOpen,
    isSidebarCollapsed,
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    handleClose,
    handleUserClick,
  } = useUserSearch();

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      {isSearchOpen && (
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-in Search Panel */}
      <div
        className={`fixed left-0 top-0 h-dvh bg-bg-primary shadow-lg flex flex-col transition-transform duration-300 ease-in-out pointer-events-auto
        w-full md:w-96 ${isSidebarCollapsed ? 'md:w-80' : ''}
        transform ${isSearchOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}
      >
        {/* Header */}
        <div className="p-4 border-b border-bg-secondary sticky top-0 bg-bg-primary z-10">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-bg-secondary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
              title="Back"
              aria-label="Back"
            >
              <BiArrowBack className="text-[20px]" />
            </button>
            <h2 className="text-lg font-semibold text-text-primary">
              Search Users
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-lg bg-bg-secondary text-text-primary placeholder-text-secondary border border-bg-secondary focus:border-brand-primary focus:outline-none transition-colors"
              autoFocus={isSearchOpen}
            />

            {searchQuery.trim() !== '' && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-primary/60 transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <BiX className="text-[18px]" />
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {searchQuery.trim() === '' ? (
            <div className="p-6 text-center text-text-secondary animate-fade-in">
              <p>Start typing to search for users</p>
            </div>
          ) : isLoading ? (
            <div className="p-6 text-center text-text-secondary animate-pulse">
              <p>Searching...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-6 text-center text-text-secondary animate-fade-in">
              <p>No users found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="p-4 space-y-2 animate-fade-in">
              {searchResults.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onClick={handleUserClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
