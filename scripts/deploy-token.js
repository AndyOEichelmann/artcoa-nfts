const { artifacts } = require('hardhat');

const tokenURI = 'ipfs://';

async function main() {
    
  // deply ACoA nft contract
  const CoA = await ethers.getContractFactory("ERC721CoA");
  const coa = await CoA.deploy();

  await coa.waitForDeployment();

  console.log(
    `Test ERC721ACoA deployed to ${coa.target}`
  );

  saveFrontendFiles(coa, "ERC721CoA");
}

function saveFrontendFiles(contract, name) {
  const fs = require('fs');
  const contractsDir = __dirname + "/../src/frontend/contract-data";

  if(!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.target }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run --network sepolia scripts/deploy-token.js

// 

// etherscan: https://sepolia.etherscan.io/address/0x7D945e32D2B9C2c52b7388e2CD2764A0Cc666FBc#code