import { useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { BiX } from 'react-icons/bi';
import { useUIContext } from '../../context/UIContext';

const Search = () => {
  const { isSidebarCollapsed, isSearchOpen, setIsSearchOpen } = useUIContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data - Replace with API call to backend
  const mockUsers = [
    { id: 1, fullName: 'John Doe', username: 'johndoe', avatar: '👨' },
    { id: 2, fullName: 'Jane Smith', username: 'janesmith', avatar: '👩' },
    { id: 3, fullName: 'Alice Johnson', username: 'alicejohn', avatar: '👩‍🦰' },
    { id: 4, fullName: 'Bob Wilson', username: 'bobwilson', avatar: '👨‍💼' },
    { id: 5, fullName: 'Emma Davis', username: 'emmadavis', avatar: '👩‍🎓' },
  ];

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const results = mockUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(results);
      setIsLoading(false);
    }, 300);
  };

  const handleClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleUserClick = (userId, username) => {
    // Handle user click - you can add navigation or other logic here
    console.log(`Clicked user: ${username}`);
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
        className={`fixed left-0 top-0 h-dvh bg-bg-primary shadow-lg flex flex-col transition-transform duration-300 ease-in-out pointer-events-auto ${
          isSidebarCollapsed ? 'w-80' : 'w-96'
        } transform ${isSearchOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}
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
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-lg bg-bg-secondary text-text-primary placeholder-text-secondary border border-bg-secondary focus:border-brand-primary focus:outline-none transition-colors"
              autoFocus
            />

            {searchQuery.trim() !== '' && (
              <button
                type="button"
                onClick={() => handleSearch('')}
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
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user.id, user.username)}
                  className="p-3 rounded-lg bg-bg-secondary hover:bg-brand-primary/10 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary truncate">
                        {user.fullName}
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
