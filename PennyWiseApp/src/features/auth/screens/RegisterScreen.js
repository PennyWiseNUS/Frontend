import React, {useState} from 'react'; // for managing inputs & error messages
import {View, TextInput, Button, Text, StyleSheet, StatusBar, ImageBackground} from 'react-native';
import axios from 'axios'; // making http req to backend
import {server_base_URL} from '../../../config'; // get base url from config file for cleaner api calls

const RegisterScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const registerHandler = async () => {
        try {
            console.log('Sending Request to:', `${server_base_URL}/api/auth/register`, 'with data:', JSON.stringify({email, password}))
            const serverResponse = await axios.post(`${server_base_URL}/api/auth/register`, {email, password});
            console.log('Register response:', serverResponse.data)
            // return an alert to let user know that their registration is successful and to re log in
            alert('You have been registered! Please log in again!');
            navigation.navigate("Login");
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.msg || err.message || 'Registration Unsuccessful');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Budgeting Journey Begins.</Text>
            <Text style={styles.title}>Fill in your details to sign up!</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.card}>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Email:</Text>
                    <TextInput style={styles.input} placeholder="Input your email" value={email} onChangeText={setEmail} keyboardType="email address" autoCapitalize="none"/>
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Password:</Text>
                    <TextInput style={styles.input} placeholder="Create your password" value={password} onChangeText={setPassword} secureTextEntry/>
                </View>
                <View style={styles.button}>
                  <Button title="Register" colour="007bff" onPress={registerHandler}/>
                </View>
            </View>
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'},
    title: {alignItems: 'center', fontSize: 24, fontWeight: 'bold', marginBottom: 10},
    error: {color: 'red', marginTop: 5, marginBottom: 5, textAlign: 'center', fontSize: 16},
    card: {backgroundColor: '#ffffff', alignItems: 'center', width: '90%', borderRadius:10},
    inputRow: {flexDirection: 'row', alignItems: 'center', marginTop: 5, width: '100%'},
    label: {width: '25%', fontSize: 16, color: '#000000', marginLeft:5},
    input: {width: '70%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 5, borderRadius: 5, backgroundColor: `#fff`}
})

export default RegisterScreen;