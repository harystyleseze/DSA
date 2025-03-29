import { useState } from "react";
import { Box, Button, Text } from "@interchain-ui/react";
import { GrantModal } from "@/components/authz/GrantModal";
import { useAuthzContext } from "@/context";
import { Footer } from "@/components/common/Footer";
import { AuthzThemeProvider } from "@/components/common/AuthzThemeProvider";
import { IoMdCreate } from "react-icons/io";
import Link from "next/link";

export default function CreateGrant() {
  const [isOpen, setIsOpen] = useState(false);
  const { chainName } = useAuthzContext();

  return (
    <AuthzThemeProvider>
      <Box>
        <Box
          py={{ mobile: "$8", tablet: "$16" }}
          px={{ mobile: "$4", tablet: "$8" }}
          maxWidth="$containerLg"
          mx="auto"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={{ mobile: "$6", tablet: "$8" }}
            flexDirection={{ mobile: "column", tablet: "row" }}
            gap={{ mobile: "$4", tablet: "$6" }}
          >
            <IoMdCreate size="48px" color="#386641" />
            <Text
              as="h1"
              fontSize={{ mobile: "$2xl", tablet: "$3xl" }}
              fontWeight="$semibold"
              textAlign="center"
            >
              Create a New Grant
            </Text>
          </Box>
          <Text
            fontSize={{ mobile: "$md", tablet: "$lg" }}
            textAlign="center"
            attributes={{ mb: { mobile: "$8", tablet: "$12" } }}
          >
            Select the type of permission you want to grant and configure the
            settings.
          </Text>
          <Button
            intent="primary"
            onClick={() => setIsOpen(true)}
            attributes={{
              mx: "auto",
              display: "block",
              mt: "$8",
            }}
          >
            Create New Grant
          </Button>
          <GrantModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            chainName={chainName || ""}
          />
          <Box
            textAlign="center"
            mt={{ mobile: "$6", tablet: "$8" }}
            display="flex"
            flexDirection={{ mobile: "column", tablet: "row" }}
            gap={{ mobile: "$4", tablet: "$6" }}
            justifyContent="center"
          >
            <Link href="/">
              <Button
                intent="secondary"
                attributes={{
                  width: { mobile: "100%", tablet: "auto" },
                }}
              >
                Back to Homepage
              </Button>
            </Link>
          </Box>
        </Box>
        <Footer />
      </Box>
    </AuthzThemeProvider>
  );
}
