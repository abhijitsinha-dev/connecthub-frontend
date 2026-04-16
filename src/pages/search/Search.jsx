import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { BiX } from 'react-icons/bi';
import { useUIContext } from '../../context/UIContext';
import userApi from '../../services/user.service';
import { sortUsersByScoreDesc } from '../../utils/helpers';
import { DEFAULT_PROFILE_PICTURE } from '../../utils/constants';

const Search = () => {
  const { isSidebarCollapsed, isSearchOpen, setIsSearchOpen } = useUIContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const skipHistoryPop = useRef(false);
  const location = useLocation();
  const openedPath = useRef(location.pathname);

  // Handle mobile back button to close search panel
  useEffect(() => {
    if (!isSearchOpen) {
      // Reset the skip flag when search is closed
      return () => {
        skipHistoryPop.current = false;
      };
    }

    // Record current path
    openedPath.current = window.location.pathname;

    // Push state when search opens to intercept back button
    // Only push if we don't already have an active search state
    if (!window.history.state?.isSearchActive) {
      window.history.pushState({ isSearchActive: true }, '');
    }

    const handlePopState = () => {
      // Close search when user hits 'back'
      setIsSearchOpen(false);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      // If closing via UI (not popstate), we might need to pop the state
      // but only if we are not navigating away or explicitly skipping it
      if (
        window.history.state?.isSearchActive &&
        !skipHistoryPop.current &&
        window.location.pathname === openedPath.current
      ) {
        window.history.back();
      }
    };
  }, [isSearchOpen, setIsSearchOpen]);

  // Debounced search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const debounceTimer = setTimeout(async () => {
      try {
        const response = await userApi.searchUsers(searchQuery);
        // Based on provided schema: response.data.data.users
        const users =
          response?.data?.data?.users || response?.data?.users || [];
        const sortedUsers = sortUsersByScoreDesc(users);
        setSearchResults(sortedUsers);
      } catch (error) {
        console.error('Failed to search users:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleUserClick = (userId, username) => {
    skipHistoryPop.current = true;
    navigate(`/profile/${username}`);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      {isSearchOpen && (
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
          onClick={handleClose}
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
              autoFocus
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
        <div className="flex-1 overflow-y-auto">
          {searchQuery.trim() === '' ? (
            <div className="p-6 text-center text-text-secondary">
              <p>Start typing to search for users</p>
            </div>
          ) : isLoading ? (
            <div className="p-6 text-center text-text-secondary">
              <p>Searching...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-6 text-center text-text-secondary">
              <p>No users found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {searchResults.map(user => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user.id, user.username)}
                  className="p-3 rounded-lg bg-bg-secondary hover:bg-brand-primary/10 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar?.url || DEFAULT_PROFILE_PICTURE}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-border-primary"
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
