# Hardhat Fund Me

Lesson 7 from the [FCC Vid course](https://www.youtube.com/watch?v=gyMwXuJrbJQ), [course repo](https://github.com/smartcontractkit/full-blockchain-solidity-course-js). Course developed by [Patrick Collins](https://www.youtube.com/c/patrickcollins).

## Notes

I made notes as I went along in `NOTES.md`.

## Testnet

To deploy to rinkeby testnet add .env variables and uncomment the network section in the `hardhat.config.js`.

The .env should include these (previous lessons explain):

```
RINKEBY_RPC_URL
PRIVATE_KEY
COINMARKETCAP_API_KEY
ETHERSCAN_API_KEY
```

-----

## Advanced Sample Hardhat Project

**The original notes that came with the hardhat boilerplate**

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.js
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```
