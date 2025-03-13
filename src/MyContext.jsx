import {createContext, useState} from "react";

export const MyContext = createContext();

export const MyProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <MyContext.Provider value={{isLoading, setIsLoading}}>
            {children}
        </MyContext.Provider>
    );
};
