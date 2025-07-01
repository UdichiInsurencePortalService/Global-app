import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-web';

export default function CarScreen() {
  const [text,setText] = useState('Enter Your Registration Number')
    const [number,setNumber] = useState('Enter Your Mobile Number')

  return (
    <SafeAreaProvider>
    <SafeAreaView>
    <View className="flex-1 items-center justify-center">
      <Text className="text-3xl font-bold text-red-600">
        This is car page
        <TextInput
         onChangeText={setText}
         value={text}
         autoCapitalize='characters'

        />

        <TextInput
         onChangeText={setNumber}
         value={number}
         keyboardType='numeric'

        />
      </Text>
    </View>
        </SafeAreaView>

    </SafeAreaProvider>
  );
}
