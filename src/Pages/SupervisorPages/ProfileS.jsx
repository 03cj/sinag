import { useEffect, useState } from 'react';

const PRIMARY_COLOR_BG = 'bg-red-800';
const BORDER_COLOR = 'border-red-800';
const INPUT_FOCUS_RING = 'focus:ring-red-500 focus:border-red-500';

const ProfileS = () => {
  const [profileData, setProfileData] = useState({
    supervisorName: '',
    companyName: '',
    natureOfBusiness: '',
    email: '',
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

  // FETCH COMPANY DATA
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:5000/api/auth/company/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        setProfileData({
          supervisorName: data.supervisorName || '',
          companyName: data.companyName || '',
          natureOfBusiness: data.natureOfBusiness || '',
          email: data.email || '',
        });
      } catch (err) {
        setError('Failed to load company information.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // SAVE PROFILE
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/auth/company/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // CHANGE PASSWORD
  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      return setError('New password and confirm password do not match.');
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccessMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.message);
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
    <div className="flex justify-center min-h-screen p-8 bg-gray-100">
      <div className={`w-full bg-white shadow-xl ${BORDER_COLOR} border-t-8 rounded-lg`}>
        <div className={`${PRIMARY_COLOR_BG} text-white font-bold text-lg text-center py-4`}>
          Company Profile
        </div>

        <div className="p-6">
          {/* Alerts */}
          {error && <div className="mb-4 p-3 border border-red-500 bg-red-100 text-red-700">{error}</div>}
          {successMessage && (
            <div className="mb-4 p-3 border border-green-500 bg-green-100 text-green-700">
              {successMessage}
            </div>
          )}

          {/* Company Info */}
          <div className={`p-4 mb-8 border ${BORDER_COLOR} rounded-md`}>
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>

            {['supervisorName', 'companyName', 'natureOfBusiness', 'email'].map((field) => (
              <div key={field} className="flex items-center mb-3">
                <label className="w-1/3 text-sm font-medium text-gray-700 capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  name={field}
                  value={profileData[field]}
                  onChange={handleProfileChange}
                  disabled={loading || field === 'email'}
                  className={`block w-2/3 px-3 py-2 border-2 ${BORDER_COLOR} rounded-md shadow-sm ${INPUT_FOCUS_RING} ${
                    field === 'email' ? 'bg-gray-200 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Password Section */}
          <div className={`p-4 border ${BORDER_COLOR} rounded-md`}>
            <h2 className="text-xl font-semibold mb-4">Update Password</h2>

            {[  
              { label: 'Current Password', value: currentPassword, setter: setCurrentPassword },
              { label: 'New Password', value: newPassword, setter: setNewPassword },
              { label: 'Confirm New Password', value: confirmNewPassword, setter: setConfirmNewPassword }
            ].map(({ label, value, setter }) => (
              <div key={label} className="mb-3 flex items-center">
                <label className="w-1/3 text-sm font-medium text-gray-700">{label}</label>
                <input
                  type="password"
                  value={value}
                  disabled={loading}
                  onChange={(e) => setter(e.target.value)}
                  className={`block w-2/3 px-3 py-2 border-2 ${BORDER_COLOR} rounded-md shadow-sm ${INPUT_FOCUS_RING}`}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleCombinedSave}
              disabled={loading}
              className={`px-6 py-2 text-white font-bold rounded-md shadow-lg ${PRIMARY_COLOR_BG} ${
                loading && 'opacity-50 cursor-not-allowed'
              }`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileS;
