import { useNavigation } from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, Image, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import { auth, sendPasswordResetEmail, db, addDoc, collection} from '../firebase';

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const navigation = useNavigation()
    const forgotPass = () => {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Mail sent, Please check inbox/spam folder")
            navigation.goBack()
        })
        .catch((error) => {
            alert(error)
        });
    }
    

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <View style={styles.inputContainer}>
                <Text style={{alignContent: 'center', textAlign: 'center', paddingBottom:20}}>
                    Forgot Password?
                </Text>
                <TextInput
                    placeholder = "Email"
                    value={email}
                    onChangeText={ value => setEmail(value)  }
                    style={styles.inputText}
                    placeholderTextColor="black"
                    autoCorrect={false}
                />
            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity
                onPress={forgotPass}
                style={styles.button}>
                    <Text style={styles.buttonText}>
                        Submit
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )

}


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


export default ForgotPassword;