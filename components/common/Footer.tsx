// TODO fix type issues
// @ts-nocheck

import { Box, Link, Text, Stack, Divider } from "@interchain-ui/react";

export function Footer() {
  return (
    <>
      <Box mb="$6">
        <Divider />
      </Box>
      <Stack
        direction="horizontal"
        space="$2"
        attributes={{
          justifyContent: "center",
          opacity: 0.5,
          fontSize: "$sm",
        }}
      >
        <Text>Built by</Text>
        <Link href="https://github.com/harystyleseze" target="_blank">
          Harystyles
        </Link>
      </Stack>
    </>
  );
}
