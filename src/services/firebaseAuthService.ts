import { auth } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  // signInWithPopup, // Removed for mobile
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { apiService } from "./api";

class FirebaseAuthService {
  private provider = new GoogleAuthProvider();

  // Initialize Firebase and notifications
  async initialize() {
    console.log("Initializing Firebase Auth Service...");
    try {
      await this.registerForPushNotifications();
      console.log("Firebase Auth Service initialized successfully");
    } catch (error) {
      console.error("Firebase Auth initialization failed:", error);
      throw error; // Propagate error for upper-level handling
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Email/Password Sign Up
  async signUpWithEmail(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Email/Password Sign In
  async signInWithEmail(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Google Sign In (Placeholder for mobile - use expo-auth-session)
  async signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      console.warn("Google Sign-In not implemented for mobile yet");
      return {
        success: false,
        error: "Google Sign-In not supported in this build",
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    await auth.signOut();
  }

  // Register for push notifications with error handling
  private async registerForPushNotifications() {
    console.log("Registering for push notifications...");
    if (!Notifications || !Notifications.getExpoPushTokenAsync) {
      console.warn("Notifications API not available");
      return;
    }

    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permissions not granted");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Push token acquired:", token);
      const user = this.getCurrentUser();
      if (user) {
        await apiService.updateUserProfile(user.uid, { pushToken: token });
      }
    } catch (error) {
      console.error("Error registering for push notifications:", error);
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
