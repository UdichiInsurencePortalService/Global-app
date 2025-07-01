import { StyleSheet, Text, View } from 'react-native';

export default function homeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>home Insurance Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'white' },
  title: { fontSize: 24, fontWeight: 'bold' },
});
