import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function Splash() {
  const router = useRouter();
  const scale = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      router.replace('(tabs)');
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/splash.png')}
        style={[styles.logo, { transform: [{ scale }] }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(52, 152, 219)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 190,
    height: 180,
    marginBottom: 20,
  },
 
});
