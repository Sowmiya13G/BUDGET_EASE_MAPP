import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {configureGoogleSignIn} from './src/services/googleSignIn.config';
import store from './src/app/store';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '874627671403-teee0iu69h1nr44cr2q2mfnjs5ajccsr.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: false,
    });
    console.log(
      'Google Signin config after configure():',
      GoogleSignin.config,
    );
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
