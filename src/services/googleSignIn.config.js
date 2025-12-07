import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = async () => {
  try {
    console.log('Configuring Google Signin...');

    GoogleSignin.configure({
      webClientId:
        '874627671403-teee0iu69h1nr44cr2q2mfnjs5ajccsr.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: false,
    });

    // Check if Google Play Services are available
    const hasPlayServices = await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    console.log(
      'Google Sign-In configured successfully. Play Services:',
      hasPlayServices,
    );
  } catch (error) {
    console.error('Error configuring Google Signin:', error);
  }
};
