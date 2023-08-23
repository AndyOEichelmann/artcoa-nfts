import { createContext, useState } from "react";

const AccountContext = createContext({});

export const AccountProvider = ({ children }) => {
    const [acc, setAcc] = useState({});
    const [sig, setSig] = useState({});

    return (
        <AccountContext.Provider value={{ acc, setAcc, sig, setSig }}>
            {children}
        </AccountContext.Provider>
    )
}

export default AccountContext;
