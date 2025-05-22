// createContext - creates a global state container
// useState - stores current auth token
// useEffect - loads token once app starts
import React, {createContext, useState, useEffect} from 'react';
import * as SecureStore from 'expo-secure-store';

// creating a context to share auth data across entire app (accessed using useContext(...))
export const AuthContext = createContext();

// authProvider comp
export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const retrieveToken = async () => {
            const token = await SecureStore.getItemAsync('token');
            // best practice to keep null: not logged in, string token: logged in
            setToken(token);
        }
        retrieveToken();
    }, []);

    const login = async (newToken) => {
        await SecureStore.setItemAsync('token', newToken);
        setToken(newToken);
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync('token');
        setToken(null);
    }

    // shares token, login and logout to any subComp that uses the context
    // this comps can call login(), logout() or check token by accessing Authcontext
    return (
        <AuthContext.Provider value={{token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};