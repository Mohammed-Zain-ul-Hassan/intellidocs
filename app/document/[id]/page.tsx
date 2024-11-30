'use client'

import ChatPage from '@/components/ChatPage'
import Navbar from '@/components/Navbar'
import React from 'react'
import { usePdfStore } from '@/stores/pdfStore'

export default function DocumentPage() {
  const parsedText = usePdfStore((state) => state.parsedText);

  return (
    <div className='relative h-screen w-full p-2 bg-gradient-to-b from-blue-700 to-transparent overflow-x-hidden'>
      <Navbar/>
      <ChatPage pdfContext={parsedText}/>
    </div>
  )
}

