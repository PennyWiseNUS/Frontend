import React, {useState, useEffect, useContext} from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';
import {AuthContext} from '../../../context/AuthContext';

const HomeScreen = ({navigation}) => {
    // to prevent rendering until context is available
    const contextValue = useContext(AuthContext);
    console.log(contextValue);

    // outputting to console when context not avail
    useEffect(() => {
        if (!contextValue) {
            console.error('AuthContext is not defined');
        }
    }, [contextValue])

    if (!contextValue) {
        return <Text>Page Loading...</Text>;
    }
    //console.log("success");
    const {token, logout} = contextValue;
    //console.log(logout);
    const LogoutHandler = async () => {
        await logout();
        navigation.navigate('Login');
    };
    //console.log("success");
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
    title:{fontSize: 48, marginBottom: 20, textAlign: 'center'}
})

export default HomeScreen;