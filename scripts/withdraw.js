const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  const balance = await fundMe.provider.getBalance(fundMe.address);
  const balanceInEth = ethers.utils.formatUnits(balance);
  console.log(`Withdrawing ${balanceInEth} ETH from contract...`);
  const transactionResponse = await fundMe.withdraw();
  await transactionResponse.wait(1);
  console.log("Contract funds withdrawn!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
