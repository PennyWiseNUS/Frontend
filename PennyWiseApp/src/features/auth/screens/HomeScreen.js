import React, {useState, useEffect, useContext, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {AuthContext} from '../../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNavigation from '../../../components/bottomNavigation';
import {jwtDecode} from 'jwt-decode'; // decode jwt tokan and extract email 
import axios from 'axios'; // http client for making api req
import {server_base_URL} from '../../../config';

const HomeScreen = ({navigation}) => {
    // to prevent rendering until context is available
    const contextValue = useContext(AuthContext);
    //console.log(contextValue);

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

    // extracting username from email
    let username = "Unknown Person";
    if (token) {
        try {
            const decodeToken = jwtDecode(token);
            const email = decodeToken.user?.email;
            if (email) {
                // do the splitting and assign to username
                username = email.split('@')[0];
            } else {
                console.warn(`No email found in Token`);
            } 
        } catch (err) {
            console.error(`Error decoding token: ${err.message}`);
        }
    }

    // creating the 3 by 3 grid 
    const contentItems = [
        {title: 'Add an Entry', icon: 'add', color: '#CF8A4E'},
        {title: 'Income and Savings', icon: 'savings', color: '#79B6E2'},
        {title: 'Expenses', icon:'monetization-on', color: '#81C288'},
        {title: 'Financial Goals', icon:'star', color: '#AA81C2'},
        {title: 'Budget Forecasting', icon:'date-range', color: '#F2EEAC'},
        {title: 'Financial Portfolios', icon:'trending-up', color: '#F0C5EB'},
        {title: 'Loans', icon:'support-agent', color: '#C5D1F0'},
        {title: 'InfoPennyWise', icon:'info', color: '#D5F3EB'},
        {title: 'More', icon:'pending', color: '#F5D9A1'},
    ]

    const navigateToPage = (title) => {
        console.log(`Navigating to ${title} page; need to change to navigation.navigate(title) next`);
        navigation.navigate(title);
    }

    const [monthlyExpense, setMonthlyExpense] = useState({ total: 0, month: ''});
    useFocusEffect(useCallback(() => {
        const fetchTotalFromExpense = async () => {
            try {
                const res = await axios.get(`${server_base_URL}/api/expense`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                const thisMonth = res.data.trackedMonthlyData.slice(-1)[0];
                if (thisMonth) {
                    setMonthlyExpense({total: thisMonth.expense, month: thisMonth.month});
                }
            } catch (err) {
                console.error('Error fetching monthly expense:', err);
            }
        };
        fetchTotalFromExpense();
    }, [token]));

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headercard}>
                <Text style={styles.greeting}>Hello,</Text>
                <Text style={styles.name}>{username}</Text>
                <Text style={styles.title}>Welcome to PennyWise!</Text>
            </View>

            {/* Current Expense Tracker */}
            <View style={styles.expensecard}>
                <Text style={styles.expenseheader}>Total Expenses</Text>
                <Text style={styles.expenseamt}>${monthlyExpense.total.toFixed(2)}</Text>
                <Text style={styles.expensemonth}>{monthlyExpense.month}</Text>
            </View>

            {/* Content Page Grid*/}
            <View style={styles.grid}>
                {contentItems.map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={[styles.contentItem]}
                        onPress={() => navigateToPage(item.title)}
                    >
                        <View style={[styles.iconcontainer,  {backgroundColor: item.color}]}>
                            <Icon name={item.icon} size={50} color='#fff'/>
                        </View>   
                        <Text style={styles.contentitemtext}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <BottomNavigation navigation={navigation} activeTab="Home" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', padding: 20, paddingBottom:60},
    headercard: {backgroundColor:"#7DCB84", width: "100%", borderRadius:10, padding:20, marginBottom:10},
    greeting: {fontSize: 16, color:"white"},
    name: {fontSize: 30, color:"white", fontWeight: "bold"},
    title: {fontSize: 16, textAlign: 'left', color:"white"},
    expensecard: {backgroundColor:"#ffffff", width: "90%", borderRadius:10, padding:10, marginBottom:20, alignSelf: "center"},
    expenseheader: {fontSize: 20, color:"black"},
    expenseamt: {fontSize: 24, color:"#67976B", fontWeight:'bold'},
    expensemonth: {fontSize: 16, color:"black"},
    grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding:10},
    iconcontainer: {justifyContent: 'center', alignItems: 'center', width:'50%', borderRadius:10},
    contentItem: {width: '30%', aspectRatio:1, borderRadius:10, alignItems:'center', margin:5},
    contentitemtext: {fontSize: 14, color: '#000000', textAlign: 'center', marginTop:5}
})

export default HomeScreen;