import { useEffect, useState } from 'react';

// Theme colors
const PRIMARY_COLOR_BG = 'bg-red-800';
const BORDER_COLOR = 'border-red-800';
const INPUT_FOCUS_RING = 'focus:ring-red-500 focus:border-red-500 ring-2';

const ProfileI = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    program: '',
    studentId: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  /* =========================
     FETCH PROFILE
  ========================= */
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        const u = data.user;

        setProfileData({
          fullName: `${u.firstName || ''} ${u.lastName || ''}`,
          email: u.email || '',
          program: u.program || '',
          studentId: u.studentId || '',
        });
      } catch (e) {
        setError('Failed to load profile information.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* =========================
     SAVE PROFILE (PROGRAM ONLY)
  ========================= */
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ program: profileData.program }),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      setSuccessMessage('Profile updated successfully.');
    } catch (e) {
      setError('Failed to update profile.');
    }
  };

  /* =========================
     CHANGE PASSWORD
  ========================= */
  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccessMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (e) {
      setError(e.message || 'Failed to change password.');
    }
  };

  const handleCombinedSave = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (currentPassword || newPassword || confirmNewPassword) {
      handleChangePassword();
    } else {
      handleSaveProfile();
    }
  };

  const ReadOnlyField = ({ label, value }) => (
    <div className="flex items-center">
      <label className="w-1/3 text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 block w-2/3 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md">{value}</div>
    </div>
  );

  return (
    <div className={`w-full bg-white shadow-xl ${BORDER_COLOR} border-t-8 rounded-lg overflow-hidden`}>
      {/* Header */}
      <div className={`text-center py-4 px-6 ${PRIMARY_COLOR_BG} text-white font-bold text-lg`}>
        {profileData.fullName} ({profileData.studentId})
      </div>

      <form onSubmit={handleCombinedSave} className="p-6">
        {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {successMessage && <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4">{successMessage}</div>}

        {/* Personal Info */}
        <div className="space-y-4 p-4 mb-8 border rounded-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>

          <ReadOnlyField label="Student Number" value={profileData.studentId} />
          <ReadOnlyField label="Name" value={profileData.fullName} />
          <ReadOnlyField label="Program" value={profileData.program} />
          <ReadOnlyField label="Email" value={profileData.email} />
        </div>

        {/* Password */}
        <div className="space-y-4 p-4 border rounded-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Password</h2>

          {[
            {
              label: 'Current Password',
              value: currentPassword,
              handler: setCurrentPassword,
            },
            {
              label: 'New Password',
              value: newPassword,
              handler: setNewPassword,
            },
            {
              label: 'Confirm Password',
              value: confirmNewPassword,
              handler: setConfirmNewPassword,
            },
          ].map(({ label, value, handler }) => (
            <div className="flex items-center" key={label}>
              <label className="w-1/3 text-sm font-medium text-gray-700">{label}</label>
              <input
                type="password"
                value={value}
                onChange={(e) => handler(e.target.value)}
                className={`mt-1 block w-2/3 px-3 py-2 border-2 border-gray-300 rounded-md ${INPUT_FOCUS_RING}`}
              />
            </div>
          ))}
        </div>

        {/* Certification */}
        <div className={`p-4 border-l-4 ${BORDER_COLOR} bg-gray-50 text-gray-600 italic text-sm mb-6`}>
          I hereby certify that all the information provided are true and correct.
        </div>

        {/* Save */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className={`py-2 px-6 ${PRIMARY_COLOR_BG} hover:bg-red-700 text-white font-bold rounded-md shadow-lg transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileI;
