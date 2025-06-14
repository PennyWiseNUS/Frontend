import React, { useContext, useEffect, useState } from 'react';
import {AuthContext} from '../../../context/AuthContext';
import axios from 'axios'; // http client for making api req
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import {server_base_URL} from '../../../config';
import BottomNavigation from '../../../components/bottomNavigation';
// import Chart from 'chart.js/auto';

const ExpensesScreen = ({navigation}) => {
    const {token} = useContext(AuthContext);

    const [expenseTransact, setExpenseTransact] = useState([]);
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    const [error, setError] = useState('');
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        extractExpenseData();
    }, []);

    const extractExpenseData = async () => {
        try {
            const res = await axios.get(`${server_base_URL}/api/expenses`, {
                headers: {Authorization: `Bearer ${token}`}
            });

            setExpenseTransact(res.data.expenseTransactions);
            setMonthlyExpenses(res.data.trackedMonthlyData);
        } catch (err) {
            console.log('Error fetching data: ', err);
            setError(err.message || 'Error with data fetching');
        };
    };

    const shortenedLabels = monthlyExpenses.map(item => item.month).map(label => {
        const [month, year] = label.split(' ');
        return `${month.slice(0,3)} '${year.slice(2)}`;
    });


    return (
      <View style={styles.container}>
        <Text style={styles.header}>Expenses Overview</Text>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20},
    header: {fontSize: 32, fontWeight: 'bold', marginVertical:20, alignSelf: 'center'},
    sectionTitle: {fontSize: 15, fontWeight: '600', alignSelf: 'center', backgroundColor: '#00ccff'},
    chart: {marginVertical:8, borderRadius:10},
    transactionList: {flex: 1, marginBottom: 20},
    transactionItem: {flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd'},
    listItems: {width: '25%', textAlign: 'center'},
    tableHeader: {flexDirection: 'row', alignItems: 'center', padding:10, borderBottomWidth: 1, borderBottomColor: '#ddd'},
  });

  export default ExpensesScreen;