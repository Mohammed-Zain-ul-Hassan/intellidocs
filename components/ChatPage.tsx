/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CopyIcon, CheckIcon, LockIcon, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Client, Storage, Databases, Query, Models } from 'appwrite'
import { getCurrentUser } from '@/app/appwrite/Services/authServices'
import { useRouter } from 'next/navigation'

type Document = {
  id: string;
  name: string;
};

interface UserDoc extends Models.Document {
  userId: string;
  documentIds: string[];
}

export default function Component() {
  const [messages, setMessages] = useState([
    { role: "user", content: "What is the capital of France?" },
    { role: "ai", content: "The capital of France is Paris." },
    { role: "user", content: "Who invented the telephone?" },
    { role: "ai", content: "Alexander Graham Bell invented the telephone." },
    { role: "user", content: "What is the largest ocean in the world?" },
    { role: "ai", content: "The Pacific Ocean is the largest ocean in the world." },
  ])
  const [newQuestion, setNewQuestion] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  const router = useRouter()

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

  const storage = new Storage(client)
  const databases = new Databases(client)

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await getCurrentUser();
      setUserId(user?.$id || null);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchDocuments = async () => {
      try {
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
        const userDocsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_USERDOC_ID!;

        const userDocResponse = await databases.listDocuments<UserDoc>(
          databaseId,
          userDocsCollectionId,
          [Query.equal('userId', userId)]
        );

        if (userDocResponse.total === 0) {
          setDocuments([]);
          return;
        }

        const userDoc = userDocResponse.documents[0];
        const documentIds = userDoc.documentIds;

        if (documentIds.length === 0) {
          setDocuments([]);
          return;
        }

        const bucketId = process.env.NEXT_PUBLIC_APPWRITE_FILES_ID!;

        const files = await Promise.all(documentIds.map(id => storage.getFile(bucketId, id)));

        const fetchedDocuments: Document[] = files.map((file) => ({
          id: file.$id,
          name: file.name,
        }));

        setDocuments(fetchedDocuments);

      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, [userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newQuestion.trim() !== "") {
      setMessages([...messages, { role: "user", content: newQuestion }, { role: "ai", content: "" }])
      setNewQuestion("")
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index)
      toast({
        title: "Copied to clipboard",
        description: "The AI's response has been copied to your clipboard.",
      })
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

  const handleDocumentClick = (docId: string) => {
    router.push(`/document/${docId}`);
  }

  const currentDocumentId = window.location.pathname.split('/').pop(); // Get the document ID from the URL

  return (
    <div className="flex h-[85%] w-full max-w-screen max-h-screen gap-4 p-4">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&display=swap');
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background-color: rgba(155, 155, 155, 0.5);
          border-radius: 20px;
          border: transparent;
        }
      `}</style>
      <div className="w-full lg:w-[75%] overflow-hidden rounded-lg bg-white shadow-lg focus-within:ring-2 focus-within:ring-blue-300 border border-blue-300 flex flex-col relative">

        <div className="relative z-10">
          <div className="absolute inset-0 bg-blue-600 opacity-20 backdrop-blur-lg"></div>
          <h2 className="text-lg font-medium text-left text-gray-800 py-3 px-4 font-['Playfair Display',serif] flex items-center gap-2 relative z-10">
            Chat Conversation
            <LockIcon className="w-4 h-4" />
          </h2>
        </div>
        <div ref={chatContainerRef} className="flex-1 overflow-auto p-6 relative z-10">
           <>
           {messages.map((message, index) => (
             <div key={index}>
               <div className={`mb-4 flex items-start gap-4 ${message.role === 'user' ? "bg-gray-100 p-2 rounded-lg" : ""}`}>
                 <Avatar className="w-6 h-6 border">
                   <AvatarImage src="/placeholder-user.jpg" alt="Image" />
                   <AvatarFallback>{message.role === "user" ? "YO" : "AI"}</AvatarFallback>
                 </Avatar>
                 <div className="grid gap-1 flex-1">
                   <div className="font-bold">{message.role === "user" ? "You" : "ChatGPT"}</div>
                   <div className="prose text-gray-700">
                     <p>{message.content}</p>
                   </div>
                   {message.role === "ai" && (
                     <Button
                       variant="ghost"
                       size="sm"
                       className="w-8 h-8 p-0 ml-auto translate-y-[5px]"
                       onClick={() => copyToClipboard(message.content, index)}
                     >
                       {copiedIndex === index ? (
                         <CheckIcon className="h-4 w-4" />
                       ) : (
                         <CopyIcon className="h-4 w-4" />
                       )}
                       <span className="sr-only">Copy response</span>
                     </Button>
                   )}
                 </div>
               </div>
               {message.role === "ai" && index < messages.length - 1 && ( // Conditionally render the line
                 <div className="w-full mb-3 border-t border-gray-300" />
               )}
             </div>
           ))}
         </>         
        </div>
        <div className="p-4 border-t relative z-10">
          <form onSubmit={handleSubmit} className="relative">
            <Textarea
              placeholder="Message ChatGPT..."
              name="message"
              id="message"
              rows={1}
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              className="min-h-[48px] rounded-2xl resize-none p-4 border border-blue-300 shadow-sm pr-16 w-full bg-white"
            />
            <Button type="submit" size="icon" className="absolute w-8 h-8 bottom-3 right-3">
              <ArrowUpIcon className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex w-[25%] overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-white shadow-lg focus-within:ring-2 focus-within:ring-blue-300 border border-blue-300 flex-col relative">
        <div className="relative z-10">
          <div className="absolute inset-0 bg-blue-600 opacity-20 backdrop-blur-lg"></div>
          <h2 className="text-lg font-medium text-left text-gray-800 py-3 px-4 font-['Playfair Display',serif] relative z-10">
            Documents
          </h2>
        </div>
        <div className="flex-1 overflow-auto p-6 relative z-10 space-y-4">
          {documents.length === 0 ? (
            <p className="text-gray-500">No documents available.</p>
          ) : (
            documents.map((doc) => (
              <>
              
                <div
                  key={doc.id}
                  className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-blue-100 ${
                    doc.id === currentDocumentId ? 'bg-blue-200' : ''
                  }`}
                  onClick={() => handleDocumentClick(doc.id)}
                >
                  <FileText className="mr-2" />
                  <span
                    className="font-medium truncate overflow-hidden text-ellipsis"
                    style={{
                      maxWidth: 'calc(100% - 2rem)', // Adjust based on icon and padding
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                    }}
                  >
                    {doc.name}
                  </span>
                </div>
                <div className="w-full border-t z-20 border-gray-300" />
              </>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  )
}