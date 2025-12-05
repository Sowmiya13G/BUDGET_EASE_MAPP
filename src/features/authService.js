import {
  EmailAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import {ref, set} from 'firebase/database';
import {firebaseAuth, firebaseDatabase} from '../../services/firebaseConfig';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

let signInInProgress = false;

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  return userCredential.user;
};

export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  await set(ref(firebaseDatabase, `users/${userCredential.user.uid}`), {
    email: userCredential.user.email,
    uid: userCredential.user.uid,
    provider: 'email',
    createdAt: new Date().toISOString(),
  });
  return userCredential.user;
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
