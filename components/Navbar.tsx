'use client'
import Image from "next/image";
import Logo from "./icons/Logo-lg-w.png";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOutUser } from "@/app/appwrite/Services/authServices"; // Make sure you have these functions in your services

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await getCurrentUser(); // Fetch the current user
        if (user) {
          setIsLoggedIn(true); // Set logged-in state if user exists
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
        setIsLoggedIn(false); // If error, assume user is not logged in
      }
    };

    checkUserSession();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser(); // Implement this function to log the user out
      setIsLoggedIn(false); // Set logged-in state to false after logout
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLogoClick = () => {
    router.push("/"); // Navigate back to the homepage
  };

  return (
    <nav className="p-4 z-50">
      <div className="flex justify-end items-center py-0">
        <Image
          src={Logo}
          alt="IntelliDocs"
          height={200}
          width={200}
          className="cursor-pointer" // Make it clear that the logo is clickable
          onClick={handleLogoClick}  // Handle the logo click to navigate to home
        />
        <div className="flex-grow"></div>
        <div className="absolute flex space-x-4 opacity-0 sm:opacity-100 font-mono">
          {isLoggedIn ? (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-600 hover:text-red-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              {/* Sign In Button (Outline) */}
              <button
                className="px-4 py-2 border text-white border-blue-700 rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white transform hover:scale-105"
                onClick={() => router.push("/signup")}
              >
                Sign In
              </button>

              {/* Login Button (Filled) */}
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-700 hover:text-blue-100 transform hover:scale-105"
                onClick={() => router.push("/login")}
              >
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
