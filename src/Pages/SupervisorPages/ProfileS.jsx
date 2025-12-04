import { useEffect, useState } from 'react';

// Theme colors
const PRIMARY_COLOR_BG = 'bg-red-800';
const BORDER_COLOR = 'border-red-800';
const INPUT_FOCUS_RING = 'focus:ring-red-500 focus:border-red-500 ring-2';

const ProfileS = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    natureOfBusiness: '',
    email: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch profile data from /api/companies/me (example endpoint)
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/companies/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        const company = data.company;

        setProfileData({
          name: company.name || '',
          natureOfBusiness: company.natureOfBusiness || '',
          email: company.email || '',
        });
      } catch (e) {
        setError('Failed to load company information.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/companies/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      setSuccessMessage('Profile updated successfully.');
    } catch (e) {
      setError('Failed to save profile.');
    }
  };

  const handleChangePassword = async () => {
    setError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      setError('Please provide valid passwords (min 6 chars).');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/companies/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to change password.');
      }

      setSuccessMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (e) {
      setError(e.message);
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
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-8">
      <div className={`w-full bg-white shadow-xl ${BORDER_COLOR} border-t-8 rounded-lg overflow-hidden`}>
        {/* Header */}
        <div className={`text-center py-4 px-6 ${PRIMARY_COLOR_BG} text-white font-bold text-lg`}>
          {profileData.name || 'Company Profile'}
        </div>

        <form onSubmit={handleCombinedSave} className="p-6">
          {/* Messages */}
          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          {successMessage && <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4">{successMessage}</div>}

          {/* Company Info */}
          <div className="space-y-4 p-4 mb-8 border rounded-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Information</h2>

            <ReadOnlyField label="Company Name" value={profileData.name} />
            <ReadOnlyField label="Nature of Business" value={profileData.natureOfBusiness} />
            <ReadOnlyField label="Email" value={profileData.email} />
          </div>

          {/* Change Password */}
          <div className="space-y-4 p-4 border rounded-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Password</h2>

            {[
              { label: 'Current Password', value: currentPassword, handler: setCurrentPassword },
              { label: 'New Password', value: newPassword, handler: setNewPassword },
              { label: 'Confirm Password', value: confirmNewPassword, handler: setConfirmNewPassword },
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

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className={`py-2 px-6 ${PRIMARY_COLOR_BG} hover:bg-red-700 text-white font-bold rounded-md shadow-lg transition-colors`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileS;
