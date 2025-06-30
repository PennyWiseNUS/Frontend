import {useState, useEffect, useContext} from 'react';
import {AuthContext} from '../../../context/AuthContext';
import { FlatList, StyleSheet, View, Text, ScrollView } from 'react-native';
import useLoanList from '../../../hooks/useLoanList';
import BottomNavigation from '../../../components/bottomNavigation';

const LoanScreen = ({navigation}) => {
    const {token} = useContext(AuthContext);
    const {loanList, getLoanList, loading} = useLoanList(token); // reused function to prevent continuous re-rendering

    useEffect(() => {
        getLoanList();
    }, []);
    
    const currentLoans = loanList.filter(
        loan => parseFloat(loan.amount) > loan.repaidAmount
    );
    const clearedLoans = loanList.filter(
        loan => parseFloat(loan.amount) <= loan.repaidAmount
    );

    const renderLoanItem = ({item}) => {
        const {notes, amount, repaidAmount, repaymentDate, isRecurring, interestRate, nextReminderDate} = item;
        const percentage = Math.min((repaidAmount/amount) * 100, 100).toFixed(1);
        return (
            <View style={styles.loanItem}>
                {/*Row 1 -- Loan Name and Loan Progress (X/Y)*/}
                <View style={styles.row}>
                    <Text style={styles.loanName}>{notes}</Text>
                    <Text style={styles.repaymentValue}>${repaidAmount} / ${amount}</Text>
                </View>

                {/*Row 2 -- Loan Progress Bar*/}
                <View style={styles.barBackground}>
                    <View style={[styles.barFill, { width: `${percentage}%` }]} />
                </View>

                {/*Row 3 -- Next Payment Date, Full Payment Date, Percentage*/}
                <View style={[styles.row, {alignItems:'flex-start'}]}>
                    {/*Column 1*/}
                    <View> 
                        <Text style={styles.details}>
                            Next Payment: {isRecurring ? new Date(nextReminderDate).toLocaleDateString() : 'NIL'}  
                        </Text>
                        <Text style={styles.details}>
                            Full Payment Due: {new Date(repaymentDate).toLocaleDateString()}  
                        </Text>
                    </View>
                    {/*Column 2*/}
                    <View>
                        <Text style={styles.details}>Interest: {Math.min(interestRate * 100).toFixed(2)}%</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.wrapper}>
            <ScrollView style={styles.container}>
                <Text style={styles.header}>Current & Past Loans</Text>
                <Text style={styles.sectionheader}>Outstanding Loans</Text>
                <FlatList data = {currentLoans} keyExtractor={item => item._id} renderItem={renderLoanItem} scrollEnabled={false}/>
                <Text style={styles.sectionheader}>Past Loans</Text>
                <FlatList data = {clearedLoans} keyExtractor={item => item._id} renderItem={renderLoanItem} scrollEnabled={false}/>
            </ScrollView>
            <BottomNavigation navigation={navigation} activeTab="Home" />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {flex:1},
    container: {padding: 20},
    header : {fontSize:22, fontWeight:'700', textAlign: 'center', marginVertical: 16},
    sectionheader: {fontSize: 18, fontWeight: '600', padding:5, marginTop: 10},
    loanItem: {backgroundColor: '#f2f2f2', padding: 14,
    marginVertical: 8, borderRadius: 10},
    row: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6},
    loanName: {fontSize: 18, fontStyle:'italic'},
    repaymentValue: {fontSize: 18},
    barBackground: {height: 8, backgroundColor: '#ccc', borderRadius: 4, marginBottom: 6, overflow: 'hidden'},
    barFill: {height: '100%', backgroundColor: '#5fa075'},
    details: {fontSize: 14, color: '#444', flex: 1, textAlign: 'left'},
});

export default LoanScreen;