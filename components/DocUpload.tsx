import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadIcon, FileIcon, CheckCircleIcon } from 'lucide-react';
import { Client, Storage, Databases, Query, ID } from 'appwrite'; // Import Appwrite SDK
import { usePdfStore } from '@/stores/pdfStore'; // Import your Zustand store

// Initialize Appwrite
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Your Appwrite endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Your Appwrite project ID

const storage = new Storage(client);
const databases = new Databases(client);

const uploadFileToAppwrite = async (file: File): Promise<string> => {
  try {
    const response = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_FILES_ID!, // Bucket ID
      ID.unique(), // Unique ID for the file
      file
    );
    console.log('File uploaded to Appwrite:', response);
    return response.$id; // Return the document ID
  } catch (error) {
    console.error('Appwrite upload error:', error);
    throw error;
  }
};

const addDocumentToUser = async (userId: string, documentId: string) => {
  try {
    const userDocId = process.env.NEXT_PUBLIC_APPWRITE_USERDOC_ID!; // Collection ID

    // Check if the user already has a document association
    const userDocuments = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!, // Database ID
      userDocId, // Collection ID
      [Query.equal('userId', userId)]
    );

    if (userDocuments.documents.length > 0) {
      // If user already has a document association, append the new document ID
      const existingDoc = userDocuments.documents[0];
      const updatedDocumentIds = [...existingDoc.documentIds, documentId];

      // Update the document with the new document ID
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        userDocId,
        existingDoc.$id,
        { documentIds: updatedDocumentIds }
      );
    } else {
      // Create a new document association if it doesn't exist
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        userDocId,
        ID.unique(),
        {
          userId: userId,
          documentIds: [documentId]
        }
      );
    }
  } catch (error) {
    console.error('Error adding document to user:', error);
    throw error;
  }
};

// New function to send the document to the PDF parser
const parsePdf = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/pdf-parser', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to parse PDF');
  }

  const data = await response.json();
  return data.text; // Return the parsed text
};

export default function DocUpload({ onClose, userId }: { onClose: () => void; userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const setParsedText = usePdfStore((state) => state.setParsedText); // Get Zustand setter

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setUploadSuccess(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const documentId = await uploadFileToAppwrite(file);
      await addDocumentToUser(userId, documentId); // Associate the file with the user

      // Send the file to the PDF parser and store the parsed text in Zustand
      const parsedText = await parsePdf(file);
      setParsedText(parsedText); // Update Zustand store with parsed text

      setUploadSuccess(true);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

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
              <p className="mt-1 text-xs text-gray-500">Supported Format: English PDF</p>
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
            {isUploading ? 'Uploading...' : 'Upload File'}
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
  );
}
