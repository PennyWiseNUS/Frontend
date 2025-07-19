import {jwtDecode} from "jwt-decode"; // from userid
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { server_base_URL } from "../../../config";
import axios from "axios";
import { TouchableOpacity, Text, View, FlatList, ActivityIndicator, TextInput, StyleSheet, Dimensions } from "react-native";
//import {VictoryChart, VictoryLine, VictoryTheme} from 'victory-native'

const StockMarketScreen = () => {
    const {token} = useContext(AuthContext);
    const [userID, setUserID] = useState('');

    const [watchList, setWatchList] = useState([]);
    const [query, setQuery] = useState('')
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState('');
    //const [expanded, setExpanded] = useState(null);
    //const [loadingChart, setLoadingChart] = useState(false);
    //const [chartData, setChartData] = useState([])

    // carry out once token is available
    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserID(decodedToken.user?.id);
        }
    }, [token]);

    // get watchlist data
    const getWatchList = async () => {
        try {
            const res = await axios.get(`${server_base_URL}/api/watchlist/${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setWatchList(res.data);
        } catch (err) {
            console.log("Error fetching watchlist:", err.message);
        }
    };

    // extract watchlist when token and userId available
    useEffect(() => {
        if (userID && token) {
            getWatchList();
        }
    }, [userID, token]);

    const searchStock = async () => {
        try {
            const res = await axios.get(
                `${server_base_URL}/api/stocks/search?query=${query}`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            setSearchResult(res.data);
            setError(null);
            console.log("Search result set:", res.data);
        } catch (err) {
            setSearchResult(null);
            setError('Company not found');
            console.error("Search failed:", err.response?.data || err.message);
        }
    };

    const addToWatchList = async () => {
        try {
            await axios.post(
                `${server_base_URL}/api/watchlist/${userID}`,
                {ticker: searchResult.ticker},
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            );
            setQuery('');
            setSearchResult(null);
            getWatchList();
        } catch (err) {
            console.log('Error adding to watchlist:', err.message);
        }
    }

    {/*
    const toggleExpand = async (ticker) => {
        // if already open, tapping it again will close it
        if (expanded === ticker) {
            setExpanded(null);
            return;
        }

        // else open it
        setExpanded(ticker);
        setLoadingChart(true);
        try {
            const res = await axios.get(`${server_base_URL}/api/stocks/chart/${ticker}`,
                {headers: {Authorization: `Bearer ${token}`}}
            );

            const cleanedChart = res.data
                .filter(point => point.price != null)
                .map(point => ({x: new Date(point.date), y: point.price}));
            
            setChartData(cleanedChart)
        } catch (err) {
            console.log('Chart fetch error:', err.message);
            setChartData([]);
        } finally {
            setLoadingChart(false);
        }
    }
    */}

    const renderCompany = ({item: company}) => {
        return (
            <View style={styles.stockList}>
                <TouchableOpacity onPress={() => toggleExpand(company.ticker)}>
                    <Text style={styles.stockText}>
                        {company.ticker} {company.name}
                    </Text>
                    <Text>
                        ${company.price} {company.change >= 0 ? '+' : ''}{company.change} ({company.percentageChange}%)
                    </Text>
                </TouchableOpacity>
                {/*
                {expanded === company.ticker && (
                    loadingChart ? (
                        <ActivityIndicator style={{marginTop: 10}}/>
                    ) : (
                        <VictoryChart
                            theme={VictoryTheme.material}
                            width={Dimensions.get('window').width - 40}
                            height={200}
                        >
                            <VictoryLine
                                data={chartData}
                                style={{ data: { stroke: "#3884d6" } }}
                                interpolation="monotoneX"
                            />
                        </VictoryChart>
                    )
                )}
                */}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search for a listed company:</Text>
            <View style={styles.searchRow}>
                {/*Search button for Company*/}
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="e.g. Apple or AAPL"
                    style={styles.searchBar}
                />
                <TouchableOpacity style={styles.searchButton} onPress={searchStock}>
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {/*Upon a valid search result, provide the option to watchlist*/}
            {/*To add more details subsequently*/}
            {searchResult && (
                <View style={styles.searchResult}>
                    <Text>
                        {searchResult.name} ({searchResult.ticker})
                    </Text>
                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={addToWatchList}>
                        <Text style={styles.addCompanyText}>Add to favourites</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/*If no company found*/}
            {error && <Text style={styles.errorText}>{error}</Text>}

            <Text style={styles.stockListName}>Favourites:</Text>
            <FlatList data={watchList} keyExtractor={(company) => company.ticker} renderItem={renderCompany}/>
        </View>
    );
}

export default StockMarketScreen;

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16},
    title: {marginVertical:10, fontSize:18},
    searchRow: {flexDirection: 'row', width: '100%'},
    searchBar: {backgroundColor:'grey', borderRadius:8, width: '67%'},
    searchButton: {backgroundColor: 'blue', borderRadius: 8, alignItems: 'center', width: '33%', justifyContent: 'center'},
    buttonText: {alignSelf: 'center', color: 'white', padding: 4},
    searchResult: {marginBottom: 20, padding:12, borderRadius: 8},
    addCompanyText: {fontWeight: 'thumb', backgroundColor: 'blue', color: 'white', borderRadius: 10},
    errorText: {marginBottom: 20, padding:12, borderRadius: 8},
    stockList: {marginBottom: 16, padding:12, backgroundColor: '#fff', borderRadius: 8, elevation:1},
    stockText: {fontSize: 16, fontWeight: 'bold'},
    stockListName: {fontSize: 24, fontWeight: 'bold', marginVertical:10}
})