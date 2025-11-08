import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { handleLogin } from '../features/auth/authSlice';
import { heightPercentageToDP, widthPercentageToDP } from '../utils/helpers';
import { baseStyle, colors, sizes } from '../utils/theme';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = ({navigation}) => {
  const {loading} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onLogin = async data => {
    const result = await dispatch(handleLogin(data));
    if (result.meta.requestStatus === 'fulfilled') {
      navigation.replace('Home');
    } else {
      // show error from payload if available
      alert(result.payload || 'Login Failed');
    }
  };

  const onGoogleLogin = async () => {
    const result = await dispatch(handleGoogleLogin());
    if (result.meta.requestStatus === 'fulfilled') {
      navigation.replace('Home');
    } else {
      alert(result.payload || 'Google Sign-In failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <Text
          style={[baseStyle.txtStyleOutPoppinBold(sizes.size5, colors.black)]}>
          Welcome
        </Text>
      </View>

      <View style={styles.formContainer}>
        {/* Email Field */}
        <View style={styles.inputGroup}>
          <Text
            style={[
              baseStyle.txtStyleOutPoppinMedium(sizes.size2, colors.black),
            ]}>
            Email
          </Text>
          <Controller
            control={control}
            name="email"
            render={({field: {value, onChange}}) => (
              <TextInput
                style={styles.input}
                placeholder="example@example.com"
                placeholderTextColor={colors.placeholder}
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && (
            <Text
              style={[
                baseStyle.txtStyleOutPoppinRegular(sizes.size01, colors.red),
                {marginTop: heightPercentageToDP('0.5%')},
              ]}>
              {errors.email.message}
            </Text>
          )}
        </View>

        {/* Password Field */}
        <View style={styles.inputGroup}>
          <Text
            style={[
              baseStyle.txtStyleOutPoppinMedium(sizes.size2, colors.black),
            ]}>
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            render={({field: {value, onChange}}) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}>
                  <FontAwesome
                    name={!showPassword ? 'eye' : 'eye-off'}
                    size={widthPercentageToDP('5%')}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && (
            <Text
              style={[
                baseStyle.txtStyleOutPoppinRegular(sizes.size01, colors.red),
                {marginTop: heightPercentageToDP('0.5%')},
              ]}>
              {errors.password.message}
            </Text>
          )}
        </View>

        <TouchableOpacity>
          <Text
            style={[
              {textAlign: 'right', textDecorationLine: 'underline'},
              baseStyle.txtStyleOutPoppinMedium(sizes.size1, colors.black),
            ]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleSubmit(onLogin)}
          style={styles.loginButton}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text
              style={[
                baseStyle.txtStyleOutPoppinMedium(sizes.size2, colors.black),
              ]}>
              Log In
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton}>
          <Text
            style={[
              baseStyle.txtStyleOutPoppinMedium(sizes.size2, colors.black),
            ]}>
            Sign Up
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            {textAlign: 'center', marginVertical: heightPercentageToDP('1%')},
            baseStyle.txtStyleOutPoppinMedium(sizes.size1, colors.black),
          ]}>
          or sign up with your google account
        </Text>

        <TouchableOpacity style={styles.google} onPress={onGoogleLogin}>
          <FontAwesome name="google" size={widthPercentageToDP('5%')} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    alignItems: 'center',
    marginVertical: heightPercentageToDP('7%'),
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.cream_5F0,
    borderTopLeftRadius: widthPercentageToDP('10%'),
    borderTopRightRadius: widthPercentageToDP('10%'),
    paddingHorizontal: widthPercentageToDP('5%'),
    paddingTop: widthPercentageToDP('10%'),
  },
  inputGroup: {
    marginBottom: heightPercentageToDP('2%'),
    columnGap: widthPercentageToDP('3%'),
  },
  input: {
    backgroundColor: colors.cream_DE5,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 14,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream_DE5,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 14,
    color: '#000',
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: widthPercentageToDP('30%'),
    paddingVertical: widthPercentageToDP('4%'),
    alignItems: 'center',
    marginVertical: heightPercentageToDP('3%'),
  },
  signUpButton: {
    backgroundColor: colors.cream_DE5,
    borderRadius: widthPercentageToDP('30%'),
    paddingVertical: widthPercentageToDP('4%'),
    alignItems: 'center',
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: '3%',
  },
  google: {
    borderRadius: widthPercentageToDP('50%'),
    borderColor: colors.black,
    borderWidth: widthPercentageToDP('0.25%'),
    paddingVertical: widthPercentageToDP('3%'),
    paddingHorizontal: widthPercentageToDP('3.5%'),
    alignSelf: 'center',
  },
});

export default LoginScreen;
