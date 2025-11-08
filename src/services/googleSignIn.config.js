import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      '874627671403-5h01c5cj4l2mtttsl4oom0sjlelvjkpr.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: false,
  });
};
