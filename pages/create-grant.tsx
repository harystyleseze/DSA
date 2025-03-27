import { useState } from "react";
import { Box, Button, Text, Icon, ThemeProvider } from "@interchain-ui/react";
import { GrantModal } from "@/components/authz/GrantModal";
import { useAuthzContext } from "@/context";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { IoMdCreate } from "react-icons/io";
import Link from "next/link";

export default function CreateGrant() {
  const [isOpen, setIsOpen] = useState(false);
  const { chainName } = useAuthzContext();

  return (
    <ThemeProvider
      overrides={{
        button: {
          bg: {
            light: "green",
            dark: "blue",
          },
        },
      }}
      themeDefs={[
        {
          name: "custom",
          vars: {
            colors: {
              primary500: "#006400",
            },
          },
        },
      ]}
      customTheme="custom"
    >
      <Box>
        <Header />
        <Box py="$16" px="$8" maxWidth="$containerLg" mx="auto">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb="$8"
          >
            <IoMdCreate
              size="48px"
              color="#4A90E2"
              style={{ marginRight: "16px" }}
            />
            <Text
              as="h1"
              fontSize="$3xl"
              fontWeight="$semibold"
              textAlign="center"
            >
              Create a New Grant
            </Text>
          </Box>
          <Text fontSize="$lg" textAlign="center" attributes={{ mb: "$12" }}>
            Select the type of permission you want to grant and configure the
            settings.
          </Text>
          <Button
            intent="primary"
            onClick={() => setIsOpen(true)}
            attributes={{ mx: "auto", display: "block", mt: "$8" }}
          >
            Create New Grant
          </Button>
          <GrantModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            chainName={chainName || ""}
          />
          <Box textAlign="center" mt="$8">
            <Link href="/">
              <Button intent="secondary">Back to Homepage</Button>
            </Link>
          </Box>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
