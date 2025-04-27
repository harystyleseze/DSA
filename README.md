# 🛡️ Delegated Staking Agent (DSA)

**Decentralized, secure staking and governance delegation built for the Cosmos ecosystem.**

---

## 🔍 Overview

**Delegated Staking Agent (DSA)** is a decentralized platform that enables secure **delegated staking and governance voting** across Cosmos-based blockchains. It uses the **Cosmos SDK Authz module** to allow users (granters) to delegate specific actions — such as staking, voting, or reward claiming — to trusted delegates (grantees), while retaining full custody of their tokens.

With integrated support from the **Secret AI SDK**, DSA provides a private, conversational assistant to help users navigate permissions, expiration dates, and setup instructions, ensuring a smooth and confidential staking experience.

---

## 🚀 Features

- **🔐 Secure Delegation**: Grant permissions without losing control of funds or assets
- **📑 Multiple Grant Types**:
  - Staking delegation
  - Governance voting
  - Reward claiming
- **💡 User-Friendly Interface**: Built with `Next.js` and `@interchain-ui/react`
- **🌐 Multi-Chain Support**: Compatible with multiple Cosmos SDK-based chains/chain registry
- **📊 Real-Time Updates**: Live tracking of delegations, voting power, and rewards
- **🔗 Wallet Integration**: Works seamlessly with Keplr, Leap, and other Cosmos wallets

---

## 🔗 Deployed Link

> ⚡ [View App](https://dsa-snowy.vercel.app/)

---

## 📹 Video Demo

> 🎥 [Watch Demo](https://drive.google.com/drive/folders/1swr4V4IOg1hi_MC1-5VC_gnm7un15qYr)

---

## 👨‍💻 Prerequisites

Before running the project locally, ensure you have:

- Node.js (v18.0.0 or higher)
- Yarn (v1.22.0 or higher)
- Git

---

## 🛠️ Installation

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

> Access the app at: [http://localhost:3000](http://localhost:3000)

---


## 🔧 Key Components

### Frontend

- **AuthzThemeProvider**: Custom styling and layout
- **Wallet Integration**: Wallet connection (Keplr, Leap, etc.)
- **Grant Management UI**: Interface for creating/viewing/revoking grants
- **Staking Dashboard**: Delegate tokens and monitor performance
- **Governance Tools**: Vote on proposals via delegated authority

### Backend

- **Secret AI SDK Integration**: Private, conversational assistant
- **Grant Handling**: Creation, validation, and revocation of grants
- **Chain Communication**: Fetch proposals, rewards, voting data
- **Security Layer**: Backend handles sensitive queries privately

---

## 👨‍🏫 Usage Guide

### 🔌 Connecting Your Wallet

1. Click **"Connect Wallet"** on the homepage
2. Choose your wallet (e.g., Keplr)
3. Approve the connection request

### 🎁 Creating a Grant

1. Navigate to **"Create Grant"**
2. Select grant type (e.g., staking, vote, reward claim)
3. Input the **grantee address**
4. Set an expiration and confirm
5. Sign the transaction in your wallet

### 📊 Managing Delegations

- View all active grants under **"My Grants"**
- Monitor delegated rewards, voting power
- Revoke or extend permissions anytime

### 🗳️ Participating in Governance

- View active proposals from your connected chains
- Vote manually or through your assigned grantee

---

## 🔒 Security

- **Non-custodial:** All actions require signed wallet transactions
- **Reversible Grants:** Granters can revoke access anytime
- **AI Privacy:** The backend uses Secret SDK for secure AI queries
- **Audits:** Code to undergo community security audits
- **Bug Bounty:** Contributions welcome via GitHub issues and PRs

---

## 👥 Team

| Name                   | Role                                   |
|------------------------|----------------------------------------|
| Harrison Eze           | Software Engineer (Lead Backend + AI) |
| Vera Ifebuche          | Frontend Developer (React, UI Logic)  |
| Paul Salawu            | UI/UX Designer                        |
| Amarachi Cynthia Eze   | Product Designer & Market Researcher  |

---

## 🌌 Cosmos Ecosystem Contribution

DSA enhances the **security and accessibility of on-chain activity** by providing a non-custodial way for Cosmos users to participate in staking and governance via trusted delegates. By simplifying permission management and offering a secure, AI-driven assistant, DSA helps reduce friction and boost active community participation across Cosmos SDK-based chains.

---

## 📅 Future Plans & Roadmap  

**Q3 2025 – Q2 2026**
---
### **Q3 2025 – Product Finalization & Testnet Launch**

- Finalize core features: staking, governance voting, reward claiming  
- Improve UI/UX based on early tester feedback  
- Integrate multi-chain support (Juno, Osmosis, Stargaze, Secret)  
- Launch public testnet with live community testing  
- Release clear setup guides for granters and grantees  

---
### **Q4 2025 – Mainnet Launch & Community Onboarding**

- Deploy DSA on mainnet across supported Cosmos chains  
- Publish user-friendly guides and video walkthroughs  
- Host live demo sessions and onboarding workshops  
- Collaborate with Cosmos DAOs and validator groups  
- Begin collecting feedback and monitoring delegate activity  

---

### **Q1 2026 and Beyond – Governance Tools & Ecosystem Growth**

- Develop and release a mobile app version of DSA  
- Launch full governance dashboard for proposal tracking and voting  
- Add alerts for proposal deadlines and grant expiration  
- Run a campaign to grow validator and user adoption  
- Analyze usage data to guide next iterations  
- Open community contributor program and launch GitHub bounties  

---

## 📘 License

MIT License © 2024 Delegated Staking Agent Contributors

---

## 📎 Resources

- [Cosmos SDK Authz Module Docs](https://docs.cosmos.network)
- [Secret Network](https://scrt.network/)
- [@interchain-ui/react](https://interchain-ui.dev)
- [Keplr Wallet](https://wallet.keplr.app/)
- [GitHub Repo](https://github.com/harystyleseze/DSA)

---

## 📬 Contact
- GitHub Issues: [Submit a bug or request a feature](https://github.com/harystyleseze/DSA/issues)
