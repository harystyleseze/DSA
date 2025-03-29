// TODO fix type issues
// @ts-nocheck

import { useChain } from "@cosmos-kit/react";
import { Box, Icon, Text } from "@interchain-ui/react";

type LoginInfoBannerProps = {
  loginAddress: string;
  chainName: string;
};

export const LoginInfoBanner = ({
  loginAddress,
  chainName,
}: LoginInfoBannerProps) => {
  const { isWalletConnected } = useChain(chainName);

  if (!isWalletConnected) return null;

  return (
    <Box
      width="$fit"
      height="$14"
      backgroundColor="$cardBg"
      borderRadius="$md"
      display="flex"
      alignItems="center"
      gap="$4"
      px="$6"
      my="$16"
      mx="auto"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      transition="transform 0.2s ease-in-out"
      _hover={{ transform: "scale(1.02)" }}
    >
      <Icon name="errorWarningLine" size="$xl" />
      <Text>
        You are now logged in as&nbsp;
        <Text as="span" fontWeight="$semibold">
          {loginAddress}
        </Text>
      </Text>
    </Box>
  );
};
