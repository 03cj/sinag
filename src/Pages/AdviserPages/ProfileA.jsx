import React, { useState, useEffect } from 'react';

const ProfileA = () => {
  // State to hold coordinator's profile data
  const [profileData, setProfileData] = useState({
    fullName: 'Loading...',
    email: 'Loading...',
    contactNumber: 'Loading...',
    department: 'Loading...',
    employeeId: 'Loading...',
    profilePicture: 'https://placehold.co/150x150/ef4444/ffffff?text=C', // Placeholder for profile pic
  });

  // State for password fields (separate from profile data as they are not usually displayed)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // State for loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Effect to fetch coordinator profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        // TODO: Database Connection Point 1: Replace this simulated data fetch
        // with an actual API call to retrieve the coordinator's profile data.
        // Example: const response = await fetch('/api/coordinator/profile');
        // if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        // const data = await response.json();
        // setProfileData({
        //   fullName: data.fullName,
        //   email: data.email,
        //   contactNumber: data.contactNumber,
        //   department: data.department,
        //   employeeId: data.employeeId,
        //   profilePicture: data.profilePicture || 'https://placehold.co/150x150/ef4444/ffffff?text=C',
        // });

        // --- START OF SIMULATED DATA ---
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setProfileData({
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          contactNumber: '09123456789',
          department: 'Internship Office',
          employeeId: 'COORD-001',
          profilePicture: 'https://placehold.co/150x150/ef4444/ffffff?text=JD',
        });
        // --- END OF SIMULATED DATA ---

      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []); // Empty dependency array means it runs once on mount

  // Handler for updating profile details
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for saving profile changes
  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // TODO: Database Connection Point 2: Replace this with an actual API call
      // to update the coordinator's profile in the database.
      // Example: const response = await fetch('/api/coordinator/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData),
      // });
      // if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }

      // Simulate API success
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccessMessage('Profile updated successfully!');
      console.log('Profile saved:', profileData);

    } catch (err) {
      console.error("Failed to save profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for changing password
  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      setLoading(false);
      return;
    }
    if (!newPassword || newPassword.length < 6) { // Basic validation
      setError("New password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // TODO: Database Connection Point 3: Replace this with an actual API call
      // to change the coordinator's password. This would typically involve sending
      // currentPassword, newPassword, and confirmNewPassword to your backend.
      // Example: const response = await fetch('/api/coordinator/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ currentPassword, newPassword }),
      // });
      // if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }

      // Simulate API success
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccessMessage('Password changed successfully!');
      console.log('Password changed.');
      // Clear password fields on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

    } catch (err) {
      console.error("Failed to change password:", err);
      setError("Failed to change password. Please check your current password and try again.");
    } finally {
      setLoading(false);
    }
  };


  if (loading && !profileData.fullName) { // Only show full loading screen on initial fetch
    return (
      <div className="p-5 md:p-8 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading coordinator profile...</p>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 bg-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Coordinator Profile</h1>
        <p className="text-gray-600 text-sm">View and manage your account details.</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {successMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-red-800 mb-4 flex items-center justify-center bg-gray-200">
              {profileData.profilePicture && (
                <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              )}
            </div>
            {/* You might add an upload button here later */}
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1 px-3 rounded-md transition-colors duration-200"
              onClick={() => alert("Upload profile picture functionality goes here!")}
            >
              Upload Photo
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={profileData.fullName}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                disabled={loading} // Disable input while saving
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Primary Contact)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={profileData.contactNumber}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department/Office</label>
              <input
                type="text"
                id="department"
                name="department"
                value={profileData.department}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Employee ID</label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={profileData.employeeId}
                readOnly // Employee ID usually not editable
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm sm:text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveProfile}
            className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      {/* Account Settings - Change Password */}
      <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              disabled={loading}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleChangePassword}
            className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileA;
