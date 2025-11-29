import { useEffect, useRef, useState } from 'react';

const ProfileC = () => {
  // Ref for the hidden file input
  const fileInputRef = useRef(null); // State to hold coordinator's profile data

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    department: '',
    employeeId: '',
    profilePicture: 'https://placehold.co/150x150/ef4444/ffffff?text=C',
  }); // State for password fields (separate from profile data as they are not usually displayed)

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // State for loading and error messages

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Handler to trigger click on the hidden file input

  const handleImageButtonClick = () => {
    // If currently loading/saving something else, don't allow picture upload
    if (!loading) {
      fileInputRef.current.click();
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }; // 📸 NEW: Handler for Profile Picture Upload

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData(); // Ensure the key 'profilePicture' matches what your backend expects for the file field
      formData.append('profilePicture', file);

      const response = await fetch('http://localhost:5000/api/auth/upload-profile-picture', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, // NOTE: Do NOT set Content-Type header when using FormData, the browser handles it.
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`); // Update the local state with the new profile picture URL returned from the backend

      setProfileData((prev) => ({
        ...prev,
        profilePicture: data.profilePictureUrl || prev.profilePicture,
      }));

      setSuccessMessage('Profile picture uploaded successfully!');
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
      setError(err.message || 'Failed to upload photo. Please try again.');
    } finally {
      setLoading(false); // Reset the input value so the same file can be uploaded again if needed
      e.target.value = null;
    }
  }; // Effect to fetch coordinator profile data on component mount

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const user = data.user;

        setProfileData({
          fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '',
          email: user.email || '',
          contactNumber: user.contactNumber || '',
          department: user.department || '',
          employeeId: user.employeeId || '',
          profilePicture: user.profilePicture || 'https://placehold.co/150x150/ef4444/ffffff?text=C',
        });
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []); // Handler for updating profile details

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT', // update existing data
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          // Note: Only sending fields the user can actually edit (contactNumber, department, employeeId)
          contactNumber: profileData.contactNumber,
          department: profileData.department,
          employeeId: profileData.employeeId,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setSuccessMessage('Profile updated successfully!');
      console.log('Profile updated:', profileData);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }; // Handler for changing password

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
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed: ${response.status}`);
      }

      setSuccessMessage('Password changed successfully!');
      console.log('✅ Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error('❌ Failed to change password:', err);
      setError(err.message || 'Failed to change password. Please check your current password and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 md:p-8 bg-gray-100 min-h-screen">
      {/* Page Header */}{' '}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Coordinator Profile</h1>{' '}
        <p className="text-gray-600 text-sm">View and manage your account details.</p>{' '}
      </div>{' '}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong> <span className="block sm:inline"> {error}</span>{' '}
        </div>
      )}{' '}
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>{' '}
          <span className="block sm:inline"> {successMessage}</span>{' '}
        </div>
      )}{' '}
      <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>{' '}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {' '}
          <div className="flex flex-col items-center justify-center p-4">
            {/* Profile Picture Display */}{' '}
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-red-800 mb-4 flex items-center justify-center bg-gray-200">
              {' '}
              {profileData.profilePicture && (
                <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              )}{' '}
            </div>
            {/* 1. The HIDDEN File Input */}{' '}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureUpload}
              accept="image/*" // Only accept image files
              className="hidden"
              disabled={loading}
            />
            {/* 2. The STYLED Button to trigger the hidden input */}{' '}
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1 px-3 rounded-md transition-colors duration-200"
              onClick={handleImageButtonClick}
              disabled={loading} // Disable while loading/saving anything
            >
              {loading ? 'Uploading...' : 'Upload Photo'}{' '}
            </button>{' '}
          </div>{' '}
          <div className="space-y-4">
            {' '}
            <div>
              {' '}
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name{' '}
              </label>{' '}
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={profileData.fullName}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                disabled={loading}
              />{' '}
            </div>{' '}
            <div>
              {' '}
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email (Primary Contact){' '}
              </label>{' '}
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                disabled={loading}
              />{' '}
            </div>{' '}
            <div>
              {' '}
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number{' '}
              </label>{' '}
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={profileData.contactNumber}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                disabled={loading}
              />{' '}
            </div>{' '}
            <div>
              {' '}
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department/Office{' '}
              </label>{' '}
              <input
                type="text"
                id="department"
                name="department"
                value={profileData.department}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                disabled={loading}
              />{' '}
            </div>{' '}
            <div>
              {' '}
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                Employee ID{' '}
              </label>{' '}
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={profileData.employeeId}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div className="mt-6 flex justify-end">
          {' '}
          <button
            onClick={handleSaveProfile}
            className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}{' '}
          </button>{' '}
        </div>{' '}
      </div>
      {/* Account Settings - Change Password */}{' '}
      <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>{' '}
        <h3 className="text-lg font-medium text-gray-700 mb-4">Change Password</h3>{' '}
        <div className="space-y-4 max-w-md">
          {' '}
          <div>
            {' '}
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password{' '}
            </label>{' '}
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              disabled={loading}
            />{' '}
          </div>{' '}
          <div>
            {' '}
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password{' '}
            </label>{' '}
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              disabled={loading}
            />{' '}
          </div>{' '}
          <div>
            {' '}
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password{' '}
            </label>{' '}
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              disabled={loading}
            />{' '}
          </div>{' '}
        </div>{' '}
        <div className="mt-6 flex justify-end">
          {' '}
          <button
            onClick={handleChangePassword}
            className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Change Password'}{' '}
          </button>{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
};

export default ProfileC;
