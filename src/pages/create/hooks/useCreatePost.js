import { useState, useRef } from 'react';
import mediaApi from '../../../services/media.service';
import postApi from '../../../services/post.service';

const useCreatePost = () => {
  const [caption, setCaption] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaType, setMediaType] = useState(null); // 'image' | 'video'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef(null);

  const processFile = file => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Only image and video files are allowed');
      return;
    }

    const type = file.type.startsWith('image/') ? 'image' : 'video';

    setMediaFile(file);
    setMediaType(type);
    setMediaPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleMediaChange = e => {
    const file = e.target.files[0];
    if (file) processFile(file);
    if (e.target) e.target.value = null;
  };

  const handleRemoveMedia = e => {
    e.stopPropagation();
    setMediaFile(null);
    setMediaPreview('');
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedCaption = caption.trim();

    if (!trimmedCaption && !mediaFile) {
      setError('Post must contain either a caption or media');
      return;
    }

    if (trimmedCaption.length > 300) {
      setError('Caption cannot exceed 300 characters');
      return;
    }

    setIsLoading(true);

    try {
      let mediaData = null;

      if (mediaFile) {
        const signatureRes = await mediaApi.getCloudinarySignature();
        const { timestamp, signature } = signatureRes.data;

        const uploadRes = await mediaApi.uploadToCloudinary(
          mediaFile,
          timestamp,
          signature
        );

        mediaData = {
          url: uploadRes.secure_url,
          publicId: uploadRes.public_id,
          type: mediaType,
        };
      }

      const postData = {
        caption: trimmedCaption,
        ...(mediaData && { media: mediaData }),
      };

      const response = await postApi.createPost(postData);

      if (response && (response.status === 201 || response.status === 200)) {
        setSuccess(response.data?.message || 'Post created successfully!');

        setCaption('');
        setMediaFile(null);
        setMediaPreview('');
        setMediaType(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        setTimeout(() => {
          setSuccess('');
        }, 4000);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      const responseData = err.response?.data;

      if (responseData?.errors && Array.isArray(responseData.errors)) {
        setError(responseData.errors.map(e => e.message || e).join(', '));
      } else {
        setError(
          responseData?.message ||
            responseData?.error ||
            'Failed to create post. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state: {
      caption,
      mediaFile,
      mediaPreview,
      mediaType,
      isLoading,
      error,
      success,
    },
    refs: {
      fileInputRef,
    },
    actions: {
      setCaption,
      setError,
      setSuccess,
      processFile,
      handleMediaChange,
      handleRemoveMedia,
      handleSubmit,
    },
  };
};

export default useCreatePost;
