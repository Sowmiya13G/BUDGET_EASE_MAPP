import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './src/app/store';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';
import {configureGoogleSignIn} from './src/services/googleSignIn.config';
import DashboardScreen from './src/screens/DashboardScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    configureGoogleSignIn();
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
          <Stack.Screen name="Home" component={DashboardScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
