import axios from 'axios';
import { Text, ScrollView, View, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList, Modal } from 'react-native';
import BottomNavigation from '../../../components/bottomNavigation';
import { useState, useContext, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {AuthContext} from '../../../context/AuthContext';
import {server_base_URL} from '../../../config'; // get base url from config file for cleaner api calls
import useGoalList from '../../../hooks/useGoalList';

const FinancialGoalsScreen = ({navigation}) => {
    const {token} = useContext(AuthContext)
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState(0);
    const [goalDeadline, setGoalDeadline] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const {goalList, completedGoals, incompletedGoals, getGoalList, error} = useGoalList(token)
    const [selectedGoalID, setSelectedGoalID] = useState(null);
    const [goalPopupVisible, setGoalPopupVisible] = useState(false);
    const [amountUpdate, setAmountUpdate] = useState(0);
    const [updateDate, setUpdateDate] = useState(new Date());
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsMap, setSuggestionsMap] = useState({});

    const handleNewGoalButtonPressed = async () => {
        if (showUpdateForm) {
            setShowUpdateForm(false);
        }
        setShowForm(true);
    }

    const handleAddGoalButton = async () => {
        console.log("Passing variables to backend to save -- need to do up");
        try {
            const payload = {
                goalName, goalAmount: Number(goalAmount), goalDeadline
            }
            console.log(payload);
            const addGoalResponse = await axios.post(
                `${server_base_URL}/api/goals`,
                payload,
                {headers: {Authorization: `Bearer ${token}`}}
            )
            console.log("New Goal has been successfully added")
            Alert.alert(
                'New Goal Added',
                `Goal Name: ${goalName}\n
                Targetted Amount: $${goalAmount}\n
                Goal Deadline: ${goalDeadline.toLocaleDateString()}`,
                [{ text: 'OK',
                    onPress: () => { console.log('User pressed ok at add a new goal form');
                    navigation.goBack(); }
                }],
            );
        } catch (err) {
            console.error('Error when saving new goal entry:', err);
            Alert.alert(`Error when saving Goal Entry, please try again.`);
        }

        // reset all the goal defaults
        setGoalName('');
        setGoalAmount(0);
        setGoalDeadline(new Date());
    }

    const handleCloseForm = async () => {
        setShowForm(false);
    }

    const handleGoalUpdateButtonPressed = async () => {
        if (showForm) {
            setShowForm(false);
        }
        setShowUpdateForm(true);
    }

    const handleUpdateGoalButtonPressed = async () => {
        const goalToUpdate = incompletedGoals.find(goal => goal._id === selectedGoalID);
        setSelectedGoalID(goalToUpdate._id);
        try {
            const updateGoalResponse = await axios.patch(
                `${server_base_URL}/api/goals/${selectedGoalID}`,
                {
                    amountUpdate: Number(amountUpdate),
                    updateDate: new Date(updateDate)
                },
                {headers: {Authorization: `Bearer ${token}`}}
            );
            console.log("Goal update successful.")
            Alert.alert(
                'Goal Updated',
                `Goal Name: ${goalToUpdate.goalName}\n
                Goal Progress: ${Number(goalToUpdate.currentAmount) + Number(amountUpdate)}/${goalToUpdate.goalAmount}\n
                Goal Date Update: ${new Date(updateDate).toLocaleDateString()}`,
                [{ text: 'OK',
                    onPress: () => { console.log('User pressed ok at add a new goal form');
                    navigation.goBack(); }
                }],
            )
        } catch (err) {
            console.error('Error when retreiving goal entries: ', err)
        }
    }

    const handleCloseUpdateForm = async () => {
        setShowUpdateForm(false);
    }
    
    // loading goals on mount
    useEffect(() => {
        getGoalList();
    })
    
    // refreshing when update form  is shown
    useEffect(() => {
        if (showUpdateForm) {
            getGoalList();
        }
    }, [showUpdateForm]);


    {/* remove auto fetching of suggestions logic -- shifting to separate page (on demand suggestions)
    const goalsString = JSON.stringify(incompletedGoals)
    useEffect(() => {
        const getSuggestions = async () => {
            const newSuggestions = {};
            for (const goal of incompletedGoals) {
                const suggestion = await getAISuggestions(goal);
                newSuggestions[goal._id] = suggestion;
            }
            setSuggestionsMap(newSuggestions);
        };
        if (incompletedGoals.length > 0) { getSuggestions()}
    }, [goalsString])
    */}

    const renderGoalItem = ({item}) => {
        const {goalName, goalAmount, currentAmount, goalDeadline} = item;
        const percentage = Math.min((currentAmount/goalAmount) * 100, 100).toFixed(1);

        return (
            <View style={styles.goalItem}>
                {/*Row 1 -- Goal Name and Goal Progress (X/Y)*/}
                <View style={styles.row}>
                    <Text style={styles.goalName}>{goalName}</Text>
                    <Text style={styles.progressNumber}>${Number(currentAmount).toFixed(2)} / ${Number(goalAmount).toFixed(2)}</Text>
                </View>
                
                {/*Row 2 -- Goal Progress Bar*/}
                <View style={styles.barBackground}>
                    <View style={[styles.barFill, { width: `${percentage}%` }]} />
                </View>
                
                {/*Row 3 -- Next Payment Date, Full Payment Date, Percentage*/}
                <View style={[styles.row, {alignItems:'flex-start'}]}>
                    {/*Column 1*/}
                    <View> 
                        <Text style={styles.details}>
                            Goal Completion Date: {new Date(goalDeadline).toLocaleDateString()}  
                        </Text>
                    </View>
                    {/*Column 2*/}
                    <View>
                        <Text style={styles.progressPerc}>{percentage}%</Text>
                    </View>
                </View>

                {/* row 4: AI suggestions button*/}
                <View style={{ flexDirection:'row', justifyContent:'flex-end'}}>
                    <TouchableOpacity style={styles.suggestionsButton} onPress={() => navigation.navigate("Goal Suggestions", {goal: item})}>
                        <Text>Generate Suggestions</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Removing auto generating feature
                <View style={styles.aiSuggestions}>
                    <Text>{suggestionsMap[item._id]}</Text>
                </View>
                */}
            </View>
        )
    }
    {/* shifting to generate button 
    const getAISuggestions = async (goal) => {
        try {
            const entriesResult = await axios.get(`${server_base_URL}/api/entries`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            // keep the most recent entries
            const chosenEntries = entriesResult.data.slice(-20);
            console.log(chosenEntries);
            
            // let suggestions backend handle the linking and querying, wait for the output
            const suggestionResult = await axios.post(`${server_base_URL}/api/suggestions`,
                { goal, entriesResult: entriesResult.data },
                { headers: { Authorization: `Bearer ${token}`}}
            );
            return suggestionResult.data.suggestion;
        } catch (err) {
            console.error('Suggestion error:', err);
            return "Suggestion could not be generated."
        }
    };
    */}

    return (
        <>
            <ScrollView>
                <Text style={styles.header}>Financial Goals</Text>
                <View style={styles.rowHolder}>
                    <TouchableOpacity style={styles.newGoalButton} onPress={handleNewGoalButtonPressed}>
                        <Text style={styles.ButtonText}>Create A New Goal</Text>
                    </TouchableOpacity>
                    {/* Updating goal progress */}
                    <TouchableOpacity style={styles.goalUpdateButton} onPress={handleGoalUpdateButtonPressed}>
                        <Text style={styles.goalUpdateText}>Update your goals</Text>
                    </TouchableOpacity>
                </View>
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


                {/* Logic for goal update*/}
                {showUpdateForm && (
                    <View style={styles.formContainer}>
                        <View style={styles.rowHolder}>
                            <Text style={styles.fieldTitle}>Choose a Goal to Update:</Text>
                            {incompletedGoals.length === 0 ? (
                                <Text styles={styles.noGoalsText}>
                                    You have no incomplete goals.
                                </Text>
                            ) : (
                                <TouchableOpacity style={styles.fieldInputs} onPress={() => setGoalPopupVisible(true)}>
                                    <Text>
                                        {selectedGoalID 
                                            ? incompletedGoals.find(goal => goal._id === selectedGoalID)?.goalName
                                            : "Choose a goal to update"
                                        }
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={styles.rowHolder}>
                            <Text style={styles.fieldTitle}>Amount set towards goal:</Text>
                            <TextInput style={styles.fieldInputs} placeholder='e.g. 1000' value={amountUpdate} onChangeText={setAmountUpdate}/>
                        </View>

                        <View style={styles.rowHolder}>
                            <Text style={styles.fieldTitle}>Date: </Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={styles.fieldInputs}
                            >
                                <Text>{updateDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={updateDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            setUpdateDate(selectedDate);
                                        }
                                    }}
                                />
                            )}
                        </View>
                        <View style={styles.rowHolder}>
                            <TouchableOpacity style={styles.closeButton} onPress={handleCloseUpdateForm}>
                                    <Text style={styles.ButtonText}>Close</Text>
                                </TouchableOpacity>
                            <TouchableOpacity style={styles.addButton} onPress={handleUpdateGoalButtonPressed}>
                                <Text style={styles.ButtonText}>Update Goals</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                <Text style={styles.sectionheader}>Incomplete Goals</Text>
                <FlatList data={incompletedGoals} keyExtractor={item => item._id} renderItem={renderGoalItem} scrollEnabled={false}/>
                <Text style={styles.sectionheader}>Complete Goals</Text>
                <FlatList data={completedGoals} keyExtractor={item => item._id} renderItem={renderGoalItem} scrollEnabled={false}/>
            </ScrollView>

            <Modal visible={goalPopupVisible} animationType='slide' onRequestClose={() => setGoalPopupVisible(false)}>
                <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
                  <Text style={styles.header}>Choose a goal to repay!</Text>
                    <FlatList 
                        data={incompletedGoals}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={[
                              styles.goalItem,
                              selectedGoalID === item._id && styles.selectedGoalItem,
                            ]}
                            onPress={() => {
                              setSelectedGoalID(item._id);
                              setGoalPopupVisible(false);
                            }}
                          >
                            <Text style={styles.GoalText}>Goal Name: {item.goalName}</Text>
                            <Text style={styles.GoalText}>
                              Goal Completion: {item.currentAmount}/{item.goalAmount}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
            
                      <TouchableOpacity
                        style={[styles.button, { marginTop: 20 }]}
                        onPress={() => setGoalPopupVisible(false)}
                      >
                        <Text>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>

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
    goalUpdateButton: {
        backgroundColor: 'orange',
        alignSelf: 'center',
        borderRadius: 10,      
    },
    goalUpdateText: {
        color: '#fff',
        padding: 10,
    },
    GoalText: {
        margin: 2
    },
    goalChoice: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#FAFAFA',
    },
    noGoalsText: {
        color: '#FFFFFF',
        padding: 10,
        flexWrap: "wrap",
        width: '70%'
    },
    goalItem: {
        backgroundColor: '#f2f2f2', 
        padding: 14,
        marginVertical: 8, 
        borderRadius: 10
    },
    row: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 6
    },
    goalName: {
        fontSize: 18, 
        fontStyle:'italic'
    },
    repaymentValue: {
        fontSize: 18
    },
    barBackground: {
        height: 8, 
        backgroundColor: '#ccc', 
        borderRadius: 4, 
        marginBottom: 6, 
        overflow: 'hidden'
    },
    barFill: {
        height: '100%', 
        backgroundColor: '#5fa075'
    },
    progressPerc: {
        fontSize: 14, 
        color: '#444', 
        flex: 1, 
        textAlign: 'left'
    },
    sectionheader: {
        fontSize: 18, 
        fontWeight: '600', 
        padding:5, 
        marginTop: 10
    },
    suggestionsButton: {
        backgroundColor: '#ff9933',
        borderRadius: 10,
        alignSelf: 'flex-start',
        padding: 4
    },
})