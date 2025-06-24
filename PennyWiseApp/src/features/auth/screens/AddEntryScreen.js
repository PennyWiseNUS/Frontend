import React, { useContext, useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
  FlatList
} from 'react-native';
import {AuthContext} from '../../../context/AuthContext';
import {server_base_URL} from '../../../config'; // get base url from config file for cleaner api calls
import axios from 'axios';

const AddEntryScreen = ({ navigation }) => {
  const {token} = useContext(AuthContext)
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');
  const [entryDate, setEntryDate] = useState(new Date());
  const [entryDatePicker, setEntryDatePicker] = useState(false);
  const [endDatePicker, setEndDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [repaymentDate, setRepaymentDate] = useState(new Date());
  const [showRepaymentDatePicker, setShowRepaymentDatePicker] = useState(false);
  const [repaidAmount, setRepaidAmount] = useState(0);
  const [selectedLoanID, setSelectedLoanID] = useState(null);
  const [loanList, setLoanList] = useState([]);

  // get the current unpaid loans using useEffect
  useEffect(() => {
    const getLoanList = async () => {
      try {
        // console.log('start');
        const listRes = await axios.get(`${server_base_URL}/api/loanEntries`,
          {headers: {Authorization: `Bearer ${token}`}}
        );
        console.log('done');
        const currentLoans = listRes.data.filter(
          loan => parseFloat(loan.amount) > loan.repaidAmount
        );
        setLoanList(currentLoans);
      } catch (err) {
        console.error('Error in getting loans: ', err)
      }
    };

    if (category === "loan" && type === "expense") {
      getLoanList();
    }
  }, [category, type]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState('daily');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(new Date());

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('Error, No Authentication Token Availabl.e');
      return;
    }
    if (!amount || !category || !type || !entryDate) {
      Alert.alert('Error, Please fill in all required fields.');
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error, Please fill in a valid amount.');
      return;
    }

    console.log(token);
    console.log('Request Config:', {
      url: `${server_base_URL}/api/entries`,
      data: { amount: parseFloat(amount), category, type, entryDate, notes, isRecurring, recurrenceFrequency, recurrenceEndDate },
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      console.log("Posting to: ", `${server_base_URL}/api/entries`)
      const addEntryResponse = await axios.post(
        `${server_base_URL}/api/entries`,
        {amount, category, type, entryDate, notes, isRecurring, recurrenceFrequency, recurrenceEndDate},
        {headers: {Authorization: `Bearer ${token}`}}
      );

      // post to second endpoint (only for loan entries)
      if (category === "loan" && type === "income") {
        const addLoanEntryResponse = await axios.post(
          `${server_base_URL}/api/loanEntries`,
          {notes, amount, interestRate, repaymentDate, repaidAmount, date},
          {headers: {Authorization: `Bearer ${token}`}}
        );
        // added to loan entry successfully
        console.log(`Loan Entry added: `, addLoanEntryResponse.data);
      }
      // post to second end point, loan repayment
      if (category === "loan" && type === "expense") {
        console.log('start of Loan Entry DB POST');
        const loanToUpdate = loanList.find(loan => loan._id === selectedLoanID);
        //console.log(loanToUpdate);
        setSelectedLoanID(loanToUpdate._id);
        //console.log(selectedLoanID);
        const updateLoanEntryResponse = await axios.patch(
          `${server_base_URL}/api/loanEntries/${selectedLoanID}`,
          {amountToAdd: parseFloat(amount)},
          {headers: {Authorization: `Bearer ${token}`}}
        )
        console.log('Loan Entry Successfully Posted to Loan Entry DB');
      }

      // after successfully 
      console.log(`Entry Added:`, addEntryResponse.data);
      Alert.alert( 
        'Entry Added',
        `You have added a new ${type} entry:\n\n
        Amount: $${amount}\n
        Category: ${category}\n
        Date: ${entryDate.toLocaleDateString()}\n
        Notes: ${notes}`,
        [{ text: 'OK', 
          onPress: () => { console.log('User pressed ok at AddEntryScreen');
          navigation.goBack(); }
        }],
      );
    } catch (err) {
      console.error('Error when saving entry:', err);
      Alert.alert(`Error when saving entry, please try again.`)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Entry</Text>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g. 50.00"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a category" value="" />
        <Picker.Item label="Food" value="food" />
        <Picker.Item label="Transport" value="transport" />
        <Picker.Item label="Utilities" value="utilities" />
        <Picker.Item label="Entertainment" value="entertainment" />
        <Picker.Item label="Health" value="health" />
        <Picker.Item label="Shopping" value="shopping" />
        <Picker.Item label="Travel" value="travel" />
        <Picker.Item label="Education" value="education" />
        <Picker.Item label="Salary" value="salary" />
        <Picker.Item label="Investment" value="investment" />
        <Picker.Item label="Loan" value="loan" />
        <Picker.Item label="Other" value="other" />
      </Picker>
      </View>

      <Text style={styles.label}>Type</Text>
      <View style={styles.toggleContainer}>
        <Pressable
          style={[
            styles.toggleButton,
            type === 'expense' && styles.activeButton,
          ]}
          onPress={() => setType('expense')}
        >
          <Text style={styles.toggleText}>Expense</Text>
        </Pressable>
        <Pressable
          style={[
            styles.toggleButton,
            type === 'income' && styles.activeButton,
          ]}
          onPress={() => setType('income')}
        >
          <Text style={styles.toggleText}>Income</Text>
        </Pressable>
      </View>

      {/* setting conditional rendering for loan and debt tracker (Income)*/}
      {(category === "loan" && type === "income") && (
        <View>
          <Text style={styles.label}>Interest Rate on Loan Taken</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 0.03 or 0.00"
            value={interestRate}
            onChangeText={setInterestRate}
          />

          <Text style={styles.label}>Repayment Date</Text>
          <TouchableOpacity
            onPress={() => setShowRepaymentDatePicker(true)}
            style={styles.input}
          >
            <Text>{repaymentDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showRepaymentDatePicker && (
            <DateTimePicker
              value={repaymentDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowRepaymentDatePicker(false);
                if (selectedDate) {
                  setRepaymentDate(selectedDate);
                }
              }}
            />
          )}
        </View>
      )}

      {/* setting conditional rendering for loan and debt tracker (Expense -> repayment)*/}
      {(category === "loan" && type === "expense") && (
        <View>
          <Text style={styles.label}>Choose your loan to repay!</Text>
          {loanList.length === 0 ? (
            <Text styles={styles.noLoansText}>
              You have cleared all your loans. Good Job!
            </Text>
          ) : (
            <FlatList
              data={loanList}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[styles.loanItem, selectedLoanID === item._id && styles.selectedLoanItem]}
                  onPress={() => setSelectedLoanID(item._id)}
                >
                  <Text style ={styles.loanText}>Loan Name: {item.notes}</Text>
                  <Text style={styles.loanText}>Amount Repaid: {item.repaidAmount}/{item.amount}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        onPress={() => setEntryDatePicker(true)}
        style={styles.input}
      >
        <Text>{entryDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      
      {entryDatePicker && (
        <DateTimePicker
          value={entryDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setEntryDatePicker(false);
            if (selectedDate) {
              setEntryDate(selectedDate);
            }
          }
        }
        />
      )}

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 60 }]}
        placeholder="Optional notes, Loan Name here for loans"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      { /* Recurring Entry Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.label}>Recurring Entry?</Text>
        <Pressable
          style={[styles.slider, isRecurring && styles.sliderOn]}
          onPress={() => setIsRecurring(!isRecurring)}
        >
          <View style={[styles.sliderKnob, isRecurring && styles.sliderKnobOn]}/>
        </Pressable>
      </View>

        {isRecurring && (
        <>
          <Text style={styles.label}>Recurrence Interval</Text>
          <Picker
            selectedValue={recurrenceFrequency}
            onValueChange={(itemValue) => setRecurrenceFrequency(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Daily" value="Daily" />
            <Picker.Item label="Monthly" value="Monthly" />
            <Picker.Item label="Weekly" value="Weekly" />
            <Picker.Item label="Annually" value="Annually" />
          </Picker>
          <Text style={styles.label}>End Date</Text>
          <TouchableOpacity
            onPress={() => setEndDatePicker(true)}
            style={styles.input}
          >
            <Text>{recurrenceEndDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {endDatePicker && (
            <DateTimePicker
              value={recurrenceEndDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setEndDatePicker(false);
                if (selectedDate) {
                  setRecurrenceEndDate(selectedDate);
                }
              }}
            />
          )}
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddEntryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  activeButton: {
    backgroundColor: '#CF8A4E',
    borderColor: '#CF8A4E',
  },
  toggleText: {
    color: '#333',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4E9FCF',
    padding: 15,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedLoanItem: {
    backgroundColor: '#5ba1c7',
  },
  toggleSwitch: {
    width: 40,
    height: 20,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    padding: 2,
    position: 'relative',
  },
  toggleSwitchOn: {
    backgroundColor: '#4E9FCF',
    justifyContent: 'flex-end',
  },
  slider: {
    width: 60,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    marginLeft: 10, 
    position: 'relative',
  },

  sliderOn: {
    backgroundColor: '#4E9FCF', 
  },

  sliderKnob: {
    width: 26,
    height: 26,
    borderRadius: 13, 
    backgroundColor: '#fff',
    position: 'absolute',
    left: 2, 
    top: 2,  
  },

  sliderKnobOn: {
    left: 32, 
  },

});


