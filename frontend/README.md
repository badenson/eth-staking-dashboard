# ETH Staking Dashboard

A full-stack, testnet-ready ETH staking dashboard for Ethereum (Sepolia), with a simple staking contract, REST API backend, and a modern React frontend.

## Features

- Stake and unstake ETH on Sepolia testnet
- View your staked balance and transaction status
- Modern dashboard UI
- Easy deployment with Docker

## Quick Start

### 1. Deploy the Staking Contract

- Use `contracts/SimpleStaking.sol`
- Deploy to Sepolia using Remix or Hardhat
- Fund your wallet with test ETH from [Sepolia faucet](https://sepoliafaucet.com/)
- Copy the contract address

### 2. Backend Setup

```bash
cd backend
cp .env.example .env  # Fill in your values
npm install
npm run dev