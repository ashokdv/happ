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

const CollapsibleView = ({ title, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const containerHeight = isCollapsed ? 50 : contentHeight + 70;

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  return (
    <Animated.View style={[styles.container, { height: containerHeight, width: windowWidth - 20 }]}>
      <TouchableOpacity style={styles.header} onPress={toggleCollapse}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={isCollapsed ? 'chevron-down' : 'chevron-up'} size={24} color="black" />
      </TouchableOpacity>
      <View onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}>
        {React.Children.map(children, (child) => (
          <View style={styles.card}>{child}</View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
  },
});

export default CollapsibleView;
