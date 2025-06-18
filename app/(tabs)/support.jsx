import { StyleSheet, Text, View } from 'react-native';

const Support = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is my support page</Text>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',   // vertical center
    alignItems: 'center',       // horizontal center
    backgroundColor: '#f2f2f2', // optional background for visibility
  },
  text: {
    fontSize: 24,
    color: 'black',
  },
});
