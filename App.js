import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeView  from './Screens/HomeView';
import LoginView from './Screens/LoginView';
import RegisterView from './Screens/RegisterView';
import ForgotPassword from './Screens/ForgotPassword';
import SplashScreen  from './Screens/SplashScreen.js';
import { useState, useEffect } from 'react';

const Stack = createNativeStackNavigator();

export default function App() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); 
  }, []);


  return (  

    <View style={{ flex: 1 }}>
    {isLoading ? (
      <SplashScreen />
    ) : (
        <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{headerShown: true, headerTitleAlign:'center'}} component={LoginView} />
          <Stack.Screen name="Happ" component={HomeView} options={{headerTitleAlign:'center'}}/>
          <Stack.Screen name="Register" component={RegisterView} options={{headerTitleAlign:'center'}}/>
          <Stack.Screen name="Reset Password" component={ForgotPassword} options={{headerTitleAlign:'center'}}/>
        </Stack.Navigator>
      </NavigationContainer> 
    )}
  </View>   
 );
}

const styles = StyleSheet.create({

});
