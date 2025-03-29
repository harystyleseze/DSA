import { useState } from "react";
import { Box, Button, Text, Stack } from "@interchain-ui/react";
import { Grants } from "@/components/authz/Grants";
import { useAuthzContext } from "@/context";
import { Footer } from "@/components/common/Footer";
import { AuthzThemeProvider } from "@/components/common/AuthzThemeProvider";
import { IoMdCreate, IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";

export default function GrantsByMe() {
  const { chainName } = useAuthzContext();

  return (
    <AuthzThemeProvider>
      <Box>
        <Box
          maxWidth="$containerLg"
          mx="auto"
          px={{ mobile: "$4", tablet: "$8" }}
          py={{ mobile: "$8", tablet: "$12" }}
        >
          {/* Hero Section */}
          <Box textAlign="center" mb={{ mobile: "$8", tablet: "$12" }}>
            <Text
              as="h1"
              fontSize={{ mobile: "$3xl", tablet: "$4xl" }}
              fontWeight="$semibold"
              attributes={{ mb: "$4" }}
            >
              Grants Issued by Me
            </Text>
            <Text
              fontSize={{ mobile: "$lg", tablet: "$xl" }}
              color="$textSecondary"
              attributes={{
                maxWidth: "$containerSm",
                mx: "auto",
              }}
            >
              View and manage all the grants you have issued to other addresses
            </Text>
          </Box>

          {/* Grants Section */}
          <Box
            bg="$gray50"
            borderRadius="$xl"
            p={{ mobile: "$6", tablet: "$8" }}
            mb={{ mobile: "$8", tablet: "$12" }}
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          >
            <Grants chainName={chainName || ""} role="granter" />
          </Box>

          {/* Action Buttons */}
          <Box
            display="flex"
            flexDirection={{ mobile: "column", tablet: "row" }}
            gap="$4"
            justifyContent="center"
          >
            <Link href="/" style={{ width: "100%" }}>
              <Button
                intent="secondary"
                attributes={{
                  width: "100%",
                  height: "$12",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "$2",
                }}
              >
                <IoMdArrowRoundBack size="20px" />
                Back to Homepage
              </Button>
            </Link>
            <Link href="/create-grant" style={{ width: "100%" }}>
              <Button
                intent="primary"
                attributes={{
                  width: "100%",
                  height: "$12",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "$2",
                }}
              >
                <IoMdCreate size="20px" />
                Create New Grant
              </Button>
            </Link>
          </Box>
        </Box>
        <Footer />
      </Box>
    </AuthzThemeProvider>
  );
}
