import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';

const CreatePostForm = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('You must be logged in to create a post.');
      return;
    }
    if (!content.trim()) {
      setMessage('Post content cannot be empty.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ user_id: user.id, title: title.trim() || null, content: content.trim() }])
        .select(); // .select() will return the inserted row(s)

      if (error) throw error;

      setMessage('Post created successfully!');
      setTitle('');
      setContent('');
      if (onPostCreated && data) {
        onPostCreated(data[0]); // Pass the newly created post back
      }
    } catch (error) {
      setMessage('Error creating post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p>Please <a href="/login">login</a> to create a post.</p>;
  }

  return (
    <form onSubmit={handleCreatePost}>
      <h2>Create New Post</h2>
      {message && <p>{message}</p>}
      <div>
        <label htmlFor="postTitle">Title (Optional):</label>
        <input
          id="postTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
};

export default CreatePostForm;
