import React, {useEffect, useState} from 'react';
import { StyleSheet, ScrollView, TextInput ,LayoutAnimation,UIManager, Text, View,Keyboard, Pressable,Image, TouchableOpacity, Alert , Modal, SafeAreaView, Platform} from 'react-native';
//TODO: Add date picker for DOB 
import { addDays, eachDayOfInterval, eachWeekOfInterval, format, subDays } from 'date-fns';
import PagerView from 'react-native-pager-view';
import { AccordionList } from 'accordion-collapse-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from "react-native";
import { db, addDoc, collection, query, getDocs, auth} from '../firebase';
const screenWidth = Dimensions.get("window").width;
import {useNavigation} from '@react-navigation/core';
import { doc, setDoc, getDoc, where, updateDoc } from "firebase/firestore"; 


import Task from './Task.js';

if(Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


function HomeScreenView() {
  const DateSlider = () => {
    return (
    <PagerView style={styles.container_home}>
    {dates.map((week, i) => {
      return (
        <View key={i} >
          <View style={styles.row}>
            {week.map(
              day => {
                const txt = format(day, 'EEEEE');
                return (
                  <TouchableOpacity key={day} onPress={ () => {console.log(day,"pressed")}}>
                    <View>
                      <Text> {txt} </Text>
                      <Text> {day.getDate()} </Text>
                    </View>
                  </TouchableOpacity>
                  
                )
              }
            )}
          </View>
        </View>
      )
    })}
    </PagerView>
    )
  }

  const dates = eachWeekOfInterval({
    start: subDays(new Date(), 14),
    end: addDays(new Date(), 14)
  },
  {
    weekStartsOn: 1
  }
  ).reduce((acc, cur) => {
    const allDays = eachDayOfInterval({
      start: cur,
      end: addDays(cur, 6)
    }); 
    acc.push(allDays);
    return acc;
  }, []);

  const sections = [
    {
      title: 'Past',
      content: <View>
        <Text>
            Hi
        </Text>
      </View>
    },
    {
      title: 'Today',
      content: <ListTodaysTasks />
    }
  ];
  
  function ListTodaysTasks() {

    const handleAddTask = () => {
      Keyboard.dismiss();
      setTaskItems([...taskItems, task])
      setTask(null);
      // update in database
    }
  
    const completeTask = (index) => {
      let itemsCopy = [...taskItems];
      itemsCopy.splice(index, 1);
      setTaskItems(itemsCopy);
      // update in database 
    }
  
    const [task, setTask] = useState();
    const [taskItems, setTaskItems] = useState(["Task 1", "Task 2", "Task 3", "Task 1", "Task 2", "Task 3qqwqwq 23q23232", ]);
  
    return <View style={styles.container}>
    {/* Added this scroll view to enable scrolling when list gets longer than the page */}
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1
      }}
      keyboardShouldPersistTaps='handled'
    >
  
    <View style={styles.tasksWrapper}>
      <View style={styles.items}>
        {/* {
          Object.entries(taskData[0]["04/23/2023"]).map(([key, value]) => {
            return (
              <TouchableOpacity key={key}  onPress={() => completeTask(index)}>
                <Task text={value} /> 
              </TouchableOpacity>
            )
        }) */}
        {
          taskData.map((item, index) => {
            return (
              <TouchableOpacity key={index}  onPress={() => completeTask(index)}>
                <Task text={item} /> 
              </TouchableOpacity>
            )
          })
        }
      </View>
    </View>
      
    </ScrollView>
    
  </View>
  }

  const navigation = useNavigation();

  function renderHeader(section, _, isActive) {

    return (
      <SafeAreaView>
      <View style={styles.accordHeader}>
        <Text style={styles.accordTitle}>{ section.title }</Text>
        <Icon name={ isActive ? 'chevron-up' : 'chevron-down' }
              size={20} color="#dfffff" />
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

    const [modalVisible, setModalVisible] = useState(false);
    function submitFunction() {
      setModalVisible(false);
      if (task === ''){
        Alert.alert("Task Name should not be empty")
      } else {
        setTask(task);
        addTaskDate(curDate);
      }
      // update in database
    }
    // const date = new Date();
    const [task, setTask] = useState('');
    const [curDate, addTaskDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    const [taskData, setTaskData] = useState([]);
    const taskRef = collection(db, "test");
    const getTasks = async() => {
      await getDocs(
        query(taskRef, where("email", "==", auth.currentUser.email))
      ).then((snap) => {
        let t_data = [];
        for (var i=0; i < snap.docs.length; i++){
          // console.log(snap.docs[i].data())
          var x = snap.docs[i].data()["04/23/2023"]
          for (const key in x) {
            const keys = Object.keys(x[key]);
            t_data.push([x[key]["name"],x[key]["emotion"], x[key]["completed"], x[key]["id"]])
          }
          // console.log(t_data)
          // t_data.push({
          //   ...snap.docs[i].data(),
          //   id: snap.docs[i].id
          // })
        }

        setTaskData(t_data);
        // console.log("==",taskData);
      }).catch((err) => { 
        Alert.alert(err.message);
      });
    }

    useEffect(() => {
      getTasks();
      navigation.addListener("focus", () => setLoading(!loading));
    }, [navigation, loading]);


    return (
        <SafeAreaView  style={styles.container_home} >
          <View style={styles.container_home}>
            <DateSlider />
          </View>
          <View style={styles.container_list}>
          <AccordionList
            list={sections}
            header={renderHeader}
            body={renderContent}
            onToggle={handleOnToggle}
          />
          </View>

      {/* Modal code */}
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
              <TextInput  placeholderTextColor="black" style={styles.modalText} placeholder="Task Name" onChangeText={ value => setTask(value)  }/>
              <TextInput  placeholderTextColor="black" style={styles.modalText} placeholder="Date (DD/MM/YYYY)" keyboardType='numeric'  onChangeText={ value => addTaskDate(value)  }/>
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
        
    )
}

export default HomeScreenView;


const styles = StyleSheet.create({
  container_home: {
    flex: 1
  },
  container_list: {
    flex: 10,
  }, 
  text_home: {
    alignContent: 'center',
    alignItems: 'center'
  },
  buttonOutlineText: {
      justifyContent: 'center',
      alignContent: 'center',
      color: 'black'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  },
  day: {
    alignItems: 'center'
  },
  accordHeader: {
    padding: 12,
    backgroundColor: '#aaaaaa',
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
  tasksWrapper: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 20,
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
    width: 65,
    height: 65,
    left: 280,
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
    justifyContent: 'center',
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
    marginBottom: 10,
    alignContent: 'center',
    textAlign: 'center'
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
    alignContent: 'center',
    textAlign: 'center'
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    alignContent: 'center',
    textAlign: 'center'
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
    width: 200
  }
});