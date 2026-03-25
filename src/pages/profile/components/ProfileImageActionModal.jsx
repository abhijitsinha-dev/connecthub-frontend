import { useEffect } from 'react';
import { BiCamera, BiTrash, BiX } from 'react-icons/bi';

const ProfileImageActionModal = ({
  isOpen,
  onClose,
  onChange,
  onRemove,
  changeLabel,
  removeLabel,
}) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-70 bg-black/35 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-fit min-w-64 max-w-[90vw] bg-bg-primary border border-border-primary rounded-2xl shadow-2xl p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onChange}
          className="w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-center whitespace-normal sm:whitespace-nowrap text-text-primary hover:bg-bg-secondary transition-colors"
        >
          <BiCamera className="text-lg" />
          {changeLabel}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-center whitespace-normal sm:whitespace-nowrap text-red-500 hover:bg-bg-secondary transition-colors"
        >
          <BiTrash className="text-lg" />
          {removeLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-center text-text-secondary hover:bg-bg-secondary transition-colors"
        >
          <BiX className="text-lg" />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProfileImageActionModal;
