import { yupResolver } from '@hookform/resolvers/yup';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';
import { firebaseAuth } from '../services/firebaseConfig';
import { heightPercentageToDP, widthPercentageToDP } from '../utils/helpers';
import { baseStyle, colors, sizes } from '../utils/theme';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPasswordScreen = () => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onResetPassword = async data => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, data.email);
      setLoading(false);
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email to reset your password.',
      );
    } catch (error) {
      setLoading(false);
      Alert.alert(error.message || 'Failed to send reset email');
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
            {marginTop: heightPercentageToDP('1%')},
          ]}>
          Enter your email to reset your password
        </Text>
      </View>

      <View style={styles.formContainer}>
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
              Send Reset Email
            </Text>
          )}
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
  },
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
});

export default ForgotPasswordScreen;
