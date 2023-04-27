import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

const CollapsibleView = ({ title, children, inner }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [contentHeight, setContentHeight] = useState(0);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const containerHeight = isCollapsed ? 50 : contentHeight + 60;

    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;

    return (
        <Animated.View style={inner == 'true' ? [styles.container, { height: containerHeight, width: windowWidth - 60 }]
            : [styles.container, { height: containerHeight, width: windowWidth - 20 }]}>
            <TouchableOpacity style={styles.header} onPress={toggleCollapse}>
                <Text style={inner == 'true' ? styles.titleInn : styles.title}>{title}</Text>
                <Ionicons name={isCollapsed ? 'chevron-down' : 'chevron-up'} size={24} color="black" style={{ marginRight: 5 }} />
            </TouchableOpacity>
            <View onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}>
                {React.Children.map(children, (child) => (
                    <View style={inner == 'true' ? styles.cardInn : styles.cardExt}>{child}</View>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        backgroundColor: 'transparent',
    
    },
    title: {
        marginLeft: '4%',
        fontSize: 18,
        fontWeight: 'bold',
    },
    titleInn: {
        marginLeft: '4%',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardExt: {
        marginVertical: 5,
        padding: 10,
    },
    cardInn: {
        //backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        backgroundColor: 'transparent',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'transparent',
        overflow: 'hidden',
        margin: 5,
        shadowColor: '#000',
        shadowOpacity: 0.25,
    }
});

export default CollapsibleView;
