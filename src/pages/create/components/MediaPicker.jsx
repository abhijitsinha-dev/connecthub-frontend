import React, { useState, useRef } from 'react';
import { BiX, BiCloudUpload, BiPlayCircle } from 'react-icons/bi';

const MediaPicker = ({
  fileInputRef,
  mediaPreview,
  mediaType,
  onMediaChange,
  onRemoveMedia,
  processFile,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Reset play state when a new file is handled
  React.useEffect(() => {
    setIsPlaying(false);
  }, [mediaPreview]);

  const toggleVideoPlay = e => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleDragOver = e => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`mb-3 sm:mb-4 flex flex-col min-h-0 relative ${mediaPreview ? 'flex-1' : 'sm:flex-1'}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onMediaChange}
        accept="image/*,video/*"
        className="hidden"
      />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !mediaPreview && fileInputRef.current?.click()}
        className={`relative rounded-xl overflow-hidden flex items-center justify-center transition-all ${
          mediaPreview ? 'flex-1 border-2' : 'sm:flex-1 sm:border-2'
        }
          ${
            mediaPreview
              ? 'border-border-primary bg-bg-secondary'
              : isDragOver
                ? 'border-brand-primary border-dashed bg-brand-primary/5'
                : 'border-transparent sm:border-border-primary sm:border-dashed hover:border-brand-primary/50 bg-transparent sm:bg-bg-secondary/50 sm:hover:bg-bg-secondary cursor-pointer'
          }`}
      >
        {!mediaPreview ? (
          <div className="flex flex-col items-center justify-center p-1 sm:p-4 text-center w-full pointer-events-none">
            {/* Desktop View */}
            <div className="hidden sm:flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 rounded-full bg-bg-primary shadow-sm flex items-center justify-center mb-3 text-brand-primary border border-border-primary">
                <BiCloudUpload size={24} />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-1">
                Upload Media
              </h3>
              <p className="text-xs text-text-secondary max-w-[250px] leading-relaxed">
                Drag and drop, or click to browse. Max size 10MB.
              </p>
            </div>

            {/* Mobile View */}
            <div className="flex sm:hidden flex-col items-center justify-center w-full">
              <div
                className="flex items-center justify-center gap-2 bg-brand-primary/10 text-brand-primary px-4 py-2.5 rounded-lg font-medium w-full shadow-sm border border-brand-primary/20 pointer-events-auto"
                onClick={e => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <BiCloudUpload size={20} />
                <span className="text-sm">Select Media from Device</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/5 group p-2">
            <button
              type="button"
              onClick={onRemoveMedia}
              className="absolute top-3 right-3 bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500 transition-all z-10 backdrop-blur-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-md hover:scale-105"
              title="Remove media"
            >
              <BiX size={20} />
            </button>
            {mediaType === 'image' ? (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-full h-full object-contain rounded-lg drop-shadow-sm"
              />
            ) : (
              <div
                className="relative w-full h-full rounded-lg overflow-hidden bg-black flex items-center justify-center cursor-pointer group/video"
                onClick={toggleVideoPlay}
              >
                <video
                  ref={videoRef}
                  src={mediaPreview}
                  className="w-full h-full object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  playsInline
                />
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all pointer-events-none z-10">
                    <BiPlayCircle
                      className="text-white drop-shadow-xl opacity-100"
                      size={72}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPicker;
