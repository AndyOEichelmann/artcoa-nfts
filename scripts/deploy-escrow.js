const { artifacts } = require('hardhat');



async function main() {

  // deply CoA Escrow
  const CoAEsrcow = await ethers.getContractFactory("ERC721CoA_Escrow");
  const coaescrow = await CoAEsrcow.deploy();

  await coaescrow.waitForDeployment();

  console.log(
    `Test ERC721ACoAEscrow deployed to ${coaescrow.target}`
  );

  saveFrontendFiles(coaescrow, "ERC721CoA_Escrow");
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

// npx hardhat run --network sepolia scripts/deploy-escrow.js

// verify: npx hardhat verify --network sepolia 0xFF13f21abd8A17337039219d794FDB0330047a09

// etherscan: https://sepolia.etherscan.io/address/0xFF13f21abd8A17337039219d794FDB0330047a09#code