import ChatPage from '@/components/ChatPage'
import Navbar from '@/components/Navbar'
import React from 'react'

const page = () => {
  return (
    <div className='relative h-screen w-full p-2 bg-gradient-to-b from-blue-700 to-transparent overflow-x-hidden'>
      <Navbar/>
      <ChatPage/>
    </div>
  )
}

export default page