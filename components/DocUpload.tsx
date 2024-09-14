import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadIcon, FileIcon, CheckCircleIcon } from 'lucide-react'
import { Client, Storage } from 'appwrite' // Import Appwrite SDK

// Initialize Appwrite
const client = new Client()
  .setEndpoint('YOUR_APPWRITE_ENDPOINT') // Replace with your Appwrite endpoint
  .setProject('YOUR_PROJECT_ID') // Replace with your project ID

const storage = new Storage(client)

// Function to upload a file to Appwrite bucket
const uploadFileToAppwrite = async (file: File): Promise<void> => {
  try {
    const response = await storage.createFile('YOUR_BUCKET_ID', 'unique()', file)
    console.log('File uploaded to Appwrite:', response)
  } catch (error) {
    console.error('Appwrite upload error:', error)
    throw error
  }
}

export default function DocUpload({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    setUploadSuccess(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    try {
      await uploadFileToAppwrite(file)
      setUploadSuccess(true)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
          X
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700">
              Upload Document
            </Label>
            <div
              {...getRootProps()}
              className={`p-4 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <Input {...getInputProps()} id="file-upload" className="sr-only" />
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Drag & drop a file here, or click to select</p>
              <p className="mt-1 text-xs text-gray-500">Supported formats: PDF, DOC, DOCX</p>
            </div>
          </div>

          {file && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FileIcon className="h-5 w-5" />
              <span>{file.name}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={!file || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload to Database'}
          </Button>

          {uploadSuccess && (
            <div className="flex items-center justify-center text-green-500">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span>Upload successful!</span>
            </div>
          )}
        </form>
      </Card>
    </div>
  )
}
