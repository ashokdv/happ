import { useNavigation } from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, Image, KeyboardAvoidingView, TouchableOpacity, Button} from 'react-native';
import { auth, createUserWithEmailAndPassword, db, addDoc, collection} from '../firebase';
import { ScrollView } from 'react-native';
// https://firebase.google.com/docs/auth/web/start?authuser=0&hl=en#web-version-9_2
// import { HomeView } from './HomeView.js';
// import {firebase} from '../firebase.js';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list';

const RegisterView = () => {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [degree, setDegree] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [genre, setMovieGenres] = useState('');
    const [emotion, setEmotion] = useState('');
    const [weight, setWeight] = useState(0);

    const login = () => {
        navigation.replace("Login")
    }

    const onRegister = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        createUserWithEmailAndPassword(auth, email, password)
        .then( (response) => {
            const uid = response.user.uid;
              
            const data = {
                id: uid,
                email: email,
                firstName: firstName,
                dob: pickedDate,
                lastName: lastName,
                phoneNumber: phoneNumber,
                degree: degree,
                hobbies: selectedHobbies,
                course: course,
                emotion: emotion,
                genre: genre,
                weight: weight
            };
            const docRef =  addDoc(collection(db, "user"), data);
            docRef
              .then(() => {
                    alert("Successfully registered")
                })
                .catch((error) => {
                    alert(error)
                })
            
            function dateStrng(date) {
                const day = date.getDate();
                const month = date.getMonth() + 1; 
                const year = date.getFullYear().toString().slice(-2);  
                const dateString = `${month}/${day}/${year}`;
                return dateString;
                }
            
            const currentDate = dateStrng(new Date());
            var temp = {};
            temp["weights"] = {};
            temp["weights"][currentDate] = weight;
            temp["email"] = email;
            
            const wtRef = addDoc(collection(db, "weight-mgmt"), temp);
            wtRef.then( () => {
                console.log("weight added for the user")
            })
        })
        .catch((error) => {
            alert(error)
        });
    }

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [pickedDate, setPickedDate] = useState('');

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
       
        let dateValue = '';
        if(!isNaN(date.getTime())) {
            // Months use 0 index.
            dateValue =  date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
        }
        setPickedDate(dateValue);
        hideDatePicker();
    };

    const [selectedHobbies, setSelected] = React.useState("");

    const hobbies = [
        {key:'1', value:'Sports'},
        {key:'2', value:'Watching TV'},
        {key:'3', value:'Reading'},
        {key:'4', value:'Dancing'},
        {key:'5', value:'Eating'},
        {key:'6', value:'Other'}
    ]

    const emotions = [
        {key:'1', value:'High'},
        {key:'2', value:'Medium'},
        {key:'3', value:'Low'},
        
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
    const [course, setCourse] = useState('');

    return (
        <ScrollView style = {{flex: 1}}>
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
         <Image source = {require('../images/happiness.png')} style={styles.image} />
          <View style={styles.inputContainer}>
            <View>
                <View style={styles.sectionStyle}>
                    <TextInput
                    placeholder = "Enter your First name"
                    value={firstName}
                    onChangeText={ value => setFirstName(value)  }
                    // style={styles.inputText}
                    style={{flex: 1}}
                    // placeholderTextColor="black"
                    />
                </View>
            </View>
            <View>
                <View style={styles.sectionStyle}>
                    <TextInput
                    placeholder = "Enter your Last name"
                    value={lastName}
                    onChangeText={ value => setLastName(value)  }
                    // style={styles.inputText}
                    style={{flex: 1}}
                    // placeholderTextColor="black"
                    />
                </View>
            </View>
            
            <View>
                <View style={styles.sectionStyle}>
                <TextInput
                    placeholder = "Enter your Email"
                    value={email}
                    onChangeText={ value => setEmail(value)  }
                    // style={styles.inputText}
                    style={{flex: 1}}
                    // placeholderTextColor="black"
                    />
                </View>
            </View>
            
            <View>
                <View style={styles.sectionStyle}>
                <TextInput
                placeholder = "Enter your password"
                value={password}
                onChangeText={ value => setPassword(value)  }
                style={{flex: 1}}
                // placeholderTextColor="black"
                />
                </View>
            </View>
            
            <View>
                <View style={styles.sectionStyle}>
                    <TextInput
                    placeholder = "Reenter the password"
                    value={confirmPassword}
                    onChangeText={ value => setConfirmPassword(value)  }
                    // style={styles.inputText}
                    style={{flex: 1}}
                    // placeholderTextColor="black"
                    underlineColorAndroid="transparent"
                    />
                </View>
            </View>
            <View>
                <View style={styles.sectionStyle}>
                <TextInput
                    style={{flex: 1}}
                    placeholder="Date of Birth"
                    underlineColorAndroid="transparent"
                    value={pickedDate}
                />
                <TouchableOpacity onPress={showDatePicker}>
                <Image
                    source = {require('../images/calendar.png')}          
                    style={styles.imageStyle}
                />
                </TouchableOpacity>

            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={new Date(2008, 11, 0)}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            </View>
            <View>
                <View style={styles.sectionStyle}>
                    <TextInput
                    placeholder = " Phone Number"
                    value={phoneNumber}
                    onChangeText={ value => setPhoneNumber(value)  }
                    style={{flex: 1}}
                    underlineColorAndroid="transparent"
                    />
                </View>
            </View>
            <View>
                <View style={styles.sectionStyle}>
                    <TextInput
                    placeholder = " Weight in Lbs"
                    value={weight}
                    onChangeText={ value => setWeight(value)  }
                    style={{flex: 1}}
                    underlineColorAndroid="transparent"
                    />
                </View>
            </View>
            <View style={styles.inputContainerDropDown}>
                <SelectList 
                    setSelected={(val) => setEmotion(val)} 
                    data={emotions} 
                    save="value"
                    placeholder='Select Emotion'
                    boxStyles={{marginTop:10, width: '100%', backgroundColor: '#fff'}}
                />
            </View>
            <View style={styles.inputContainerDropDown}>
                <MultipleSelectList 
                setSelected={(val) => setSelected(val)} 
                data={hobbies} 
                save="value"
                label="hobbies"
                boxStyles={{marginTop:10, width: '100%', backgroundColor: '#fff'}}
                placeholder='Select Hobbies'
            />
            </View>
            <View style={styles.inputContainerDropDown}>
                <SelectList 
                    setSelected={(val) => setDegree(val)} 
                    data={degrees} 
                    save="value"
                    boxStyles={{marginTop:10, width: '100%', backgroundColor: '#fff'}}
                    placeholder='Select Degree'
                />
            </View>
            <View style={styles.inputContainerDropDown}>
                <SelectList 
                    setSelected={(val) => setCourse(val)} 
                    data={courses} 
                    save="value"
                    placeholder='Select Course'
                    boxStyles={{marginTop:10, width: '100%', backgroundColor: '#fff'}}
                />
            </View>
            <View style={styles.inputContainerDropDown}>
                <MultipleSelectList 
                setSelected={(val) => setMovieGenres(val)} 
                data={genres} 
                save="value"
                label="genre"
                boxStyles={{marginTop:10, width: '100%', backgroundColor: '#fff'}}
                placeholder='Select Genres'
            />
            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity
                onPress={onRegister}
                style={styles.button}>
                    <Text style={styles.buttonText}>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>


            <View style= {styles.bottomViewReg}>
                <Text style={styles.bottomTextReg}> Already have an Account? 
                    <Text style={styles.bottomClickReg} onPress={login}> SignIn </Text>
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
        // justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        alignContent: "center",
        marginTop: 10
    },
    inputContainer: {
        width: '80%',
        borderRadius:'20%'
    },
    inputContainerDropDown: {
        width: '100%',
        borderRadius:'20%',
        flex:1,
    },
    inputText: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 20,
        marginTop: 10
    },
    buttonView: {
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 30
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        // justifyContent: 'center'
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
        width: 100,
        height:100,
        marginTop: 10
    },
    bottomViewReg: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20
    },
    bottomTextReg: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    bottomClickReg: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 20
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
    sectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#000',
        height: 40,
        borderRadius: 5,
        margin: 10,
    },
    imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
    },
})

