import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_PROFILE_PICTURE } from '../../utils/constants';
import useCreatePost from './hooks/useCreatePost';
import MediaPicker from './components/MediaPicker';
import CreateFeedback from './components/CreateFeedback';

const Create = () => {
  const { user } = useAuth();

  const { state, refs, actions } = useCreatePost();

  const {
    caption,
    mediaFile,
    mediaPreview,
    mediaType,
    isLoading,
    error,
    success,
  } = state;
  const { fileInputRef } = refs;
  const {
    setCaption,
    setError,
    setSuccess,
    processFile,
    handleMediaChange,
    handleRemoveMedia,
    handleSubmit,
  } = actions;

  const userAvatar = user?.avatar?.url || DEFAULT_PROFILE_PICTURE;

  return (
    <div className="h-[calc(100dvh-8rem)] md:h-dvh overflow-hidden w-full lg:pl-64 bg-bg-secondary/30 flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto flex flex-col h-full min-h-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-2 sm:mb-4 gap-1 sm:gap-2 shrink-0">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Create Post
            </h1>
            <p className="text-xs sm:text-base text-text-secondary mt-0.5 sm:mt-1">
              Share what's on your mind with your network.
            </p>
          </div>
        </div>

        <CreateFeedback
          error={error}
          success={success}
          onErrorDismiss={() => setError('')}
          onSuccessDismiss={() => setSuccess('')}
        />

        {/* The Card - flex-1 and min-h-0 make it expand to fill space, but never overflow */}
        <article
          className={`bg-bg-primary rounded-2xl shadow-sm border border-border-primary p-3 sm:p-6 flex flex-col min-h-0 ${mediaPreview ? 'flex-1' : 'sm:flex-1'}`}
        >
          {/* Profile Information */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4 shrink-0">
            <img
              src={userAvatar}
              alt="Your avatar"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-bg-secondary"
            />
            <div>
              <p className="font-semibold text-text-primary text-xs sm:text-sm flex items-center gap-1">
                {user?.fullName || user?.username}
              </p>
              <p className="text-text-secondary text-[10px] sm:text-xs">
                @{user?.username}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`flex flex-col min-h-0 ${mediaPreview ? 'flex-1' : 'sm:flex-1'}`}
          >
            {/* Caption Textarea - rows reduced slightly to optimize vertical space */}
            <div className="mb-2 sm:mb-4 shrink-0">
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                maxLength={300}
                rows={3}
                placeholder="What do you want to talk about?"
                className="w-full bg-transparent text-text-primary text-sm sm:text-base focus:outline-none resize-none leading-relaxed placeholder:text-text-secondary custom-scrollbar"
              />
              <div
                className={`text-right text-xs mt-1 font-medium ${caption.length >= 300 ? 'text-red-500' : 'text-text-secondary'}`}
              >
                {caption.length}/300
              </div>
            </div>

            {/* Media Picker Component handles drag and drop */}
            <MediaPicker
              fileInputRef={fileInputRef}
              mediaPreview={mediaPreview}
              mediaType={mediaType}
              onMediaChange={handleMediaChange}
              onRemoveMedia={handleRemoveMedia}
              processFile={processFile}
            />

            {/* Submit Button */}
            <div
              className={`flex items-center justify-end pt-2 sm:pt-3 mt-2 border-border-primary shrink-0 ${mediaPreview ? 'mt-auto border-t' : 'sm:mt-auto sm:border-t'}`}
            >
              <button
                type="submit"
                disabled={isLoading || (!caption.trim() && !mediaFile)}
                className="px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold bg-brand-primary text-white hover:opacity-90 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:hover:shadow-none flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  'Publish Post'
                )}
              </button>
            </div>
          </form>
        </article>
      </div>
    </div>
  );
};

export default Create;
