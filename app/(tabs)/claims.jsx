import { StyleSheet, Text, View } from 'react-native';

const claims = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>this is my cliam page</Text>
    </View>
  );
}

export default claims;

const styles = StyleSheet.create({
  container: {
    flex: 1,                       // make full screen
    justifyContent: 'center',     // vertical center
    alignItems: 'center',         // horizontal center
    backgroundColor: '#f2f2f2',   // just for visibility
  },
  text: {
    fontSize: 30,
    color: 'black',
  },
});
