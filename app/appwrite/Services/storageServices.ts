import { buckets } from "../buckets";
import { storage } from "../config";
import { ID, Models, Query } from "appwrite";

type FilePayload = File | Blob;

interface StorageService {
  createFile: (file: FilePayload, id: string,userId: string) => Promise<Models.File>;
  deleteFile: (id: string) => Promise<Record<string, never>>;
  getFile: (id: string) => Promise<Models.File>;
  getFileDownload: (id: string) => Promise<string>;
  getFilePreview: (id: string) => Promise<string>;
  getFileView: (id: string) => Promise<string>;
  listFiles: (queries?: Query[]) => Promise<Models.FileList>;
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
    createFile: async (file: FilePayload, id = ID.unique(), userId: string) => {
      // If the file is a Blob, convert it to a File
      const fileToUpload = file instanceof File ? file : blobToFile(file, userId);
      return await storage.createFile(bucket.id, id, fileToUpload); // Create the file with proper File object
    },

    deleteFile: async (id) => await storage.deleteFile(bucket.id, id),

    getFile: async (id) => await storage.getFile(bucket.id, id),

    getFileDownload: async (id) => {
      const fileUrl = await storage.getFileDownload(bucket.id, id);
      return fileUrl.toString(); // Convert URL to string
    },

    getFilePreview: async (id) => {
      const filePreviewUrl = await storage.getFilePreview(bucket.id, id);
      return filePreviewUrl.toString(); // Convert URL to string
    },

    getFileView: async (id) => {
      const fileViewUrl = await storage.getFileView(bucket.id, id);
      return fileViewUrl.toString(); // Convert URL to string
    },

    listFiles: async (queries) => {
      const queryStrings = queries?.map(query => query.toString());
      return await storage.listFiles(bucket.id, queryStrings);
    },

    // Update only metadata (not the file content)
    
  };
});

export default storageServices;
