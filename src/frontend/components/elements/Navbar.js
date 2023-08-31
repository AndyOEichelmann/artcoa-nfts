// import { ethers } from 'ethers';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import AccountContext from '../../context/AccountContext';

let injectedProvider = false;

if(typeof window.ethereum !== 'undefined'){
    injectedProvider = true;
}

const isMetaMask = injectedProvider ? window.ethereum.isMetaMask : false;

const Navbar = () => {
    const { acc, setAcc } = useContext(AccountContext);

    // MetaMask Login/Connect
    const web3Handler = async () => {

        if(!injectedProvider){
            // activate parameter to render msg window w message
            console.log('ther is no wallet pup up window')
        }

        if(injectedProvider && !isMetaMask){
            // activate parameter to render msg window w message
            console.log('you dont have metamask installed')
        }

        if(isMetaMask){
            // verify that the wallet is conected to the correct chain
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if(chainId !== '0xaa36a7'){
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0xaa36a7" }]
                });
            }

            // Get metamask account
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            
            setAcc({ account });
        }
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