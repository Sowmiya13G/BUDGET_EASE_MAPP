import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/helpers';
import {baseStyle, colors, sizes} from '../utils/theme';
import {authStateListener} from '../features/authService';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const unsubscribe = authStateListener(user => {
      setTimeout(() => {
        if (user) {
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
      }, 2000);
    });

    return () => unsubscribe();
  }, [navigation]);

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
