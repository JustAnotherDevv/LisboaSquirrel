# 🐿️🥜

## Dapp

## Smart Contracts

- `OrganizationSheet.sol` - Implementation of tracking for team token allocation for multiple organizations with different users and criteria.
- `SquirrelToken.sol` - Example of ERC20 compatible contract that could be used in the actual token luanch by the cofounders after all token allocation periods were completed.

### Adresses of smart contracts deployed on chains

#### Polygon Mumbai Testnet:

-     `OrganizationSheet.sol`    -    0x1732CfDEB84176C78190eaED7592D95726456A77
-     `SquirrelToken.sol`    0xf492cC2A1e0ADB48B98c6D68118Ab7d79dc93b5d

#### Gnosis Chiado Testnet:

- `OrganizationSheet.sol` 0x2F51DeA930a71BE9fab183566116b0a5967063ea
- `SquirrelToken.sol` 0xbb3a8a4ebc9bEf9f394d4bdf2D0ae1EAe794F23a

### Integrations:

## PHala

[Phala offchain oracle running](./Capture111.PNG)

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

---

# TODO

- Allow ENS names to be entered
- Resolve addresses to ENS names when displayed
