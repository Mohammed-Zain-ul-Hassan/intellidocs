import { Client, Account, Databases, Storage } from "appwrite";

const Endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';



const client = new Client();

client
  .setEndpoint(Endpoint) // Your Appwrite Endpoint
  .setProject(projectID); // Your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { databaseId,projectID };