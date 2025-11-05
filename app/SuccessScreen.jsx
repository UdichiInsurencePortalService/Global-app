import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SuccessScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={successStyles.container}>
      <View style={successStyles.content}>
        <Ionicons name="checkmark-circle" size={100} color="#28a745" />
        <Text style={successStyles.title}>Payment Successful!</Text>
        <Text style={successStyles.message}>
          Your vehicle insurance premium has been paid successfully. 
          You will receive a confirmation email shortly.
        </Text>
        <TouchableOpacity 
          style={successStyles.button}
          onPress={() => router.push('../app/(tabs)/index')} // Navigate to home
        >
          <Text style={successStyles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const successStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 20,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#28a745',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export { SuccessScreen };

