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
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'


    useEffect(() => {
        extractExpenseData();
    }, []);

    const extractExpenseData = async () => {
        try {
            const res = await axios.get(`${server_base_URL}/api/expense`, {
                headers: {Authorization: `Bearer ${token}`}
            });

            const transactions = res.data.expenseTransactions;
            const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

            setExpenseTransact(sortedTransactions);
            setMonthlyExpenses(res.data.trackedMonthlyData);
        } catch (err) {
            console.log('Error fetching data: ', err);
            setError(err.message || 'Error with data fetching');
        };
    };

    const sortTransactions = (column) => {
      let order=sortOrder;

      if (sortBy === column) {
          order = sortOrder === 'asc' ? 'desc' : 'asc';
          setSortOrder(order);
      } else {
        setSortBy(column);
        order = 'asc';
        setSortOrder('asc');
      }

      const sortedData = [...expenseTransact].sort((a, b) => {
          if (column === 'amount') {
              return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
          } else if (column === 'date') {
              return order === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
          } else if (column === 'category') {
              return order === 'asc' ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
          } else {
              return 0; // no sorting for notes
          }
      });
      setExpenseTransact(sortedData);
    };

    const renderExpenseItem = ({item}) => {
      return (   
          <View style={styles.transactionItem}>
              <Text style={styles.listItems}>{item.category}</Text>
              <Text style={styles.listItems}>${item.amount.toFixed(2)}</Text>
              <Text style={styles.listItems}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.listItems}>{item.notes || `NIL`}</Text>
          </View> 
      )
    }

    const shortenedLabels = monthlyExpenses.map(item => item.month).map(label => {
        const [month, year] = label.split(' ');
        return `${month.slice(0,3)} '${year.slice(2)}`;
    });


    return (
      <View style={styles.container}>
        <Text style={styles.header}>Expenses Overview</Text>
        <Text style={styles.sectionTitle}>Monthly Expenses</Text>
        <View style={styles.tableHeader}>
                <Text style={styles.listItems} onPress={() => sortTransactions('category')}>Category</Text>
                <Text style={styles.listItems} onPress={() => sortTransactions('amount')}>Amount</Text>
                <Text style={styles.listItems} onPress={() => sortTransactions('date')}>Date</Text>
                <Text style={styles.listItems}>Notes</Text>
            </View>
            <FlatList data={expenseTransact} renderItem={renderExpenseItem} keyExtractor={transact => transact._id} style={styles.transactionList}/>
            <BottomNavigation navigation={navigation} activeTab="Home"/>
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