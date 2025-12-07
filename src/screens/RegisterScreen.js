import React, {useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {registerUser} from '../features/authService';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/helpers';
import {baseStyle, colors, sizes} from '../utils/theme';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegisterScreen = () => {
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

  const onRegister = async data => {
    setLoading(true);
    try {
      await registerUser(data.email, data.password, data.name);
      setLoading(false);
      Alert.alert('Registration Successful', 'You can now login', [
        {text: 'OK', onPress: () => navigation.replace('Login')},
      ]);
    } catch (error) {
      console.log('error: ', error);
      setLoading(false);
      Alert.alert(error.message || 'Registration Failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <Text
          style={[baseStyle.txtStyleOutPoppinBold(sizes.size5, colors.black)]}>
          Register
        </Text>
      </View>

      <View style={styles.formContainer}>
        {/* Name Field */}
        <View style={styles.inputGroup}>
          <Text
            style={[
              baseStyle.txtStyleOutPoppinMedium(sizes.size2, colors.black),
            ]}>
            Name
          </Text>
          <Controller
            control={control}
            name="name"
            render={({field: {value, onChange}}) => (
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor={colors.placeholder}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.name && (
            <Text
              style={[
                baseStyle.txtStyleOutPoppinRegular(sizes.size01, colors.red),
                {marginTop: heightPercentageToDP('0.5%')},
              ]}>
              {errors.name.message}
            </Text>
          )}
        </View>

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

        {/* Confirm Password Field */}
        <View style={styles.inputGroup}>
          <Text
            style={[
              baseStyle.txtStyleOutPoppinMedium(sizes.size2, colors.black),
            ]}>
            Confirm Password
          </Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({field: {value, onChange}}) => (
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text
              style={[
                baseStyle.txtStyleOutPoppinRegular(sizes.size01, colors.red),
                {marginTop: heightPercentageToDP('0.5%')},
              ]}>
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleSubmit(onRegister)}
          style={styles.registerButton}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text
              style={[
                baseStyle.txtStyleOutPoppinMedium(sizes.size2, colors.black),
              ]}>
              Register
            </Text>
          )}
        </TouchableOpacity>

        <Text
          style={[
            {textAlign: 'center', marginVertical: heightPercentageToDP('1%')},
            baseStyle.txtStyleOutPoppinMedium(sizes.size1, colors.black),
          ]}>
          Already have an account? Login
        </Text>

        <TouchableOpacity
          onPress={() => navigation.replace('Login')}
          style={styles.loginLink}>
          <Text
            style={[
              baseStyle.txtStyleOutPoppinMedium(sizes.size2, colors.primary),
            ]}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.primary},
  header: {alignItems: 'center', marginVertical: heightPercentageToDP('7%')},
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
  passwordInput: {flex: 1, paddingVertical: 16, fontSize: 14, color: '#000'},
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: widthPercentageToDP('30%'),
    paddingVertical: widthPercentageToDP('4%'),
    alignItems: 'center',
    marginVertical: heightPercentageToDP('3%'),
  },
  loginLink: {alignSelf: 'center', marginTop: heightPercentageToDP('1%')},
});

export default RegisterScreen;
