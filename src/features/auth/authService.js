import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {ref, set} from 'firebase/database';
import {firebaseAuth, firebaseDatabase} from '../../services/firebaseConfig';

// Login with Email & Password
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  return userCredential.user;
};

// Register with Email & Password
export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );

  // Store user data in Realtime Database
  await set(ref(firebaseDatabase, `users/${userCredential.user.uid}`), {
    email: userCredential.user.email,
    uid: userCredential.user.uid,
    provider: 'email',
    createdAt: new Date().toISOString(),
  });

  return userCredential.user;
};

// Logout
export const logoutUser = async () => {
  await signOut(firebaseAuth);
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.log('Google signout error:', error);
  }
};

let signInInProgress = false;

export const googleSignIn = async () => {
  if (signInInProgress) return;
  signInInProgress = true;

  try {
    console.log('Google Signin Config:', GoogleSignin._config);
    // await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // const {idToken} = await GoogleSignin.signIn();
    // console.log('idToken: ', idToken);
    // Try silent sign-in first
    const silentUser = await GoogleSignin.signInSilently().catch(e => {
      console.log('Silent sign-in error:', e);
      return null; // fallback to interactive sign-in
    });
    console.log('silentUser: ', silentUser);
    // if (!idToken) throw new Error('No idToken returned from Google Sign-In');

    // const googleCredential = GoogleAuthProvider.credential(idToken);
    // const userCredential = await signInWithCredential(
    //   firebaseAuth,
    //   googleCredential,
    // );

    // // Save user data
    // await set(ref(firebaseDatabase, `users/${userCredential.user.uid}`), {
    //   name: userCredential.user.displayName,
    //   email: userCredential.user.email,
    //   photoURL: userCredential.user.photoURL,
    //   uid: userCredential.user.uid,
    //   provider: 'google',
    //   createdAt: new Date().toISOString(),
    // });

    // return userCredential.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    signInInProgress = false;
  }
};

// Auth State Listener (for SplashScreen)
export const authStateListener = callback => {
  return onAuthStateChanged(firebaseAuth, callback);
};

// Get Current User
export const getCurrentUser = () => {
  return firebaseAuth.currentUser;
};
