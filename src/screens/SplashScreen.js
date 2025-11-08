// import { onAuthStateChanged } from 'firebase/auth';
// import React, { useEffect } from 'react';
// import { Image, StyleSheet, Text, View } from 'react-native';
// import { auth } from '../services/firebaseConfig';
// import { widthPercentageToDP } from '../utils/helpers';
// import { baseStyle, colors, sizes } from '../utils/theme';

// const SplashScreen = ({navigation}) => {
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, user => {
//       if (user) {
//         // navigation.replace("Dashboard");
//       } else {
//         setTimeout(() => {
//           navigation.replace('Login');
//         }, 3000);
//       }
//     });
//     return unsubscribe;
//   }, [navigation]);

//   return (
//     <View style={styles.container}>
//       <View
//         style={{
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//         <Image
//           source={require('../assets/images/logo_black.png')}
//           style={styles.logo}
//         />
//         <Text
//           style={[
//             baseStyle.txtStyleOutPoppinBold(sizes.size6, colors.white),
//             styles.textAlign,
//           ]}>
//           Budget Ease
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logo: {
//     height: widthPercentageToDP('35%'),
//     width: widthPercentageToDP('35%'),
//     resizeMode: 'contain',
//     marginBottom: widthPercentageToDP('5%'),
//   },
//   textAlign: {textAlign: 'center'},
// });
// export default SplashScreen;

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
    // Listen to auth state changes
    const unsubscribe = authStateListener((user) => {
      if (user) {
        // User is signed in
        dispatch(setUser(user));
        setTimeout(() => {
          navigation.replace('Home');
        }, 2000);
      } else {
        // User is signed out
        dispatch(setUser(null));
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
      }
    });

    // Cleanup subscription on unmount
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