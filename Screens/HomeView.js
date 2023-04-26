import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert } from 'react-native';
import {useNavigation} from '@react-navigation/core';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { auth, signOut } from '../firebase';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { db, addDoc, collection, query, getDocs,} from '../firebase';
import { doc, setDoc, getDoc, where, updateDoc } from "firebase/firestore"; 
//TODO: Add date picker for DOB 
import Management from './Management.js';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list'
import Example from './DatePicker.js';
import ProfileScreen from './ProfileView.js';
import { addDays, eachDayOfInterval, eachWeekOfInterval, format, subDays } from 'date-fns';
import PagerView from 'react-native-pager-view';
import HomeScreenView from './HomeScreen.js';
function ManagementView({navigation}) {
  return (
    <Management />
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.text}> Home Page </Text>
      <Text> Out 1</Text>
      <Text> Out 2</Text>
      <Text> Out 3</Text>
      <Text> Out 4</Text>
    </View>
  );
}


function ProfileScreenView({navigation}) {
  return <ProfileScreen />
}




const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigat = useNavigation();
  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigat.replace("Login")
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
  return (
    <Drawer.Navigator useLegacyImplementation initialRouteName="Home" 
      drawerContent={ (props) => <CustomDrawerContent {...props}/>} >
      <Drawer.Screen name="Home" component={HomeScreen}/>
      <Drawer.Screen name="Profile" component={ProfileScreenView}/>
      <Drawer.Screen name="Management" component={ManagementView}/>
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
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 10
  },
  inputContainer: {
    width: '80%',
    borderRadius:'20%',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  profileScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonView: {
    width: '68%',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 30
  },
  button: {
      backgroundColor: '#0782F9',
      width: '100%',
      padding: 15,
      borderRadius: 10,
      // marginTop: 10,
      borderWidth: 1.5,
      borderColor: 'black',
      alignItems: 'center'
  },
  buttonText: {
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      color: 'black'
  },
  buttonOutline: {
      backgroundColor: 'white',
      // paddingHorizontal: 50,
      borderRadius: 15,
      borderWidth: 1.5,
      marginTop: 10,

  },
  buttonOutlineText: {
      justifyContent: 'center',
      alignContent: 'center',
      color: 'black'
  }
});