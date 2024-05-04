import React, { useEffect, useState,useRef } from 'react';
import { Link } from 'react-router-dom';


function Navbar() {  

  
  return (
    <div className="bg-gray-800 p-4 w-full">
      <div className="container">
        <div className="flex justify-between items-center">
          <div className="space-x-16">
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
            <Link to="/services" className="text-white hover:text-gray-300">
              Services
            </Link>
            <Link to="/About" className="text-white hover:text-gray-300">
              About
            </Link>
            <Link to="/Contacts" className="text-white hover:text-gray-300">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
