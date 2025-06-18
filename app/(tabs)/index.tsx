import { Text, View } from 'react-native';
import '../../global.css';

export default function HomeScreen() {
  return (
    <View>
      <Text className='text-7xl text-red-400'>this is home page</Text>
    </View>
  );
}

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });
