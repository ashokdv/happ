import { useNavigation } from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, Image, KeyboardAvoidingView, TouchableOpacity, Button} from 'react-native';
import { auth, createUserWithEmailAndPassword, db, addDoc, collection} from '../firebase';
import { ScrollView } from 'react-native';
// https://firebase.google.com/docs/auth/web/start?authuser=0&hl=en#web-version-9_2
// import { HomeView } from './HomeView.js';
// import {firebase} from '../firebase.js';
// import DateTimePickerModal from "react-native-modal-datetime-picker";

const RegisterView = () => {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const login = () => {
        navigation.replace("LoginPage")
    }

    const onRegister = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        console.log(email, password, fullName, confirmPassword)
        createUserWithEmailAndPassword(auth, email, password)
        .then( (response) => {
            console.log("--respins", response)
            const uid = response.user.uid;
              
            const data = {
                id: uid,
                email: email,
                fullName: fullName
            };
            console.log("--coiming here");
            const docRef =  addDoc(collection(db, "user"), data);
            docRef
              .then(() => {
                    alert("Successfully registered")
                })
                .catch((error) => {
                    alert(error)
                })


            // const userDoc = db.collection('user');
            // userDoc
            //     .doc(uid)
            //     .set(data)
            //     .then(() => {
            //         navigation.replace('HomePage')
            //     })
            //     .catch((error) => {
            //         alert(error)
            //         navigation.replace("LoginPage")
            //     })
        })
        .catch((error) => {
            alert(error)
        });
    }

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        hideDatePicker();
    };


    return (
        <ScrollView >
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
         <Image source = {require('../images/happ.png')} style={styles.image} />
          <View style={styles.inputContainer}>
            <TextInput
            placeholder = "Enter your full name"
            value={fullName}
            onChangeText={ value => setFullName(value)  }
            style={styles.inputText}
            placeholderTextColor="black"
            />
            <TextInput
            placeholder = "Enter your Email"
            value={email}
            onChangeText={ value => setEmail(value)  }
            style={styles.inputText}
            placeholderTextColor="black"
            />
            <TextInput
            placeholder = "Enter your password"
            value={password}
            onChangeText={ value => setPassword(value)  }
            style={styles.inputText}
            placeholderTextColor="black"
            />
            <TextInput
            placeholder = "Reenter the password"
            value={confirmPassword}
            onChangeText={ value => setConfirmPassword(value)  }
            style={styles.inputText}
            placeholderTextColor="black"
            />
            {/* <View>
            <Button title="Show Date Picker" onPress={showDatePicker} />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            </View> */}
            <View style={styles.buttonView}>
                <TouchableOpacity
                onPress={onRegister}
                style={styles.button}>
                    <Text style={styles.buttonText}>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text> Already have an Account? 
                    <TouchableOpacity onPress={login}
                    > 
                        <Text style={styles.buttonText}>
                            SignIn
                        </Text>
                </TouchableOpacity>
                </Text>
            </View>
        </View>
        </KeyboardAvoidingView>
        </ScrollView>

      )

}


export default RegisterView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        width: '80%',
        borderRadius:'20%'
    },
    inputText: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 20,
        marginTop: 10
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
    image: {
        width: 200,
        height:100
    }
})

