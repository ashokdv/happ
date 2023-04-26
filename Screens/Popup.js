import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';


const Popup = ({ isVisible, onClose, onOptionPress, selectedEmotion, date, taskname }) => {

    const [selected, setSelected] = useState(selectedEmotion);
    const [checkToUpdate, setCheck] = useState(true);

    useEffect(() => {
        if (!checkToUpdate) {
            onOptionPress(selected, date, taskname);
            setCheck(true);
        }
    });

    const handleEmotionSelect = (option) => {
        setSelected(option);
        setCheck(false);
    }

    //console.log(selectedEmotion);

    return (
        <Modal animationType="fade" transparent visible={isVisible} onRequestClose={onClose}>
            <TouchableOpacity
                style={styles.container}
                activeOpacity={1}
                onPressOut={onClose}
            >   
                <View style={{ padding: 40, borderRadius: 5, backgroundColor: 'white', marginTop: 10, marginBottom: 20, display: 'flex', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Image source={require('../assets/icon-close.png')} style={styles.closeIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEmotionSelect('1')}>
                        <Text style={{ fontSize: selected === '1' ? 40 : 30 }}>
                            &#x1F62B; {/* Sad */}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEmotionSelect('2')}>
                        <Text style={{ fontSize: selected === '2' ? 40 : 30 }}>
                            &#x1F621; {/* Angry */}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEmotionSelect('3')}>
                        <Text style={{ fontSize: selected === '3' ? 40 : 30 }}>
                            &#x1F615; {/* Confused */}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEmotionSelect('4')}>
                        <Text style={{ fontSize: selected === '4' ? 40 : 30 }}>
                            &#x1F929; {/* Happy */}
                        </Text>
                    </TouchableOpacity>
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
});

export default Popup;
