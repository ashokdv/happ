import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const ToastMessage = ({ message, type = 'default', duration = 3000, onHide }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onHide();
    }, duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [duration, onHide]);

  return (
    <View style={[styles.container, type === 'error' && styles.error, type === 'success' && styles.success]}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 80 : 50,
    zIndex: 999,
  },
  message: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    backgroundColor: 'red',
  },
  success: {
    backgroundColor: 'green',
  },
});

export default ToastMessage;
