import { createPortal } from 'react-dom';
import Button from './Button'; // Adjust path as needed

const ErrorModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  // Using createPortal to mount the modal directly to the document body
  return createPortal(
    // Backdrop overlay (increased z-index just to be safe globally)
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 transition-all duration-300 ease-in-out">
      <div className="bg-bg-primary w-full max-w-100 p-8 rounded-xl shadow-2xl flex flex-col items-center text-center transform transition-all duration-300 max-[400px]:p-5">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-[24px] font-semibold text-text-primary mb-2 max-[650px]:text-[22px]">
          Something went wrong!
        </h2>

        {/* Error Message */}
        <p className="text-[16px] text-text-secondary font-medium mb-8 break-words max-[650px]:text-[14px]">
          {message}
        </p>

        {/* Action Button */}
        <Button type="button" onClick={onClose} className="w-full mt-2">
          OK
        </Button>
      </div>
    </div>,
    document.body, // <-- This tells React to render it outside the current DOM hierarchy
  );
};

export default ErrorModal;
