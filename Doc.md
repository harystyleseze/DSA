# Delegated Staking Agent (DSA)

## Overview

Delegated Staking Agent (DSA) is a decentralized platform that enables delegated staking in the Cosmos ecosystem using the Cosmos SDK's Authz module. The platform allows users (granters) to delegate specific staking actions, such as token delegation or governance voting, to delegates (grantees) without relinquishing control over their funds.

## Features

- **Secure Delegation**: Grant specific permissions for staking operations while maintaining custody of funds
- **Multiple Grant Types**: Support for various authorization types including:
  - Staking delegation
  - Governance voting
  - Reward claiming
- **User-Friendly Interface**: Modern, responsive UI built with Next.js and @interchain-ui/react
- **Multi-Chain Support**: Compatible with multiple Cosmos-based chains
- **Real-Time Updates**: Live tracking of delegations, rewards, and voting power
- **Wallet Integration**: Seamless connection with popular Cosmos wallets

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.0.0 or higher)
- Yarn (v1.22.0 or higher)
- Python (v3.12 or higher) for the backend services
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/harystyleseze/DSA.git
cd DSA
```

2. Install frontend dependencies:

```bash
yarn install
```

3. Run locally:

```bash
yarn dev
```

## Development

1. Start the development server:

```bash
yarn dev
```

2. Run the backend services:

```bash
cd secret-backend
source venv/bin/activate
python app.py
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
DSA/
├── components/          # React components
├── configs/            # Configuration files
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── pages/              # Next.js pages
├── public/             # Static assets
├── styles/            # CSS and styling files
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── secret-backend/    # Python backend services
```

## Key Components

### Frontend

- **AuthzThemeProvider**: Custom theme provider for consistent styling
- **Wallet Integration**: Cosmos wallet connection management
- **Grant Management**: Interface for creating and managing grants
- **Voting Interface**: Governance proposal viewing and voting
- **Staking Dashboard**: Delegation and reward management

### Backend

- **Authentication**: Secure wallet authentication
- **Grant Processing**: Authorization grant creation and validation
- **Chain Integration**: Interaction with Cosmos chains
- **Transaction Management**: Secure transaction handling

## Usage Guide

### Connecting Your Wallet

1. Click "Connect Wallet" on the homepage
2. Select your preferred Cosmos wallet
3. Approve the connection request

### Creating a Grant

1. Navigate to "Create Grant"
2. Select the grant type (staking, voting, etc.)
3. Specify the grantee address
4. Configure grant parameters
5. Confirm and sign the transaction

### Managing Delegations

1. Access "My Grants" to view active delegations
2. Monitor delegation performance
3. Adjust or revoke permissions as needed

### Participating in Governance

1. Browse active proposals
2. Review proposal details
3. Cast votes through your delegate

## API Documentation

### Endpoints

- `POST /api/grants/create`: Create new authorization grant
- `GET /api/grants/list`: List all active grants
- `POST /api/grants/revoke`: Revoke existing grant
- `GET /api/proposals`: Get active governance proposals

## Security

- All smart contract interactions are signed by the user's wallet
- Grants can be revoked at any time by the granter
- Regular security audits are performed
- Bug bounty program available for security researchers

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**

   - Ensure your wallet extension is installed and up to date
   - Check if you're on the correct network

2. **Transaction Error**

   - Verify you have sufficient funds for gas
   - Check network connectivity
   - Ensure correct chain configuration

3. **Grant Creation Failed**
   - Verify the grantee address is valid
   - Check grant parameters are correctly set

## License

This project is licensed under the MIT License.

## Contact & Support

- GitHub Issues: [Create an issue](https://github.com/harystyleseze/DSA/issues)

## Acknowledgments

- Built with [create-cosmos-app](https://github.com/cosmology-tech/create-cosmos-app)
- Powered by [Cosmos SDK](https://github.com/cosmos/cosmos-sdk)
- UI components from [@interchain-ui/react](https://github.com/cosmology-tech/interchain-ui)
