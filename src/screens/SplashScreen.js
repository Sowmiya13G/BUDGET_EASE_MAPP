import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { widthPercentageToDP } from '../utils/helpers';
import { baseStyle, colors, sizes } from '../utils/theme';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // navigation.replace("Dashboard");
      } else {
        setTimeout(() => {
          navigation.replace('Login');
        }, 3000);
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../assets/images/logo_black.png')}
          style={styles.logo}
        />
        <Text
          style={[
            baseStyle.txtStyleOutPoppinBold(sizes.size6, colors.white),
            styles.textAlign,
          ]}>
          Budget Ease
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: widthPercentageToDP('35%'),
    width: widthPercentageToDP('35%'),
    resizeMode: 'contain',
    marginBottom: widthPercentageToDP('5%'),
  },
  textAlign: {textAlign: 'center'},
});
export default SplashScreen;
