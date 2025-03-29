# Delegated Staking Agent (DSA) - Features Documentation

## Core Features Overview

### 1. Authorization Management System

The application provides a comprehensive authorization (Authz) system for managing delegated permissions in the Cosmos ecosystem.

#### 1.1 Permission Types

- **Vote**: Governance proposal voting rights
- **Send**: Token transfer capabilities
- **Delegate**: Staking delegation management
- **Claim Rewards**: Staking rewards collection

### 2. Wallet Integration

#### 2.1 Multi-Chain Support

- Chain selection and management
- Network switching capabilities
- Chain-specific configuration handling

#### 2.2 Wallet Connection

- Multiple wallet provider support
- Address management and validation
- Transaction signing integration
- The Wallet component manages the chain name using a combination of a default value and local storage. When a user connects their wallet, the chain name is either retrieved from local storage or set to a default value (DEFAULT_CHAIN_NAME). This chain name is then used throughout the application.

### 3. Permission Management

#### 3.1 Grant Creation

```typescript
type GrantMsg = {
  grantType: "send" | "delegate" | "vote" | "claim-rewards";
  customize?: SendAuthorization | StakeAuthorization | GenericAuthorization;
};
```

Features:

- Custom spend limits for Send permissions
- Validator allowlist/denylist for Delegate permissions
- Expiration time settings
- Multiple permission types support

#### 3.2 Permission Revocation

- Individual permission revocation
- Bulk revocation capability
- Automatic expiration handling

### 4. Transaction System

#### 4.1 Message Composition

```typescript
const createGrantMsg = (options: CreateGrantMsgOptions) => {
  return grant({
    granter,
    grantee,
    grant: {
      authorization: authz[grantType],
      expiration,
    },
  });
};
```

#### 4.2 Transaction Types

1. Vote Transactions

```typescript
MsgVote.toProtoMsg({
  voter: granter,
  option: VoteTypes.indexOf(voteType),
  proposalId: proposal.proposalId,
});
```

2. Send Transactions

```typescript
MsgSend.toProtoMsg({
  fromAddress: granter,
  toAddress: recipient,
  amount: [{ amount: sendAmount, denom: coin.base }],
});
```

3. Delegate Transactions

```typescript
MsgDelegate.toProtoMsg({
  delegatorAddress: granter,
  validatorAddress: validator,
  amount: { amount: delegateAmount, denom: coin.base },
});
```

4. Claim Rewards Transactions

```typescript
MsgWithdrawDelegatorReward.toProtoMsg({
  delegatorAddress: granter,
  validatorAddress,
});
```

### 5. State Management

#### 5.1 Authorization Context

```typescript
type TAuthzContext = {
  permission: PrettyPermission | undefined;
  setPermission: (permission: PrettyPermission) => void;
  chainName: string | undefined;
  setChainName: (chainName: string | undefined) => void;
};
```

#### 5.2 Custom Hooks

1. `useAuthzTx`: Transaction management
2. `useGrants`: Grant data handling
3. `useVotingData`: Voting functionality
4. `useStakingData`: Staking operations

### 6. User Interface Components

#### 6.1 Core Components

1. `GrantModal`: Permission granting interface
2. `GrantCard`: Grant display and management
3. `PermissionDetailCard`: Detailed permission view
4. `Wallet`: Wallet connection and management

#### 6.2 Feature-Specific Components

1. Voting Section

   - Proposal display
   - Vote casting interface
   - Vote status tracking

2. Staking Section

   - Validator list
   - Delegation interface
   - Reward tracking

3. Send Section
   - Token transfer interface
   - Balance display
   - Transaction history

### 7. Security Features

#### 7.1 Permission Controls

- Expiration time enforcement
- Spend limit validation
- Validator list restrictions
- Authorization scope checking

#### 7.2 Transaction Safety

- Message validation
- Signature verification
- Network confirmation
- Error handling

### 8. Error Handling

#### 8.1 Transaction Errors

- Network failures
- Insufficient funds
- Invalid permissions
- Expired grants

#### 8.2 User Feedback

- Toast notifications
- Error messages
- Loading states
- Success confirmations

### 9. Network Management

#### 9.1 Chain Configuration

- RPC endpoint management
- Fee handling
- Network parameters
- Chain registry integration

#### 9.2 Transaction Broadcasting

- Message encoding
- Transaction signing
- Broadcast retry logic
- Confirmation tracking

### 10. User Interface Implementation

#### 10.1 Layout Structure

```typescript
// Core Layout Components
- Layout: Main container with max width and padding
- Header: App title and theme toggle
- Footer: Attribution and links
```

#### 10.2 Page Structure

1. **Home Page** (`pages/index.tsx`)

   - Multi-chain wallet selector
   - Authorization section
   - Grant management interface

2. **Staking Page** (`pages/stake.tsx`)

   - Wallet connection
   - Login info banner
   - Staking overview
   - Validator list

3. **Voting Page** (`pages/vote.tsx`)

   - Proposal list
   - Vote management
   - Voting statistics

4. **Claim Rewards Page** (`pages/claim-rewards.tsx`)
   - Rewards overview
   - Claim interface
   - Transaction management

#### 10.3 Component Architecture

1. **Header Component**

```typescript
- App branding ("DSA")
- Theme toggle (light/dark)
- Responsive design
- Gradient text effects
```

2. **Wallet Component**

```typescript
- Chain selection
- Address display
- Connection status
- Multi-chain support
```

3. **Grant Management**

```typescript
- GrantCard: Display and manage permissions
- GrantModal: Create new grants
- PermissionDetailCard: View detailed permission info
```

4. **Staking Interface**

```typescript
- Overview: Balance and rewards display
- AllValidatorsList: Validator management
- DelegateModal: Delegation interface
```

5. **Voting Interface**

```typescript
- ProposalList: Active and past proposals
- VoteModal: Voting interface
- VoteStatistics: Quorum and participation
```

#### 10.4 UI/UX Features

1. **Responsive Design**

```typescript
- Mobile-first approach
- Tablet and desktop breakpoints
- Flexible layouts
```

2. **Theme Support**

```typescript
- Light/dark mode toggle
- Color system
- Consistent styling
```

3. **Loading States**

```typescript
- Skeleton loaders
- Spinners
- Progress indicators
```

4. **Interactive Elements**

```typescript
- Buttons with loading states
- Modal dialogs
- Form inputs
- Toast notifications
```

5. **Data Display**

```typescript
- Asset headers
- Transaction lists
- Validator tables
- Statistics cards
```

#### 10.5 Component Interactions

1. **Wallet Integration Flow**

```typescript
1. Chain selection
2. Wallet connection
3. Address validation
4. Balance loading
```

2. **Permission Management Flow**

```typescript
1. Select permission type
2. Configure parameters
3. Set expiration
4. Grant authorization
5. View/Revoke permissions
```

3. **Staking Operations Flow**

```typescript
1. Select validator
2. Enter amount
3. Confirm delegation
4. Monitor transaction
5. View rewards
```

4. **Voting Process Flow**

```typescript
1. View proposals
2. Select proposal
3. Choose vote option
4. Submit vote
5. Track results
```

### 11. State Management Implementation

#### 11.1 Context Structure

```typescript
type TAuthzContext = {
  permission: PrettyPermission | undefined;
  setPermission: (permission: PrettyPermission) => void;
  chainName: string | undefined;
  setChainName: (chainName: string | undefined) => void;
};
```

#### 11.2 Data Flow

1. **Chain Selection**

   - Update chain context
   - Load chain-specific data
   - Update UI components

2. **Permission Updates**

   - Update permission context
   - Refresh grant list
   - Update UI state

3. **Transaction Flow**
   - Prepare transaction
   - Update loading state
   - Handle response
   - Update UI

#### 11.3 Error Handling

```typescript
- Network errors
- Transaction failures
- Invalid inputs
- Authorization errors
```

### 12. Styling System

#### 12.1 Theme Configuration

```typescript
- Color tokens
- Typography scale
- Spacing system
- Breakpoints
```

#### 12.2 Component Styles

```typescript
- Consistent spacing
- Responsive layouts
- Interactive states
- Accessibility features
```

#### 12.3 Animation System

```typescript
- Loading states
- Transitions
- Hover effects
- Modal animations
```

## Technical Implementation

### 1. Project Structure

```
/components
  /authz        - Authorization components
  /wallet       - Wallet integration
  /voting       - Governance features
  /staking      - Staking operations
  /send         - Token transfer
  /claim-rewards - Reward management

/context
  authz-context.tsx - Global state management

/configs
  permissions.ts - Permission configurations
  defaults.ts    - Default settings

/hooks
  useAuthzTx.ts - Transaction handling
  useGrants.ts  - Grant management
```

### 2. Key Features Implementation

#### 2.1 Authorization Flow

1. User connects wallet
2. Selects permission type
3. Configures permission parameters
4. Grants authorization
5. Manages granted permissions

#### 2.2 Transaction Flow

1. Permission verification
2. Message composition
3. Transaction signing
4. Network broadcast
5. Confirmation handling

### 3. Development Guidelines

#### 3.1 Code Standards

- TypeScript strict mode
- React best practices
- Component reusability
- Error boundary implementation

#### 3.2 Performance Optimization

- State management efficiency
- Network request optimization
- Component rendering optimization
- Error handling strategies

### 13. Utility Functions and Helpers

#### 13.1 Calculation Utilities

```typescript
// BigNumber operations for precise calculations
export const isGreaterThanZero = (val: number | string | undefined) => {
  return new BigNumber(val || 0).gt(0);
};

export const shiftDigits = (
  num: string | number | undefined | null,
  places: number,
  decimalPlaces?: number
) => {
  return new BigNumber(num ?? 0)
    .shiftedBy(places)
    .decimalPlaces(decimalPlaces || 6)
    .toString();
};

// Percentage calculations
export function percent(num: number | string = 0, total: number, decimals = 2) {
  return total
    ? new BigNumber(num)
        .dividedBy(total)
        .multipliedBy(100)
        .decimalPlaces(decimals)
        .toNumber()
    : 0;
}
```

#### 13.2 Data Transformation

```typescript
// Array manipulation
export const splitIntoChunks = (arr: any[], chunkSize: number) => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

// Binary data handling
export const decodeUint8Arr = (uint8array: Uint8Array | undefined) => {
  if (!uint8array) return "";
  return new TextDecoder("utf-8").decode(uint8array);
};

// Base64 encoding
export function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  arr.forEach((byte) => {
    bin.push(String.fromCharCode(byte));
  });
  return btoa(bin.join(""));
}
```

#### 13.3 Type Handling

```typescript
// Null/Undefined checks
export function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

// Default value omission
export function omitDefault<T extends string | number | bigint | boolean>(
  input: T
): T | undefined {
  if (typeof input === "string") {
    return input === "" ? undefined : input;
  }
  // ... other type checks
}
```

#### 13.4 Chain-Specific Utilities

```typescript
// Token formatting
const formatTokenAmount = (token: Coin) => {
  const symbol = getSymbolByDenom(token.denom);
  const exponent = getExponentByDenom(token.denom);
  const displayAmount = shiftDigits(token.amount, -exponent);
  return `${displayAmount} ${symbol}`;
};

// Denom handling
export const getExponentByDenom = (denom: string) => {
  const asset = assets.find((chain) => chain.assets[0].base === denom)
    ?.assets[0];
  const exponent = asset?.denom_units.find(
    (unit) => unit.denom === asset.display
  )?.exponent;
  return exponent || 6;
};
```

#### 13.5 Staking Utilities

```typescript
// Delegation parsing
export const parseDelegations = (
  delegations: QueryDelegatorDelegationsResponse["delegationResponses"],
  exponent: number
) => {
  return delegations.map(({ balance, delegation }) => ({
    validatorAddress: delegation?.validatorAddress || "",
    amount: shiftDigits(balance?.amount || ZERO, exponent),
  }));
};

// Rewards calculation
const findAndDecodeReward = (
  coins: Coin[],
  denom: string,
  exponent: number
) => {
  const amount = coins.find((coin) => coin.denom === denom)?.amount || ZERO;
  const decodedAmount = decodeCosmosSdkDecFromProto(amount).toString();
  return shiftDigits(decodedAmount, exponent);
};
```

#### 13.6 Time and Duration Handling

```typescript
// Duration conversion
export function toDuration(duration: string): Duration {
  return {
    seconds: BigInt(Math.floor(parseInt(duration) / 1000000000)),
    nanos: parseInt(duration) % 1000000000,
  };
}

export function fromDuration(duration: Duration): string {
  return (
    parseInt(duration.seconds.toString()) * 1000000000 +
    duration.nanos
  ).toString();
}
```

### 14. Common Tools Usage

#### 14.1 BigNumber.js

- Precise decimal calculations
- Token amount manipulation
- Percentage calculations
- Exponentiation operations

#### 14.2 TextEncoder/Decoder

- Binary data handling
- UTF-8 encoding/decoding
- Uint8Array processing

#### 14.3 Type Guards

- Null checks
- Type validation
- Default value handling
- Object validation

#### 14.4 String Manipulation

- Capitalization
- Formatting
- Token amount display
- Error messages

#### 14.5 Array Operations

- Chunking
- Mapping
- Filtering
- Transformation
