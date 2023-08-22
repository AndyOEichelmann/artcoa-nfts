import { createContext, useState } from "react";

const AccountContext = createContext({});

export const AccountProvider = ({ children }) => {
    const [acc, setAcc] = useState({});

    return (
        <AccountContext.Provider value={{ acc, setAcc }}>
            {children}
        </AccountContext.Provider>
    )
}

export default AccountContext;
