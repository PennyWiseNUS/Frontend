import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ScrollView, Text, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { server_base_URL } from "../../../config";

// receiving properties, route contains params paused via nav
const GoalSuggestionScreen = ({route}) => {
    const {goal} = route.params;
    const {token} = useContext(AuthContext);
    const [suggestion, setSuggestion] = useState('');
    const [loading, setLoading] = useState(true);

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
            console.log(suggestionResult.data.suggestion);
            setSuggestion(suggestionResult.data.suggestion);
        } catch (err) {
            console.error('Suggestion error:', err);
            setSuggestion("Suggestion could not be generated.");
        } finally {
            setLoading(false);
        }
    };

    // cleaning the markdown

    // fetching suggestions when the screen load
    useEffect(() => {
        getAISuggestions(goal);
    }, [goal]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.suggestionTitle}>Goal Suggestion for {goal.goalName}</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <Text style={styles.suggestion}>{suggestion}</Text>
            )}
        </ScrollView>
    );
};

export default GoalSuggestionScreen;

const styles = StyleSheet.create({
    container: {padding: 16},
    suggestionTitle: {fontSize: 20, fontWeight: 'bold', textAlign: 'center'},
    suggestion: {fontSize: 14, marginTop: 14}
});