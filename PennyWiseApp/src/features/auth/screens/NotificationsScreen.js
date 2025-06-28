import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {AuthContext} from '../../../context/AuthContext';
import {server_base_URL} from '../../../config'; // get base url from config file for cleaner api calls
import axios from 'axios';


const NotificationsScreen = ({navigation}) => {
    const {token} = useContext(AuthContext);
    
    const [notifications, setNotifications] = useState([
        { id: '1', title: 'Reminder', body: 'You have a new reminder', timestamp: '2025-06-19 08:55', read: false },
        { id: '2', title: 'Update', body: 'Your profile has been updated', timestamp: '2025-06-18 14:30', read: true },
        { id: '3', title: 'Message', body: 'You have a new message', timestamp: '2025-06-17 10:00', read: false },
      ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        ));
      };
    
    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
      };

    const clearAllNotifications = () => {
        Alert.alert('Clear All Notifications', 'Are you sure you want to clear all notifications?', [
          { text: 'Cancel' },
          { text: 'Clear', onPress: () => setNotifications([]) }
        ]);
      };
    
    const renderItem = ({ item }) => (
        <View style={[styles.notificationCard, item.read ? styles.read : styles.unread]}>
          <View style={styles.notificationContent}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => markAsRead(item.id)} style={styles.actionButton}>
              <Text style={styles.actionText}>{item.read ? 'Read' : 'Mark as Read'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteNotification(item.id)} style={styles.actionButton}>
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Notifications</Text>
            <TouchableOpacity onPress={clearAllNotifications} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
    
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
    
          {notifications.length === 0 && (
            <Text style={styles.emptyText}>No new notifications</Text>
          )}
        </View>
      );
}

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    justifyContent: 'space-between',
  },
  notificationContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 14,
    marginVertical: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#777',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
  read: {
    backgroundColor: '#f1f1f1',
  },
  unread: {
    backgroundColor: '#dfe7e9',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});
