import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Modal, Platform, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { auth, signOut } from '../firebase';
import { Directions, ScrollView, TextInput } from 'react-native-gesture-handler';
import { db, addDoc, collection, query, getDocs, } from '../firebase';
import { doc, setDoc, getDoc, where, updateDoc, orderBy } from "firebase/firestore";
import { toFirestore } from "firebase/firestore/lite";
//TODO: Add date picker for DOB 
import Management from './Management.js';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list'
import Example from './DatePicker.js';
import ProfileScreen from './ProfileView.js';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from "date-fns";
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Emoji from 'react-native-emoji';
// import { Tooltip } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import CollapsibleView from './CollapsibleView';
// import { validate } from 'react-native-web/dist/cjs/exports/StyleSheet/validate';
function ManagementView({ navigation }) {
  return (
    <Management />
  );
}

//TEST

class ActivitiesByDate {
  constructor(date, activities) {
    this.date = date;
    this.tasks = activities;
  }
}

class Task {
  constructor(taskName, desc, emotion, completed) {
    this.taskname = taskName;
    this.desc = desc;
    this.emotion = emotion;
    this.completed = completed;
  }
}

class ActivitiesDoc {
  constructor(activities, email) {
    this.activities = activities;
    this.email = email;
  }
}

var activitiesByDateList = null;
var activitiesDoc = null;
var docID = null;
const windowHeight = Dimensions.get('window').height;
function HomeScreen({ navigation }) {

  const activitiesList = collection(db, "activities");
  const [loading, setLoading] = useState(true);

  const [activitiesExist, setActivitiesExist] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [formValue, setFormValue] = useState('');
  const [inputDateValue, setInputDateValue] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [inputText, setInputTextValue] = useState('');
  const [title, setTitleValue] = useState('');
  const [desc, setDescValue] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [currentIndex, setCurrentIndex] = useState('');
  const [pastActivities, setPastActivities] = useState([]);
  const [currentDayActivities, setCurrentDayActivities] = useState([]);
  const [futureActivities, setFutureActivities] = useState([]);
  
  const options = [
    { label: 'In progress', value: '0' },
    { label: 'No', value: '1' },
    { label: 'Yes', value: '2' },
  ];

  const handleStatusSelect = (value) => {
    setSelectedStatus(value);
  };

  const handleEmotionSelect = (option) => {
    if (option == selectedEmotion)
      setSelectedEmotion(undefined);
    else
      setSelectedEmotion(option);
  }

  const handleInputDateChange = (text) => {
    setInputDateValue(format(text, "MM/dd/yyyy"));
  }

  const handleInputChange = (text) => {
    setInputTextValue(text);
  }

  const handleTitleChange = (text) => {
    setTitleValue(text);
  }

  const handleDescChange = (text) => {
    setDescValue(text);
  }

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    //setShowDatePicker(Platform.OS === 'ios');
    setShowDatePicker(false);
    setDate(currentDate);
    handleInputDateChange(currentDate);

  };

  const showPicker = () => {
    setShowDatePicker(true);
  };


  const handleSubmit = (e) => {

    e.preventDefault();
    if (validateForm()) {

      if (activitiesExist) {

        //Checking if activities exists for that particular date already
        var exists = false;

        for (let i = 0; i < activitiesByDateList.length; i++) {
          var act = activitiesByDateList[i];
          if (act.date == inputDateValue) {
            var tasksList = act.tasks;
            var newTask = new Task(title, desc, selectedEmotion, selectedStatus);
            tasksList.push(newTask);
            act.tasks = tasksList;
            exists = true;
            break;
          }
        }
        if (!exists) {
          var tasksList = [];
          var newTask = new Task(title, desc, selectedEmotion, selectedStatus);
          tasksList.push(newTask);
          var act = new ActivitiesByDate(inputDateValue, tasksList);
          activitiesByDateList.push(act);
        }


        //console.log(JSON.stringify(activitiesDoc));

      }
      else {
        activitiesByDateList = [];
        var tasksList = [];
        var newTask = new Task(title, desc, selectedEmotion, selectedStatus);
        tasksList.push(newTask);
        var act = new ActivitiesByDate(inputDateValue, tasksList);
        activitiesByDateList.push(act);
      }
      //Sorting activities
      activitiesByDateList = activitiesByDateList.sort(compareByDateAsc);
      getPastActivities(activitiesByDateList);
      getCurrentDayActivities(activitiesByDateList);
      getFutureActivities(activitiesByDateList);
      var activitiesDoc = new ActivitiesDoc(activitiesByDateList, auth.currentUser.email);
      updateActivities(activitiesDoc);
      console.log(pastActivities);
      setModalVisible(false);
    }
  }

  const getPastActivities = (activitiesByDateList) => {
    var pastActivities = []
    for (let i = 0; i < activitiesByDateList.length; i++) {
      var a = activitiesByDateList[i];
      var activity_date = new Date(a.date);
      var now = new Date();
      // console.log('--------PAST----------');
      // console.log(activity_date < now);
      if ((now - activity_date) / 3600000 > 20) {
        pastActivities.push(a);
      }
    }
    setPastActivities(pastActivities);
  }

  const getCurrentDayActivities = (activitiesByDateList) => {
    var currentDayActivities = []
    for (let i = 0; i < activitiesByDateList.length; i++) {
      var a = activitiesByDateList[i];
      var activity_date = new Date(a.date);
      var now = new Date();
      // console.log('--------CURRENT----------');
      // console.log(activity_date - now);
      if ((now - activity_date) / 3600000 < 20 && (now - activity_date) / 3600000 > 0) {
        currentDayActivities.push(a);
      }
    }
    setCurrentDayActivities(currentDayActivities);
  }

  const getFutureActivities = (activitiesByDateList) => {
    var futureActivities = []
    for (let i = 0; i < activitiesByDateList.length; i++) {
      var a = activitiesByDateList[i];
      var activity_date = new Date(a.date);
      var now = new Date();
      // console.log('--------FUTURE----------');
      // console.log(activity_date > now);
      if ((now - activity_date) / 3600000 < 0) {
        futureActivities.push(a);
      }
    }
    setFutureActivities(futureActivities);
  }

  const getEmoji = (emotion) => {
    if(emotion == '1'){
     return (<View><Text style={{ fontSize: 25 }}>&#x1F62B;</Text></View>);
    }
    else if(emotion == '2'){
      return (<View><Text style={{ fontSize: 25 }}>&#x1F621;</Text></View>);
    }
    else if(emotion == '3'){
      return (<View><Text style={{ fontSize: 25 }}>&#x1F615;</Text></View>);
      
    }
    else if(emotion == '4'){
      return (<View><Text style={{ fontSize: 25 }}>&#x1F929;</Text></View>);
    }
  }

  const compareByDateAsc = (a, b) => {
    var a_date = new Date(a.date);
    var b_date = new Date(b.date);
    if (a_date.getTime() < b_date.getTime()) {
      return -1;
    }
    else if (a_date.getTime() > b_date.getTime()) {
      return 1;
    }
    else {
      console.log('0');
      return 0;
    }
  };

  // useEffect(() => {
  //   validateForm();
  // }, [date, title, desc, selectedEmotion, selectedStatus]);


  const validateForm = () => {
    // console.log('Entered Validation');
    // console.log(!inputDateValue);
    // console.log(!title);
    // console.log(desc);
    // console.log(selectedEmotion);
    // console.log(selectedStatus);
    let errors = {}
    setFormErrors(errors)
    let isValid = true;

    if (!inputDateValue) {
      errors.inputDateValue = "Date is required";
      isValid = false;
      console.log(errors.inputDateValue);
    }

    if (!title) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!desc) {
      errors.desc = "Description is required";
      isValid = false;
    }

    if (!selectedStatus) {
      errors.selectedStatus = "Please select a staus of this goal";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  }


  const handleClose = () => {
    setModalVisible(false);
    setInputDateValue(undefined);
    setFormErrors({});
  }

  const updateActivities = async (activitiesDoc) => {
    if (docID == null)
      docID = auth.currentUser.email;

    const docRef = doc(db, "activities", docID);
    const docData = JSON.parse(JSON.stringify(activitiesDoc));

    await setDoc(docRef, docData).then(() => {
      setActivitiesExist(true);
      setInputDateValue(undefined);
      setTitleValue('');
      setDescValue('');
      setSelectedEmotion('');
      setSelectedStatus('');
      Alert.alert(
        'Activity created..!',
        'The new activity is added'
      );
    });
  }

  const getData = async () => {
    await getDocs(
      query(activitiesList, where("email", "==", auth.currentUser.email))
    ).then((snap) => {
      let temp = [];
      for (var i = 0; i < snap.docs.length; i++) {
        temp.push({
          ...snap.docs[i].data(),
          id: snap.docs[i].id
        })
      }
      activitiesByDateList = []
      //console.log(temp[0]);
      if (temp[0] != undefined) {
        //Used to update Firebase
        docID = temp[0]['id'];
        // Iterating through each activity date available
        for (var i = 0; i < temp[0]['activities'].length; i++) {
          var a = temp[0]['activities'][i];

          var activitiesByDate = new ActivitiesByDate();
          activitiesByDate.date = a.date;
          var activitiesList = []
          for (var j = 0; j < a.tasks.length; j++) {
            var task = new Task(a.tasks[j] == undefined ? '' : a.tasks[j].taskname, a.tasks[j] == undefined ? '' : a.tasks[j].desc, a.tasks[j] == undefined ? '' : a.tasks[j].emotion, a.tasks[j] == undefined ? '' : a.tasks[j].completed);
            activitiesList.push(task)
          }
          activitiesByDate.tasks = activitiesList;
          //This contains the list of objects where each object contains all activities by date
          activitiesByDateList.push(activitiesByDate);
        }
      }
      setActivitiesExist(activitiesByDateList.length > 0 ? true : false);
      //setActivitiesExist(false);
      activitiesByDateList = activitiesByDateList.sort(compareByDateAsc);
      getPastActivities(activitiesByDateList);
      getCurrentDayActivities(activitiesByDateList);
      getFutureActivities(activitiesByDateList);
      
      // console.log(futureActivities);
      // console.log(new Date());
      // console.log(new Date('04/25/2023'));
      // console.log((new Date() - new Date('04/25/2023'))/3600000);
      //console.log(JSON.stringify(activitiesByDateList));
      // const givenDate = new Date('04/24/2022');
      // const currentDate = new Date('04/24/2022');
      // console.log(currentDate-givenDate);
      // console.log(givenDate);
      //contentContainerStyle={{ alignItems: 'center', flexGrow:1, backgroundColor: 'white', height: windowHeight }}
    });
  }

  useEffect(() => {
    getData();
    navigation.addListener("focus", () => setLoading(!loading));
  }, [navigation, loading]);

  return (
    <View style={{flex:1, backgroundColor: 'white'}}>
    <ScrollView contentContainerStyle={{alignItems: 'center'}} style={{flexGrow:1, padding: 10}}>
      {!activitiesExist ? (
        <View style={styles.backgroundImage}>
          <Image source={require('../assets/icon-tasks.png')} style={{ width: 75, height: 75, opacity: 0.75 }}></Image>
          <Text style={styles.textForNoActivities}>There are no activities logged yet.</Text>
          <Text style={styles.textForNoActivities}>Please click on (+) to add an activity/goal</Text>
        </View>
      ) :

        /* View if there are existing activities by user */
        <View>
          <CollapsibleView title="Past" inner="false">
          {pastActivities.map((activity) => (
              <CollapsibleView key={activity.date} title={format(new Date(activity.date), "dd MMM yy")} inner="true">
                {activity.tasks.map((task) => (
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text style={{ fontWeight: 'bold', flex: 1}}></Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, marginRight: 5, textAlign:'left' ,flex: 2 }}>{task.taskname}</Text>
                  <View style={{ flex: 4 }}>{getEmoji(task.emotion)}</View>
                  </View>
                ))}
              </CollapsibleView>
            ))}
          </CollapsibleView>
          <CollapsibleView title="Present" inner="false">
          {currentDayActivities.map((activity) => (
              <CollapsibleView key={activity.date} title={activity.date} inner="true">
                {activity.tasks.map((task) => (
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text style={{ fontWeight: 'bold', flex: 1 }}></Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, flex: 2 }}>{task.taskname}</Text>
                  <View style={{ flex: 4 }}>{getEmoji(task.emotion)}</View>
                  </View>
                ))}
              </CollapsibleView>
            ))}
          </CollapsibleView>
          <CollapsibleView title="Future" inner="false">
          {futureActivities.map((activity) => (
              <CollapsibleView key={activity.date} title={activity.date} inner="true">
                {activity.tasks.map((task) => (
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text style={{ fontWeight: 'bold', flex: 1 }}></Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, flex: 2 }}>{task.taskname}</Text>
                  <View style={{ flex: 4 }}>{getEmoji(task.emotion)}</View>
                  </View>
                ))}
              </CollapsibleView>
            ))}
          </CollapsibleView>
         
        </View>
      }
      

      {/* Modal view on click of (+) */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleClose}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            {/* Date */}
            {formErrors.inputDateValue !== "" && <Text style={{ color: "red" }}>{formErrors.inputDateValue}</Text>}
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <TextInput
                style={styles.dateText}
                placeholder='Select the Date'
                editable={false}
                onChangeText={handleInputChange}
                value={inputDateValue}
              />
              <TouchableOpacity onPress={showPicker}>
                <Image
                  source={require('../images/calendar.png')}
                  style={styles.imageDate}
                />
              </TouchableOpacity>
            </View>


            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
            {/* Title */}
            {formErrors.title !== "" && <Text style={{ color: "red" }}>{formErrors.title}</Text>}
            <TextInput
              style={styles.input}
              placeholder='Enter title of the goal'
              onChangeText={handleTitleChange}
            />
            {/* Description */}
            {formErrors.desc !== "" && <Text style={{ color: "red" }}>{formErrors.desc}</Text>}
            <TextInput
              style={styles.inputMultiLine}
              multiline={true}
              numberOfLines={4}
              textAlignVertical='top'
              placeholder='Describe the goal'
              onChangeText={handleDescChange}
            />

            {/* Emotion */}
            <Text style={{ fontSize: 16 }}>How do you feel about this?</Text>
            <View style={{ marginTop: 10, marginBottom: 20, display: 'flex', flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => handleEmotionSelect('1')}>
                <Text style={{ fontSize: selectedEmotion === '1' ? 40 : 30 }}>
                  &#x1F62B; {/* Sad */}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEmotionSelect('2')}>
                <Text style={{ fontSize: selectedEmotion === '2' ? 40 : 30 }}>
                  &#x1F621; {/* Angry */}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEmotionSelect('3')}>
                <Text style={{ fontSize: selectedEmotion === '3' ? 40 : 30 }}>
                  &#x1F615; {/* Confused */}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEmotionSelect('4')}>
                <Text style={{ fontSize: selectedEmotion === '4' ? 40 : 30 }}>
                  &#x1F929; {/* Happy */}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Status */}
            {formErrors.selectedStatus !== "" && <Text style={{ color: "red" }}>{formErrors.selectedStatus}</Text>}
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Is it completed?</Text>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: option.value === selectedStatus ? '#EFEFEF' : '#FFFFFF',
                  borderRadius: 5,
                  marginBottom: 10,
                }}
                onPress={() => handleStatusSelect(option.value)}
              >
                <AntDesign name={option.value === selectedStatus ? 'checkcircle' : 'checkcircleo'} size={24} color="#007AFF" style={{ marginRight: 10 }} />
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}



            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
    <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>


  );
}


function ProfileScreenView({ navigation }) {
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
        <View style={{ flex: 1 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.logoutButton}>
        <Button title='LogOut' onPress={handleSignOut} ></Button>
      </View>
    </>);
}

const HomeView = () => {
  return (
    <Drawer.Navigator useLegacyImplementation initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />} >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreenView} />
      <Drawer.Screen name="Management" component={ManagementView} />
    </Drawer.Navigator>
  )
}

export default HomeView
const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  textForNoActivities: {
    paddingHorizontal: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    alignContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  logoutButton: {
    borderColor: "blue",
    paddingBottom: 60
  },
  // input: {
  //   backgroundColor: 'white',
  //   paddingHorizontal: 15,
  //   paddingVertical: 15,
  //   borderRadius: 20,
  //   marginTop: 10
  // },
  inputContainer: {
    width: '0%',
    borderRadius: '20%',
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    marginBottom: 100,
    marginTop: windowHeight/4,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#87C9FC',
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },


  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  dateText: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    marginRight: 10,
    flex: 7
  },
  inputDate: {
    borderRadius: 5,
    padding: 10,
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: 20,
    height: 20
  },
  inputMultiLine: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
});