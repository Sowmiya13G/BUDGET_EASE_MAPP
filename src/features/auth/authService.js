import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { firebaseAuth, firebaseDatabase } from '../firebase.config';

export const loginUser = async (email, password) => {
  const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
  return userCredential.user;
};

export const registerUser = async (email, password) => {
  const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await firebaseAuth.signOut();
  await GoogleSignin.signOut();
};

export const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = firebaseAuth.GoogleAuthProvider.credential(idToken);
    const userCredential = await firebaseAuth.signInWithCredential(googleCredential);
    await firebaseDatabase.ref(`users/${userCredential.user.uid}`).set({
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
  }
};