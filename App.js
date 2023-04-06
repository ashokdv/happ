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
        <Stack.Screen name="LoginPage" options={{headerShown: true}} component={LoginView} />
        <Stack.Screen name="HomePage" component={HomeView} />
        <Stack.Screen name="RegisterPage" component={RegisterView} />
        <Stack.Screen name="ResetPasswordPage" component={ForgotPassword} />

      </Stack.Navigator>
    </NavigationContainer>    
 );
}

const styles = StyleSheet.create({

});
