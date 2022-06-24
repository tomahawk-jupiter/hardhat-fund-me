# Hardhat Fund Me Notes

The [Course Repo](https://github.com/smartcontractkit/full-blockchain-solidity-course-js). It includes timestamped links to the video.

## Contents

- [Setup](#setup)
- [Boilerplate Overview](#boilerplate-overview)
- [Hardhat Setup Continued](#hardhat-setup-continued)
- [Hardhat Deploy](#hardhat-deploy)
- [Deploy Script](#deploy-script)
- [Mocking & Helper Hardhat Config](#mocking--helper-hardhat-config)
- [Back to Deploy FundMe Script](#back-to-deploy-fundme-script)
- [Utils Folder](#utils-folder)
- [Testnet Demo](#testnet-demo)
- [Solidity Style Guide](#solidity-style-guide)
- [Testing Fund Me](#testing-fund-me)
- [Using Conole.log in Hardhat](#using-conolelog-in-hardhat)
- [Testing Fundme II](#testing-fundme-ii)
- [Storage In Solidity](#storage-in-solidity)
- [State Variables](#state-variables)
- [Gas Optimizations using Storage Knowledge](#gas-optimizations-using-storage-knowledge)
- [Staging Tests](#staging-tests)
- [Running Scripts on a Local Node](#running-scripts-on-a-local-node)
- [Adding Scripts to Package.json](#adding-scripts-to-packagejson)
- [Run ESlint](#run-eslint)

## Setup

Install hardhat `$ yarn add --dev hardhat`. This will create a package.json with just devDeps section.

Run hardhat `$ yarn hardhat`. This will go through some setup options.

Choose `create an advanced sample project`.

Press yes for all the options:

1. project root
1. Add a .gitignore
1. Install dependencies. We won't end up using alot of these.

We end up with our boilerplate.

[Page Top](#hardhat-fund-me-notes)

## Boilerplate Overview

We have the `contracts`, `node_modules`, `scripts` and `test` folders like before with the hardhat simple project.

It comes with more than the simple project and we can delete some.

### Files We Don't Need

He deletes these `.eslintignore` and `eslintrc.js`, but you can keep if you want. Eslint is for helping to find mistakes in your code.

`.npmignore` for if you push to npm and want to ignore files.

### Solhint

A solidity linter. Whereas Eslint is for javascript. It helps you to use best practices in your code.

A linter looks for errors in code and also formats. Its sometimes used interchangably with prettier but they are a bit different.

Lint files `$ yarn solhint contracts/*.sol`, this will lint all .sol files in the conracts folder.

If everything is ok nothing will happen. If there are problems it will tell you.

**Warnings** are best practices, the code will still work.

**Errors** the code won't work.

[Page Top](#hardhat-fund-me-notes)

## Hardhat Setup Continued

### Pretterrc

Set this up how you like.

He added to the `.prettierignore` (my one had the gas report already included, his did not include it):

- node_modules
- package.json
- img
- artifacts
- cache
- coverage\*
- .env
- .\*
- gasReporterOutput.json
- README.md
- coverage.json

### FundMe

Delete `Greeter.sol`.

Copy `FundMe.sol` and `PriceConverter.sol` from here [fundme repo](https://github.com/PatrickAlphaC/fund-me-fcc)

Make sure solidity version for the `contracts` and the `hardhat.config.js` are the same.

### Compile Error

If you compile `$ yarn hardhat compile`, there will be an error because we import a contract from @chainlink/contracts. We can install this code into our node_modules:

    $ yarn add --dev @chainlink/contracts

Hardhat will be smart enough to find it there from our import.

Now it will compile.

[Page Top](#hardhat-fund-me-notes)

## Hardhat Deploy

[hardhat-deploy](https://github.com/wighawag/hardhat-deploy) is a Hardhat Plugin For Replicable Deployments And Easy Testing.

Keeping track of all our deployments can get tricky when deploying with our script file. Its not saving our deployments to any file.

Additionally having everything in the deploy script for deploying can make the tests and deploy scripts not work hand in hand.

This is where `hardhat-deploy` comes in. It makes these and other things way easier.

### Install & Require

    $ yarn add --dev hardhat-deploy

In `hardhat.config.js`:

    require("hardhat-deploy");

We can delete our `deploy.js` script now.

### Deploy Task

We'll have a bunch of new tasks available for hardhat, take a look with `$ yarn hardhat`.

One of them is the deploy task.

We'll create a new folder for our deploy scripts called `deploy`, this is where `hardhat-deploy` looks to deploy code. It will run the scripts in here when we enter `$ yarn hardhat deploy`.

### hardhat-deploy-ethers

[hardhat-deploy-ethers](https://github.com/wighawag/hardhat-deploy-ethers)

We will install this, but we're going to do it a bit differently to usual.

    $ yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers

We're overriding `@nomiclabs/hardhat-ethers` which we used before and overriding with `hardhat-deploy-ethers`.

Remember before we used `hardhat-ethers` to override `ethers`. We are now overriding that with `hardhat-deploy-ethers`.

It will look like this `"@nomiclabs/hardhat-ethers": "npm:hardhat-deploy-ethers"`, in the package.json.

[Page Top](#hardhat-fund-me-notes)

## Deploy Script

Its best to number them so they run in the order you want. We will just have one script `01-deploy-fund-me.js`.

### What we did before

Before in our deploy.js script we import, main function, call main function.

Now we're going to do it a bit different, we will export a function that hardhat will look for.

### Example from the Docs

[hardhat-deploy docs](https://github.com/wighawag/hardhat-deploy#an-example-of-a-deploy-script-)

```javascript
module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  getUnnamedAccounts,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // the following will only deploy "GenericMetaTxProcessor" if the contract was never deployed or if the code changed since last deployment
  await deploy("GenericMetaTxProcessor", {
    from: deployer,
    gasLimit: 4000000,
    args: [],
  });
};
```

### What we'll do

```javascript
module.exports = async (hre) => {};
```

The `hre` is the `hardhat runtime environment`, when we run a deploy script this gets passed into it automatically by hardhat.

We can use javascript destructuring to pull out the variables we want from the hre object. Thats whats happening in the example from the docs.

```javascript
module.exports = async ({ getNamedAccounts, deployments }) => {};
```

We'll get some functions from these objects, these will be explained further:

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

### Named Accounts

In the `hardhat.config.js` there is an array of accounts for the network we are working on. We can setup names for these so we can tell them apart easier.

We add a `namedAccounts` property to the config and give the accounts names based on their index in the array.

We can name a deployer account is based on what network we are on, or a user account (any name?):

```javascript
namedAccounts: {
  deployer: {
    default: 0,
    4: 1, // Rinkeby network
    31337: 1, // hardhat
  },
  user: {
    default: 1,
    4: 0,
  },
},
```

[Page Top](#hardhat-fund-me-notes)

## Mocking & Helper Hardhat Config

Our `PriceConverter` uses a function from another contract. If we are using a local network to run our code, it won't exist.

One option is to fork a blockchain and have it hardcoded, we'll look at this later.

A better option is something called `mocking`.

### Refactor FundMe and PriceConverter

The address we use in our `PriceConverter` function is different for different blockchains (they all do a similar thing, get the price of ETH in USD).

We want to be able to pass in different addresses, ie. parameterize it. We can do this in the constructor of our main `FundMe` contract.

We want it to have a parameter for an address of a price feed `constructor(address priceFeedAddress) {...}`, so when we deploy our contract we pass in an address depending on what chain we're on.

We can save an aggregator v3 interface object as a global variable in our price converter, we just create a variable of type aggregatorV3Interface which we are importing from the chainlink repo, it is an interface object which gets compiled down to the ABI. If you match an ABI up with a contract address you can interact with.

```
// FundMe.sol
AggregatorV3Interface public priceFeed;

constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    priceFeed = AggregatorV3Interface(priceFeedAddress);
}
```

Now we want to use this for our price conversion function. We are using the PriceConverter as a library in our `FundMe.sol` here `using PriceConverter for uint256;` and using its `getConversionRate` function here `msg.value.getConversionRate()`, the `msg.value` is passed in as the first argument automatically.

We could also pass the `getConversionRate` a second argument, our new price feed like this `msg.value.getConversionRate(priceFeed)` and in `PriceConverter.sol` set it up to recieve this parameter `function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed)`.

We also pass the `getPrice` function the `priceFeed` and set that up to recieve it as a parameter.

    $ yarn hardhat compile

There was a warning, declaration shadows an existing declaration. This means a variable was declared twice with the same name. Delete the getVersion function because we don't need it and this will fix the warning.

[Page Top](#hardhat-fund-me-notes)

## Back to Deploy FundMe Script

Remember before we used contract factories.

With hardhat deploy we can use the deploy function passing in the contract name as first argument and a list of overrides as the second:

```javascript
const fundMe = await deploy("FundMe", {
  from: deployer,
  args: [], // arguments the contract takes
  log: true, // will log some info, we can add more with log("hello!")
});
```

args are the arguments the contract takes, we just added one `priceFeedAddress` (in the contstructor).

We will pass the address based on the chainId ie. what blockchain are we on.

We can get an idea from the [aave](https://github.com/aave/aave-v3-core) github, where they also need to deploy on different chains. See their `helper-hardhat-config.ts` file.

We will create our own helper file `helper-hardhat-config.js`, and this is where we'll define the network config. This needs to be exported so its available to other files.

```javascript
const networkConfig = {
  4: {
    name: "rinkeby",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
  137: {
    name: "poloygon",
    // ...etc
  },
};

// We'll be exporting some other things too
module.exports = {
  networkConfig,
};
```

Just find the chainId and the data feed address for ETH / USD for that network.

[chainlink data feed for ETH](https://docs.chain.link/docs/ethereum-addresses/)

What about hardhat local network? We'll deal with that soon.

## Local Mock Contract

We create a minimal version of this contract (price feed) for our local testing.

Deploying mocks is technically a deploy script. We'll do this in our deploy folder, create a new file.

We also need to create this mock contract in our contracts folder but we want to seperate it by putting it into a new folder within the `contracts` folder, call it `mocks` or `test`. The contract will be called `MockD3Aggregator.sol`.

We can look at this [chainlink repo](https://github.com/smartcontractkit/chainlink) and copy their contracts, or even better, we can **copy their mocks**, we already have this code in our `node_modules` so we just import it.

### Solidity Version Error

We can add multiple versions of solidity into the `hardhat.config.js` file for when we are compiling contracts of different versions, like this:

```javascript
module.exports = {
  // solidity: "0.8.8",
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
```

Compile `$ yarn hardhat compile`, and now we are ready to use this mock contract to get a mock price Feed.

### Only Use Mock on Local Chains

We don't want to use this mock on testnets, only local ones. We can add to our helper config `const developmentChain = ["hardhat", "localhost"];`, remember to export this.

Back in deploy mocks we can import it and use it to check if on a dev chain:

```javascript
// or if (chainId == "31337")
  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: // ???
    });
  }
```

We can check what arguments this contract takes on the github repo or in our node_modules folder. Look for the `contstuctor` function.

It takes `_decimals` which is how many decimal places it will be to eg. 8 (remember solidity doesn't deal with floats / decimals so we must make it an integer) and `_initialAnswer` which is what is the price feed starting at (we have to add decimal places onto this number eg. "2000" + 00000000). We can pick the price of the price feed (becuase we are just testing so the price isn't important to us).

We can add these two parameters in our helper config (its better to define them outside of the deploy function).

Import and pass them to the args array.

### How to Only Deploy the Mock Script

Add this `module.exports.tags = ["all", "mocks"];` to the bottom of the `00-deploy-mocks.js`.

**NOTE**: This `module.exports.tags` is in addition to the `module.exports =` that exports the deploy script.

And we can deploy only scripts that have this tag:

    $ yarn hardhat deploy --tags mocks

Or

    $ yarn hardhat deploy --tags all

It deploys, and because `log: true` it will show some details, tx, deploy address and gas.

### How to Apply this into our FundMe Script

Instead of make `ethUsdPriceFeedAddress` a const variable make in a let so we can update it.

```javascript
// const ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
let ethUsdPriceFeedAddress;
if (developmentChains.includes(network.name)) {
  // This will get the deployed mock
  const ethUsdAggregator = await deployments.get("MockV3Aggregator");
  ethUsdPriceFeedAddress = ethUsdAggregator.address;
} else {
  // Use the network config
  ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
}
```

We now have a robust script that will work on real networks and local ones.

### Other Awesome Things About Hardhat Deploy

When we run our local blockchain, hardhat deploy will run through all of our deploy scripts and add them to our node.

Now when we run `$ yarn hardhat node` to create a local node, it will have our contracts already on it.

[Page Top](#hardhat-fund-me-notes)

## Utils Folder

We want to verify our `FundMe` contract if we are not on a local blockchain, just like before, except instead of doing it right in the deploy script, we'll make a new folder called `utils` (stands for utilities) that will handle this.

[Page Top](#hardhat-fund-me-notes)

## Testnet Demo

Deploy to rinkeby. First cleanup `hardhat.config.js`, and then add the rinkeby to the networks section (need RPC and account private key), copy our gas reporter section from before.

Add .env variables and `$ yarn hardhat deploy --network rinkeby`.

### Block Confirmations

We can say how many blocks we want to wait for when testing on each network.

In `hardhat.config.js`:

    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
      blockConfirmations: 6,
    },

And in `01-deploy-fund-me.js`:

    const fundMe = await deploy("FundMe", {
      from: deployer,
      args: args,
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
    });

[Page Top](#hardhat-fund-me-notes)

## Solidity Style Guide

We'll make our contract look a bit more professional.

[Style Guide](https://docs.soliditylang.org/en/v0.8.13/style-guide.html)

- Things should appear in a certain order.
- Errors should have the contract name included.
- Contract code should also be in a certain order.

[NatSpec](https://docs.soliditylang.org/en/v0.8.13/natspec-format.html#natspec)

If you use NatSpec to comment your code, it can be used to autogenerate documentation later. This is only important if you need to make documentation for other devs.

[Page Top](#hardhat-fund-me-notes)

## Testing Fund Me

We'll make `staging` folder and `unit` folder, inside the main test folder.

Unit tests are done locally. Using local hardhat or forked hardhat.

Staging tests can be done on a testnet (LAST STOP!!), not always necessary, remember we want to limit testnet usage.

### FundMe Unit tests

We will use hardhat deploy in our tests.

To run tests: `$ yarn hardhat test`, to check test coverage: `$ yarn hardhat coverage`.

We will group our tests by function. Do this with nested describe blocks.

We can import the deployments object from hardhat into our test file. It has a `fixture` function, use like this: `await deployments.fixture(["all"]);`, it will deploy all scripts with the `all` tag. Do that in a before each.

**NOTE**: Remember we added the `all` tag when exporting our deploy scripts.

This line of code will get the most recent deployment of the FundMe contract `fundMe = await ethers.getContract("FundMe");`. It works because hardhat wraps ethers with the getContract function.

**NOTE**: Because we import it from hardhat: `const { ethers } = require("hardhat");`.

Get the deployer address `const { deployer } = await getNamedAccounts();`, or like this `deployer = (await getNamedAccounts()).deployer;`.

Get all accounts passed in our hardhat.config `const accounts = await ethers.getSigners();` and choose one to work with `const accountZero = accounts[0];`.

vid 11:16:51

**Stopped taking detailed notes**

**FIX**: In the fundme deploy script had to remove the `.default` from this line `module.exports.default =`.

### fund function revert test

vid 11:20:00

The fund should fail if not enough ETH sent. How to test for this?

This is where [waffle](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html) can be used. It has chai matchers specifically for solidity.

It can be used to test a revert `expect(fundMe.fund()).to.be.reverted` or `revertedWith("Some message")`.

### fund function with ETH

We can use this `ethers.utils.parseEther("1");` to make it easier to write values, ie. instead of typing `1000000000000000000`.

**TIP**: Also a util for [parseUnits](https://docs.ethers.io/v5/api/utils/display-logic/#utils-parseUnits).

Check to see if our data structure updates when an address sends ETH.

Run selected tests `$ yarn hardhat test --grep "amount funded"`, this will run tests that include that string.

### Test Withdraw

Arrange -> Act -> Assert, is a way to think about writing tests.

We are going to get the starting balance of the contract address and the deployer address, and then see if they have changed when the withdraw function is called.

Also remember to account for gas spent.

### Big Numbers

Add them like this `bigNumber1.add(bigNumber2)` not `bigNumber1 + bigNumber2`.

Also `bigNumber.toString()` is useful.

### Debugging & Breakpoints

Set a breakpoint, click the debug icon and select `JavaScript Debug Terminal`. This opens a debug terminal, run the tests `$ yarn hardhat test` in this terminal.

It will stop at the breakpoint and you can see the values of different variables in the side panel. This is very useful.

You can also go to the `DEBUG CONSOLE`, in here you can type variable names eg `transactionReceipt` and get loads of info, click to see it better.

You can see the gas price and gas used properties of the transactionReceipt.

### Getting Gas Cost

We can pull out objects / values from an object like this `const { gasUsed, effectiveGasPrice } = transactionReceipt;`.

[ethers bigNumber maths operations](https://docs.ethers.io/v5/api/utils/bignumber/#BigNumber--BigNumber--methods--math-operations)

### getBalance

This function is available from `ethers.provider.getBalance(address)` or `fundMe.provider.getBalance(address)`.

It gets the balance of an address.

[Page Top](#hardhat-fund-me-notes)

## Using Conole.log in Hardhat

Put this `import "hardhat/console.sol";` in your solidity file and you will be able to use console.log.

## Testing Fundme II

### Loop Accounts

We we want to connect to the contract with different accounts. So far its only connected with one account, the deployer, so when we use the contracts functions, its this address thats interacting with it.

```javascript
const deployer = (await getNamedAccounts()).deployer;
const fundMe = await ethers.getContract("FundMe", deployer);
```

Here we get other accounts and send funds from them.

```javascript
const accounts = await ethers.getSigners();
for (let i = 1; i < 6; i++) {
  const fundMeConnectedContract = await fundMe.connect(accounts[i]);
  fundMeConnectedContract.fund({ value: sendValue });
}
```

The rest of this test is similar to the previous test except that we want to make sure the funders are reset ie. the funder: value == 0, for each funder after the ETH is withdrawn.

### Testing Only the Owner can widthdraw

This is a very important test!

```javascript
it("Only allows the owner to withdraw", async function () {
  const accounts = ethers.getSigners();
  const attacker = accounts[1];
  const attackerConnectedContract = await fundMe.connect(attacker);
  await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
    "FundMe__NotOwner"
  );
});
```

[Page Top](#hardhat-fund-me-notes)

## Storage In Solidity

### Gas Reporter

Set `enable: true` in the `hardhat.config.js` for `gasReporter`.

We don't need to use `coinmarketCap` (this is for getting the price in normal currencies).

Run all tests `$ yarn hardhat test` and now there will be a `gas-report.txt` file created.

### State Variables

vid 11:46:30

When we declare a variable and we want it to persist. The way it persists is that it gets stored in the `storage`, its a list associated with this contract.

Each value is put in a 32byte long slot in this storage array. eg. the number 25 would be represented as a 32byte hex string, `0x00...19`. A boolean true would be `0x00...01`.

Everytime you store a variable like this, it takes up another slot.

**Dynamic values**, like an array or a map, use a hashing function (you can see the hasing funcions in the docs), it stores the array length in the storage slot and the values pushed into the array are stored somewhere else (in the storage?).

**constant & immutable variables** do not take up spots in storage. This is because they are part of the contracts byte code itself.

**Variables inside of functions** don't persist and aren't put into the `storage`, they exist in their own memory datastructure.

**memory keyword** we used this when defining strings, strings are technically arrays, we use the memory keyword when we want solidity to work with them in memory instead of put them in storage.

[Page Top](#hardhat-fund-me-notes)

## Gas Optimizations using Storage Knowledge

So Whenever we read or write from storage, it costs a ton of gas.

`opcodes` can be seen in the `artifacts/build-info`, these represent what the machine code is doing, how much computational work it takes to run and do stuff with our code.

Gas is calculated by these opcodes. You can see the [opcode gas prices](https://github.com/crytic/evm-opcodes), the table shows the cost in gas for each operation.

`SSTORE` and `SLOAD` are vert expensive operations.

### Label storage variables

Name storage variables with `s_variableName`, this is so you are aware that using this variable is going to cost alot of gas.

Name immutable variables with `i_variableName`, and constant are uppercase with underscores `VARIABLE_NAME`, we know these won't cost so much gas.

### FundMe Withdraw

With this new info in mind, look at the widthdraw function. Its using alot of the `s_` variables. We are using them inside a loop!

We can read the s_funders array once and store it in memory `address[] memory funders = s_funders;`.

We'll create a new function called cheaperWithdraw with this optimization.

**NOTE**: mappings can't be in memory.

We can copy the tests but change withdraw to cheaperWithdraw, run tests and compare them in the gas report.

## Solidity Chainlink Style Guide

We will refactor again. We'll make some variables private or internal (they can all be read from the blockchain anyway) and then create getters. Eg:

```solidity
address private immutable i_owner;

function getOwner() public view returns (address) {
  return i_owner;
}
```

This way people interacting with our contract won't see the s_variable, i_variable, etc, this might look confusing to them. Instead they will just see the getter functions we wrote, an API that makes sense to them.

Also reading from private or internal variables is **cheaper gas** wise.

Change the variables in the tests now to use the getter functions instead of the variables.

### Change requires to be reverts

This will save gas because the requires contain your error message string.

Using error codes is much cheaper.

**EXERCISE**: Change requires to reverts with error codes.

[Page Top](#hardhat-fund-me-notes)

## Staging Tests

Vid 12:12:00

Staging tests are tests that can be run on a testnet. Its the last step before deploying to a mainnet.

The tests are going to be similar to before but we won't deploy the contract in the test, we'll assume its already deployed (we deployed in the unit tests because the local environment does not persist).

We also don't need a `Mock` because we'll have access to the real contract.

### Skip tests

This will skip the tests in the describe block `describe.skip`, see the test files for usage, its used to conditionally run tests depending on network.

Running tests on local network `$ yarn hardhat test` or on a testnet `$ yarn hardhat test --network rinkeby`.

[Page Top](#hardhat-fund-me-notes)

## Running Scripts on a Local Node

We'll write a script to interact with our code in `scripts/fund.js`.

It will be used for if we want to fund our contract. Remember this is how you can write your script:

```javascript
async function main() {
  // Do stuff
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run a local node `$ yarn hardhat node`, this will open a node in another terminal.

In another terminal `$ yarn hardhat run scripts/fund.js --network localhost`.

### I Added Some Code

**NOTE**: I later removed this because you can get it already like this `const balance = await fundMe.provider.getBalance(fundMe.address);`.

I added a this to the `FundMe` contract:

```solidity
function getBalance() public view returns (uint256) {
  return address(this).balance;
}

```

I used it in the `withdraw.js` script to get the contract balance:

```javascript
const balance = await fundMe.getBalance();
const balanceInEth = ethers.utils.formatUnits(balance);
console.log(`Withdrawing ${balanceInEth} ETH from contract...`);
```

[Page Top](#hardhat-fund-me-notes)

## Adding Scripts to Package.json

```json
{
  "scripts": {
    "test": "yarn hardhat test",
    "test:staging": "yarn hardhat test --network rinkeby",
    "lint": "yarn solhint 'contracts/*.sol'",
    "lint:fix": "yarn solhint 'contracts/*.sol' --fix",
    "format": "yarn prettier --write .",
    "coverage": "yarn hardhat coverage"
  }
}
```

Run with `$ yarn <script>` eg. `$ yarn lint` or `$ yarn lint:fix`.

`lint` will show linting errors / warnings in the console. `lint:fix` will automatically fix what it can.

You can add scripts for the scripts we just wrote `"fund": "yarn hardhat run scripts/fund.js --network localhost"`.

## Run ESlint

    $ yarn run eslint yourfile.js

Or

    $ npx eslint yourfile.js

[Page Top](#hardhat-fund-me-notes)
