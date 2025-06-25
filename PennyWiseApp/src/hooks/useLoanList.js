import {useState, useCallback} from 'react';
import {server_base_URL} from '../config'; // get base url from config file for cleaner api calls
import axios from 'axios';

const useLoanList = (token) => {
    const [loanList, setLoanList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getLoanList = useCallback(
        async () => {
            if (!token) return;
            setLoading(true); // shows the user that the page is currently loading
            try {
                const listRes = await axios.get(`${server_base_URL}/api/loanEntries`,
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                console.log('done');
                const currentLoans = listRes.data.filter(
                    loan => parseFloat(loan.amount) > loan.repaidAmount
                );
                setLoanList(currentLoans);
            } catch (err) {
                console.error('Error in getting loans: ', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }, [token]
    );

    return {loanList, getLoanList, loading, error}
}

export default useLoanList;