'use client'
import Image from "next/image";
import Logo from "./icons/Logo-lg-w.png";
import { useState } from "react";

const Navbar = () => {
  // State to check if user is logged in (replace this with actual authentication logic)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("User logged out");
    setIsLoggedIn(false);
  };

  return (
    <nav className="p-4 z-50">
      <div className="flex justify-end items-center py-0">
        <Image src={Logo} alt="IntelliDocs" height={200} width={200} />
        <div className="flex-grow"></div>
        <div className="absolute flex space-x-4 opacity-0 sm:opacity-100">
          {isLoggedIn ? (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-600 hover:text-red-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              {/* Sign In Button (Outline) */}
              <button className="px-4 py-2 border text-white border-blue-700 rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white transform hover:scale-105">
                Sign In
              </button>

              {/* Login Button (Filled) */}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-700 hover:text-blue-100 transform hover:scale-105">
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
