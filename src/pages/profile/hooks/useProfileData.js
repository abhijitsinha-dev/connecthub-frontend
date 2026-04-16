import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import mediaApi from '../../../services/media.service';
import userApi from '../../../services/user.service';
import { useParams } from 'react-router-dom';

import { DEFAULT_PROFILE_PICTURE, DEFAULT_COVER_PHOTO } from '../../../utils/constants';
const useProfileData = () => {
  const { username } = useParams();
  const { user, handleAuthSuccess } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await userApi.getUserByUsername(username);
      const fetchedUser = response.data?.user || response.data?.data?.user;

      if (user?.username === fetchedUser.username) {
        handleAuthSuccess(fetchedUser);
      }

      setUserData({
        id: fetchedUser.id,
        username: fetchedUser.username,
        fullName: fetchedUser.fullName || '',
        email: fetchedUser.email,
        phoneNumber: fetchedUser.phoneNumber || 'Not provided',
        bio: fetchedUser.bio || 'Not provided',
        profilePicture: fetchedUser.avatar?.url || '',
        coverPhoto: fetchedUser.coverImage?.url || '',
        gender: fetchedUser.gender || 'Not specified',
        dateOfBirth: fetchedUser.dateOfBirth || null,
        address: fetchedUser.address || 'Not provided',
        followersCount: fetchedUser.followersCount || 0,
        followingCount: fetchedUser.followingCount || 0,
        postsCount: fetchedUser.postsCount || 0,
        isFollowedByCurrentUser: fetchedUser.isFollowedByCurrentUser,
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setIsFetching(false);
    }
  }, [handleAuthSuccess, username, user?.username]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleImageChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserData(prev => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);

    try {
      setIsUploadingImage(true);

      const signatureResponse = await mediaApi.getCloudinarySignature();
      const { timestamp, signature } = signatureResponse.data;

      const uploadData = await mediaApi.uploadToCloudinary(
        file,
        timestamp,
        signature
      );

      if (!uploadData.secure_url) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      let updatePayload = {};
      if (field === 'profilePicture') {
        updatePayload = {
          avatar: {
            url: uploadData.secure_url,
            publicId: uploadData.public_id,
          },
        };
      } else if (field === 'coverPhoto') {
        updatePayload = {
          coverImage: {
            url: uploadData.secure_url,
            publicId: uploadData.public_id,
          },
        };
      }

      await userApi.updateLoggedInUser(updatePayload);

      setUserData(prev => ({ ...prev, [field]: uploadData.secure_url }));

      if (user) {
        handleAuthSuccess({ ...user, ...updatePayload });
      }
    } catch (error) {
      console.error('Error during image upload workflow:', error);
      alert('Failed to save the image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      setIsUploadingImage(true);
      await userApi.updateLoggedInUser({ avatar: null });
      setUserData(prev => ({
        ...prev,
        profilePicture: DEFAULT_PROFILE_PICTURE,
      }));
      if (user) handleAuthSuccess({ ...user, avatar: null });
    } catch (error) {
      console.error('Error removing profile picture:', error);
      alert('Failed to remove the profile picture. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveCoverPhoto = async () => {
    try {
      setIsUploadingImage(true);
      await userApi.updateLoggedInUser({ coverImage: null });
      setUserData(prev => ({ ...prev, coverPhoto: DEFAULT_COVER_PHOTO }));
      if (user) handleAuthSuccess({ ...user, coverImage: null });
    } catch (error) {
      console.error('Error removing cover photo:', error);
      alert('Failed to remove the cover photo. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleProfileUpdateSuccess = updatedFields => {
    setUserData(prev => {
      const updated = { ...prev };

      if ('username' in updatedFields) updated.username = updatedFields.username;
      if ('fullName' in updatedFields) updated.fullName = updatedFields.fullName;
      if ('email' in updatedFields) updated.email = updatedFields.email;
      if ('bio' in updatedFields) updated.bio = updatedFields.bio || 'Not provided';
      if ('phoneNumber' in updatedFields) updated.phoneNumber = updatedFields.phoneNumber || 'Not provided';
      if ('gender' in updatedFields) updated.gender = updatedFields.gender || 'prefer not to say';
      if ('dateOfBirth' in updatedFields) updated.dateOfBirth = updatedFields.dateOfBirth || prev.dateOfBirth;
      if ('address' in updatedFields) updated.address = updatedFields.address || 'Not provided';

      return updated;
    });

    if (user) {
      handleAuthSuccess({ ...user, ...updatedFields });
    }
  };

  const handleToggleFollow = async (isCurrentlyFollowing) => {
    if (!userData || !user) return;
    setIsTogglingFollow(true);
    try {
      if (isCurrentlyFollowing) {
        await userApi.unfollowUser(userData.id);
        setUserData(prev => ({
          ...prev,
          isFollowedByCurrentUser: false,
          followersCount: Math.max(0, prev.followersCount - 1),
        }));
      } else {
        await userApi.followUser(userData.id);
        setUserData(prev => ({
          ...prev,
          isFollowedByCurrentUser: true,
          followersCount: prev.followersCount + 1,
        }));
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      // Let the component handle reverting optimisitic update if needed or just alert
      alert('Failed to updated follow status.');
      throw error;
    } finally {
      setIsTogglingFollow(false);
    }
  };

  return {
    userData,
    isFetching,
    isUploadingImage,
    isTogglingFollow,
    actions: {
      handleImageChange,
      handleRemoveProfilePicture,
      handleRemoveCoverPhoto,
      handleProfileUpdateSuccess,
      handleToggleFollow,
    },
  };
};

export default useProfileData;
