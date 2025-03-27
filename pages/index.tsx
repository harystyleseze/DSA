// TODO fix type issues
// @ts-nocheck

import { useState } from "react";
import { Divider, Box, Button } from "@interchain-ui/react";
import { ChainName } from "cosmos-kit";
import Link from "next/link";

import { useAuthzContext } from "@/context";
import { Layout, Wallet, AuthzSection } from "@/components";

export default function Home() {
  const [selectedChain, setSelectedChain] = useState<ChainName>();
  const { setChainName } = useAuthzContext();

  return (
    <Layout>
      <Wallet
        chainName={selectedChain}
        isMultiChain
        onChainChange={(chainName) => {
          setSelectedChain(chainName);
          setChainName(chainName);
        }}
      />
      <Divider height="0.1px" mt="$12" mb="$17" />
      {selectedChain && <AuthzSection chainName={selectedChain} />}
      <Box textAlign="center" mt="$12">
        <Link href="/create-grant">
          <Button intent="primary">Create Grant</Button>
        </Link>
        <Link href="/grantsbyme">
          <Button intent="secondary" attributes={{ ml: "$4" }}>
            View My Grants
          </Button>
        </Link>
        <Link href="/grantstome">
          <Button intent="secondary" attributes={{ ml: "$4" }}>
            View Grants to Me
          </Button>
        </Link>
      </Box>
    </Layout>
  );
}
