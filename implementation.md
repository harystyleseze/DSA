1. Entry Point and Application Flow:

1. Entry Point and Setup:
   The application starts with `pages/_app.tsx` which sets up:

- Theme Provider
- Chain Provider (for Cosmos integration)
- Query Client (for data fetching)
- Authorization Context (AuthzProvider)

2. Main Application Flow:

```typescript
// pages/index.tsx - Home Page
export default function Home() {
  const [selectedChain, setSelectedChain] = useState<ChainName>();
  const { setChainName } = useAuthzContext();

  return (
    <Layout>
      <Wallet chainName={selectedChain} isMultiChain />
      <AuthzSection chainName={selectedChain} />
    </Layout>
  );
}
```

1. Permission Types Implementation:

a) Vote Permission:

```typescript
// In components/voting/Proposal.tsx
function onVoteButtonClick() {
  if (!voteType || !permission) return;
  const { grantee, granter, expiration } = permission;

  const msg = MsgVote.toProtoMsg({
    voter: granter,
    option: VoteTypes.indexOf(voteType),
    proposalId: proposal.proposalId,
  });

  authzTx({
    msgs: [createExecMsg({ msgs: [msg], grantee })],
    execExpiration: expiration,
    onSuccess: () => {
      onVoteSuccess();
    },
  });
}
```

b) Send Permission:

Search files...
The send implementation is found in `components/send/send.tsx`:

```typescript
// In components/send/send.tsx
const onSendClick = () => {
  if (!amount || !recipientAddress || !permission) return;
  const { grantee, granter, authorization, expiration } = permission;

  const sendAmount = shiftDigits(amount, exponent);

  // Check spend limit if authorization exists
  if (SendAuthorization.is(authorization)) {
    const limitAmount = authorization?.spendLimit?.[0]?.amount;
    if (limitAmount && new BigNumber(sendAmount).gt(limitAmount)) {
      toast({
        type: "error",
        title: "Amount exceeds the spending limit",
      });
      return;
    }
  }

  const msg = MsgSend.toProtoMsg({
    amount: [{ amount: sendAmount, denom: coin.base }],
    fromAddress: granter,
    toAddress: recipientAddress,
  });

  authzTx({
    msgs: [createExecMsg({ msgs: [msg], grantee })],
    execExpiration: expiration,
    onSuccess: () => {
      refetch();
      setAmount(undefined);
      setRecipientAddress("");
    },
  });
};
```

c) Delegate Permission:

```typescript
// In components/staking/DelegateModal.tsx
const onDelegateClick = async () => {
  if (!amount || !permission) return;
  const { grantee, granter, authorization, expiration } = permission;

  const delegateAmount = shiftDigits(amount, exponent);

  // Check authorization limits
  if (StakeAuthorization.is(authorization)) {
    const maxAmount = authorization?.maxTokens?.amount;
    if (maxAmount && new BigNumber(delegateAmount).gt(maxAmount)) {
      toast({
        type: "error",
        title: "Amount exceeds max tokens",
      });
      return;
    }

    // Check validator allowlist/denylist
    const allowList = authorization?.allowList?.address;
    const denyList = authorization?.denyList?.address;
    if (
      (allowList && !allowList.includes(selectedValidator.address)) ||
      (denyList && denyList.includes(selectedValidator.address))
    ) {
      toast({
        type: "error",
        title: "Unauthorized Delegation",
      });
      return;
    }
  }

  const msg = MsgDelegate.toProtoMsg({
    delegatorAddress: granter,
    validatorAddress: selectedValidator.address,
    amount: {
      amount: delegateAmount,
      denom: coin.base,
    },
  });

  authzTx({
    msgs: [createExecMsg({ msgs: [msg], grantee })],
    execExpiration: expiration,
    onSuccess: () => {
      /* handle success */
    },
  });
};
```

d) Claim Rewards Permission:

```typescript
// In components/claim-rewards/Overview.tsx
const onClaimRewardClick = () => {
  if (!permission) return;
  const { grantee, granter, expiration } = permission;

  const msgs = rewards.byValidators.map(({ validatorAddress }) =>
    MsgWithdrawDelegatorReward.toProtoMsg({
      delegatorAddress: granter,
      validatorAddress,
    })
  );

  authzTx({
    msgs: [createExecMsg({ msgs, grantee })],
    execExpiration: expiration,
    onSuccess: () => {
      updateData();
    },
  });
};
```

2. Grant and Revoke Implementation:

Let me search for the grant and revoke implementation.

Search files...
Here's how granting and revoking permissions are implemented:

1. Granting Permissions:

```typescript
// In components/authz/GrantModal.tsx
const onGrantClick = () => {
  if (!address || !granteeAddress || !expiryDate || !selectedPermission) return;

  // Create grant message based on permission type
  const grantMsg: Record<PermissionId, GrantMsg> = {
    send: {
      grantType: "send",
      customize: sendLimit
        ? {
            spendLimit: [coin(shiftDigits(sendLimit, exponent), denom)],
          }
        : undefined,
    },
    delegate: {
      grantType: "delegate",
      customize:
        delegateLimit || accessList.addresses.length > 0
          ? {
              authorizationType: AuthorizationType.AUTHORIZATION_TYPE_DELEGATE,
              maxTokens: coin(shiftDigits(delegateLimit, exponent), denom),
              [accessList.type]: { address: accessList.addresses },
            }
          : undefined,
    },
    vote: { grantType: "vote" },
    "claim-rewards": { grantType: "claim-rewards" },
  };

  // Create and execute grant message
  const msg = createGrantMsg({
    grantee: granteeAddress,
    granter: address,
    expiration: expiryDate,
    ...grantMsg[selectedPermission.id],
  });

  authzTx({
    msgs: [msg],
    onSuccess: () => {
      refetch();
      onModalClose();
    },
  });
};
```

2. Revoking Permissions:

```typescript
// In hooks/useAuthzTx.ts
export const createRevokeMsg = (permission: PrettyPermission) => {
  const { grantee, granter, authorization: authz } = permission;
  let msgTypeUrl = "";

  // Determine message type URL based on authorization type
  switch (true) {
    case GenericAuthorization.is(authz):
      msgTypeUrl = (authz as GenericAuthorization).msg;
      break;
    case SendAuthorization.is(authz):
      msgTypeUrl = MsgSend.typeUrl;
      break;
    case StakeAuthorization.is(authz):
      const authzType = (authz as StakeAuthorization).authorizationType;
      if (authzType === AuthorizationType.AUTHORIZATION_TYPE_DELEGATE) {
        msgTypeUrl = MsgDelegate.typeUrl;
      }
      // ... handle other stake authorization types
      break;
  }

  return revoke({
    grantee,
    granter,
    msgTypeUrl,
  });
};

// In components/authz/GrantDetailsModal.tsx
const handleRevoke = (permissions: PrettyPermission[]) => {
  setIsRevoking(true);

  authzTx({
    msgs: permissions.map(createRevokeMsg),
    onSuccess: () => {
      refetch();
      onClose();
    },
  });
};
```

The implementation follows this flow:

1. Entry Point (`pages/_app.tsx`):

- Sets up providers (Theme, Chain, Query Client, AuthzProvider)
- Configures wallet connection and chain selection

2. Home Page (`pages/index.tsx`):

- Displays wallet connection
- Shows authorization section when chain is selected

3. Permission Management:

- Each permission type (Vote, Send, Delegate, Claim) has its own component
- Components handle permission-specific logic and UI
- All use the common `authzTx` hook for transaction execution

4. Grant/Revoke Flow:

- Granting: Through `GrantModal` with customization options
- Revoking: Through `GrantCard` or `GrantDetailsModal`
- Both use `useAuthzTx` hook for transaction handling

5. Transaction Handling:

- All transactions go through `authzTx` hook
- Messages are created using appropriate message composers
- Transactions are signed and broadcast using the chain's RPC client

Would you like me to explain any specific part in more detail?
