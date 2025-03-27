import { useState } from "react";
import { Box, Button, Text } from "@interchain-ui/react";
import { Grants } from "@/components/authz/Grants";
import { useAuthzContext } from "@/context";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import Link from "next/link";

export default function GrantsByMe() {
  const { chainName } = useAuthzContext();

  return (
    <Box>
      <Header />
      <Box py="$16" px="$8" maxWidth="$containerLg" mx="auto">
        <Text
          as="h1"
          fontSize="$3xl"
          fontWeight="$semibold"
          textAlign="center"
          attributes={{ mb: "$8" }}
        >
          Grants Issued by Me
        </Text>
        <Grants chainName={chainName || ""} role="granter" />
        <Box textAlign="center" mt="$8">
          <Link href="/">
            <Button intent="secondary">Back to Homepage</Button>
          </Link>
          <Link href="/create-grant">
            <Button intent="primary" attributes={{ ml: "$4" }}>
              Create New Grant
            </Button>
          </Link>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
