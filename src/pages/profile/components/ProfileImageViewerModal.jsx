import { useEffect } from 'react';
import { BiX } from 'react-icons/bi';
import { createPortal } from 'react-dom';

const ProfileImageViewerModal = ({ imageUrl, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-80 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-90"
        aria-label="Close viewer"
      >
        <BiX className="text-3xl" />
      </button>

      {/* Image Container */}
      <div
        className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Profile Preview"
          className="max-w-[90vw] max-h-[90dvh] w-auto h-auto object-contain shadow-2xl select-none rounded-lg"
          draggable="false"
        />
      </div>
    </div>,
    document.body
  );
};

export default ProfileImageViewerModal;
