import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BottomNavigation from '../../../components/bottomNavigation';

const InfoScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>ℹ️ About PennyWise</Text>

        <Text style={styles.sectionTitle}>What is PennyWise?</Text>
        <Text style={styles.text}>
          PennyWise is your all-in-one personal finance app that helps students, working adults, and retirees take control of their money. It combines budgeting, forecasting, goal tracking, and investment monitoring — all in one clean and intuitive interface.
        </Text>

        <Text style={styles.sectionTitle}>📝 How to Add an Entry</Text>
        <Text style={styles.text}>
          Go to the Home screen and tap “Add Entry”. You can log expenses, income, or loans. Add a date, category, amount, and optional notes. If it’s a recurring entry (like a subscription or loan repayment), enable the toggle and the app will auto-log it monthly.
        </Text>

        <Text style={styles.sectionTitle}>💸 Viewing Your Expenses</Text>
        <Text style={styles.text}>
          Visit the Expense Tracker screen to see your monthly spending trends. Tap on any month’s bar in the chart to view a full breakdown of that month’s transactions — grouped by category, amount, or date.
        </Text>

        <Text style={styles.sectionTitle}>📈 Forecasting Your Budget</Text>
        <Text style={styles.text}>
          PennyWise calculates a monthly spending forecast based on your past 3 months (excluding the current one). Use this forecast to understand your usual spending patterns.
        </Text>

        <Text style={styles.sectionTitle}>🎯 Set Budget Goals</Text>
        <Text style={styles.text}>
          You can set monthly goals for each category. The app will compare your current spending against these goals and show whether you’re on track, over, or under.
        </Text>

        <Text style={styles.sectionTitle}>🧾 Track Savings & Income</Text>
        <Text style={styles.text}>
          See how much you're saving over time with a 6-month graph. Income sources are listed clearly, and loans received are included as income.
        </Text>

        <Text style={styles.sectionTitle}>🚨 Emergency Fund</Text>
        <Text style={styles.text}>
          Set and track your emergency savings goal. Add or remove from the fund, and see your progress via a progress bar and supportive encouragement.
        </Text>

        <Text style={styles.sectionTitle}>🏦 Loan Tracker</Text>
        <Text style={styles.text}>
          View all outstanding and repaid loans in one place. You’ll receive reminders for upcoming repayments so you never miss one.
        </Text>

        <Text style={styles.sectionTitle}>🔔 Notifications</Text>
        <Text style={styles.text}>
          Tap the bell icon on the home screen to view recent expense alerts and reminders — including recurring subscriptions or bills.
        </Text>

        <Text style={styles.sectionTitle}>📊 Track Financial Markets</Text>
        <Text style={styles.text}>
          Search and favourite your U.S. stocks to monitor price changes. Great for keeping tabs on your investments.
        </Text>

        <Text style={styles.sectionTitle}>📅 Set & Achieve Financial Goals</Text>
        <Text style={styles.text}>
          Whether it’s buying a car or saving for retirement, set your target amount and deadline. PennyWise uses AI to suggest how much to save monthly.
        </Text>

        <Text style={styles.sectionTitle}>🚀 What's Next?</Text>
        <Text style={styles.text}>
          We plan to add: 
          {'\n'}• Cloud sync
          {'\n'}• Shared budgets with family
          {'\n'}• Smarter AI insights
          {'\n'}• Data export features
        </Text>
      </ScrollView>

      <BottomNavigation navigation={navigation} activeTab="Info" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 6 },
  text: { fontSize: 15, lineHeight: 22 },
});

export default InfoScreen;
