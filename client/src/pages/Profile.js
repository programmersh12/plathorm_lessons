import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    dateOfBirth: ''
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        dateOfBirth: user.dateOfBirth || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // In a real app, you would update the profile via API
    // await updateProfile(profileData);
    
    setTimeout(() => {
      setSaving(false);
      setEditing(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div>
      <h1>Profile</h1>
      
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Personal Information</h2>
        
        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-input"
                value={profileData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-input"
                value={profileData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={profileData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea
                id="bio"
                name="bio"
                className="form-input"
                rows="4"
                value={profileData.bio}
                onChange={handleChange}
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className="form-input"
                value={profileData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="submit" 
                className="form-button"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="form-button"
                style={{ backgroundColor: '#6c757d' }}
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Name:</strong> {user?.firstName} {user?.lastName}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Email:</strong> {user?.email}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Role:</strong> {user?.role}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Bio:</strong> {user?.bio || 'Not provided'}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Date of Birth:</strong> {user?.dateOfBirth || 'Not provided'}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </div>
            
            <button 
              className="form-button"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
      
      <div className="card" style={{ maxWidth: '600px', margin: '20px auto 0' }}>
        <h2>Security</h2>
        <button 
          className="form-button"
          style={{ backgroundColor: '#dc3545' }}
          onClick={() => alert('Change password functionality would go here')}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Profile;