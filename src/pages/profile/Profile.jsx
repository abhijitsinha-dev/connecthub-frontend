import React, { useState } from 'react';
import ProfileTopSection from './components/ProfileTopSection';
import ProfilePostsSection from './components/ProfilePostsSection';
import ProfileAboutModal from './components/ProfileAboutModal';

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

const MOCK_USER = {
  username: 'alex_dev',
  fullName: 'Alex Developer',
  email: 'alex.developer@example.com',
  phoneNumber: '+1 (555) 123-4567',
  bio: 'Software engineer and tech enthusiast. Building things for the web and sharing my journey. Coffee addict. ☕🚀',
  profilePicture: 'https://i.pravatar.cc/300?img=68',
  coverPhoto:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000',
  gender: 'Non-binary',
  dateOfBirth: '1994-10-24',
  address: '123 Tech Lane, San Francisco, CA, 94105',
  followersCount: 1420,
  followingCount: 385,
  postsCount: 42,
};

const Profile = () => {
  const [userData, setUserData] = useState(MOCK_USER);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12 animate-fade-in relative">
      <ProfileTopSection
        userData={userData}
        onImageChange={handleImageChange}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <ProfilePostsSection
        posts={MOCK_POSTS}
        userData={userData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ProfileAboutModal
        isOpen={isAboutOpen}
        userData={userData}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
};

export default Profile;
