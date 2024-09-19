'use client'

import Image from "next/image"
import Logo from "./icons/Logo-lg-w.png"
//import Logosm from "./icons/Logo.png"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, signOutUser } from "@/app/appwrite/Services/authServices"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Menu } from "lucide-react"

interface User {
  name: string
  email: string
  profilePicture?: string
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setIsLoggedIn(true)
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Error fetching user session:", error)
        setIsLoggedIn(false)
        setUser(null)
      }
    }

    checkUserSession()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = async () => {
    try {
      await signOutUser()
      setIsLoggedIn(false)
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const handleLogoClick = () => {
    router.push("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="p-2 md:p-4 z-50 bg-transparent">
      <div className="flex justify-between items-center py-0 max-w-7xl mx-auto">
        <Image
          src={isSmallScreen ? Logo : Logo}
          alt="IntelliDocs"
          height={isSmallScreen ? 50 : 50}
          width={isSmallScreen ? 100 : 200}
          className="cursor-pointer"
          onClick={handleLogoClick}
        />
        {isSmallScreen ? (
          <Button 
            variant="outline" 
            onClick={toggleMenu} 
            className="p-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300"
          >
            <Menu className="h-6 w-6" />
          </Button>
        ) : (
          <div className="flex space-x-2 md:space-x-4 items-center">
            {renderNavItems()}
          </div>
        )}
      </div>
      {isSmallScreen && isMenuOpen && (
        <div className="absolute right-4 top-12 mt-2 space-y-2 bg-transparent p-4 rounded-lg shadow-md">
          <div className="flex flex-col items-end space-y-2">
            {renderNavItems()}
          </div>
        </div>
      )}
    </nav>
  )

  function renderNavItems() {
    return isLoggedIn ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 rounded-full border border-blue-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              <AvatarImage src={user?.profilePicture} alt={user?.name} className="rounded-full" />
              <AvatarFallback className="bg-blue-600 text-white">
                {user?.name?.charAt(0) || <User className="h-4 w-4 md:h-6 md:w-6" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-48 md:w-56 bg-white border border-blue-600 shadow-md rounded-lg transition-all duration-300 transform hover:shadow-lg"
          align="end" 
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-xs md:text-sm font-medium text-gray-900 leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-gray-500">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1 border-blue-600" />
          <DropdownMenuItem 
            onClick={handleLogout} 
            className="cursor-pointer px-4 py-2 text-gray-900 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-md flex items-center text-xs md:text-sm"
          >
            <LogOut className="mr-2 h-3 w-3 md:h-4 md:w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <>
        <button
          className="w-24 px-3 font-bold py-1 md:px-4 md:py-2 border text-white border-blue-600 rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white transform hover:scale-105 text-xs md:text-sm"
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </button>
        <button
          className="w-24 px-3 font-bold py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-700 hover:text-blue-100 transform hover:scale-105 text-xs md:text-sm"
          onClick={() => router.push("/login")}
        >
          Login
        </button>

      </>
    )
  }
}
