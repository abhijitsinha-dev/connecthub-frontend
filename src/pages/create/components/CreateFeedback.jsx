import React from 'react';
import { BiX } from 'react-icons/bi';

const CreateFeedback = ({ error, success, onErrorDismiss, onSuccessDismiss }) => {
  if (!error && !success) return null;

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-sm animate-fade-in flex items-center justify-between shrink-0">
          <span>{error}</span>
          <button
            onClick={onErrorDismiss}
            className="text-red-500 hover:text-red-700 transition"
          >
            <BiX size={20} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 text-green-500 rounded-xl text-sm animate-fade-in flex items-center justify-between shrink-0">
          <span>{success}</span>
          <button
            onClick={onSuccessDismiss}
            className="text-green-500 hover:text-green-700 transition"
          >
            <BiX size={20} />
          </button>
        </div>
      )}
    </>
  );
};

export default CreateFeedback;
