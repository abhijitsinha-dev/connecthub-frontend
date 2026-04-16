import { useEffect } from 'react';

let lockCount = 0;
const ORIGINAL_OVERFLOW = typeof document !== 'undefined' ? document.body.style.overflow : 'unset';

const useScrollLock = isLocked => {
  useEffect(() => {
    if (isLocked) {
      lockCount++;
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (isLocked) {
        lockCount = Math.max(0, lockCount - 1);
        if (lockCount === 0) {
          document.body.style.overflow = ORIGINAL_OVERFLOW || 'unset';
        }
      }
    };
  }, [isLocked]);
};

export default useScrollLock;
