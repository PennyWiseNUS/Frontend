import {useState, useEffect, useContext} from 'react';
import {AuthContext} from '../../../context/AuthContext';
import axios from 'axios';
import {server_base_URL} from '../../../config';

const LoanRepaymentScreen = ({navigation}) => {
    const {token} = useContext(AuthContext);
    const [repaidAmount, setRepaidAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        extractRepaymentAmounts();
    }, [])

    const extractRepaymentAmounts = async () => {
        const res = await axios.get(`${server_base_URL}/api/loanEntries`, {
            headers: {Authorization: `Bearer ${token}`}
        });

        // essign to individual 
    }
}

export default LoanRepaymentScreen;