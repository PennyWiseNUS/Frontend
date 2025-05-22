import React, {useState, useEffect, useContext} from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';
import {AuthContext} from '../../../context/AuthContext';

const HomeScreen = ({navigation}) => {
    const [token, logout] = useContext(AuthContext);

    const LogoutHandler = async () => {
        await logout();
        navigation.navigate('Login');
    };

    return (
        <View style={StyleSheet.container}>
            <Text style={StyleSheet.title}>Welcome to PennyWise!</Text>
            <Text>Token: {token || 'No token found'}</Text>
            <Button title='Logout' onPress={LogoutHandler}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', padding: 20},
    title:{fontSize: 24, marginBottom: 20, textAlign: 'center'}
})

export default HomeScreen;