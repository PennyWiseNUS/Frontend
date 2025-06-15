import React, { useContext, useEffect, useState } from 'react';
import {AuthContext} from '../../../context/AuthContext';
import axios from 'axios'; // http client for making api req
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {server_base_URL} from '../../../config';
import BottomNavigation from '../../../components/bottomNavigation';

// import Chart from 'chart.js/auto';

const ExpensesScreen = ({navigation}) => {
    const {token} = useContext(AuthContext);

    const [expenseTransact, setExpenseTransact] = useState([]);
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const screenWidth = Dimensions.get('window').width;
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);


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
    const currentMonthShortLabel = () => {
      const now = new Date();
      const month = now.toLocaleString('default', { month: 'short' });
      const year = now.getFullYear().toString().slice(2);
      return `${month} '${year}`;
    };

    useEffect(() => {
      if (monthlyExpenses.length > 0 && selectedMonthIndex === null) {
        const labels = monthlyExpenses.map(item => {
          const [month, year] = item.month.split(' ');
          return `${month.slice(0,3)} '${year.slice(2)}`;
        });
        const currentLabel = currentMonthShortLabel();
        const index = labels.findIndex(label => label === currentLabel);
        if (index !== -1) {
          setSelectedMonthIndex(index);
        }
      }
    }, [monthlyExpenses]);

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
              <Text style={styles.listItems}>{item.category.charAt(0).toUpperCase()+item.category.slice(1)}</Text>
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

    const totalMonthlyExpenses = monthlyExpenses.map(item => item.expense);
    const chartData = {
      labels: shortenedLabels,
      datasets: [{ data: totalMonthlyExpenses}],
    };

    const selectedMonthLabel = shortenedLabels[selectedMonthIndex];

    const filteredExpenses = selectedMonthLabel 
    ? expenseTransact.filter(x => {
      const month = new Date(x.date).toLocaleString('default', { month: 'short' });
      const year = new Date(x.date).getFullYear().toString().slice(2);
      return `${month} '${year}` === selectedMonthLabel;
    })
    : [];

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Expenses Overview</Text>
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            fromZero
            chartConfig={styles.chartConfig}
            style={styles.chartContainer}
          />

        <View style={[styles.chartOverlay, {top: 105}]}>
          {chartData.labels.map((label, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chartTouch} // same height as chart
              onPress={() => {console.log("pressed"); setSelectedMonthIndex(index)}}
            />
          ))}
        </View>
        <Text style={styles.sectionTitle}>Monthly Expenses</Text>
        <View style={styles.tableHeader}>
                <Text style={styles.listItems} onPress={() => sortTransactions('category')}>Category</Text>
                <Text style={styles.listItems} onPress={() => sortTransactions('amount')}>Amount</Text>
                <Text style={styles.listItems} onPress={() => sortTransactions('date')}>Date</Text>
                <Text style={styles.listItems}>Notes</Text>
            </View>
        <FlatList
            data={selectedMonthIndex !== null ? filteredExpenses : expenseTransact}
            renderItem={renderExpenseItem}
            keyExtractor={transact => transact._id}
            style={styles.transactionList}
          />
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
    chartContainer: {marginBottom:16, borderRadius: 10, alignSelf: 'center'},
    chartConfig: {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 1) => `rgba(0,122,255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        decimalPlaces:2,
        style: {borderRadius: 16},
        propsForBackgroundLines: {
          stroke: '#e3e3e3',
        },
    },
    chartOverlay: {position: 'absolute', left: 20, right: 20, flexDirection: 'row',},
    chartTouch: { flex: 1, height: 220},
  });

  export default ExpensesScreen;