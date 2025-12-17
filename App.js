import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddExpenseForm from './src/screens/AddExpenseForm';
import DashboardScreen from './src/screens/DashboardScreen';
import { default as ForgotPasswordScreen, default as ResetPasswordScreen } from './src/screens/ForgotPasswordScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';
import AddIncomeScreen from './src/screens/AddIncomeScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={DashboardScreen} />
        <Stack.Screen name="AddExpenseForm" component={AddExpenseForm} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="AddIncomeScreen" component={AddIncomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
