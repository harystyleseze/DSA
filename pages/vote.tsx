// TODO fix type issues
// @ts-nocheck

import { Box, Text } from "@interchain-ui/react";
import { useAuthzContext } from "@/context";
import { withServerSideRedirect } from "@/utils";
import { Layout, Wallet, LoginInfoBanner, Voting } from "@/components";
import { AuthzThemeProvider } from "@/components/common/AuthzThemeProvider";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export const getServerSideProps = withServerSideRedirect({ to: "/" });

export default function Vote() {
  const { chainName, permission } = useAuthzContext();

  return (
    <AuthzThemeProvider>
      <Layout>
        <Box
          maxWidth="$containerLg"
          mx="auto"
          px={{ mobile: "$4", tablet: "$8" }}
          py={{ mobile: "$8", tablet: "$12" }}
        >
          {/* Hero Section */}
          <Box textAlign="center" mb={{ mobile: "$8", tablet: "$12" }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb="$4"
            >
              <IoMdCheckmarkCircleOutline size="48px" color="#386641" />
            </Box>
            <Text
              as="h1"
              fontSize={{ mobile: "$3xl", tablet: "$4xl" }}
              fontWeight="$semibold"
              attributes={{ mb: "$4" }}
            >
              Governance Voting
            </Text>
            <Text
              fontSize={{ mobile: "$lg", tablet: "$xl" }}
              color="$textSecondary"
              attributes={{
                maxWidth: "$containerSm",
                mx: "auto",
              }}
            >
              Participate in governance by voting on proposals
            </Text>
          </Box>

          {/* Wallet Section */}
          <Box
            bg="$gray50"
            borderRadius="$xl"
            p={{ mobile: "$6", tablet: "$8" }}
            mb={{ mobile: "$8", tablet: "$12" }}
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          >
            <Wallet chainName={chainName} />
          </Box>

          {chainName && (
            <>
              {/* Login Info Section */}
              {permission && (
                <Box
                  bg="$gray50"
                  borderRadius="$xl"
                  p={{ mobile: "$6", tablet: "$8" }}
                  mb={{ mobile: "$8", tablet: "$12" }}
                  boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                >
                  <LoginInfoBanner
                    chainName={chainName}
                    loginAddress={permission.granter}
                  />
                </Box>
              )}

              {/* Voting Section */}
              <Box
                bg="$gray50"
                borderRadius="$xl"
                p={{ mobile: "$6", tablet: "$8" }}
                boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                position="relative"
                zIndex="0"
              >
                <Voting chainName={chainName} />
              </Box>
            </>
          )}
        </Box>
      </Layout>
    </AuthzThemeProvider>
  );
}
