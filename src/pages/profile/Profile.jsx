import React, { useState } from 'react';
import ProfileTopSection from './components/ProfileTopSection';
import ProfilePostsSection from './components/ProfilePostsSection';
import ProfileAboutModal from './components/ProfileAboutModal';
import ProfileEditModal from './components/ProfileEditModal';
import useProfileData, {
  DEFAULT_PROFILE_PICTURE,
  DEFAULT_COVER_PHOTO,
} from './hooks/useProfileData';

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
    content: 'Coffee shop coding session ☕️💻',
    mediaUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000',
    likes: 198,
    comments: 24,
    timestamp: '1 week ago',
  },
];

const Profile = () => {
  const { userData, isFetching, isUploadingImage, actions } = useProfileData();

  // UI State
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

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

      <ProfileTopSection
        userData={resolvedUserData}
        imageActions={{
          onChange: actions.handleImageChange,
          onRemoveProfilePicture: actions.handleRemoveProfilePicture,
          onRemoveCoverPhoto: actions.handleRemoveCoverPhoto,
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenEdit={() => setIsEditOpen(true)}
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

      <ProfileEditModal
        isOpen={isEditOpen}
        userData={resolvedUserData}
        onClose={() => setIsEditOpen(false)}
        onUpdateSuccess={actions.handleProfileUpdateSuccess}
      />
    </div>
  );
};

export default Profile;
