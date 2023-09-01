const { Alchemy, Network } = require("alchemy-sdk");
const { ethers } = require('ethers');

const contract = require("../contract-data/ERC721CoA.json");
const escrowabi = require('../contract-data/ERC721CoA_Escrow.json');

// netowork
const network = 'sepolia';

// Config Alchemy as a provider
const alchemyProvider = new ethers.AlchemyProvider(network, process.env.REACT_APP_ALCHEMY_API_KEY);

// Configure signer
const signer = new ethers.Wallet(process.env.REACT_APP_SEPOLIA_PRIVATE_KEY, alchemyProvider);

// Configuration the Alchemy SDK
const config = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA,
};

// Alchemy object instance with the config to use for making requests
const alchemy = new Alchemy(config);

export const galleryLoader = async () => {

    // contract address whose NFTs you want to fetch
    const address = "0x7D945e32D2B9C2c52b7388e2CD2764A0Cc666FBc";
    
    const res = await alchemy.nft.getNftsForContract(address);
    // console.log(res.nextToken)

    const nfts = await res.nfts;
    
    let acoa = [];
    nfts.forEach(async element => {
        if(element.rawMetadata.image !== undefined){
            acoa.push(element);
        }
    });

    let unique = [];
    acoa.forEach(async element => {
        if (!unique.includes(element.rawMetadata.artist)) {
            unique.push(element.rawMetadata.artist);
        }
    });

    return { acoa: acoa, unique: await unique }
}

export const profileLoader = async ({ params }) => {
    const { id } = params;

    const address = "0x7D945e32D2B9C2c52b7388e2CD2764A0Cc666FBc";

    const escrow = "0xFF13f21abd8A17337039219d794FDB0330047a09";

    /* --- retrive owned nfts --- */
    const res = await alchemy.nft.getNftsForOwner(id,{contractAddresses: [address]})

    const nfts = await res.ownedNfts;
    
    let ownedCoAs = [];
    nfts.forEach(async element => {
        if(element.rawMetadata.image !== undefined){
            ownedCoAs.push(element);
        }
    });
    
    /* --- retrive all climable listed tokens  --- */
    const escrowcoacontract = new ethers.Contract(escrow, escrowabi.abi, signer);

    const user = id.slice(2);

    const logs = await alchemy.core.getLogs({
        address: escrow,
        topics: [
            "0x1361183d3619b83f772e8c55c1fb823a1d95ee5f906e8dd77a4ca29dfccaf03d",
            null,
            null,
            `0x${user.padStart(64,0)}`
        ],
        fromBlock: 'earliest'
    })

        // console.log('listed items logs:', logs)
    const claimItems = await logChecker(logs, escrowcoacontract);

        // clim logs
    const claimLogs = [];
    logs.forEach(async element => {
        const itemId = Number(ethers.AbiCoder.defaultAbiCoder().decode(['uint256','address'], element.data)[0]);

        // verify listing status
        const status = await escrowcoacontract._itemsListed(itemId);

        if(Number(status.status) === 1){
            claimLogs.push(element)
        }
    })
    console.log('logs climed', claimLogs.length);
    
    console.log('claimable items:', claimItems.length);

    return {ownedCoAs: ownedCoAs, claimItem: claimItems, claimLogs: logs};
}

async function logChecker(logs, escrowcoacontract){
    const claimItems = [];

   logs.forEach(async e => {
        // obtain item id
        const itemId = Number(ethers.AbiCoder.defaultAbiCoder().decode(['uint256','address'], e.data)[0]);
            // console.log('itemId:', itemId);

        // verify listing status
        const status = await escrowcoacontract._itemsListed(itemId);
            // console.log('->listed status:', Number(status.status));

        // if it is listed save it in a array for climing with relevant data
        if(Number(status.status) == 1){

            const sender = ethers.AbiCoder.defaultAbiCoder().decode(['uint256','address'], e.data)[1];
                // console.log('sender:', sender);
            
                // retrive metadata of token 
            const coaaddress = ethers.AbiCoder.defaultAbiCoder().decode(['address'], e.topics[1])[0];
                // console.log('contact add:', coaaddress);
            const tokenId = ethers.AbiCoder.defaultAbiCoder().decode(['address'], e.topics[2])[0];
                // console.log('token Id:', ethers.getNumber(tokenId));
            const coa = await alchemy.nft.getNftMetadata(coaaddress, ethers.getNumber(tokenId));
                // console.log('--- coa:', coa);

            const item = {
                sender: sender,
                itemId: itemId,
                coaaddress: coaaddress,
                tokenId: ethers.getNumber(tokenId),
                image: coa.rawMetadata.image,
                titile: coa.title
            };

            claimItems.push(item)
        }
    })

    return claimItems;
}

export const coaLoader = async ({ params }) => {
    // console.log('fetch signer:' ,signer);

    const { id } = params;

    const arg = id.split('-');
    // console.log('info', arg);

    // Config contract
    const proxycontract = new ethers.Contract(arg[0], contract.abi, signer);

    // obtain all the transfer events from the contact for the token
    const logs = await alchemy.core.getLogs({
        address: arg[0],
        topics: [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            null,
            null,
            `0x${arg[1].padStart(64, 0)}`
        ],
        fromBlock: 'earliest'
    })
    // console.log("logs: ",logs)
  
    // generate the ledger
    let ledger = [];
    logs.forEach(async e => {
        const timestamp = await (await alchemyProvider.getBlock(e.blockNumber)).timestamp;
        const hystory = {}

        if(Number(e.topics[3]) == arg[1]){
            hystory.from = `0x${e.topics[1].slice(26)}`;
            hystory.to = `0x${e.topics[2].slice(26)}`;
            hystory.transactionHash = e.transactionHash;
            hystory.timestamp = timestamp;
        }

        ledger.push(hystory);
    })
    // console.log("ledger: ",ledger);
    
    const res = await alchemy.nft.getNftMetadata(arg[0], arg[1]);
    // console.log("res:",res);
    
    const coa = await res.rawMetadata;

    const coaname = await res.contract.name;
    
    // retrive token owner
    const owner = await proxycontract.ownerOf(arg[1]);

    // retrive token date
    const date = Date.parse(res.timeLastUpdated);

    return { coa: coa, coaname: coaname, owner: owner, date: date, ledger: ledger };
}

export const setMinter = async (minter) => {

        // contract address whose NFTs you want to fetch
        const address = "0x7D945e32D2B9C2c52b7388e2CD2764A0Cc666FBc";

        const proxycontract = new ethers.Contract(address, contract.abi, signer);

        // set minter
        const roleMint = await proxycontract.MINTER_ROLE();
        const hasRoll = await proxycontract.hasRole(roleMint, minter);
        if(!hasRoll){
            await proxycontract.grantRole(roleMint, minter.address);
            console.log('minter roll granted')
        }

        // minter roll
        console.log('minter rooll:', true)
}