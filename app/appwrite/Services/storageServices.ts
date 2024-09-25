import { buckets } from "../buckets";
import { storage, databases } from "../config";
import { ID, Models, Query } from "appwrite";
import { getCurrentUser } from "./authServices"; // Import the getCurrentUser function

type FilePayload = File | Blob;

interface StorageService {
  createFile: (file: FilePayload, id: string, userId: string) => Promise<Models.File>;
  deleteFile: (id: string) => Promise<Record<string, never>>;
  getFile: (id: string) => Promise<Models.File>;
  getFileDownload: (id: string) => Promise<string>;
  getFilePreview: (id: string) => Promise<string>;
  getFileView: (id: string) => Promise<string>;
  listFiles: (queries?: Query[]) => Promise<Models.FileList>;
}

// Define the structure of the user document
interface UserDocument extends Models.Document {
  userId: string;
  documentIds: string[];
}

// Utility to convert Blob to File
const blobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
  });
};

const storageServices: Record<string, StorageService> = {};

// Loop through the buckets to create the storage services
buckets.forEach((bucket) => {
  storageServices[bucket.name] = {
    createFile: async (file: FilePayload, id = ID.unique(), userId: string): Promise<Models.File> => {
      // If the file is a Blob, convert it to a File
      const fileToUpload = file instanceof File ? file : blobToFile(file, userId);
      return await storage.createFile(bucket.id, id, fileToUpload); // Create the file with proper File object
    },

    deleteFile: async (id: string): Promise<Record<string, never>> => {
      return await storage.deleteFile(bucket.id, id);
    },

    getFile: async (id: string): Promise<Models.File> => {
      return await storage.getFile(bucket.id, id);
    },

    getFileDownload: async (id: string): Promise<string> => {
      const fileUrl = await storage.getFileDownload(bucket.id, id);
      return fileUrl.toString(); // Convert URL to string
    },

    getFilePreview: async (id: string): Promise<string> => {
      const filePreviewUrl = await storage.getFilePreview(bucket.id, id);
      return filePreviewUrl.toString(); // Convert URL to string
    },

    getFileView: async (id: string): Promise<string> => {
      const fileViewUrl = await storage.getFileView(bucket.id, id);
      return fileViewUrl.toString(); // Convert URL to string
    },

    listFiles: async (queries?: Query[]): Promise<Models.FileList> => {
      try {
        // Get the current user's information
        const currentUser = await getCurrentUser();

        // Get the user's document collection ID from the environment variable
        const userDocId: string = process.env.NEXT_PUBLIC_APPWRITE_USERDOC_ID!;

        // Fetch all document IDs associated with the current user
        const userDocuments: Models.DocumentList<UserDocument> = await databases.listDocuments<UserDocument>(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!, // Database ID
          userDocId, // Collection ID
          [Query.equal('userId', currentUser.$id)] // Filter by current user's ID
        );

        // Extract document IDs from the userDocuments response
        const documentIds: string[] = userDocuments.documents.map((doc: UserDocument) => doc.$id);

        // Ensure that queries are properly mapped to strings
        const queryStrings: string[] = queries?.map(query => query.toString()) || [];

        // List all files in the Appwrite bucket
        const allFiles: Models.FileList = await storage.listFiles(
          process.env.NEXT_PUBLIC_APPWRITE_FILES_ID!, // Bucket ID
          queryStrings // Pass any additional queries
        );

        // Filter the files based on document IDs
        const userFiles: Models.File[] = allFiles.files.filter((file: Models.File) => documentIds.includes(file.$id));

        // Return the filtered files along with other file metadata
        return { ...allFiles, files: userFiles };

      } catch (error) {
        console.error("Error listing files:", error);
        throw error;
      }
    },
  };
});

export default storageServices;
