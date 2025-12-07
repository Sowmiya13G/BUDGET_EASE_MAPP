import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { firebaseAuth, firebaseDatabase } from '../services/firebaseConfig';


let signInInProgress = false;

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  return userCredential.user;
};

/**
 * Registers a new user with email and password, and stores user info in Realtime Database
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @returns {Promise<object>} - Firebase User object
 */
export const registerUser = async (email, password, name) => {
  try {
    // Create user with email & password
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

    // Save user info in Realtime Database
    const userRef = ref(firebaseDatabase, `users/${userCredential.user.uid}`);
    await set(userRef, {
      name: name || userCredential.user.displayName || '',
      email: userCredential.user.email,
      uid: userCredential.user.uid,
      provider: 'email',
      createdAt: new Date().toISOString(),
    });

    return userCredential.user;
  } catch (error) {
    // Firebase-specific errors can be caught here
    console.error('Error registering user:', error);
    throw new Error(error.message || 'Registration Failed');
  }
};

export const logoutUser = async () => {
  await signOut(firebaseAuth);
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.log(error);
  }
};

export const googleSignInService = async () => {
  if (signInInProgress) return;
  signInInProgress = true;
  try {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    await GoogleSignin.signOut(); // force account picker
    const userInfo = await GoogleSignin.signIn();
    if (!userInfo?.idToken) throw new Error('No idToken returned from Google');

    const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
    const userCredential = await signInWithCredential(
      firebaseAuth,
      googleCredential,
    );

    const userRef = ref(firebaseDatabase, `users/${userCredential.user.uid}`);
    await set(userRef, {
      name: userCredential.user.displayName,
      email: userCredential.user.email,
      photoURL: userCredential.user.photoURL,
      uid: userCredential.user.uid,
      provider: 'google',
      createdAt: new Date().toISOString(),
    });

    return userCredential.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    signInInProgress = false;
  }
};

export const setPasswordForGoogleUser = async (user, newPassword) => {
  if (!user.email) throw new Error('No email found for this user');
  const credential = EmailAuthProvider.credential(user.email, newPassword);
  return linkWithCredential(user, credential);
};

export const authStateListener = callback =>
  onAuthStateChanged(firebaseAuth, callback);
export const getCurrentUser = () => firebaseAuth.currentUser;
