import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const CustomCheckbox = ({givenValue, date, taskname, onChangeFunction}) => {
  const [value, setValue] = useState(givenValue);
  const [checkToUpdate, setCheck] = useState(true);

  useEffect(() => {
    if(!checkToUpdate){
        onChangeFunction(value, date, taskname);
        setCheck(true);
    }
  });

  const handlePress = () => {
    if (value === '0') {
      setValue('1');
    } else if (value === '1') {
      setValue('2');
    } else if (value === '2') {
      setValue('0');
    }
    setCheck(false);
  };

  const getCheckboxIcon = (index) => {
    if (index === '0') {
      return 'square-o';
    } else if (index === '1') {
      return 'times';
    } else if (index === '2') {
      return 'check-square-o';
    }
  };


  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <FontAwesome name={getCheckboxIcon(value)} size={24} style={value==='0'? styles.unchecked : value === '1' ? styles.notCompleted : styles.completed} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notCompleted: {
    borderRadius: 10,
    color: 'red',
    marginHorizontal: 5,
  },
  completed: {
    borderRadius: 10,
    color: 'green',
    marginHorizontal: 5,
  },
  unchecked: {
    borderRadius: 10,
    color: 'grey',
    marginHorizontal: 5,
  },
});

export default CustomCheckbox;
