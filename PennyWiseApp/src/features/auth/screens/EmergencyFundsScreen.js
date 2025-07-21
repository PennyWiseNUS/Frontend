import { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { AuthContext } from "../../../context/AuthContext";
import BottomNavigation from "../../../components/bottomNavigation";
import { server_base_URL } from "../../../config";
import axios from 'axios';

const EmergencyFundsScreen = ({navigation}) => {
    const {token} = useContext(AuthContext);
    const [goalAmount, setGoalAmount] = useState('');
    const [savedAmount, setSavedAmount] = useState(0)
    const [addSavedAmount, setAddSavedAmount] = useState('');
    const [subtractSavedAmount, setSubtractSavedAmount] = useState('');

    const getFund = async () => {
        try {
            const res = await axios.get(
                `${server_base_URL}/api/emergency-funds`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            setGoalAmount(res.data.goalAmount);
            setSavedAmount(res.data.savedAmount);
        } catch (err) {
            console.log("Error fetching fund:", err.message);
        }
    }

    useEffect(() => {
        getFund();
    }, []);

    const handleSetNewGoal = async () => {
        try {
            console.log("start");
            const res = await axios.post(`${server_base_URL}/api/emergency-funds`,
                {goalAmount: Number(goalAmount), savedAmount},
                {headers: {Authorization: `Bearer ${token}`}}
            )
            console.log("Goal posted to backend");
            setGoalAmount('');
            await getFund();
        } catch (err) {
            Alert.alert("Failed to set goal. Please try again.")
        }
    };

    const handleIncreaseSavings = async () => {
        const amountToAdd = Number(addSavedAmount);
        try {
            const newAmount = savedAmount + amountToAdd;
            await axios.patch(
                `${server_base_URL}/api/emergency-funds`,
                {savedAmount: newAmount},
                {headers: {Authorization: `Bearer ${token}`}},
            );
            console.log("Update Successful");
            setSavedAmount(newAmount);
            setAddSavedAmount('');
        } catch (err) {
            Alert.alert("Error adding funds");
        }
    };

    const handleSubtractSavings = async () => {
        const amountToSubtract = Number(subtractSavedAmount);
        try {
            const newAmount = savedAmount - amountToSubtract;
            await axios.patch(
                `${server_base_URL}/api/emergency-funds`,
                {savedAmount: newAmount},
                {headers: {Authorization: `Bearer ${token}`}},
            );
            console.log("Update Successful");
            setSavedAmount(newAmount);
            setSubtractSavedAmount('');
        } catch (err) {
            Alert.alert("Error adding funds");
        }
    };

    return (
        <ScrollView>
            <Text style={{marginLeft: 10, marginTop: 10}}>Set or Update your Emergency Fund Goal here!</Text>
            <View style={styles.rowHolder}>
                <TextInput style={styles.goalInput} placeholder="Set Goal Amount (e.g. 10000)" keyboardType="numeric" value={goalAmount} onChangeText={text => setGoalAmount(text)}/>
                <TouchableOpacity style={styles.addGoalbutton} onPress={handleSetNewGoal}>
                    <Text style={styles.addGoalbuttonText}>Set Goal</Text>
                </TouchableOpacity>
            </View>

            <Text style={{marginLeft: 10}}>Update Your Emergency Fund Status Here!</Text>
            
            <View style={styles.rowHolder}>
                <TextInput style={styles.addInput} placeholder="Set Increase" keyboardType="numeric" value={addSavedAmount} onChangeText={text => setAddSavedAmount(text)}/>
                <TouchableOpacity style={styles.increaseSavingsButton} onPress={handleIncreaseSavings}>
                    <Text style={styles.increaseSavingsButtonText}>+</Text>
                </TouchableOpacity>
                <TextInput style={styles.subtractInput} placeholder="Set Decrease" keyboardType="numeric" value={subtractSavedAmount} onChangeText={text => setSubtractSavedAmount(text)}/>
                <TouchableOpacity style={styles.subtractSavingsButton} onPress={handleSubtractSavings}>
                    <Text style={styles.subtractSavingsButtonText}>-</Text>
                </TouchableOpacity>
            </View>

            {/* if no goal set yet */}
            {goalAmount === 0 && (
                <View style={styles.noGoalContainer}>
                    <Text style={{fontSize: 24, textAlign: 'center'}}>Set your emergency funds goal above today!</Text>
                </View>
            )}

            {/* Visual Jar to show progress */}
            {goalAmount > 0 && (
                <View style={styles.jarContainer}>
                    <View style={styles.jarCover}>
                        <View style={[
                            styles.jarFill,
                            {
                                height: `${Math.min((savedAmount/goalAmount) * 100, 100)}%`
                            }
                        ]} />
                    </View>
                    <Text style={styles.percText}>
                        {`${Math.min((savedAmount/goalAmount) * 100, 100).toFixed(1)}% Saved\n`}
                        {`$${savedAmount} / $${goalAmount}`}
                    </Text>
                    <Text style={styles.message}>
                        {(savedAmount >= goalAmount)
                            ? "Goal Completed! Well Done!"
                            : (savedAmount >= goalAmount * 0.5)
                                ? "Great Progress! Keep it up!"
                                : "Good Start to your Emergency Funds Saving Journey!"
                        }
                    </Text>
                </View>
            )}

        </ScrollView>
    )
}

export default EmergencyFundsScreen;

const styles = StyleSheet.create({
    rowHolder: {flexDirection:'row', alignItems: 'center', padding: 10},
    goalInput: {backgroundColor: 'grey', borderRadius: 10, flex: 7},
    addGoalbutton: {backgroundColor: 'blue', borderRadius: 10, marginLeft: 10, alignItems: 'center', flex: 3},
    addGoalbuttonText: {color: 'white', padding: 10, fontSize:12},
    addInput: {backgroundColor: 'grey', borderRadius: 10, width: "40%"},
    increaseSavingsButton: {backgroundColor: 'green', borderRadius: 20, alignItems: 'center', width: "8%"},
    increaseSavingsButtonText: {color: 'black', padding: 10, fontSize: 15},
    subtractInput: {backgroundColor: 'grey', borderRadius: 10, width: "40%", marginLeft: 10},
    subtractSavingsButton: {backgroundColor: 'red', borderRadius: 20, alignItems: 'center', width: "8%"},
    subtractSavingsButtonText: {color: 'black', padding: 10, fontSize: 15},
    // for visual jar
    jarContainer: {alignItems: 'center', marginVertical: 30},
    jarCover: {width:200, height:400, borderWidth: 2, borderColor: '#333', borderRadius:10, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: '#eee' },
    jarFill: {width:'100%', backgroundColor: 'green'},
    percText: {marginTop: 10, fontSize:18, fontWeight: 'bold', textAlign: 'center'},
    message: {textAlign: 'center'},
    // no goals set yet
    noGoalContainer: {backgroundColor: '#abd9cd', alignItems: 'center', padding: 10, marginTop: 20}
})  