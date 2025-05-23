import React, {useContext, useState} from 'react'; // for managing inputs & error messages
import {View, TextInput, Button, Text, StyleSheet, Image} from 'react-native';
import axios from 'axios'; // making http req to backend 
import {server_base_URL} from '../../../config'; // get base url from config file for cleaner api calls
import {AuthContext} from '../../../context/AuthContext';

const LoginScreen = ({navigation}) => {
    // state hooks
    const [email, setEmail] = useState(''); // user input for email
    const [password, setPassword] = useState(''); // user input for password
    const [error, setError] = useState(''); // stores login err msg (if any)
    const {login} = useContext(AuthContext);

    
    // Login handler
    const loginHandler = async () => {
      try {
        //console.log('Sending request to:', `${server_base_URL}/api/auth/login`, 'with data:', {email, password});
        // await res after sending a post req with email and pw to login api
        const serverResponse = await axios.post(
          `${server_base_URL}/api/auth/login`, 
          {email, password}
        );
        //console.log('Login Response:', serverResponse.data);
        // upon successful login, store JWT token on device
        await login(serverResponse.data.token);
        // nav to home page
        navigation.navigate("Home");
      } catch (err) {
        //console.log('Login error:', err.response?.data?.msg);
        // preferred err msg to show, uses optional chaining which safely checks if the next value exists
        setError(err.response?.data?.msg || err.message || 'Login Unsuccessful');
      };
    }

    return (
      <View style={styles.container}>
        <Text style={styles.header}>PennyWise</Text>
        <Text style={styles.subtitle}>Your One-Stop Finance Management App</Text>
        <Image source={require("../../../../assets/loginPage2.jpg")} style={styles.image}/>
        <View style={styles.card}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Email:</Text>
            <TextInput style={styles.input} placeholder="Input your email" value={email} onChangeText={setEmail} keyboardType="email address" autoCapitalize="none"/>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Password:</Text>
            <TextInput style={styles.input} placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry/>
          </View>
          <View style={styles.button}>
            <Button style={styles.button} title="Sign In" color="#007bff" onPress={loginHandler}/>
          </View>
          <View style={styles.button}>
            <Button title="Create a New Account" color="#007bff" onPress={() => navigation.navigate('Register')}/>
          </View>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    image: {width:'90%', height:'30%', borderRadius:10},
    container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    header: {fontFamily: 'Times New Roman', fontSize: 70, fontWeight: 'bold', marginBottom: 5, color: '#000000'},
    subtitle: {fontSize: 18, marginBottom: 20, fontWeight: 'bold', color: '#000000'},
    card: {backgroundColor: '#ffffff', alignItems: 'center', width: '90%', borderRadius:10},
    inputRow: {flexDirection: 'row', alignItems: 'center', marginTop: 5, width: '100%'},
    label: {width: '25%', fontSize: 16, color: '#000000', marginLeft:5},
    input: {width: '70%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 5, borderRadius: 5, backgroundColor: `#fff`},
    error: {color: 'red', marginTop: 5, marginBottom: 5, textAlign: 'center', fontSize: 16},
    button: {paddingBottom: 10}
});

export default LoginScreen;