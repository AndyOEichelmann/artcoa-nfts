const { Alchemy, Network } = require("alchemy-sdk");
const { ethers } = require('ethers');
const contract = require("../contract-data/ERC721CoA.json")

// netowork
const network = 'sepolia';

// Config Alchemy as a provider
const alchemyProvider = new ethers.AlchemyProvider(network, process.env.REACT_APP_ALCHEMY_API_KEY);

// Configure signer
const signer = new ethers.Wallet(process.env.REACT_APP_SEPOLIA_PRIVATE_KEY , alchemyProvider);

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

    // if (!res.ok) {
        //   throw Error('Culd not fetch certificates data');
    // }
        
    const acoa = await res.nfts;

    let unique = [];
    acoa.forEach(async element => {
        if (!unique.includes(element.rawMetadata.artist)) {
            unique.push(element.rawMetadata.artist);
        }
    });

    return { acoa: acoa, unique: await unique }
}

export const coaLoader = async ({ params }) => {

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
