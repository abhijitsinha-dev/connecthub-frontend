import React, { useState, useEffect } from 'react';
import ProfileTopSection from './components/ProfileTopSection';
import ProfilePostsSection from './components/ProfilePostsSection';
import ProfileAboutModal from './components/ProfileAboutModal';
import { useAuth } from '../../context/AuthContext';
import authApi from '../../services/auth.service';
import mediaApi from '../../services/media.service';
import userApi from '../../services/user.service';

const DEFAULT_PROFILE_PICTURE =
  'https://res.cloudinary.com/dl8c40ppg/image/upload/v1775503611/zbj6efjrtmly4wfqe0tg.jpg';
const DEFAULT_COVER_PHOTO =
  'https://placehold.co/2000x600/e2e8f0/64748b?text=Cover+Photo';

const MOCK_POSTS = [
  {
    id: 1,
    type: 'photo',
    content: 'Enjoying the sunset at the beach! 🌅',
    mediaUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    likes: 124,
    comments: 15,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    type: 'text',
    content:
      'Just launched my new portfolio website! Check it out and let me know what you think. 🚀 #webdev #portfolio',
    likes: 89,
    comments: 8,
    timestamp: '1 day ago',
  },
  {
    id: 3,
    type: 'video',
    content: 'A quick tutorial on how to center a div in CSS. #css #coding',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    likes: 256,
    comments: 42,
    timestamp: '3 days ago',
  },
  {
    id: 4,
    type: 'photo',
    content: 'Coffee shop coding session ☕💻',
    mediaUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000',
    likes: 198,
    comments: 24,
    timestamp: '1 week ago',
  },
];

const Profile = () => {
  const { handleAuthSuccess } = useAuth();

  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsFetching(true);
        const response = await authApi.me();
        const fetchedUser = response.data.user;

        handleAuthSuccess(fetchedUser);

        setUserData({
          id: fetchedUser.id,
          username: fetchedUser.username,
          fullName: fetchedUser.fullName || fetchedUser.username,
          email: fetchedUser.email,
          phoneNumber: 'Not provided',
          bio: 'No bio available.',
          profilePicture: fetchedUser.avatar?.url || '',
          coverPhoto: fetchedUser.coverImage?.url || '',
          gender: 'Not specified',
          dateOfBirth: fetchedUser.createdAt,
          address: 'Not provided',
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [handleAuthSuccess]);

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

      // Update backend
      await userApi.updateLoggedInUser({ avatar: null });

      // Update local state to fallback image
      setUserData(prev => ({
        ...prev,
        profilePicture: DEFAULT_PROFILE_PICTURE,
      }));
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

      // Update backend
      await userApi.updateLoggedInUser({ coverImage: null });

      // Update local state to fallback image
      setUserData(prev => ({
        ...prev,
        coverPhoto: DEFAULT_COVER_PHOTO,
      }));
    } catch (error) {
      console.error('Error removing cover photo:', error);
      alert('Failed to remove the cover photo. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (isFetching || !userData) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const resolvedUserData = {
    ...userData,
    profilePicture: userData.profilePicture || DEFAULT_PROFILE_PICTURE,
    coverPhoto: userData.coverPhoto || DEFAULT_COVER_PHOTO,
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12 animate-fade-in relative">
      {isUploadingImage && (
        <div className="absolute top-4 right-4 bg-brand-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50 shadow-lg animate-pulse">
          Saving changes...
        </div>
      )}

      {/* Reduced Props implementation */}
      <ProfileTopSection
        userData={resolvedUserData}
        imageActions={{
          onChange: handleImageChange,
          onRemoveProfilePicture: handleRemoveProfilePicture,
          onRemoveCoverPhoto: handleRemoveCoverPhoto,
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <ProfilePostsSection
        posts={MOCK_POSTS}
        userData={resolvedUserData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ProfileAboutModal
        isOpen={isAboutOpen}
        userData={resolvedUserData}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
};

export default Profile;
