import {createContext, useContext, useState} from 'react';
import {MyContext} from "@/context/MyContext.jsx";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const {showToast} = useContext(MyContext);

    const login = (data) => {
        localStorage.setItem('token', data.token);
        showToast("success", "Login Berhasil", 1000);
        setTimeout(() => {
            setUser(data.user);
            setToken(data.token);
        }, 1800);

    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{token, login, logout, isAuthenticated, user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
