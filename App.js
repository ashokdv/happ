import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeView  from './Screens/HomeView';
import LoginView from './Screens/LoginView'

const Stack = createNativeStackNavigator();

export default function App() {
  return (  
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginPage" options={{headerShown: true}} component={LoginView} />
        <Stack.Screen name="HomePage" component={HomeView} />
      </Stack.Navigator>
    </NavigationContainer>    
 );
}

const styles = StyleSheet.create({

});
