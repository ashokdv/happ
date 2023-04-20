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

import {
  LineChart
} from "react-native-chart-kit";
import { db, addDoc, collection, query, getDocs,} from '../firebase';
import { doc, setDoc, getDoc, where, updateDoc } from "firebase/firestore"; 

if(Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


function Management() {
  const navigation = useNavigation();
  const [weightData, setWeightData] = useState(null);
  const [weights, setWeightsData] = useState([]);
  const [dates, setDatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setID] = useState(null);

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
        console.log('Weight Updated!');
        Alert.alert(
          'Weight Added for today'        );
      }).catch((err) => {err.message})
    }

  }

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
      setID(weight_data[0].id);
      // let arr = sortObj(weight_data[0].weights);
      // console.log("----", weight_data[0].weights);
      let weights = []
      // let dates = []
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
      
      // console.log("---",lastSevenDays);


      for (var day in lastSevenDays) {
        var test = lastSevenDays[day];
        // console.log("---", test);
        // console.log(weight_data[0]['weights'][test])
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
      // console.log("---weight data",weight_data,  weights, dates);
    }).catch((err) => Alert.alert(err.message)); 
  }

  useEffect(() => {
    getWeightData();
    navigation.addListener("focus", () => setLoading(!loading));
    // console.log("---weight data from useEffect", weights, dates);
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
    legend: ["Rainy Days"] // optional
  };


  const sections = [
    {
      title: 'Weight Management',
      content: <LineChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                />
    },
    {
      title: 'Emotion Management',
      content: <LineChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
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


  const [weight, setWeight] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  // console.log("---weigfht", weight);
  function submitFunction() {
    setModalVisible(false);
    setWeight(weight);
    updateUserWeight();
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
            source={{
              uri:
                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/plus_icon.png',
            }}
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
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: 10,
    backgroundColor: 'white',
  },
});

export default Management;