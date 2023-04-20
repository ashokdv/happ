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
import { MultipleSelectList } from 'react-native-dropdown-select-list'

function ManagementView({navigation}) {
  return (
    <Management />
  )
}

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




function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

  const citiesRef2 =  collection(db, "user");
  const [loading, setLoading] = useState(true);

  const getData = async() => {
    await getDocs(
      query(citiesRef2, where("email", "==", auth.currentUser.email))
    ).then((snap) => {
      let temp = [];
      for (var i=0; i < snap.docs.length; i++){
        temp.push({
          ...snap.docs[i].data(),
          id: snap.docs[i].id
        })
      }
      setUserData(temp[0]);
    }); 
  }
  
  const updateUserProfile = async() => {
  
    const userUpdateData = doc(db, "user", userData.id);

    await updateDoc(userUpdateData, {
      fullName: userData.fullName,
    }).then(() => {
      console.log('User Updated!');
      Alert.alert(
        'Profile Updated!',
        'Your profile has been updated successfully.'
      );
    })
  }
  

  useEffect(() => {
    getData();
    navigation.addListener("focus", () => setLoading(!loading));
  }, [navigation, loading]);
 
  const [selected, setSelected] = React.useState("");
  
  const data = [
      {key:'1', value:'Mobiles', disabled:true},
      {key:'2', value:'Appliances'},
      {key:'3', value:'Cameras'},
      {key:'4', value:'Computers', disabled:true},
      {key:'5', value:'Vegetables'},
      {key:'6', value:'Diary Products'},
      {key:'7', value:'Drinks'},
  ]


  return (
    <ScrollView>
    <View style={styles.profileScreen}>
      <View style={styles.inputContainer}> 
        <TextInput
          style={styles.input} placeholder="Email" placeholderTextColor='black'  
          value={userData ? userData.email : ''}
          autoCorrect={false}
        />    
      </View>
      <View style={styles.inputContainer}> 
        <TextInput
          style={styles.input} placeholder="Name" placeholderTextColor='black'  
          value={userData ? userData.fullName : ''}
          onChangeText={(txt) => setUserData({...userData, fullName: txt})}
          autoCorrect={false}
        />    
      </View>
      <View style={styles.inputContainer}> 
        <TextInput
          style={styles.input} placeholder="Name" placeholderTextColor='black'  
          value={userData ? userData.fullName : ''}
          // onChangeText={(txt) => setUserData({...userData, fullName: txt})}
          autoCorrect={false}
        />    
      </View>
      <View style={styles.inputContainer}> 
        <TextInput
          style={styles.input} placeholder="Name" placeholderTextColor='black'  
          value={userData ? userData.fullName : ''}
          // onChangeText={(txt) => setUserData({...userData, fullName: txt})}
          autoCorrect={false}
        />    
      </View>
      <View style={styles.inputContainer}>
        <MultipleSelectList 
          setSelected={(val) => setSelected(val)} 
          data={data} 
          save="value"
          label="hobbies"
          boxStyles={{marginTop:10, width: '100%'}}
          placeholder='Select Hobbies'
      />
      </View>
      

      <View style={styles.buttonView}>
        <TouchableOpacity
        onPress={updateUserProfile}
        style={styles.button}>
          <Text style={styles.buttonText}>
              Update Profile
          </Text>
        </TouchableOpacity>

      </View>
      </View>
    </ScrollView>
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
  return (
    <Drawer.Navigator useLegacyImplementation initialRouteName="Home" 
      drawerContent={ (props) => <CustomDrawerContent {...props}/>} >
      <Drawer.Screen name="Home" component={HomeScreen}/>
      <Drawer.Screen name="Profile" component={ProfileScreen}/>
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
  },
});