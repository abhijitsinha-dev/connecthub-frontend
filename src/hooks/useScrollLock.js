import { useEffect } from 'react';

const useScrollLock = isLocked => {
  useEffect(() => {
    document.body.style.overflow = isLocked ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLocked]);
};

export default useScrollLock;
