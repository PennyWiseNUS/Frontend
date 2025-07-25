import React, {useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import RegisterScreen from '../features/auth/screens/RegisterScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import HomeScreen from '../features/auth/screens/HomeScreen';
import AddEntryScreen from '../features/auth/screens/AddEntryScreen';
import IncomeSavingsScreen from '../features/auth/screens/IncomeSavingsScreen';
import LoanScreen from '../features/auth/screens/LoanScreen';
import ExpensesScreen from '../features/auth/screens/ExpensesScreen';
import NotificationsScreen from '../features/auth/screens/NotificationsScreen';
import FinancialGoalsScreen from '../features/auth/screens/FinancialGoalsScreen';
import BottomNavigation from '../components/bottomNavigation';
import GoalSuggestionScreen from '../features/auth/screens/GoalSuggestionScreen';
import EmergencyFundsScreen from '../features/auth/screens/EmergencyFundsScreen';
import StockMarketScreen from '../features/auth/screens/StockMarketScreen'
import ForecastScreen from '../features/auth/screens/ForecastScreen';
import InfoScreen from '../features/auth/screens/InfoScreen'; 
import Profile from '../features/auth/screens/Profile';

// initialise a stack nav obj (for def and config stack based transitions)
const Stack = createStackNavigator();

// create a component for the navigator
const AppNavigator = () => {
    const {token} = useContext(AuthContext)
    //console.log('Login Screen:', LoginScreen);
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Register" component={RegisterScreen}/>
                <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Add an Entry" component={AddEntryScreen}/>
                <Stack.Screen name="Income and Savings" component={IncomeSavingsScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Expenses" component={ExpensesScreen} />
                <Stack.Screen name="Loans" component={LoanScreen}/>
                <Stack.Screen name="Notifications" component={NotificationsScreen}/>
                <Stack.Screen name="Financial Goals" component={FinancialGoalsScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Goal Suggestions" component={GoalSuggestionScreen}/>
                <Stack.Screen name="Emergency Funds" component={EmergencyFundsScreen}/>
                <Stack.Screen name="Markets" component={StockMarketScreen}/>
                <Stack.Screen name="Budget Forecasting" component={ForecastScreen}/>
                <Stack.Screen name="InfoPennyWise" component={InfoScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;