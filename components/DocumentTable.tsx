'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, Search, PlusCircle, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Helper function to generate random file size
const getRandomSize = () => {
  const sizes = ['KB', 'MB']
  const size = Math.floor(Math.random() * 1000) + 1
  const unit = sizes[Math.floor(Math.random() * sizes.length)]
  return `${size} ${unit}`
}

const initialDocuments = [
  { id: 1, name: "Project Proposal", format: "PDF", uploadTime: "2023-06-01T09:30:00Z", size: getRandomSize() },
  { id: 2, name: "Financial Report", format: "XLSX", uploadTime: "2023-06-02T14:45:00Z", size: getRandomSize() },
  { id: 3, name: "Meeting Minutes", format: "DOCX", uploadTime: "2023-06-03T11:15:00Z", size: getRandomSize() },
  { id: 4, name: "Product Roadmap", format: "PNG", uploadTime: "2023-06-04T16:20:00Z", size: getRandomSize() },
  { id: 5, name: "User Research", format: "PDF", uploadTime: "2023-06-05T10:00:00Z", size: getRandomSize() },
  { id: 6, name: "Marketing Plan", format: "PPTX", uploadTime: "2023-06-06T13:30:00Z", size: getRandomSize() },
  { id: 7, name: "Budget Forecast", format: "XLSX", uploadTime: "2023-06-07T15:45:00Z", size: getRandomSize() },
  { id: 8, name: "Design Mockups", format: "AI", uploadTime: "2023-06-08T12:00:00Z", size: getRandomSize() },
  { id: 9, name: "Code Review", format: "TXT", uploadTime: "2023-06-09T17:30:00Z", size: getRandomSize() },
  { id: 10, name: "Client Presentation", format: "PPTX", uploadTime: "2023-06-10T09:15:00Z", size: getRandomSize() },
]

export default function DocumentCards() {
  const [documents, setDocuments] = useState(initialDocuments)
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const documentsPerPage = 15 // Change to 12 if needed

  const handleSort = (key: 'name' | 'format' | 'uploadTime' | 'size') => {
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
    console.log("Add new document")
  }

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {currentDocuments.map((doc) => (
          <Card key={doc.id} className="flex flex-col bg-gray-100 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex-grow p-4">
              <div className="flex justify-center mb-2">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <CardTitle className="text-center text-sm truncate">{doc.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <p className="text-xs text-gray-500 text-center">{doc.format} • {doc.size}</p>
            </CardContent>
            <CardFooter className="text-xs text-gray-400 justify-center p-2">
              {formatDate(doc.uploadTime)}
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Button 
          variant="outline" 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="mx-4 self-center">
          Page {currentPage} of {totalPages}
        </span>
        <Button 
          variant="outline" 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="ml-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
