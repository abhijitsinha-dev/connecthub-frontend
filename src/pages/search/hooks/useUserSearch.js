import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIContext } from '../../../context/UIContext';
import userApi from '../../../services/user.service';
import { sortUsersByScoreDesc } from '../../../utils/helpers';

/**
 * Custom hook to handle search logic for the Search component
 * @returns {Object} Search state and handlers
 */
export const useUserSearch = () => {
  const { isSidebarCollapsed, isSearchOpen, setIsSearchOpen } = useUIContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const skipHistoryPop = useRef(false);
  const openedPath = useRef(location.pathname);

  // Handle mobile back button to close search panel
  useEffect(() => {
    if (!isSearchOpen) {
      // Reset the skip flag when search is closed
      return () => {
        skipHistoryPop.current = false;
      };
    }

    // Record current path when opened
    openedPath.current = window.location.pathname;

    // Push state when search opens to intercept back button
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
        // Extract users from various potential response structures
        const users = response?.data?.data?.users || response?.data?.users || [];
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

  const handleUserClick = (user) => {
    // Prevent the next history pop from happening as we are navigating
    skipHistoryPop.current = true;
    navigate(`/profile/${user.username}`);
    handleClose();
  };

  return {
    isSearchOpen,
    isSidebarCollapsed,
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    handleClose,
    handleUserClick
  };
};
