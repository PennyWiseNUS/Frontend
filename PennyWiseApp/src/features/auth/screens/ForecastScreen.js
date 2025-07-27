import React, {useState, useEffect, useContext} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import {AuthContext} from '../../../context/AuthContext';
import axios from 'axios';
import { server_base_URL } from '../../../config';
import BottomNavigation from '../../../components/bottomNavigation';

const forecastByCategory = (transactions, monthsToUse = 3) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthMap = {};

  transactions.forEach(txn => {
    const date = new Date(txn.entryDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    if (year === currentYear && month === currentMonth) return;

    const key = `${year}-${month}`;
    if (!monthMap[key]) monthMap[key] = {};
    if (!monthMap[key][txn.category]) monthMap[key][txn.category] = 0;
    monthMap[key][txn.category] += txn.amount;
  });

  const recentKeys = Object.keys(monthMap)
    .sort((a, b) => new Date(b) - new Date(a))
    .slice(0, monthsToUse);

  const categorySums = {};
  const categoryCounts = {};

  recentKeys.forEach(month => {
    const monthData = monthMap[month];
    for (const category in monthData) {
      if (!categorySums[category]) {
        categorySums[category] = 0;
        categoryCounts[category] = 0;
      }
      categorySums[category] += monthData[category];
      categoryCounts[category] += 1;
    }
  });

  const forecast = {};
  for (const category in categorySums) {
    forecast[category] = parseFloat((categorySums[category] / categoryCounts[category]).toFixed(2));
  }

  return forecast;
};


const ForecastScreen = ({navigation}) => {
  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [forecastedBudget, setForecastedBudget] = useState({});
  const [currentSpend, setCurrentSpend] = useState({});
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [goals, setGoals] = useState({});

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${server_base_URL}/api/expense`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data.expenseTransactions);
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses');
    }
  };

  const getCurrentMonthSpend = (transactions) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
  
    const currentSpend = {};
  
    transactions.forEach(txn => {
      const date = new Date(txn.entryDate);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        if (!currentSpend[txn.category]) currentSpend[txn.category] = 0;
        currentSpend[txn.category] += txn.amount;
      }
    });
  
    return currentSpend;
  };
  

  useEffect(() => {
    if (transactions.length > 0) {
      const forecast = forecastByCategory(transactions);
      const actualSpend = getCurrentMonthSpend(transactions);
      setCurrentSpend(actualSpend);
      setForecastedBudget(forecast);
      
      const categories = Object.keys(forecast);
      const defaultGoals = {};
      categories.forEach(cat => {
        defaultGoals[cat] = forecast[cat];
      });
      setGoals(defaultGoals);
    }
  }, [transactions]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Forecast for This Month</Text>
      {Object.keys(forecastedBudget).length === 0 && <Text>Loading forecast...</Text>}
      <View style={[styles.row, styles.headingRow]}>
          <Text style={[styles.cell, styles.headingText]}>Category</Text>
          <Text style={[styles.cell, styles.headingText]}>Forecasted</Text>
          <Text style={[styles.cell, styles.headingText]}>Goal</Text>
          <Text style={[styles.cell, styles.headingText]}>Status</Text>
        </View>
    {Object.entries(forecastedBudget).map(([category, amount]) => (
    <View key={category}>
    <TouchableOpacity
      onPress={() =>
        setSelectedCategory(prev => (prev === category ? null : category))
      }
    >
      <View style={styles.row}>
        <Text style={styles.cell}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
        <Text style={styles.cell}>${amount.toFixed(2)}</Text>
        <TextInput
          style={[styles.cell, styles.goalInput]}
          value={
            goals[category] !== undefined ? goals[category].toString() : ''
          }
          keyboardType="numeric"
          onChangeText={(text) => {
            const value = parseFloat(text);
            if (!isNaN(value)) {
              setGoals(prev => ({ ...prev, [category]: value }));
            } else if (text === '') {
              setGoals(prev => ({ ...prev, [category]: '' }));
            }
          }}
          placeholder="—"
        />
        <Text style={styles.cell}>
          {goals[category] === undefined
            ? '—'
            : currentSpend[category] === undefined
            ? 'No spending yet'
            : currentSpend[category] > goals[category]
            ? `Over by $${(currentSpend[category] - goals[category]).toFixed(0)} 🔴`
            : currentSpend[category] < goals[category]
            ? `Remaining $${(goals[category] - currentSpend[category]).toFixed(0)} ✅`
            : 'On Track! Yay'}
        </Text>
      </View>
    </TouchableOpacity>

    {selectedCategory === category &&
      transactions
        .filter(txn => txn.category === category)
        .map(txn => (
          <View key={txn._id} style={styles.subRow}>
            <Text style={styles.subCell}>• ${txn.amount.toFixed(2)}</Text>
            <Text style={styles.subCell}>{new Date(txn.entryDate).toLocaleDateString()}</Text>
            <Text style={styles.subCell}>{txn.notes || '—'}</Text>
          </View>
        ))}
  </View>
))}

    {error && <Text style={styles.error}>{error}</Text>}
    <BottomNavigation navigation={navigation} activeTab="Home"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  cell: {
    width: 90, 
    fontSize: 16,
    textAlign: 'center',
  },
  error: { color: 'red', marginTop: 10, textAlign: 'center' },
  headingRow: {
    borderBottomWidth: 2,
    borderColor: '#000',
    paddingBottom: 4,
    marginTop: 10,
  },
  headingText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingLeft: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 0.5,
    borderColor: '#ccc'
  },
  subCell: {
    width: '33%',
    fontSize: 13,
    color: '#333'
  },
  goalInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    width: '30%',
    paddingVertical: 2,
  },
});

export default ForecastScreen;
