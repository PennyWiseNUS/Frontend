import {useState, useCallback} from 'react';
import {server_base_URL} from '../config'; // get base url from config file for cleaner api calls
import axios from 'axios';

const useGoalList = (token) => {
    const [goalList, setGoalList] = useState([]);
    const [error, setError] = useState(null);

    const getGoalList = useCallback(
        async () => {
            if (!token) return;
            try {
                const goalRes = await axios.get(`${server_base_URL}/api/goals`,
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                setGoalList(goalRes.data);
            } catch (err) {
                setError(err);
            }
        }, [token]
    );

    const completedGoals = goalList.filter(goal => goal.currentAmount >= goal.goalAmount);
    const incompletedGoals = goalList.filter(goal => goal.currentAmount < goal.goalAmount);
    return {goalList, completedGoals, incompletedGoals, getGoalList, error}
}

export default useGoalList;