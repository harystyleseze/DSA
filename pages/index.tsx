// TODO fix type issues
// @ts-nocheck

import { useState } from "react";
import {
  Divider,
  Box,
  Button,
  Text,
  Stack,
  useColorModeValue,
} from "@interchain-ui/react";
import { ChainName } from "cosmos-kit";
import Link from "next/link";
import {
  IoMdCreate,
  IoMdEye,
  IoMdGift,
  IoMdWallet,
  IoMdChatbubbles,
} from "react-icons/io";

import { useAuthzContext } from "@/context";
import { Layout, Wallet, AuthzSection } from "@/components";
import { AuthzThemeProvider } from "@/components/common/AuthzThemeProvider";

export default function Home() {
  const [selectedChain, setSelectedChain] = useState<ChainName>();
  const { setChainName } = useAuthzContext();

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
          <Box
            textAlign="center"
            mb={{ mobile: "$16", tablet: "$20" }}
            attributes={{
              background: {
                default:
                  "linear-gradient(180deg, #f2e8cf 0%, rgba(242, 232, 207, 0) 100%)",
                _dark:
                  "linear-gradient(180deg, rgba(56, 102, 65, 0.2) 0%, rgba(56, 102, 65, 0) 100%)",
              },
              borderRadius: "$2xl",
              padding: { mobile: "$8", tablet: "$12" },
            }}
          >
            <Box display="flex" justifyContent="center" mb="$6">
              <IoMdWallet
                size={64}
                color="#386641"
                style={{ filter: "brightness(1.2)" }}
              />
            </Box>
            <Text
              as="h1"
              fontSize={{ mobile: "$4xl", tablet: "$5xl" }}
              fontWeight="$bold"
              mb="$6"
              attributes={{
                color: {
                  default: "#386641",
                  _dark: "#a7c957",
                },
                lineHeight: "1.2",
              }}
            >
              Authz Grant Management
            </Text>
            <Text
              fontSize={{ mobile: "$xl", tablet: "$2xl" }}
              maxWidth="$containerSm"
              mx="auto"
              mb="$8"
              attributes={{
                color: {
                  default: "#6a994e",
                  _dark: "#f2e8cf",
                },
                lineHeight: "1.5",
              }}
            >
              Manage your blockchain permissions and grants in one place.
            </Text>
          </Box>

          {/* Wallet Section */}
          <Box
            attributes={{
              backgroundColor: {
                default: "#ffffff",
                _dark: "rgba(56, 102, 65, 0.1)",
              },
              borderRadius: "$xl",
              padding: { mobile: "$8", tablet: "$10" },
              marginBottom: { mobile: "$16", tablet: "$20" },
              boxShadow: {
                default: "0 8px 16px rgba(56, 102, 65, 0.08)",
                _dark: "0 8px 16px rgba(0, 0, 0, 0.2)",
              },
              border: {
                default: "1px solid rgba(106, 153, 78, 0.1)",
                _dark: "1px solid rgba(167, 201, 87, 0.2)",
              },
            }}
          >
            <Wallet
              chainName={selectedChain}
              isMultiChain
              onChainChange={(chainName) => {
                setSelectedChain(chainName);
                setChainName(chainName);
              }}
            />
          </Box>

          {/* Quick Actions */}
          <Box mb={{ mobile: "$16", tablet: "$20" }}>
            <Text
              as="h2"
              fontSize={{ mobile: "$2xl", tablet: "$3xl" }}
              fontWeight="$bold"
              textAlign="center"
              mb="$10"
              attributes={{
                color: {
                  default: "#386641",
                  _dark: "#a7c957",
                },
              }}
            >
              Quick Actions
            </Text>
            <Box
              display="flex"
              flexDirection={{ mobile: "column", tablet: "row" }}
              gap={{ mobile: "$6", tablet: "$8" }}
              justifyContent="center"
              alignItems={{ mobile: "stretch", tablet: "stretch" }}
              px={{ mobile: "$4", tablet: "0" }}
            >
              {[
                {
                  href: "/create-grant",
                  icon: IoMdCreate,
                  text: "Create New Grant",
                },
                { href: "/grantsbyme", icon: IoMdEye, text: "View My Grants" },
                {
                  href: "/grantstome",
                  icon: IoMdGift,
                  text: "View Grants to Me",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ width: "100%" }}
                >
                  <Box
                    attributes={{
                      padding: "$8",
                      backgroundColor: {
                        default: "#ffffff",
                        _dark: "rgba(56, 102, 65, 0.1)",
                      },
                      borderRadius: "$xl",
                      boxShadow: {
                        default: "0 4px 12px rgba(56, 102, 65, 0.06)",
                        _dark: "0 4px 12px rgba(0, 0, 0, 0.2)",
                      },
                      border: {
                        default: "1px solid rgba(106, 153, 78, 0.1)",
                        _dark: "1px solid rgba(167, 201, 87, 0.2)",
                      },
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "$4",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      width: "100%",
                      _hover: {
                        transform: "translateY(-4px)",
                        boxShadow: {
                          default: "0 8px 24px rgba(56, 102, 65, 0.12)",
                          _dark: "0 8px 24px rgba(0, 0, 0, 0.3)",
                        },
                        borderColor: {
                          default: "#6a994e",
                          _dark: "#a7c957",
                        },
                        backgroundColor: {
                          default: "#ffffff",
                          _dark: "rgba(56, 102, 65, 0.2)",
                        },
                      },
                    }}
                  >
                    <Box
                      attributes={{
                        backgroundColor: {
                          default: "#f2e8cf",
                          _dark: "rgba(167, 201, 87, 0.1)",
                        },
                        borderRadius: "$lg",
                        padding: "$4",
                        flexShrink: "0",
                      }}
                    >
                      <item.icon
                        size="24px"
                        color={useColorModeValue("#386641", "#a7c957")}
                      />
                    </Box>
                    <Text
                      fontSize={{ mobile: "$lg", tablet: "$xl" }}
                      fontWeight="$semibold"
                      attributes={{
                        color: {
                          default: "#386641",
                          _dark: "#a7c957",
                        },
                        flex: "1",
                        textAlign: "left",
                      }}
                    >
                      {item.text}
                    </Text>
                  </Box>
                </Link>
              ))}
              <Link href="/grants-dashboard" style={{ width: "100%" }}>
                <Box
                  attributes={{
                    padding: "$8",
                    backgroundColor: {
                      default: "#ffffff",
                      _dark: "rgba(56, 102, 65, 0.1)",
                    },
                    borderRadius: "$xl",
                    boxShadow: {
                      default: "0 4px 12px rgba(56, 102, 65, 0.06)",
                      _dark: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    },
                    border: {
                      default: "1px solid rgba(106, 153, 78, 0.1)",
                      _dark: "1px solid rgba(167, 201, 87, 0.2)",
                    },
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "$4",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    width: "100%",
                    _hover: {
                      transform: "translateY(-4px)",
                      boxShadow: {
                        default: "0 8px 24px rgba(56, 102, 65, 0.12)",
                        _dark: "0 8px 24px rgba(0, 0, 0, 0.3)",
                      },
                      borderColor: {
                        default: "#6a994e",
                        _dark: "#a7c957",
                      },
                      backgroundColor: {
                        default: "#ffffff",
                        _dark: "rgba(56, 102, 65, 0.2)",
                      },
                    },
                  }}
                >
                  <IoMdEye size={24} color="#386641" />
                  <Text
                    fontSize={{ mobile: "$lg", tablet: "$xl" }}
                    fontWeight="$medium"
                    attributes={{
                      color: {
                        default: "#386641",
                        _dark: "#a7c957",
                      },
                    }}
                  >
                    Go to Dashboard
                  </Text>
                </Box>
              </Link>
              <Link href="/chat" style={{ width: "100%" }}>
                <Box
                  attributes={{
                    padding: "$8",
                    backgroundColor: {
                      default: "#ffffff",
                      _dark: "rgba(56, 102, 65, 0.1)",
                    },
                    borderRadius: "$xl",
                    boxShadow: {
                      default: "0 4px 12px rgba(56, 102, 65, 0.06)",
                      _dark: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    },
                    border: {
                      default: "1px solid rgba(106, 153, 78, 0.1)",
                      _dark: "1px solid rgba(167, 201, 87, 0.2)",
                    },
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "$4",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    width: "100%",
                    _hover: {
                      transform: "translateY(-4px)",
                      boxShadow: {
                        default: "0 8px 24px rgba(56, 102, 65, 0.12)",
                        _dark: "0 8px 24px rgba(0, 0, 0, 0.3)",
                      },
                      borderColor: {
                        default: "#6a994e",
                        _dark: "#a7c957",
                      },
                      backgroundColor: {
                        default: "#ffffff",
                        _dark: "rgba(56, 102, 65, 0.2)",
                      },
                    },
                  }}
                >
                  <IoMdChatbubbles size={24} color="#386641" />
                  <Text
                    fontSize={{ mobile: "$lg", tablet: "$xl" }}
                    fontWeight="$bold"
                    attributes={{
                      color: {
                        default: "#386641",
                        _dark: "#a7c957",
                      },
                    }}
                  >
                    Secret Chat
                  </Text>
                </Box>
              </Link>
            </Box>
          </Box>

          {/* Authz Section */}
          {selectedChain && (
            <Box
              attributes={{
                backgroundColor: {
                  default: "#ffffff",
                  _dark: "rgba(56, 102, 65, 0.1)",
                },
                borderRadius: "$xl",
                padding: { mobile: "$8", tablet: "$10" },
                boxShadow: {
                  default: "0 8px 16px rgba(56, 102, 65, 0.08)",
                  _dark: "0 8px 16px rgba(0, 0, 0, 0.2)",
                },
                border: {
                  default: "1px solid rgba(106, 153, 78, 0.1)",
                  _dark: "1px solid rgba(167, 201, 87, 0.2)",
                },
              }}
            >
              <AuthzSection chainName={selectedChain} />
            </Box>
          )}
        </Box>
      </Layout>
    </AuthzThemeProvider>
  );
}
