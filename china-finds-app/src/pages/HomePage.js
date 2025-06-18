import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // To conditionally show buttons

const HomePage = () => {
  const { user } = useAuth();

  const pageStyle = {
    textAlign: 'center',
    padding: '50px 20px',
    fontFamily: 'Arial, sans-serif',
  };

  const heroStyle = {
    backgroundColor: '#f0f8ff', // A light, welcoming blue
    padding: '40px 20px',
    borderRadius: '8px',
    marginBottom: '30px',
  };

  const headingStyle = {
    fontSize: '2.5em',
    color: '#333',
    marginBottom: '20px',
  };

  const subHeadingStyle = {
    fontSize: '1.2em',
    color: '#555',
    marginBottom: '30px',
    lineHeight: '1.6',
  };

  const ctaContainerStyle = {
    marginTop: '30px',
  };

  const ctaButtonStyle = {
    display: 'inline-block',
    backgroundColor: '#007bff', // Primary blue
    color: 'white',
    padding: '15px 30px',
    margin: '10px',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
  };

  const secondaryButtonStyle = {
    ...ctaButtonStyle,
    backgroundColor: '#6c757d', // Secondary gray
  };

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <h1 style={headingStyle}>Welcome to China Finds!</h1>
        <p style={subHeadingStyle}>
          Your community hub for discovering unique and valuable products directly from China. <br />
          Share your finds, get advice, and connect with fellow enthusiasts.
        </p>
      </div>

      <h2>Why China Finds?</h2>
      <p style={subHeadingStyle}>
        - Discover products curated by a community of nomads and travelers. <br />
        - Get authentic reviews and insights before you buy. <br />
        - Connect with manufacturers and access C2M deals (coming soon!).
      </p>

      <div style={ctaContainerStyle}>
        {user ? (
          <Link to="/feed" style={ctaButtonStyle}>
            Go to Community Feed
          </Link>
        ) : (
          <>
            <Link to="/signup" style={ctaButtonStyle}>
              Join the Community
            </Link>
            <Link to="/login" style={secondaryButtonStyle}>
              Login
            </Link>
          </>
        )}
      </div>

      <div style={{marginTop: '40px', color: '#777'}}>
        <p>Domain: chinafinds.org (This is a conceptual project)</p>
      </div>
    </div>
  );
};

export default HomePage;
