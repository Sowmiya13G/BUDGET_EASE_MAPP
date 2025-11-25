import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import { heightPercentageToDP, widthPercentageToDP } from '../utils/helpers';
import { baseStyle, colors, sizes } from '../utils/theme';
import { authStateListener } from '../features/auth/authService';

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = authStateListener(user => {
      if (user) {
        // 🔹 Extract only serializable user data
        const sanitizedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        };

        dispatch(setUser(sanitizedUser));

        setTimeout(() => {
          navigation.replace('Home');
        }, 2000);
      } else {
        dispatch(setUser(null));
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <View style={styles.content}>
        <Text
          style={[
            baseStyle.txtStyleOutPoppinBold(sizes.size7, colors.black),
            styles.title,
          ]}>
          Budget Ease
        </Text>
        <Text
          style={[
            baseStyle.txtStyleOutPoppinRegular(sizes.size2, colors.black),
            styles.subtitle,
          ]}>
          Manage Your Money Smartly
        </Text>
        <ActivityIndicator
          size="large"
          color={colors.black}
          style={styles.loader}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: widthPercentageToDP('5%'),
  },
  title: {
    textAlign: 'center',
    marginBottom: heightPercentageToDP('2%'),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: heightPercentageToDP('5%'),
  },
  loader: {
    marginTop: heightPercentageToDP('3%'),
  },
});

export default SplashScreen;
