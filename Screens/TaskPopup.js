import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';


const TaskPopup = ({ isVisible, onClose, selectedEmotion, date, taskname, desc, isCompleted }) => {



    const getStatus = (key) => {
        if(key === '0'){
            return 'Not yet'
        }
        else if(key === '1'){
            return 'No'
        }
        if(key === '2'){
            return 'Yes'
        }
    } 

    const getEmoji = (emotion) => {
        if (emotion == '') {
          return (<View><Text style={{ fontSize: 14,  paddingTop: 10 }}>Not yet given</Text></View>);
        }
        else if (emotion == '1') {
          return (<Text style={{ fontSize: 25, paddingTop: 10 }}>&#x1F62B;</Text>);
        }
        else if (emotion == '2') {
          return (<Text style={{ fontSize: 25, paddingTop: 10 }}>&#x1F621;</Text>);
        }
        else if (emotion == '3') {
            return (<Text style={{ fontSize: 25,  paddingTop: 10}}>&#x1F615;</Text>);
        }
        else if (emotion == '4') {
          return (<Text style={{ fontSize: 25, paddingTop: 10 }}>&#x1F929;</Text>);
        }
      }

    return (
        <Modal animationType="fade" transparent visible={isVisible} onRequestClose={onClose}>
            <TouchableOpacity
                style={styles.container}
                activeOpacity={1}
                onPressOut={onClose}
            >
                <View style={styles.ModalContainer}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Image source={require('../assets/icon-close.png')} style={styles.closeIcon} />
                    </TouchableOpacity>
                    <View style={styles.row}>
                        <Text style={styles.key}>
                            Date:
                        </Text>
                        <Text style={styles.value}>{date}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.key}>
                            Title:
                        </Text>
                        <Text style={styles.value}>{taskname}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.key}>
                            Description:
                        </Text>
                        <Text style={styles.value}>{desc}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.key, {paddingTop: 10}]}>
                            Feeling:
                        </Text>
                        <Text style={[styles.value]}>{getEmoji(selectedEmotion)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.key}>
                            Completed?
                        </Text>
                        <Text style={styles.value}>{getStatus(isCompleted)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    optionText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeIcon: {
        width: 20,
        height: 20,
    },
    ModalContainer: {
        padding: 40, 
        borderRadius: 5, 
        backgroundColor: 'white', 
        marginTop: 10, 
        marginBottom: 20, 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center', 
        width: '90%'
    },
    row: {
        display: 'flex', 
        flexDirection: 'row',
        marginVertical: 10,
    },
    key: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 14
    },
    value: {
        flex: 2,
        fontSize: 14,
        paddingLeft: 5
    },
   
});

export default TaskPopup;
