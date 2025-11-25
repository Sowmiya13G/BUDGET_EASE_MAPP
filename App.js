import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/app/store';
import AddExpenseForm from './src/screens/AddExpenseForm';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';
import { configureGoogleSignIn } from './src/services/googleSignIn.config';

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
          <Stack.Screen name="Home" component={DashboardScreen} />
          <Stack.Screen name="AddExpenseForm" component={AddExpenseForm} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
