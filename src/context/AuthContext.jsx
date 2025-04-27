import {createContext, useContext, useState} from 'react';
import {MyContext} from "@/context/MyContext.jsx";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const {showToast} = useContext(MyContext);

    const login = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
        }));
        showToast("success", "Login Berhasil", 1000);
        setTimeout(() => {
            setUser(data.user);
            setToken(data.token);
        }, 1800);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
