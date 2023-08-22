// import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';

import AccountContext from '../../context/AccountContext';

const Navbar = () => {
    const { acc, setAcc } = useContext(AccountContext);

    const [account, setAccount] = useState(null);

    // MetaMask Login/Connect
    const web3Handler = async () => {
        // Get metamask account
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Set account onfo for display
        setAccount(accounts[0]);
        setAcc({ account });
      
        // Get provider from metamask
            // const provider = await new ethers.BrowserProvider(window.ethereum);

        // Get the signer
            // const signer = await provider.getSigner();
    }

    return (
        <nav className="navbar">
            <h1>Chain Art-Certificate</h1>
            <div className="links">
                <NavLink to="/">Home</NavLink>
                {acc.account && <NavLink to="createcertificate">Create Certificate</NavLink>}
            </div>

            {acc.account ? ( 
                <NavLink to={"/profile/" + acc.account }>Profile</NavLink>
                ) : (        
                <button onClick={web3Handler}>Loggin</button>
            )}
        
        </nav>
    );
} 

export default Navbar;