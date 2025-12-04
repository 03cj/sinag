import { useEffect, useState } from 'react';

// Theme colors
const PRIMARY_COLOR_BG = 'bg-red-800';
const BORDER_COLOR = 'border-red-800';
const INPUT_FOCUS_RING = 'focus:ring-red-500 focus:border-red-500';

const ProfileA = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    department: '',
    employeeId: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        const user = data.user;

        setProfileData({
          fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '',
          email: user.email || '',
          department: user.department || '',
          employeeId: user.employeeId || '',
        });
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          department: profileData.department,
          employeeId: profileData.employeeId,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password do not match.');
      setLoading(false);
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Failed: ${response.status}`);

      setSuccessMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const handleCombinedSave = () => {
    if (currentPassword || newPassword || confirmNewPassword) {
      handleChangePassword();
    } else {
      handleSaveProfile();
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-8">
      <div className={`w-full bg-white shadow-xl ${BORDER_COLOR} border-t-8 rounded-lg overflow-hidden`}>
        <div className={`text-center py-4 px-6 ${PRIMARY_COLOR_BG} text-white font-bold text-lg`}>
          {profileData.fullName} ({profileData.employeeId})
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error!</strong> {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <strong>Success!</strong> {successMessage}
            </div>
          )}

          {/* Personal Information Section */}
          <div className={`space-y-4 p-4 mb-8 border ${BORDER_COLOR} rounded-md`}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>

            <div className="space-y-4">
              {['fullName', 'email', 'department', 'employeeId'].map((field) => (
                <div key={field} className="flex items-center">
                  <label className="w-1/3 text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={profileData[field]}
                    onChange={handleProfileChange}
                    className={`mt-1 block w-2/3 px-3 py-2 border-2 ${BORDER_COLOR} rounded-md shadow-sm ${INPUT_FOCUS_RING}`}
                    disabled={loading}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Password Section */}
          <div className={`space-y-4 p-4 border ${BORDER_COLOR} rounded-md`}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Change Password</h3>

            {[
              { id: 'currentPassword', value: currentPassword, handler: setCurrentPassword, label: 'Current Password' },
              { id: 'newPassword', value: newPassword, handler: setNewPassword, label: 'New Password' },
              {
                id: 'confirmNewPassword',
                value: confirmNewPassword,
                handler: setConfirmNewPassword,
                label: 'Confirm New Password',
              },
            ].map(({ id, value, handler, label }) => (
              <div key={id} className="flex items-center">
                <label className="w-1/3 text-sm font-medium text-gray-700">{label}</label>
                <input
                  type="password"
                  value={value}
                  onChange={(e) => handler(e.target.value)}
                  className={`mt-1 block w-2/3 px-3 py-2 border-2 ${BORDER_COLOR} rounded-md shadow-sm ${INPUT_FOCUS_RING}`}
                  disabled={loading}
                />
              </div>
            ))}
          </div>

          {/* Certification */}
          <div className={`mt-6 p-4 border-l-4 ${BORDER_COLOR} bg-gray-50 text-gray-600 italic text-sm`}>
            I hereby certify that all the information provided are true and correct to the best of my knowledge.
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleCombinedSave}
              className={`py-2 px-6 ${PRIMARY_COLOR_BG} hover:bg-red-700 text-white font-bold rounded-md shadow-lg transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileA;
