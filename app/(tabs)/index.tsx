
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
// Or just use View if SafeAreaView is not installed
import Home from '../../components/Home/home';



const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgb(245, 250, 255)" }}>
      <Home />

    </SafeAreaView>
  );
};

export default Index;
