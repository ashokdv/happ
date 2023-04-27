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


function ProfileScreen() {
    const navigation = useNavigation();

    const [userData, setUserData] = useState(null);
    const [hobbi, setSelected] = useState("");
    const [genre, setGenre] = useState("");
    const [degree, setDegree] = useState("");
    const [course, setCourse] = useState("");

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
        setCourse(temp[0].course);
        setDegree(temp[0].degree);
      }); 
    }
    
    const updateUserProfile = async() => {
    
      const userUpdateData = doc(db, "user", userData.id);
  
      await updateDoc(userUpdateData, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        course: course,
        degree: degree,
        genre: genre,
        hobbies: hobbi,
        phoneNumber: userData.phoneNumber,
        weight: userData.weight,
        dob: userData.dob
      }).then(() => {
        // console.log('User Updated!');
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
   
    
    
    const hobbies = [
      {key:'1', value:'Sports'},
      {key:'2', value:'Watching TV'},
      {key:'3', value:'Reading'},
      {key:'4', value:'Dancing'},
      {key:'5', value:'Eating'},
      {key:'6', value:'Other'}
    ]
  
    const degrees = [
      {key:'1', value:'MS (Science)'},
      {key:'2', value:'BE/B.Tech'},
      {key:'3', value:'MBA'},
      {key:'4', value: 'Other'}
    ]
  
    const genres = [
        {key:'1', value:'Thriller'},
        {key:'2', value:'Action'},
        {key:'3', value:'Fiction'},
        {key:'4', value: 'Horror'},
        {key:'5', value: 'Romance'}
    ]
  
    const courses = [
        {key:'1', value:'Computer Science'},
        {key:'2', value:'IT'},
        {key:'3', value:'Cyber Security'},
        {key:'4', value:'Constuction Management'},
        {key:'5', value: 'Other'}
    ]
  
    function getDegreeData() {
      return {
        key: userData['degree'],
        value: userData['degree']
      }
    }
  
  
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
            style={styles.input} placeholder="firstName" placeholderTextColor='black'  
            value={userData ? userData.firstName : ''}
            onChangeText={(txt) => setUserData({...userData, firstName: txt})}
            autoCorrect={false}
          />    
        </View>
        <View style={styles.inputContainer}> 
          <TextInput
            style={styles.input} placeholder="lastName" placeholderTextColor='black'  
            value={userData ? userData.lastName : ''}
            onChangeText={(txt) => setUserData({...userData, lastName: txt})}
            autoCorrect={false}
          />    
        </View>
        <View style={styles.inputContainer}> 
          <TextInput
            style={styles.input} placeholder="DOB (MM/DD/YYYY)" placeholderTextColor='black'  
            value={userData ? userData.dob : ''}
            onChangeText={(txt) => setUserData({...userData, dob: txt})}
            autoCorrect={false}
          />    
        </View>
        <View style={styles.inputContainer}> 
          <TextInput
            style={styles.input} placeholder="Weight" placeholderTextColor='black'  
            value={userData ? userData.weight : ''}
            onChangeText={(txt) => setUserData({...userData, weight: txt})}
            autoCorrect={false}
            keyboardType='numeric'
          />    
        </View>
        <View style={styles.inputContainer}>
          <SelectList 
            setSelected={(val) => setDegree(val)} 
            data={degrees} 
            save="value"
            label="degrees"
            boxStyles={{marginTop:10, width: '100%'}}
            placeholder='Select Degree'
            // defaultOption={{'key': '1', value: 'MS (Science)'}}
        />
        </View>
        <View style={styles.inputContainer}>
          <SelectList 
            setSelected={(val) => setCourse(val)} 
            data={courses} 
            save="value"
            label="courses"
            boxStyles={{marginTop:10, width: '100%'}}
            placeholder='Select Course'
            // defaultOption={{'key': '1', value: 'Computer Science'}}
        />
        </View>
        {/* <View style={styles.inputContainer}>
          <MultipleSelectList 
            setSelected={(val) => setGenre(val)} 
            data={genres} 
            save="value"
            label="genre"
            boxStyles={{marginTop:10, width: '100%'}}
            placeholder='Select Genres'
        />
        </View> */}
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


export default ProfileScreen;

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