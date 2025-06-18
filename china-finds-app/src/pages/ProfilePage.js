import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom'; // If redirect is needed

const ProfilePage = () => {
  const { user } = useAuth();
  // const navigate = useNavigate(); // If redirect is needed
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(''); // For simplicity, we'll just show the URL
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        // navigate('/login'); // Redirect if not logged in
        setMessage('User not logged in.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('username, full_name, bio, avatar_url')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116: 'single' row not found
          throw error;
        }
        if (data) {
          setUsername(data.username || '');
          setFullName(data.full_name || '');
          setBio(data.bio || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (error) {
        setMessage('Error fetching profile: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]); // Add navigate to dependency array if used

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('You must be logged in to update your profile.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const updates = {
        id: user.id,
        username,
        full_name: fullName,
        bio,
        avatar_url: avatarUrl, // In a real app, handle avatar uploads separately
        updated_at: new Date(),
      };
      const { error } = await supabase.from('users').upsert(updates);
      if (error) throw error;
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user && !message) return <p>Loading profile...</p>;
  if (!user && !loading) return <p>Please <a href="/login">login</a> to view your profile.</p>;
  if (!user) return <p>{message || 'User not available.'}</p>


  return (
    <div>
      <h1>Your Profile</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleProfileUpdate}>
        <div>
          <label htmlFor="email">Email:</label>
          <input id="email" type="text" value={user?.email || ''} disabled />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="avatarUrl">Avatar URL:</label>
          <input
            id="avatarUrl"
            type="text"
            value={avatarUrl}
            placeholder="http://example.com/avatar.png"
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
