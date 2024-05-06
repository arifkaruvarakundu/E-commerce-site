import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {  
  // State to track user authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle user sign out
  const handleSignOut = async () => {
    try {
      // Make a POST request to the logout endpoint
      const response = await axios.post('logout/');
      if (response.status === 200) {
        // If logout successful, update authentication status
        setIsAuthenticated(false);
      } else {
        // Handle error
        console.error('Failed to logout:', response.statusText);
      }
    } catch (error) {
      console.error('Error occurred while logging out:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 w-full">
      <div className="container">
        <div className="flex justify-between items-center">
          <div className="space-x-16">
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
            <Link to="/services" className="text-white hover:text-gray-300">
              Dashboard
            </Link>
            <Link to="/About" className="text-white hover:text-gray-300">
              About
            </Link>
            <Link to="/Contacts" className="text-white hover:text-gray-300">
              Contact
            </Link>
          </div>
          <div>
            {isAuthenticated ? (
              <div className="flex items-center">
                <span className="text-white mr-4">User Avatar</span>
                <button className="text-white hover:text-gray-300" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                <Link to='/signIn'>
                <button className="btn btn-sm btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#modellogin">
                  Login
                </button>
                </Link>
                <Link to='/signup'>
                <button className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modelsignup">
                  Register
                </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

