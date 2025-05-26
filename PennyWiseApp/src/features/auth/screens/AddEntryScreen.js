import React, { useContext, useState } from 'react';
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
} from 'react-native';
import {AuthContext} from '../../../context/AuthContext';
import {server_base_URL} from '../../../config'; // get base url from config file for cleaner api calls
import axios from 'axios';

const AddEntryScreen = ({ navigation }) => {
  const {token} = useContext(AuthContext)
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('Error, No Authentication Token Availabl.e');
      return;
    }
    if (!amount || !category || !type || !date) {
      Alert.alert('Error, Please fill in all required fields.')
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error, Please fill in a valid amount.')
    }

    console.log(token);
    console.log('Request Config:', {
      url: `${server_base_URL}/api/entries`,
      data: { amount: parseFloat(amount), category, type, date, notes },
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      console.log("Posting to: ", `${server_base_URL}/api/entries`)
      const addEntryResponse = await axios.post(
        `${server_base_URL}/api/entries`,
        {amount, category, type, date, notes},
        {headers: {Authorization: `Bearer ${token}`}}
      );
      // after successfully 
      console.log(`Entry Added:`, addEntryResponse.data);
      Alert.alert( 
        'Entry Added',
        `You have added a new ${type} entry:\n\n
        Amount: $${amount}\n
        Category: ${category}\n
        Date: ${date}\n
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

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
      >
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }
        }
        />
      )}

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 60 }]}
        placeholder="Optional notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

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
    marginBottom: 30,
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
});


