import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
// import { useNavigate } from 'react-router-dom'; // Uncomment if you want to redirect after signup

const SignupPage = () => {
  // const navigate = useNavigate(); // Uncomment for redirection
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      // Check data.user and data.session
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setMessage('Signup successful, but confirmation email might be pending if enabled in Supabase. Please check your email.');
      } else if (data.user) {
        setMessage('Signup successful! Please check your email to confirm your account if required by your Supabase settings.');
        // navigate('/'); // Redirect to home or login
      } else {
        setMessage('Signup successful, but no user data returned. Please check your Supabase console.');
      }
    } catch (error) {
      setMessage('Error signing up: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignupPage;
