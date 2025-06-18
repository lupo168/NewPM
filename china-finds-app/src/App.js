import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import Navbar from './components/common/Navbar'; // We will enhance this Navbar
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const AppNavbar = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li>Loading...</li>
        </ul>
      </nav>
    );
  }

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {user && <li><Link to="/feed">Feed</Link></li>}
        {user && <li><Link to="/profile">Profile</Link></li>}
        {user ? (
          <>
            <li><span>Welcome, {user.email}</span></li>
            <li><button onClick={signOut}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppNavbar /> {/* Using the new Navbar */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Add protected route for Feed later if needed */}
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
