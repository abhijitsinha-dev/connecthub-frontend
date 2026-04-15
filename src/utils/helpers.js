/**
 * Formats a date string into a human-readable relative time format.
 *
 * @param {string} dateString - The ISO date string to format
 * @returns {string} The formatted relative date (e.g., "Just now", "5 minutes ago", "2 hours ago")
 */
export const formatDate = dateString => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
};

/**
 * Sorts an array of posts in descending order of their createdAt date.
 *
 * @param {Array} posts - The list of posts to sort
 * @returns {Array} A new array of posts sorted in descending order (newest to oldest)
 */
export const sortPostsByCreatedAtDesc = posts => {
  if (!posts || !Array.isArray(posts)) return [];

  return [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
};
/**
 * Sorts an array of users in descending order based on their score.
 *
 * @param {Array} users - The list of users to sort
 * @returns {Array} A new array of users sorted by score (highest to lowest)
 */
export const sortUsersByScoreDesc = users => {
  if (!users || !Array.isArray(users)) return [];

  return [...users].sort((a, b) => {
    const scoreA = typeof a.score === 'number' ? a.score : 0;
    const scoreB = typeof b.score === 'number' ? b.score : 0;
    return scoreB - scoreA;
  });
};
