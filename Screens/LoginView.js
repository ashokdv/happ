import { useNavigation } from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, Image, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from '../firebase';
// https://firebase.google.com/docs/auth/web/start?authuser=0&hl=en#web-version-9_2
// import { HomeView } from './HomeView.js';

const LoginView = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation();

    useEffect(() => {
        const logout = onAuthStateChanged(auth, (user) => {
            console.log("---User", user);
            if(user) {
                navigation.replace("HomePage")
            }
        })

        return logout
    }, [])

    const signUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                let userCred = userCredential.user;
                console.log("---user name", userCred.email)
            })
            .catch(error => alert(error.message));
    }

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                let userCred = userCredential.user;
                console.log("---logged in", userCred.email)
            })
            .catch(error => alert(error.message));
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
        <Image source = {require('../images/happ.png')} style={styles.image} />
          <View style={styles.inputContainer}>
            <TextInput
            placeholder = "Email"
            value={email}
            onChangeText={ value => setEmail(value)  }
            style={styles.inputText}
            placeholderTextColor="black"
            />
            <TextInput
            placeholder = "Password"
            value={ password }
            onChangeText={value => setPassword(value)}
            style={styles.inputText}
            placeholderTextColor="black"
            secureTextEntry
            />
            </View>

            <View style={styles.buttonView}>
                <TouchableOpacity
                onPress={login}
                style={styles.button}>
                    <Text style={styles.buttonText}>
                        Login
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={signUp}
                style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
      )

}


export default LoginView;

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

