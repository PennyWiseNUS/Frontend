import React, {useState, useEffect, useContext} from 'react';
import {AuthContext} from '../../../context/AuthContext';
import axios from 'axios'; // http client for making api req
// flatList - for efficient list rendering
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {server_base_URL} from '../../../config';
// rendering a line graph
import {LineChart} from 'react-native-chart-kit';
// getting screen width for responsive chart rendering
import {Dimensions} from 'react-native';
import BottomNavigation from '../../../components/bottomNavigation';

const IncomeSavingsScreen = ({navigation}) => {
    const {token} = useContext(AuthContext);
    // need to get income transactions from back end, start off with an empty list, to indicate no transactions
    const [incomeTransact, setIncomeTransact] = useState([]);
    // need to get savings from back end
    const [monthlySavings, setMonthlySavings] = useState([]);
    const [error, setError] = useState('');
    // changing the screen width dynamically based on window size
    // window is used more commonly than screen as it gives the actual area the app can draw into without overlapping system UI (status bar etc)
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    // create a side effect to get data from backend (one time)
    useEffect(() => {
        extractIncomeSavings();
    }, []);

    // getting api data
    const extractIncomeSavings = async () => {
        try {
            const res = await axios.get(`${server_base_URL}/api/income`, {
                headers: {Authorization: `Bearer ${token}`}
            });

            // assign the response to the individual groups, income transactions and savings data
            setIncomeTransact(res.data.incomeTransactions);
            setMonthlySavings(res.data.trackedMonthlyData);
            //console.log(incomeTransact);
        } catch (err) {
            console.log('Error fetching data: ', err);
            setError(err.message || 'Error with data fetching');
        };
    };

    const shortenedLabels = monthlySavings.map(item => item.month).map(label => {
        const [month, year] = label.split(' ');
        return `${month.slice(0,3)} '${year.slice(2)}`;
    })

    const chartData = monthlySavings.length > 0 ? {
        labels: shortenedLabels,
        datasets: [
            // savings dataset
            {
                data: monthlySavings.map(item => item.savings || 0),
                color: (opacity = 1) => `rgba(79, 182, 226, ${opacity})`,
                strokeWidth: 2,
            },
            // income dataset
            {
                data: monthlySavings.map(item => item.income || 0),
                color: (opacity = 1) => `rgba(129, 194, 136, ${opacity})`,
                strokeWidth: 2,
            },
        ],
        legend: ['Savings', 'Income'],
    }
    : {labels: [], datasets: [{data: [], color: () => '#000000', strokeWidth: 2}, {data: [], color: () => '#000000', strokeWidth: 2}]};
        
    // chart configuration
    const chartConfiguration = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        // still need to include color for rendering labels, tooltips etc
        color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        decimalPlaces: 2,
        style: {borderRadius: 16},
    };

    // function to render each item in the income transactions list
    const renderTransaction =({item}) => {
        return (   
            <View style={styles.transactionItem}>
                <Text style={styles.listItems}>{item.category}</Text>
                <Text style={styles.listItems}>${item.amount.toFixed(2)}</Text>
                <Text style={styles.listItems}>{new Date(item.entryDate).toLocaleDateString()}</Text>
                <Text style={styles.listItems}>{item.notes || `NIL`}</Text>
            </View> 
        )
    }
    // bezier for smooth lines
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Income and Savings</Text>
            <Text style={styles.sectionTitle}>Your Income and Savings Trend for the past 6 months</Text>
            {monthlySavings.length > 0 ? (
                <LineChart data={chartData} width={screenWidth-40} height={screenHeight*0.3} chartConfig={chartConfiguration} bezier style={styles.chart}/>
            ) : (
                <Text style={styles.noDataText}>No Data recorded yet. Add entries to view trends!</Text>
            )}
            <Text style={styles.sectionTitle}>Income Transactions for this Month</Text>
            <View style={styles.tableHeader}>
                <Text style={styles.listItems}>Category</Text>
                <Text style={styles.listItems}>Amount</Text>
                <Text style={styles.listItems}>Date</Text>
                <Text style={styles.listItems}>Notes</Text>
            </View>
            <FlatList data={incomeTransact} renderItem={renderTransaction} keyExtractor={transact => transact._id} style={styles.transactionList}/>
            <BottomNavigation navigation={navigation} activeTab="Home" />
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

export default IncomeSavingsScreen;