# Authorization (Authz) Application PRD

## Overview

This application is a comprehensive authorization management system built on the Cosmos ecosystem that enables users to grant and manage permissions for various blockchain operations. The application handles four main types of permissions:

- Vote
- Send
- Delegate
- Claim Rewards

## Technical Stack

### Core Dependencies

```json
{
  "@cosmjs/amino": "0.32.4",
  "@cosmjs/cosmwasm-stargate": "0.32.4",
  "@cosmjs/proto-signing": "0.32.4",
  "@cosmjs/stargate": "0.32.4",
  "@interchain-kit/core": "0.0.1-beta.62",
  "@interchain-ui/react": "1.23.22",
  "chain-registry": "^1.69.32",
  "next": "^13",
  "react": "18.2.0"
}
```

## Core Features

### 1. Wallet Integration

The application integrates with Cosmos-based wallets through the `@cosmos-kit/react` package. The wallet component (`components/wallet/Wallet.tsx`) handles:

- Wallet connection
- Chain selection
- Address display and management
- Connection status handling

### 2. Permission Types

#### 2.1 Vote Permission

- Allows grantee to vote on governance proposals
- Implementation: `GenericAuthorization` with `MsgVote.typeUrl`
- No customization options
- Handled in `components/voting/Proposal.tsx`

#### 2.2 Send Permission

- Allows grantee to send tokens from granter's account
- Implementation: `SendAuthorization`
- Customizable with:
  - Spend limit
  - Token denomination
- Defined in `proto/cosmos/bank/v1beta1/authz.proto`

#### 2.3 Delegate Permission

- Allows grantee to delegate tokens to validators
- Implementation: `StakeAuthorization`
- Customizable with:
  - Maximum token amount
  - Validator allowlist/denylist
  - Authorization types (delegate/undelegate/redelegate)
- Defined in `proto/cosmos/staking/v1beta1/authz.proto`

#### 2.4 Claim Rewards Permission

- Allows grantee to claim staking rewards
- Implementation: `GenericAuthorization` with `MsgWithdrawDelegatorReward.typeUrl`
- No customization options
- Handled in `components/claim-rewards/Overview.tsx`

### 3. Grant Management

#### 3.1 Granting Permissions

The grant process is handled through the `GrantModal` component with the following flow:

1. User selects permission type
2. Sets grantee address
3. Sets expiration date
4. Configures custom parameters (if applicable)
5. Submits grant transaction

```typescript
const grantMsg = {
  send: {
    grantType: 'send',
    customize: sendLimit ? {
      spendLimit: [coin(amount, denom)]
    } : undefined
  },
  delegate: {
    grantType: 'delegate',
    customize: {
      authorizationType: AuthorizationType.AUTHORIZATION_TYPE_DELEGATE,
      maxTokens: coin(amount, denom),
      allowList/denyList: { address: addresses }
    }
  },
  vote: { grantType: 'vote' },
  'claim-rewards': { grantType: 'claim-rewards' }
}
```

#### 3.2 Revoking Permissions

Permissions can be revoked through the `GrantCard` or `GrantDetailsModal` components:

- Individual permission revocation
- Bulk revocation of all permissions
- Automatic cleanup of expired grants

### 4. Permission Execution

#### 4.1 Vote Execution

```typescript
const msg = MsgVote.toProtoMsg({
  voter: granter,
  option: VoteTypes.indexOf(voteType),
  proposalId: proposal.proposalId,
});
```

#### 4.2 Send Execution

```typescript
const msg = MsgSend.toProtoMsg({
  fromAddress: granter,
  toAddress: recipient,
  amount: [coin(amount, denom)],
});
```

#### 4.3 Delegate Execution

```typescript
const msg = MsgDelegate.toProtoMsg({
  delegatorAddress: granter,
  validatorAddress: validator,
  amount: coin(amount, denom),
});
```

#### 4.4 Claim Rewards Execution

```typescript
const msg = MsgWithdrawDelegatorReward.toProtoMsg({
  delegatorAddress: granter,
  validatorAddress,
});
```

## Application Flow

### 1. Home Page Load

1. Wallet component initialization
2. Chain selection/detection
3. Permission context setup
4. Network connection establishment

### 2. User Authentication

1. Wallet connection request
2. Address verification
3. Chain compatibility check
4. Permission loading

### 3. Permission Management

1. View existing grants (granted by/to user)
2. Create new grants
3. Modify existing grants
4. Revoke grants

### 4. Transaction Execution

1. Permission verification
2. Message composition
3. Transaction signing
4. Broadcast and confirmation

## Network Management

- Chain registry integration
- Multi-chain support
- Network switching
- Transaction fee handling

## Security Considerations

1. Expiration time enforcement
2. Spend limits
3. Validator restrictions
4. Authorization scoping
5. Transaction signing verification

## Error Handling

1. Connection failures
2. Transaction rejections
3. Invalid permissions
4. Network issues
5. Wallet interaction errors

## User Interface Components

1. Wallet connection
2. Permission management
3. Transaction execution
4. Network selection
5. Error displays

## State Management

1. Wallet state
2. Permission context
3. Transaction status
4. Network state
5. User preferences

## Development Guidelines

1. TypeScript strict mode
2. React best practices
3. Cosmos SDK compatibility
4. Error boundary implementation
5. Performance optimization

## Testing

1. Unit tests
2. Integration tests
3. Network interaction tests
4. Permission verification tests
5. Transaction simulation tests

## Technical Implementation Details

### 1. Context Management

#### 1.1 AuthzContext (`context/authz-context.tsx`)

```typescript
type TAuthzContext = {
  permission: PrettyPermission | undefined;
  setPermission: (permission: PrettyPermission) => void;
  chainName: string | undefined;
  setChainName: (chainName: string | undefined) => void;
};
```

- Manages global state for permissions and chain selection
- Provides permission context throughout the application
- Handles chain name state management
- Implements React Context API with proper type safety

### 2. Custom Hooks

#### 2.1 useAuthzTx (`hooks/useAuthzTx.ts`)

Core transaction hook that handles:

- Grant creation
- Permission revocation
- Transaction execution
- Message composition

```typescript
const useAuthzTx = (chainName: string) => {
  return {
    authzTx: (options: TxOptions) => void;
    createGrantMsg: (options: CreateGrantMsgOptions) => MsgGrant;
    createRevokeMsg: (permission: PrettyPermission) => MsgRevoke;
    createExecMsg: (options: CreateExecMsgOptions) => MsgExec;
  };
};
```

#### 2.2 useGrants (`hooks/useGrants.ts`)

Manages grant data fetching and state:

- Fetches active grants
- Handles pagination
- Provides grant filtering
- Manages loading states

#### 2.3 useVotingData (`hooks/useVotingData.ts`)

Handles voting-related data:

```typescript
const useVotingData = (chainName: string) => {
  // Queries
  const proposalsQuery = cosmos.gov.v1beta1.useProposals();
  const bondedTokensQuery = cosmos.staking.v1beta1.usePool();
  const quorumQuery = cosmos.gov.v1beta1.useParams();
  const votedProposalsQuery = cosmos.gov.v1beta1.useProposals();

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const { permission } = useAuthzContext();
};
```

### 3. Component Architecture

#### 3.1 Grant Management Components

##### GrantModal

```typescript
type GrantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  chainName: string;
};

type AccessList = {
  type: "allowList" | "denyList";
  addresses: string[];
};
```

##### GrantCard

```typescript
type GrantCardProps = {
  role: "granter" | "grantee";
  grant: PrettyGrant;
  chainName: string;
  onViewDetails: () => void;
};
```

##### PermissionDetailCard

```typescript
type PermissionDetailCardProps = {
  role: "granter" | "grantee";
  onRevoke: () => void;
  isRevoking: boolean;
  chainName: string;
  permission: PrettyGrant["permissions"][0];
};
```

### 4. Utility Functions

#### 4.1 Grant Processing

```typescript
export const prettyGrants = (
  grants: GrantAuthorization[],
  groupBy: "granter" | "grantee"
) => {
  // Transforms raw grants into user-friendly format
  // Groups grants by address
  // Adds expiry formatting
  // Adds human-readable names
};
```

#### 4.2 Authorization Types

```typescript
type GrantMsg =
  | {
      grantType: typeof Permission.Send;
      customize?: SendAuthorization;
    }
  | {
      grantType: typeof Permission.Delegate;
      customize?: StakeAuthorization;
    }
  | {
      grantType: typeof Permission.ClaimRewards | typeof Permission.Vote;
      customize?: GenericAuthorization;
    };
```

### 5. State Management Flow

1. **Permission Granting Flow**

   ```typescript
   // 1. User initiates grant
   const handleGrant = () => {
     // 2. Create grant message
     const msg = createGrantMsg({
       grantee,
       granter,
       expiration,
       ...customization,
     });

     // 3. Execute transaction
     authzTx({
       msgs: [msg],
       onSuccess: () => {
         refetch();
         onClose();
       },
     });
   };
   ```

2. **Permission Execution Flow**

   ```typescript
   // 1. User initiates action
   const handleExec = () => {
     // 2. Create execution message
     const msg = createExecMsg({
       grantee,
       msgs: [actionMsg],
     });

     // 3. Execute transaction
     authzTx({
       msgs: [msg],
       execExpiration: expiration,
       onSuccess: () => {
         onComplete();
       },
     });
   };
   ```

### 6. Error Handling Implementation

```typescript
const authzTx = async (options: TxOptions) => {
  try {
    // 1. Validate inputs
    validateInputs(options);

    // 2. Prepare transaction
    const tx = await prepareTx(options);

    // 3. Execute with error handling
    const result = await executeTx(tx);

    // 4. Handle success
    options.onSuccess?.(result);
  } catch (error) {
    // 5. Handle specific error types
    handleTxError(error);
  } finally {
    // 6. Cleanup
    options.onComplete?.();
  }
};
```

## Transaction Handling and Message Composition

### 1. Message Composers

#### 1.1 Bank Messages

```typescript
export const MessageComposer = {
  encoded: {
    send(value: MsgSend) {
      return {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: MsgSend.encode(value).finish(),
      };
    },
  },
};
```

#### 1.2 Staking Messages

```typescript
export const MessageComposer = {
  encoded: {
    delegate(value: MsgDelegate) {
      return {
        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
        value: MsgDelegate.encode(value).finish(),
      };
    },
    undelegate(value: MsgUndelegate) {
      return {
        typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
        value: MsgUndelegate.encode(value).finish(),
      };
    },
  },
};
```

#### 1.3 Governance Messages

```typescript
export const MessageComposer = {
  encoded: {
    vote(value: MsgVote) {
      return {
        typeUrl: "/cosmos.gov.v1beta1.MsgVote",
        value: MsgVote.encode(value).finish(),
      };
    },
  },
};
```

### 2. Message Type URLs

```typescript
const MessageTypeUrls = {
  Send: "/cosmos.bank.v1beta1.MsgSend",
  Delegate: "/cosmos.staking.v1beta1.MsgDelegate",
  Vote: "/cosmos.gov.v1beta1.MsgVote",
  ClaimRewards: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
};
```

### 3. Transaction Lifecycle

#### 3.1 Message Creation

```typescript
const createTxMessage = (type: string, data: any) => {
  return {
    typeUrl: type,
    value: data,
  };
};
```

#### 3.2 Transaction Signing

```typescript
const signTx = async (
  signerAddress: string,
  messages: EncodeObject[],
  fee: StdFee | "auto",
  memo: string = ""
): Promise<DeliverTxResponse> => {
  return rpc.signAndBroadcast!(signerAddress, messages, fee, memo);
};
```

#### 3.3 Transaction Broadcasting

```typescript
const broadcastTx = async (
  tx: SignedTransaction,
  options: BroadcastOptions
): Promise<DeliverTxResponse> => {
  try {
    const result = await client.broadcastTx(tx);
    return processResponse(result);
  } catch (error) {
    handleBroadcastError(error);
  }
};
```

### 4. Message Processing Pipeline

#### 4.1 Message Encoding

```typescript
const encodeMsg = {
  // Bank messages
  send: (msg: MsgSend) => MsgSend.encode(msg).finish(),

  // Staking messages
  delegate: (msg: MsgDelegate) => MsgDelegate.encode(msg).finish(),

  // Governance messages
  vote: (msg: MsgVote) => MsgVote.encode(msg).finish(),

  // Distribution messages
  withdrawReward: (msg: MsgWithdrawDelegatorReward) =>
    MsgWithdrawDelegatorReward.encode(msg).finish(),
};
```

#### 4.2 Message Validation

```typescript
const validateMsg = {
  send: (msg: MsgSend) => {
    validateAddress(msg.fromAddress);
    validateAddress(msg.toAddress);
    validateCoins(msg.amount);
  },

  delegate: (msg: MsgDelegate) => {
    validateAddress(msg.delegatorAddress);
    validateAddress(msg.validatorAddress);
    validateCoin(msg.amount);
  },
};
```

### 5. Authorization Types

#### 5.1 Generic Authorization

```typescript
interface GenericAuthorization {
  typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization";
  value: {
    msg: string; // Message type URL
  };
}
```

#### 5.2 Send Authorization

```typescript
interface SendAuthorization {
  typeUrl: "/cosmos.bank.v1beta1.SendAuthorization";
  value: {
    spendLimit: Coin[];
  };
}
```

#### 5.3 Stake Authorization

```typescript
interface StakeAuthorization {
  typeUrl: "/cosmos.staking.v1beta1.StakeAuthorization";
  value: {
    maxTokens: Coin;
    authorizationType: AuthorizationType;
    validators: {
      allowList?: { address: string[] };
      denyList?: { address: string[] };
    };
  };
}
```

### 6. Transaction Response Handling

#### 6.1 Success Response

```typescript
interface TxSuccess {
  code: 0;
  height: number;
  txhash: string;
  events: Event[];
  gasUsed: number;
  gasWanted: number;
}
```

#### 6.2 Error Response

```typescript
interface TxError {
  code: number;
  message: string;
  details: string[];
}
```

#### 6.3 Response Processing

```typescript
const processResponse = (response: DeliverTxResponse) => {
  if (isDeliverTxSuccess(response)) {
    return {
      success: true,
      hash: response.transactionHash,
      height: response.height,
    };
  } else {
    throw new TxError(response.code, response.rawLog);
  }
};
```

### 7. Transaction Fee Management

#### 7.1 Fee Estimation

```typescript
const estimateFee = async (
  messages: EncodeObject[],
  gasAdjustment: number = 1.3
): Promise<StdFee> => {
  const gasEstimate = await client.simulate(messages);
  return {
    amount: calculateFeeAmount(gasEstimate),
    gas: Math.ceil(gasEstimate * gasAdjustment).toString(),
  };
};
```

#### 7.2 Fee Configuration

```typescript
const FeeConfig = {
  send: {
    gasLimit: 200000,
    feeAmount: [{ amount: "2000", denom: "uatom" }],
  },
  delegate: {
    gasLimit: 250000,
    feeAmount: [{ amount: "2500", denom: "uatom" }],
  },
  vote: {
    gasLimit: 180000,
    feeAmount: [{ amount: "1800", denom: "uatom" }],
  },
};
```
