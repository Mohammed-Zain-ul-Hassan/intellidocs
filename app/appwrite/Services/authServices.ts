import { account } from "../config";
import { OAuthProvider } from "appwrite"; // Import the OAuthProvider from Appwrite
import { ID } from "appwrite";

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
    throw error; // Rethrow the error for the caller to handle
  }
}

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<Session> => {
  try {
    const session = await account.createSession(email, password);
    localStorage.setItem("authToken", session.$id); // Store session ID
    return session;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Rethrow error for the caller to handle
  }
};

// Google OAuth Sign-in
export const signInWithGoogle = async (): Promise<void> => {
  try {
    // Redirect to dashboard after successful sign-in, or to a specific auth page if it fails
    await account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/dashboard`, // Success redirect URL
      `${window.location.origin}/sign-in` // Failure redirect URL
    );
  } catch (error) {
    console.error("Google Sign-in error:", error);
    throw error; // Rethrow error for the caller to handle
  }
};

// Sign out the current user
export const signOutUser = async (): Promise<void> => {
  try {
    await account.deleteSession("current");
    localStorage.removeItem("authToken");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error; // Rethrow error for the caller to handle
  }
};

// Get the current authenticated user
export const getCurrentUser = async (): Promise<User> => {
  try {
    const user = await account.get(); // Fetch current user's data
    return user;
  } catch (error) {
    console.error("Get user error:", error);
    throw error; // Rethrow error for the caller to handle
  }
};

// Check if the user is authenticated
export const checkAuth = async (): Promise<boolean> => {
  try {
    await account.get(); // If this succeeds, user is authenticated
    return true;
  } catch (error) {
    console.warn("User not authenticated:", error); // Log warning instead of an error
    return false; // If it fails, return false
  }
};

// Send password recovery email
export const sendPasswordRecoveryEmail = async (email: string): Promise<void> => {
  const resetPasswordUrl = `${window.location.origin}/reset-password`; // URL for password reset
  try {
    await account.createRecovery(email, resetPasswordUrl);
  } catch (error) {
    console.error("Password recovery error:", error);
    throw error; // Rethrow error for the caller to handle
  }
};
