import axios from 'axios';
import { Text, ScrollView, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import BottomNavigation from '../../../components/bottomNavigation';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

const FinancialGoalsScreen = ({navigation}) => {
    const [showForm, setShowForm] = useState(false);
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState(0);
    const [goalDeadline, setGoalDeadline] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);


    const handleNewGoalButtonPressed = async () => {
        setShowForm(true);
    }

    const handleAddGoalButton = async () => {
        console.log("Passing variables to backend to save -- need to do up");
        setGoalName('');
        setGoalAmount(0);
        setGoalDeadline(new Date());
    }

    const handleCloseForm = async () => {
        setShowForm(false);
    }

    return (
        <>
            <ScrollView>
                <Text style={styles.header}>Financial Goals</Text>
                <TouchableOpacity style={styles.newGoalButton} onPress={handleNewGoalButtonPressed}>
                    <Text style={styles.ButtonText}>Create A New Goal</Text>
                </TouchableOpacity>
                {showForm && (
                    <View style={styles.formContainer}>
                        <View style={styles.rowHolder}>
                            <Text style={styles.fieldTitle}>Goal Name:</Text>
                            <TextInput style={styles.fieldInputs} placeholder='e.g. Save up for HDB Downpayment' value={goalName} onChangeText={setGoalName}/>
                        </View>
                        <View style={styles.rowHolder}>
                            <Text style={styles.fieldTitle}>Goal Amount:</Text>
                            <TextInput style={styles.fieldInputs} placeholder='e.g. 10000' value={goalAmount} onChangeText={setGoalAmount}/>
                        </View>
                        <View style={styles.rowHolder}>
                            <Text style={styles.fieldTitle}>Completion Date:</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={styles.fieldInputs}
                            >
                                <Text>{goalDeadline.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={goalDeadline}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            setGoalDeadline(selectedDate);
                                        }
                                    }}
                                />
                            )}
                        </View>
                        <View style={styles.rowHolder}>
                            <TouchableOpacity style={styles.closeButton} onPress={handleCloseForm}>
                                <Text style={styles.ButtonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addButton} onPress={handleAddGoalButton}>
                                <Text style={styles.ButtonText}>Add Entry</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )} 
            </ScrollView>
            <BottomNavigation navigation={navigation} activeTab="Home" />
        </>
    );
}

export default FinancialGoalsScreen;

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 50,
        textAlign: 'center',
    },
    newGoalButton: {
        backgroundColor: 'blue',
        alignSelf: 'center',
        borderRadius: 10,
    },
    ButtonText: {
        color: '#fff',
        padding: 10,
    },
    formContainer: {
        marginTop:10, 
        padding:5,
        backgroundColor: 'grey',
        borderRadius: 10,
    },
    rowHolder: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding:5
    },
    fieldTitle: {
        width: '25%', 
        margin:5
    },
    fieldInputs: {
        width: '70%', 
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        padding: 7,
        backgroundColor: '#FAFAFA',
    },
    closeButton: {
        backgroundColor: 'red',
        alignSelf: 'center',
        borderRadius: 10,
    },
    addButton: {
        backgroundColor: 'green',
        alignSelf: 'center',
        borderRadius: 10,
    },
})