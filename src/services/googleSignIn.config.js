import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  console.log('Configuring Google Signin...'); // for debug

  GoogleSignin.configure({
    webClientId:
      '874627671403-teee0iu69h1nr44cr2q2mfnjs5ajccsr.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: false,
  });
  console.log('GoogleSignin configured:', GoogleSignin._config);

};
