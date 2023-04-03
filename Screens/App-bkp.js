import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
    <Text style={styles.loginText}> Login </Text>
    
    <View style={styles.email_password}>
      <TextInput style={styles.inputText} placeholder="Email" placeholderTextColor="black"/>
    </View>
    <View style={styles.email_password}>
      <TextInput style={styles.inputText} placeholder="Password" placeholderTextColor="black"/>
    </View>
    
    <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText:{
    fontWeight: "bold",
    fontSize:30,
    color:"black",
    marginBottom: 70,
    },
    email_password:{
      width:"80%",
      backgroundColor:"grey",
      height:50,
      marginBottom:30,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 0,
      borderRadius: 25,
      justifyContent:"center",
      padding:20
    },
    
    

});
