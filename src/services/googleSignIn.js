import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth, db } from '../firebase'; // your firebase config file
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { ref, set } from 'firebase/database';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // from Firebase console
});
