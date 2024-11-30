'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, Search, PlusCircle, FileText, ChevronLeft, ChevronRight, X } from 'lucide-react'
import FileUploader from './DocUpload'
import { getCurrentUser } from '@/app/appwrite/Services/authServices' 
import { Client, Storage, Databases, Query, Models } from 'appwrite' 
import { useRouter, usePathname } from 'next/navigation'
import { usePdfStore } from '@/stores/pdfStore'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Document = {
  id: string;
  name: string;
  format: string;
  uploadTime: string;
  size: number;
};

interface UserDoc extends Models.Document {
  userId: string;
  documentIds: string[];
}

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const storage = new Storage(client);
const databases = new Databases(client);

export default function DocumentCards() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filter, setFilter] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isModalOpen, setIsModalOpen] = useState(false) // State to control modal visibility
  const [userId, setUserId] = useState<string | null>(null) // State to store userId
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null)
  const setParsedText = usePdfStore((state) => state.setParsedText);
  const documentsPerPage = 12 // Set the number of documents per page

  const router = useRouter();
  const pathname = usePathname();

  // Fetch userId (Assume getCurrentUser returns a promise that resolves to the current user object)
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserId(user.$id);
        }
      } catch (error) {
      }
    };
    fetchUserId();
  }, []);

  // Add this useEffect to get current document ID from URL
  useEffect(() => {
    const id = pathname?.split('/').pop();
    if (id) setCurrentDocumentId(id);
  }, [pathname]);

  // Fetch documents from the Appwrite storage bucket
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

        const bucketId = process.env.NEXT_PUBLIC_APPWRITE_FILES_ID!;
        const fetchedFiles = await Promise.all(
          userDoc.documentIds.map(async (id) => {
            try {
              const file = await storage.getFile(bucketId, id);
              return file;
            } catch (error) {
              return null;
            }
          })
        );

        const validFiles = fetchedFiles.filter((file): file is Models.File => file !== null);

        const fetchedDocuments: Document[] = validFiles.map((file) => ({
          id: file.$id,
          name: file.name,
          format: file.mimeType.split('/').pop() || 'Unknown',
          uploadTime: file.$createdAt,
          size: file.sizeOriginal,
        }));

        setDocuments(fetchedDocuments);

      } catch (error) {
      }
    };

    fetchDocuments();
  }, [userId]);

  const handleSort = (key: keyof Document) => {
    const sortedDocuments = [...documents].sort((a, b) => {
      if (a[key] < b[key]) return -1
      if (a[key] > b[key]) return 1
      return 0
    })
    setDocuments(sortedDocuments)
  }

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(filter.toLowerCase()) ||
    doc.format.toLowerCase().includes(filter.toLowerCase())
  )

  const indexOfLastDocument = currentPage * documentsPerPage
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage
  const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument)

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const handleAddDocument = () => {
    setIsModalOpen(true) // Show the modal when "Add Document" is clicked
  }

  const closeModal = () => {
    setIsModalOpen(false) // Close modal
  }

  const parsePdf = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/pdf-parser', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Failed to parse PDF: ${response.status} ${response.statusText}\n${responseText}`);
      }

      const data = JSON.parse(responseText);
      return data.text;
    } catch (error) {
      throw error;
    }
  };

  const handleDocumentClick = async (docId: string) => {
    try {
      const bucketId = process.env.NEXT_PUBLIC_APPWRITE_FILES_ID!;
      const file = await storage.getFileDownload(bucketId, docId);

      const response = await fetch(file.href);
      const blob = await response.blob();
      const pdfFile = new File([blob], 'document.pdf', { type: 'application/pdf' });

      const parsedText = await parsePdf(pdfFile);
      setParsedText(parsedText);
      
      router.push(`/document/${docId}`);
    } catch (error) {
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Total number of pages
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Input 
            placeholder="Search documents..." 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleSort('name')}>
                By Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('format')}>
                By Format
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('uploadTime')}>
                By Upload Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('size')}>
                By Size
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddDocument} className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Document
          </Button>
        </div>
      </div>
      {documents.length === 0 ? (
        <p className="text-center text-gray-500">No documents yet</p>
      ) : (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentDocuments.map((doc) => (
              <div key={doc.id} onClick={() => handleDocumentClick(doc.id)} className="cursor-pointer">
                <Card className="flex flex-col bg-gray-100 hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex-grow p-4">
                    <div className="flex justify-center mb-2">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                    <CardTitle className="text-center text-sm truncate">{doc.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <p className="text-xs text-gray-500 text-center">
                      {doc.format} • {(doc.size / 1048576).toFixed(2)} MB
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-gray-400 justify-center p-2">
                    {formatDate(doc.uploadTime)}
                  </CardFooter>
                </Card>
                </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 mt-6">
            {currentPage > 1 && (
              <Button variant="outline" onClick={() => paginate(currentPage - 1)}>
                <ChevronLeft />
              </Button>
            )}
            <p className="text-sm text-gray-500">{`Page ${currentPage} of ${totalPages}`}</p>
            {currentPage < totalPages && (
              <Button variant="outline" onClick={() => paginate(currentPage + 1)}>
                <ChevronRight />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Modal for adding document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-lg p-4 bg-white rounded-lg shadow-lg">
            <button 
              onClick={closeModal} 
              className="absolute top-3 right-3 p-1 text-gray-600 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
            {/* Pass both onClose and userId */}
            {userId && <FileUploader onClose={closeModal} userId={userId} />}
          </div>
        </div>
      )}
    </div>
  )
}
