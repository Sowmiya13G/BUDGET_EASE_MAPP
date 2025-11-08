import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '874627671403-teee0iu69h1nr44cr2q2mfnjs5ajccsr.apps.googleusercontent.com', // From Firebase Console
    offlineAccess: true,
  });
};