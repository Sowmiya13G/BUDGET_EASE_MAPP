import {yupResolver} from '@hookform/resolvers/yup';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import * as yup from 'yup';
import {handleGoogleLogin, handleLogin} from '../features/auth/authSlice';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/helpers';
import {baseStyle, colors, sizes} from '../utils/theme';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {clearError} from '../features/auth/authSlice';

const LoginScreen = ({}) => {
  const {user, error} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert(error);
      dispatch(clearError());
    }
  }, [error]);

  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onLogin = async data => {
    setLoading(true);
    const result = await dispatch(handleLogin(data));
    if (result.meta.requestStatus === 'fulfilled') {
      setLoading(false);
      navigation.replace('Home');
    } else {
      setLoading(false);

      Alert.alert(result.payload || 'Login Failed');
    }
  };

  const onGoogleLogin = async () => {
    try {
      const result = await dispatch(handleGoogleLogin());
      if (result.meta.requestStatus === 'fulfilled') {
        navigation.replace('Home');
      } else {
        Alert.alert(result.payload || 'Google Login Failed');
      }
    } catch (err) {
      console.error(err);
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
                    name={!showPassword ? 'eye' : 'eye-slash'}
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
        <TouchableOpacity
          onPress={handleSubmit(onLogin)}
          style={styles.loginButton}
          disabled={loading}>
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
        <Text
          style={[
            {textAlign: 'center', marginVertical: heightPercentageToDP('1%')},
            baseStyle.txtStyleOutPoppinMedium(sizes.size1, colors.black),
          ]}>
          or sign in with your google account
        </Text>

        <TouchableOpacity
          style={styles.google}
          onPress={onGoogleLogin}
          disabled={loading}>
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
