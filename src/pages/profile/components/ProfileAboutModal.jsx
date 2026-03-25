import {
  BiMap,
  BiEnvelope,
  BiPhone,
  BiUser,
  BiCalendar,
  BiX,
} from 'react-icons/bi';

const ProfileAboutModal = ({ isOpen, userData, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in backdrop-blur-sm">
      <div className="bg-bg-primary rounded-2xl shadow-xl border border-border-primary w-full max-w-3xl p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full transition-all"
        >
          <BiX className="text-2xl" />
        </button>
        <h3 className="text-xl font-bold text-text-primary mb-6">About</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <BiEnvelope className="text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-text-secondary">Email</p>
              <p className="text-text-primary font-medium break-all">
                {userData.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <BiPhone className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Phone Number</p>
              <p className="text-text-primary font-medium">
                {userData.phoneNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <BiUser className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Gender</p>
              <p className="text-text-primary font-medium">{userData.gender}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <BiCalendar className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Date of Birth</p>
              <p className="text-text-primary font-medium">
                {new Date(userData.dateOfBirth).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:col-span-2">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <BiMap className="text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-text-secondary">Address</p>
              <p className="text-text-primary font-medium wrap-break-word">
                {userData.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAboutModal;
