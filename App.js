import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeView  from './Screens/HomeView';
import LoginView from './Screens/LoginView';
import RegisterView from './Screens/RegisterView';
import ForgotPassword from './Screens/ForgotPassword';

const Stack = createNativeStackNavigator();

export default function App() {
  return (  
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{headerShown: true, headerTitleAlign:'center'}} component={LoginView} />
        <Stack.Screen name="Happ" component={HomeView} options={{headerShown: false, headerTitleAlign:'center'}}/>
        <Stack.Screen name="Register" component={RegisterView} options={{headerShown: false, headerTitleAlign:'center'}}/>
        <Stack.Screen name="Reset Password" component={ForgotPassword} options={{headerShown: false, headerTitleAlign:'center'}}/>
      </Stack.Navigator>
    </NavigationContainer>    
 );
}

const styles = StyleSheet.create({

});
