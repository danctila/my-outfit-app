import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from './firebase';

// Save or update user preferences
export const saveUserPreferences = async (userId, preferences) => {
    try {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        // Document exists, update it
        await setDoc(userRef, {
          ...preferences,
          updatedAt: serverTimestamp(), // Always update on preference change
        }, { merge: true });
      } else {
        // Document doesn't exist, create it
        await setDoc(userRef, {
          ...preferences,
          createdAt: serverTimestamp(), // Set on document creation
          updatedAt: serverTimestamp(), // Set on document creation
        });
      }
      console.log('User preferences saved successfully.');
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };

// Load user preferences
export const loadUserPreferences = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error loading user preferences:', error);
  }
};
