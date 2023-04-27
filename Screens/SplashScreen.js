// SplashScreen.js

import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../images/happiness.png')} // Replace with your logo image path
        style={styles.logo}
      />
      <View style={{marginTop: 20}}>
        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>  Welcome to Happ </Text>
        <Text style={{textAlign: 'center', fontSize: 15, fontWeight: 'bold'}}> Measure your Emotions through our App </Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Replace with your desired background color
  },
  logo: {
    width: 200, // Adjust the width and height according to your logo's size
    height: 200,
  },
});

export default SplashScreen;
