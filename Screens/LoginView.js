import { useNavigation } from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, Image, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from '../firebase';
// https://firebase.google.com/docs/auth/web/start?authuser=0&hl=en#web-version-9_2
// import { RegisterView } from './RegisterView.js';
import { TextInput as TextInputPaper } from 'react-native-paper';

const LoginView = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation();

    useEffect(() => {
        const logout = onAuthStateChanged(auth, (user) => {
            if(user) {
                navigation.replace("Happ")
            }
        })

        return logout
    }, [])

    const signUp = () => {
        navigation.navigate('Register');
        // createUserWithEmailAndPassword(auth, email, password)
        //     .then(userCredential => {
        //         let userCred = userCredential.user;
        //         console.log("---user name", userCred.email)
        //     })
        //     .catch(error => alert(error.message));
    }

    const reset = () => {
        navigation.navigate('Reset Password');
        // createUserWithEmailAndPassword(auth, email, password)
        //     .then(userCredential => {
        //         let userCred = userCredential.user;
        //         console.log("---user name", userCred.email)
        //     })
        //     .catch(error => alert(error.message));
    }

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                let userCred = userCredential.user;
                console.log("---logged in", userCred.email)
            })
            .catch(error => alert(error.message));
    }

    const [passwordVisible, setPasswordVisible] = useState(true);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
        <Image source = {require('../images/happiness.png')} style={styles.image} />
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

                {/* <TouchableOpacity
                onPress={signUp}
                style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>
                        Register
                    </Text>
                </TouchableOpacity> */}
             </View>
             
             <View style={styles.bottomView}>
                <Text style={styles.bottomText}>Don't have an account? <Text style={styles.bottomClick} onPress={signUp}>Sign up</Text></Text>
            </View>
            <View style={styles.bottomView}>
                <Text style={styles.bottomText}> Forgot Password? <Text style={styles.bottomClick} onPress={reset}> Reset </Text></Text>
            </View>
        </KeyboardAvoidingView>
      )

}


export default LoginView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'blue'
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
        width: 150,
        height:150
    },
    bottomView: {
        alignItems: "center",
        marginTop: 20
    },
    bottomText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    bottomClick: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 20
    }
})

