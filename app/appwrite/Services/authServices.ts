import { account } from "../config";
import { OAuthProvider } from "appwrite";
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
