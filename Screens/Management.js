import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  TextInput,
  Modal
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import { auth, signOut } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AccordionList } from 'accordion-collapse-react-native';
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

import {
  LineChart, StackedBarChart
} from "react-native-chart-kit";
import { db, addDoc, collection, query, getDocs,} from '../firebase';
import { doc, setDoc, getDoc, where, updateDoc } from "firebase/firestore"; 

if(Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function EmotionCalendar(days) {
  // console.log("From emotuon", days);

  const [selected, setSelected] = useState(days["selectedDays"]);
  // YYYY-MM-DD
  return (
    <View style={{ flex: 1, marginBottom: 10}}>
     <View style={{flexDirection: 'row', marginBottom: 20}}>
        <View style = {styles.circleHappy} />
        <Text style={styles.textHappy}>
            Happy
          </Text>
        <View style = {styles.circleConfused}>
        </View>
        <Text style={styles.textConfused}>
            Confused
          </Text>
        <View style = {styles.circleAngry} />
          <Text style={styles.textAngry}>
            Angry
          </Text>
        
        <View style = {styles.circleSad}>
        </View>
        <Text style={styles.textSad}>
            Sad
        </Text>
        
     </View>
     <Calendar
      markedDates={selected}
      enableSwipeMonths={true}    
      />
    </View>
  );
}

function Management() {
  const navigation = useNavigation();
  const [weightData, setWeightData] = useState(null);
  const [weights, setWeightsData] = useState([]);
  const [dates, setDatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setID] = useState(null);
  const [goals, setGoals] = useState([]);
  const [selected, setSelected] = useState({});
  const weightRef =  collection(db, "weight-mgmt");

  function dateStrng(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-indexed, add 1 to get correct month
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
    const dateString = `${month}/${day}/${year}`;
    return dateString;
  }

  const updateUserWeight = async() => {
  
    const userUpdateData = doc(db, "weight-mgmt", id);
    const currentDate = dateStrng(new Date())
    var temp = {}
    temp[currentDate] = weight
    if (weight !== null) {
      await setDoc(userUpdateData, {
        weights: temp,
      }, {merge: true}).then(() => {
        Alert.alert(
          'Weight Added for today'        );
      }).catch((err) => {err.message})
    }

  }
  // #cccccc
  // #737373
  // #000000
  const lastFiveDays = [];
  const lastFiveDates = [];
  const currentDate = new Date()
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(currentDate.getDate() -4 + i);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, add 1 to get correct month
    const year = String(date.getFullYear()); // Get last 2 digits of year
    const dateString = `${month}/${day}/${year}`;
    const dayStr = `${month}/${day}`
    lastFiveDays.push(dateString);
    lastFiveDates.push(dayStr);
  }

  // Goals, Set Goals
  const activitiesRef =  collection(db, "activities");
  const getActivities = async() => {
    await getDocs(
      query(activitiesRef, where("email", "==", auth.currentUser.email))
    ).then((snap) => {
      let temp_data = [];
      for (var i=0; i < snap.docs.length; i++){
        temp_data.push({
          ...snap.docs[i].data(),
        });
      }
      var res = []
      for (var i = 0 ; i < lastFiveDates.length ; i++) {
        // console.log("1", lastFiveDays[i])
        var filteredDates = temp_data[0]["activities"].filter(obj => obj.date == lastFiveDays[i]);
        // console.log("2",filteredDates[0]);
        if (filteredDates[0] !== undefined) {
          // console.log("2",filteredDates[0]["tasks"]);
          var inProgCount = null;
          var noCount = null;
          var yesCount = null;
          var tempDates = filteredDates[0]["tasks"];
          // console.log("2",filteredDates[0]["tasks"].length);
          for (var j = 0; j < tempDates.length; j++ ){
            // console.log("3",filteredDates[0]["tasks"]);
            if (tempDates[j]["completed"] == '0'){
              inProgCount = inProgCount + 1
            } else if (tempDates[j]["completed"] == '1') {
              noCount = noCount + 1
            } else if (tempDates[j]["completed"] == '2') {
              yesCount = yesCount + 1
            } 
          }
          res.push([inProgCount, noCount, yesCount])
        } else {
          res.push([]);
        }
      }
      // console.log('---res', res);
      // if (temp_data )
      setGoals(res);
    }).catch(err => {err.message});
  }


  const getCalendarActivities = async() => {
    function convertDateFormat(dateString) {
      var parts = dateString.split("/");      
      var day = parts[1];
      var month = parts[0];
      var year = parts[2];
      var formattedDate = year + "-" + month + "-" + day;      
      return formattedDate;
    }
    

    await getDocs(
      query(activitiesRef, where("email", "==", auth.currentUser.email))
    ).then(
      (snap) => {
        let temp_data = [];
        for (var i=0; i < snap.docs.length; i++){
          temp_data.push({
          ...snap.docs[i].data(),
          });
        }

        // console.log(temp_data[0]["activities"]);
        var res = {};
        var userActivities = temp_data[0]["activities"];
        for (var i=0; i < userActivities.length; i++) {
          var getActivitiesDate = userActivities[i]["date"];
          var formattedDate = convertDateFormat(getActivitiesDate);
          
          // console.log("--", formattedDate);
          var userTasks = userActivities[i]["tasks"]
          var happyCount = null;
          var sadCount = null;
          var angryCount = 0;
          var confusedCount = 0;
          
          // console.log('--1', userTasks);
          for (var j =0; j < userTasks.length; j++){
            if (userTasks[j]["emotion"] == '4'){
              happyCount = happyCount + 1
            } else if (userTasks[j]["emotion"] == '3'){
              confusedCount = confusedCount + 1
            } else if (userTasks[j]["emotion"] == '2'){
              angryCount = angryCount + 1
            } else if (userTasks[j]["emotion"] == '1'){
              sadCount = sadCount + 1
            } 
          }
                    
          var max = happyCount; 
          var maxVarName = 'h'; 

          if (confusedCount > max) {
            max = confusedCount ;
            maxVarName = 'c';
          }

          if (sadCount > max) {
            max = sadCount;
            maxVarName = 's';
          }

          if (angryCount > max) {
            max = angryCount;
            maxVarName = 'a';
          }

          if (maxVarName === 'h') {
            res[formattedDate] = {selected: true, marked: true, selectedColor: '#4CF71F' }
          } else if (maxVarName === 's') {
            res[formattedDate] = {selected: true, marked: true, selectedColor: '#C0D2D6' } // #C0D2D6 #D9FCA4
          } else if (maxVarName === 'a') {
            res[formattedDate] = {selected: true, marked: true, selectedColor: '#FC2626' } 
          } else if (maxVarName === 'c') {
            res[formattedDate] = {selected: true, marked: true, selectedColor: '#26D3FC' }  
          }
        }
        setSelected(res);
      }
    ).catch(err => {err.message})
  }
    



  

  const emotion_data = {
    labels: lastFiveDates,
    legend: ["In Progress", "No", "Yes" ],
    data: goals, 
    barColors: ["#5CC6F7", "#F7885C", "#17F538"]
  };

  const getWeightData = async() => {
    await getDocs(
      query(weightRef, where("email", "==", auth.currentUser.email))
    ).then((snap) => {
      let weight_data = [];
      for (var i=0; i < snap.docs.length; i++){
        weight_data.push({
          ...snap.docs[i].data(),
          id: snap.docs[i].id
        })
      
      }
      // console.log("--weufht", weight_data);
      setID(weight_data[0].id);
      let weights = []
      const currentDate = new Date();

      // Generate last 7 days in a single string for each day
      const lastSevenDays = [];
      const lastSevenDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() -6 + i);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Month is zero-indexed, add 1 to get correct month
        const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
        const dateString = `${month}/${day}/${year}`;
        const dayStr = `${month}/${day}`
        lastSevenDays.push(dateString);
        lastSevenDates.push(dayStr);
      }
      
      for (var day in lastSevenDays) {
        var test = lastSevenDays[day];
        if (weight_data[0]['weights'][test] !== undefined) {
          weights.push(Number(weight_data[0]['weights'][test]))
        } else {
          weights.push(0)
        }
      }

      let prevNonZero = 0;
      for (var i = 0; i < weights.length; i++) {
        if (weights[i] !== 0) {
          prevNonZero = weights[i];
        } else {
          weights[i] = prevNonZero;
        }
      }

      setWeightData(weight_data);
      setDatesData(lastSevenDates);
      setWeightsData(weights);
    }).catch((err) => Alert.alert(err.message)); 
  }

  useEffect(() => {
    getWeightData();
    getActivities();
    getCalendarActivities();
    navigation.addListener("focus", () => setLoading(!loading));
  }, [navigation, loading]);

  const chartConfig = {
    backgroundGradientFrom: "#1E2d23",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(26, 26, 146, ${opacity})`,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: true // optional
  };

  const data = {
    labels: dates,
    datasets: [
      {
        data: weights,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Weight"] // optional
  };


  const sections = [
    {
      title: 'Goal Management',
      content: <StackedBarChart
              data={emotion_data}
              width={screenWidth}
              height={220}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
    />
    },
    {
      title: 'Emotion Calendar',
      content: <EmotionCalendar selectedDays={selected}/>
    },
    {
      title: 'Weight Management',
      content: <LineChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                />
    }
  ];

  function renderHeader(section, _, isActive) {

    return (
      <SafeAreaView style={styles.container}>
      <View style={styles.accordHeader}>
        <Text style={styles.accordTitle}>{ section.title }</Text>
        <Icon name={ isActive ? 'chevron-up' : 'chevron-down' }
              size={20} color="#bbb" />
       </View>

      </SafeAreaView>
      
    );
  };

  function renderContent(section, _, isActive) {
    return (
      <View style={styles.accordBody}>
        {section.content}
      </View>
    );
  }

  function handleOnToggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }


  const [weight, setWeight] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  async function submitFunction() {
    setModalVisible(false);
    setWeight(weight);
    await updateUserWeight();
    await getWeightData();
  }

  return (
    <SafeAreaView style={styles.container} onPress={ () => setModalVisible(false)}>
      <AccordionList
        list={sections}
        header={renderHeader}
        body={renderContent}
        onToggle={handleOnToggle}
      />
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <TextInput style={styles.modalText} placeholder="weight" keyboardType='numeric' onChangeText={ value => setWeight(value)  }/>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={submitFunction}>
              <Text style={styles.textStyle}>Submit</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
        </Modal>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.touchableOpacityStyle}
          onPress={() => setModalVisible(true)}>
          <Image
            source = {require('../images/plus.png')}
            style={styles.floatingButtonStyle}
          />
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  accordHeader: {
    padding: 12,
    backgroundColor: '#aaaaaa',
    color: 'blue',
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom: 4
  },
  accordTitle: {
    fontSize: 20,
  },
  accordBody: {
    padding: 12
  },
  textSmall: {
    fontSize: 16
  },
  seperator: {
    height: 12
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    // left: 50,
    bottom: 60,
    // paddingBottom: 60
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    left: 280
    // paddingBottom: 60
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 250
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    height: 40,
    width: '70%',
    marginBottom: 10
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    backgroundColor: '#cccccc',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    width: 150,
    textAlign: 'center',
    justifyContent: 'center'
  },
  textHappy: {
    // paddingLeft: 10
    paddingRight: 10,
    // textAlign: 'center',
    justifyContent: 'space-between'
  },
  textConfused: {
    // marginLeft: 15
    paddingRight: 10,
    justifyContent: 'space-between'
  },
  textAngry: {
    paddingRight: 10,
    justifyContent: 'space-between'
  },
  textSad: {
    // paddingRight: 30,
    justifyContent: 'space-between'
  },
  circleHappy: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CF71F',
    marginRight:5
  },
  circleConfused: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#26D3FC',
    marginRight:5
  },
  circleAngry: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FC2626',
    marginRight:5
  },
  circleSad: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#C0D2D6',
    marginRight:5
  }
});

export default Management;

