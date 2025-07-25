import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { server_base_URL } from '../../../config';
import BottomNavigation from '../../../components/bottomNavigation';

const Profile = ({ navigation }) => {
  const { token } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchUserEmail();
  }, []);

  const fetchUserEmail = async () => {
    try {
      const res = await axios.get(`${server_base_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmail(res.data.email);
    } catch (err) {
      Alert.alert('Error', 'Unable to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New passwords do not match.');
      return;
    }

    try {
      await axios.post(
        `${server_base_URL}/api/profile/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password';
      Alert.alert('Error', msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 My Profile</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00ccff" />
      ) : (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{email}</Text>
          </View>

          <TouchableOpacity onPress={() => setShowPasswordForm(!showPasswordForm)}>
            <Text style={styles.changePasswordLink}>
              {showPasswordForm ? 'Cancel Password Change' : 'Change Password'}
            </Text>
          </TouchableOpacity>

          {showPasswordForm && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                <Text style={styles.saveButtonText}>Save New Password</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}

      <BottomNavigation navigation={navigation} activeTab="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600' },
  value: { fontSize: 16 },
  changePasswordLink: { color: '#007AFF', textAlign: 'right', marginBottom: 10, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 12
  },
  saveButton: {
    backgroundColor: '#00ccff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: '600' }
});

export default Profile;
