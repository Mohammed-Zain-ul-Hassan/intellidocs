import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Image from 'next/image'
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { getCurrentUser, updateUserProfile } from '@/app/appwrite/Services/authServices'
// import storageServices from '@/app/appwrite/Services/storageServices' // Adjust import path as needed
// import Logo from '@/components/icons/Logo.png'

// interface User {
//   name: string;
//   email: string;
//   profilePictureId?: string; // Optional profile picture ID
// }

// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>(null)
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [currentPassword, setCurrentPassword] = useState('')
//   const [profilePicture, setProfilePicture] = useState<File | null>(null)
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const currentUser = await getCurrentUser()
//         if (currentUser) {
//           setUser(currentUser)
//           setName(currentUser.name || '')
//           setEmail(currentUser.email || '')

//           // Set the profile picture preview if it exists
//           if (currentUser.profilePictureId) {
//             const previewUrl = await storageServices.profile.getFilePreview(currentUser.profilePictureId)
//             setPreviewUrl(previewUrl)
//           }
//         } else {
//           router.push('/login')
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error)
//         router.push('/login')
//       }
//     }

//     fetchUserData()
//   }, [router])

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       setProfilePicture(file)
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setPreviewUrl(reader.result as string)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setSuccess('')

//     try {
//       let profilePictureId = user?.profilePictureId

//       // If a new profile picture is selected, upload it
//       if (profilePicture) {
//         if (user) {
//           const uploadedFile = await storageServices.profile.createFile(profilePicture, user.email || '') // Use user email or any unique ID
//           profilePictureId = uploadedFile.$id
//         }
//       }

//       // Update the user profile with the new name, email, and profile picture
//       await updateUserProfile(name, email, currentPassword, profilePictureId || '')

//       setSuccess('Profile updated successfully')
//     } catch (error) {
//       console.error('Error updating profile:', error)
//       setError('Failed to update profile')
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (!user) {
//     return <div>Loading...</div>
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
//       {/* Decorative background */}
//       <div className="absolute inset-0 z-0 bg-white bg-opacity-70">
//         <div className="absolute inset-0" style={{
//           backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
//         }} />
//       </div>
//       <Image src={Logo} alt="Your Logo" className="mx-auto h-[10rem] w-auto z-10" />
//       <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Update Your Profile
//         </h2>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Name
//               </Label>
//               <div className="mt-1">
//                 <Input
//                   id="name"
//                   name="name"
//                   type="text"
//                   autoComplete="name"
//                   required
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email address
//               </Label>
//               <div className="mt-1">
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
//                 Current Password
//               </Label>
//               <div className="mt-1">
//                 <Input
//                   id="currentPassword"
//                   name="currentPassword"
//                   type="password"
//                   required
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
//                 Profile Picture
//               </Label>
//               <div className="mt-1 flex items-center space-x-4">
//                 {previewUrl && (
//                   <Image
//                     src={previewUrl}
//                     alt="Profile Preview"
//                     width={64}
//                     height={64}
//                     className="rounded-full object-cover"
//                   />
//                 )}
//                 <Input
//                   id="profilePicture"
//                   name="profilePicture"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             {error && <p className="text-sm text-red-600">{error}</p>}
//             {success && <p className="text-sm text-green-600">{success}</p>}

//             <div>
//               <Button
//                 type="submit"
//                 className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 disabled={loading}
//               >
//                 {loading ? 'Updating...' : 'Update Profile'}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }
