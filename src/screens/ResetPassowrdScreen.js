import React, {useState} from 'react';
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
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {sendPasswordResetEmail} from 'firebase/auth';
import {firebaseAuth} from '../services/firebaseConfig';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/helpers';
import {baseStyle, colors, sizes} from '../utils/theme';
import {useNavigation} from '@react-navigation/native';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onResetPassword = async data => {
      console.log("onResetPassword",data);
      Alert.alert("clk")
    setLoading(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, data.email);
      setLoading(false);
      Alert.alert(
        'Success',
        'Password reset link has been sent to your email. Please check your inbox.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      setLoading(false);
      let errorMessage = 'Failed to send reset email';

      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      }

      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <Text
          style={[baseStyle.txtStyleOutPoppinBold(sizes.size5, colors.black)]}>
          Forgot Password
        </Text>
        <Text
          style={[
            baseStyle.txtStyleOutPoppinMedium(sizes.size2, colors.black),
            {marginTop: heightPercentageToDP('1%'), textAlign: 'center'},
          ]}>
          Enter your email to receive a password reset link
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
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
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

        {/* Reset Button */}
        <TouchableOpacity
          onPress={handleSubmit(onResetPassword)}
          style={styles.resetButton}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text
              style={[
                baseStyle.txtStyleOutPoppinMedium(sizes.size2, colors.black),
              ]}>
              Send Reset Link
            </Text>
          )}
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text
            style={[
              baseStyle.txtStyleOutPoppinMedium(sizes.size2, colors.primary),
            ]}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.primary},
  header: {
    alignItems: 'center',
    marginVertical: heightPercentageToDP('7%'),
    paddingHorizontal: widthPercentageToDP('5%'),
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.cream_5F0,
    borderTopLeftRadius: widthPercentageToDP('10%'),
    borderTopRightRadius: widthPercentageToDP('10%'),
    paddingHorizontal: widthPercentageToDP('5%'),
    paddingTop: widthPercentageToDP('10%'),
  },
  inputGroup: {marginBottom: heightPercentageToDP('2%')},
  input: {
    backgroundColor: colors.cream_DE5,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 14,
    color: '#000',
  },
  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: widthPercentageToDP('30%'),
    paddingVertical: widthPercentageToDP('4%'),
    alignItems: 'center',
    marginVertical: heightPercentageToDP('3%'),
  },
  backButton: {
    alignSelf: 'center',
    marginTop: heightPercentageToDP('2%'),
  },
});

export default ResetPasswordScreen;
