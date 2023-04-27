import React from 'react';
import { View, Text, StyleSheet,Image, Touchable, TouchableOpacity } from 'react-native';

const Task = (props) => {
    // console.log(props);

    const IsHappy = (happy) => {
        if (happy["happy"] !== null || happy["happy"] !== undefined) {
            return (
            <TouchableOpacity>
                <Image source = {require('../images/happiness.png')} style={styles.image} />
            </TouchableOpacity>
            )
        }
    }

    // var isComplete = false
    const IsCompleted = (isComplete) => {
        if(isComplete["isComplete"]) {
            return (
                <TouchableOpacity>
                    <Image source = {require('../images/check.png')} style={styles.imageBefore} />
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity>
                    <Image source = {require('../images/uncheck.png')} style={styles.imageBefore} />
                </TouchableOpacity>
            )
        }
    }


    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <IsCompleted isComplete={props.text[2]}/>
                <Text style={styles.itemText}>{props.text[0]}</Text>        
            </View>
            <IsHappy happy={props.text[1]} />
            
            <TouchableOpacity>
                <Image source = {require('../images/confused.png')} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity>
                <Image source = {require('../images/sad.png')} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity>
                <Image source = {require('../images/angry.png')} style={styles.image} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: "center",
        flexWrap: 'wrap'
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: '#55BCF6',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15,
    },
    itemText: {
        maxWidth: '80%'
    },
    circular: {
        width: 12,
        height: 12,
        borderColor: '#55BCF6',
        borderWidth: 2,
        borderRadius: 5, 
    },
    image: {
        width: 24,
        height: 24,
    },
    imageBefore: {
        width: 24,
        height: 24,
        marginRight: 15,
    },
})

export default Task;