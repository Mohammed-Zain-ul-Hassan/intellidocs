'use client'

import Image from "next/image";
import Logo from "./icons/Logo-lg-w.png";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOutUser } from "@/app/appwrite/Services/authServices";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  interface User {
    name: string;
    email: string;
    profilePicture?: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setIsLoggedIn(true);
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkUserSession();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      setIsLoggedIn(false);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <nav className="p-4 z-50">
      <div className="flex justify-between items-center py-0">
        <Image
          src={Logo}
          alt="IntelliDocs"
          height={200}
          width={200}
          className="cursor-pointer"
          onClick={handleLogoClick}
        />
        <div className="flex space-x-4 items-center">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-blue-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profilePicture} alt={user?.name} className="rounded-full" />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {user?.name?.charAt(0) || <User className="h-6 w-6" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 bg-white border border-blue-700 shadow-md rounded-lg transition-all duration-300 transform hover:shadow-lg"
                align="end" 
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium text-gray-900 leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 border-blue-700" />

                {/* Logout Button with Icon */}
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer px-4 py-2 text-gray-900 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-md flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
}