import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import CreatePostForm from '../components/community/CreatePostForm';
import { useAuth } from '../context/AuthContext'; // To check if user is logged in

const FeedPage = () => {
  const { user } = useAuth(); // Get current user
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch posts and join with users table to get usernames
      // Ensure your RLS policies on 'users' table allow authenticated users to read usernames
      // Or, make usernames public if that fits your security model.
      // For simplicity, let's assume 'users.username' is readable by authenticated users.
      // If not, you might need to create a Supabase function (RPC) for this.
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          created_at,
          user_id,
          users ( username )
        `)
        .order('created_at', { ascending: false }); // Corrected from 'user:users(username)'

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err) {
      setError('Error fetching posts: ' + err.message);
      setPosts([]); // Clear posts on error
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    // Add the new post to the top of the list
    // This requires the newPost object to have the same structure as fetched posts,
    // especially the nested user object.
    // For simplicity, we'll refetch for now, or you can manually construct the user object.
    fetchPosts();
    // Or, to add optimistically:
    // setPosts(currentPosts => [
    //   { ...newPost, users: { username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'New User' } },
    //   ...currentPosts
    // ]);
  };

  if (loading) return <p>Loading feed...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <div>
      <h1>Community Feed</h1>
      {user && <CreatePostForm onPostCreated={handlePostCreated} />}
      {!user && <p>Please <a href="/login">login</a> or <a href="/signup">sign up</a> to create posts and join the discussion!</p>}

      {posts.length === 0 && !loading && <p>No posts yet. Be the first to share!</p>}

      <div style={{ marginTop: '20px' }}>
        {posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h2>{post.title || 'Untitled Post'}</h2>
            {/* Adjust according to how you get the username.
                The SQL query fetches users ( username ), so it should be post.users.username
                If users is null (e.g. user deleted, or RLS issue), provide a fallback.
            */}
            <small>By: {post.users ? post.users.username : (post.user_id ? 'Unknown User' : 'Anonymous')} on {new Date(post.created_at).toLocaleDateString()}</small>
            <p>{post.content}</p>
            {/* Add Edit/Delete buttons here if user is the owner */}
            {user && user.id === post.user_id && (
              <div>
                {/* <button onClick={() => {/* handle edit */}}>Edit</button> */}
                {/* <button onClick={() => {/* handle delete */}}>Delete</button> */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
