import { auth } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { apiService } from "./api";

class FirebaseAuthService {
  private provider = new GoogleAuthProvider();

  // Initialize Firebase and notifications
  initialize() {
    // Any additional Firebase setup can go here
    this.registerForPushNotifications();
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

  // Google Sign In
  async signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      // Note: signInWithPopup is for web; for mobile, use signInWithRedirect or native Google Sign-In
      // This is a placeholder; for mobile, integrate with expo-auth-session or similar
      await signInWithPopup(auth, this.provider);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    await auth.signOut();
  }

  // Register for push notifications
  private async registerForPushNotifications() {
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
