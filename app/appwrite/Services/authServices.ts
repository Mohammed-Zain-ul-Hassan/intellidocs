/* eslint-disable @typescript-eslint/no-explicit-any */
import { OAuthProvider } from "appwrite";
import { ID } from "appwrite";
import { account, filesBucket, profileBucket, storage } from "../config";

// Define User and Session types based on Appwrite's API response
interface User {
  $id: string;
  name: string;
  email: string;
  // Add more properties as per Appwrite's user model if needed
}

interface Session {
  $id: string;
  userId: string;
  // Add more session properties if needed
}

// Register user with email and password
export async function registerUser(username: string, email: string, password: string): Promise<User> {
  try {
    const user = await account.create<ID>(ID.unique(), email, password, username);
    localStorage.setItem("authToken", user.$id);
    console.log(user);
    return user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<Session> => {
  try {
    const session = await account.createSession(email, password);
    localStorage.setItem("authToken", session.$id);
    return session;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Google OAuth Sign-in
export const signInWithGoogle = async (): Promise<void> => {
  try {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/dashboard`,
      `${window.location.origin}/sign-in`
    );
    
    // Create a session object (customize the contents as necessary)
    const sessionData = {
      provider: 'Google',
      isAuthenticated: true,
      timestamp: new Date().toISOString(),
    };

    // Store session data in local storage
    localStorage.setItem('session', JSON.stringify(sessionData));

  } catch (error) {
    console.error("Google Sign-in error:", error);
    throw error;
  }
};

// GitHub OAuth Sign-in
export const signInWithGitHub = async (): Promise<void> => {
  try {
    await account.createOAuth2Session(
      OAuthProvider.Github,
      `${window.location.origin}/dashboard`,
      `${window.location.origin}/sign-in`
    );

    // Create a session object (customize the contents as necessary)
    const sessionData = {
      provider: 'GitHub',
      isAuthenticated: true,
      timestamp: new Date().toISOString(),
    };

    // Store session data in local storage
    localStorage.setItem('session', JSON.stringify(sessionData));

  } catch (error) {
    console.error("GitHub Sign-in error:", error);
    throw error;
  }
};


// Sign out the current user
export const signOutUser = async (): Promise<void> => {
  try {
    await account.deleteSession("current");
    localStorage.removeItem("authToken");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// Get the current authenticated user
export const getCurrentUser = async (): Promise<User> => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};

// Check if the user is authenticated
export const checkAuth = async (): Promise<boolean> => {
  try {
    await account.get();
    return true;
  } catch (error) {
    console.warn("User not authenticated:", error);
    return false;
  }
};

// Send password recovery email
export const sendPasswordRecoveryEmail = async (email: string): Promise<void> => {
  const resetPasswordUrl = `${window.location.origin}/reset-password`;
  try {
    await account.createRecovery(email, resetPasswordUrl);
  } catch (error) {
    console.error("Password recovery error:", error);
    throw error;
  }
};

// Reset password with userId, secret, and new password
export const resetPassword = async (userId: string, secret: string, newPassword: string): Promise<void> => {
  try {
    await account.updateRecovery(userId, secret, newPassword);
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

// In authServices.ts

export const updateUserProfile = async (
  name: string,
  email: string,
  currentPassword: string, // Include current password for email update
  profilePicture: File | null
): Promise<void> => {
  try {
    // Update user name
    await account.updateName(name);

    // Update user email
    await account.updateEmail(email, currentPassword); // Pass the current password

    // If a profile picture is provided
    if (profilePicture) {
      const fileId = ID.unique(); // Generate a unique ID for the file

      console.log(profileBucket, fileId, profilePicture);
      // Upload profile picture to Appwrite's storage
      const uploadedFile = await storage.createFile(
        profileBucket, // Replace with your Appwrite bucket ID
        fileId,           // Unique file ID
        profilePicture    // File to be uploaded
      );

      // Get the file URL for displaying
      const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PROFILE_ID}/files/${uploadedFile.$id}/view`;

      // Save the file URL to user preferences or a database
      console.log("Uploaded Profile Picture URL:", fileUrl);
      // Perform additional actions as needed (e.g., updating a user profile in a database)
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Uploading a file to the profile bucket
export const uploadProfilePicture = async (file: File): Promise<void> => {
  try {
    const fileId = ID.unique(); // Generate a unique ID for the file

    // Attempt to upload the file
    await uploadWithRetry(profileBucket, fileId, file);

    console.log('Profile picture uploaded successfully.');
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// Function to handle retry logic
const uploadWithRetry = async (bucketId: string, fileId: string, file: File) => {
  try {
    // Try to upload the file
    await storage.createFile(bucketId, fileId, file);
  } catch (error: any) {
    // If an error occurs and it's due to the same fileId, regenerate a new one and retry
    if (error.message.includes('A target with the same ID already exists')) {
      console.warn(`File ID ${fileId} already exists. Generating a new ID and retrying...`);
      const newFileId = `${ID.unique()}-${Date.now()}`; // Generate a new ID
      await storage.createFile(bucketId, newFileId, file); // Retry with the new ID
    } else {
      // Rethrow other errors
      throw error;
    }
  }
};


// Uploading a file to the files bucket
export const uploadPDF = async (file: File): Promise<void> => {
  try {
    const fileId = ID.unique(); // Generate a unique ID for the file
    await storage.createFile(
      filesBucket, // Use the files bucket ID
      fileId,
      file
    );
    console.log('PDF uploaded successfully.');
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};
