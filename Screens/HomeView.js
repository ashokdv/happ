import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import {useNavigation} from '@react-navigation/core';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { auth, signOut } from '../firebase';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { inline } from 'react-native-web/dist/cjs/exports/StyleSheet/compiler';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.text}> Home Page </Text>
      {/* <Button
        onPress={() => navigation.navigate('Home')}
        title="Home Page"
      /> */}
      <Text> Out 1</Text>
      <Text> Out 2</Text>
      <Text> Out 3</Text>
      <Text> Out 4</Text>
    </View>
  );
}




function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.text}> Notifications Page </Text>
      <TextInput
        style={styles.input}
      />    
    </View>
  );
}



function LogoutScreen({ navigation }) {
  
  const navigat = useNavigation();
  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("----Auth", auth);
      navigat.replace("LoginPage")
    }).catch(error => alert(error.message));
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text> Email: {auth.currentUser.email} </Text>
      <Button onPress={handleSignOut} title="Click to Logout" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigat = useNavigation();
  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("----Auth", auth);
      navigat.replace("LoginPage")
    }).catch(error => alert(error.message));
  }
  return (
  <>
  <DrawerContentScrollView {...props}>
    <View style={{flex:1}}>
      <DrawerItemList {...props} />
    </View>
  </DrawerContentScrollView>
    <View style = {styles.logoutButton}>
      <Button title='LogOut' onPress={handleSignOut} ></Button>
    </View>
  </> ); 
}

const HomeView = () => {

  // <NavigationContainer independent={true}>
  // <Drawer.Navigator useLegacyImplementation initialRouteName="Home" >
  //   <Drawer.Screen name="Home" component={HomeScreen}/>
  //   <Drawer.Screen name="Notifications" component={NotificationsScreen}/>
  //   <Drawer.Screen name="Logout" component={LogoutScreen} />
  //   {/* <TouchableOpacity>
  //     <Button onPress={handleSignOut}/>
  //   </TouchableOpacity> */}
  // </Drawer.Navigator>
  
  // </NavigationContainer>   
  return (
    <Drawer.Navigator useLegacyImplementation initialRouteName="Home" 
      drawerContent={ (props) => <CustomDrawerContent {...props}/>} >
      <Drawer.Screen name="Home" component={HomeScreen}/>
      <Drawer.Screen name="Notifications" component={NotificationsScreen}/>
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator> 
  )
}

export default HomeView
const styles = StyleSheet.create({
  text: {
    alignContent: 'center',
    alignItems: 'center'
  },
  logoutButton: {
    borderColor: "blue",
    paddingBottom: 60
  },
  input: {
    height: 10,
    margin: 2,
    borderWidth: 2,
    padding: 10,
    width: 300
  },
});