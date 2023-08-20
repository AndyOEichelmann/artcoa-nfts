const { Alchemy, Network } = require("alchemy-sdk");

// Configuration the Alchemy SDK
const config = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA,
};

// Alchemy object instance with the config to use for making requests
const alchemy = new Alchemy(config);

export const galleryLoader = async () => {

    // contract address whose NFTs you want to fetch
    const address = "0x8A465A325B4A684B6D2abf13ecCE6150f4219426";
    
    const res = await alchemy.nft.getNftsForContract(address);
    
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
    //console.log('info', arg);

    const res = await alchemy.nft.getNftMetadata(arg[0], arg[1]);
    //console.log(res);

    const coa = await res.rawMetadata;

    return coa;
}