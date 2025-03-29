import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  useColorModeValue,
  Button,
} from "@interchain-ui/react";
import { useGrants } from "@/hooks";
import { Layout } from "@/components/common/Layout";
import Link from "next/link";
import { permissions } from "@/configs/permissions";

import { useToast } from "@/hooks/useToast";

import { useChain } from "@cosmos-kit/react";

interface Grant {
  grantee: string;
  granter?: string;
  permission: string;
  expiration: string | null;
}

const GrantsDashboard = () => {
  const CHAIN_NAME_STORAGE_KEY = "selected-chain";
  const chainName = localStorage.getItem(CHAIN_NAME_STORAGE_KEY) || "cosmoshub"; // Default to cosmoshub if not set
  const [granteeGrants, setGranteeGrants] = useState<Grant[]>([]);
  const [granterGrants, setGranterGrants] = useState<Grant[]>([]);
  const { data, refetch, isLoading, isError } = useGrants(chainName);
  const [activeTab, setActiveTab] = useState("grantee");
  const { toast } = useToast();
  const { address: granterAddress } = useChain(chainName);

  console.log("Chain Name:", chainName);
  console.log("Data from useGrants:", data);
  console.log("Is Loading:", isLoading);
  console.log("Is Error:", isError);

  const getPermissionName = (typeUrl: string | undefined) => {
    if (!typeUrl) return "Unknown";
    console.log("$typeUrl:", typeUrl);
    const typeUrlParts = typeUrl.split(".");
    const typeId = typeUrlParts[typeUrlParts.length - 1];
    console.log("Extracted typeId:", typeId);
    const permission = permissions.find((perm) =>
      typeId.toLowerCase().includes(perm.id)
    );
    console.log("Matched permission:", permission);
    return permission ? permission.name : "Unknown";
  };

  useEffect(() => {
    if (data) {
      console.log("Grantee Grants:", data.granteeGrants);
      console.log("Granter Grants:", data.granterGrants);
      const formattedGranteeGrants = data.granteeGrants.flatMap((grant: any) =>
        grant.permissions.map((permission: any) => ({
          grantee: grant.address,
          permission:
            permission.name ||
            getPermissionName(permission.authorization.$typeUrl),
          expiration: permission.expiration
            ? new Date(permission.expiration).toLocaleDateString()
            : "N/A",
        }))
      );

      const formattedGranterGrants = data.granterGrants.flatMap((grant: any) =>
        grant.permissions.map((permission: any) => ({
          granter: grant.address,
          permission:
            permission.name ||
            getPermissionName(permission.authorization.$typeUrl),
          expiration: permission.expiration
            ? new Date(permission.expiration).toLocaleDateString()
            : "N/A",
        }))
      );

      setGranteeGrants(formattedGranteeGrants);
      setGranterGrants(formattedGranterGrants);
    } else {
      setGranteeGrants([]);
      setGranterGrants([]);
    }
  }, [data]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const persistGrants = async () => {
    try {
      const response = await fetch("/api/grants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ granterGrants, granteeGrants }),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Grants persisted successfully.",
          type: "success",
          duration: 5000,
        });
      } else {
        throw new Error("Failed to persist grants.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        type: "error",
        duration: 5000,
      });
    }
  };

  return (
    <Layout>
      <Box
        maxWidth="$containerLg"
        mx="auto"
        px={{ mobile: 4, tablet: 8 }}
        py={{ mobile: 8, tablet: 12 }}
      >
        <Box marginBottom={10}>
          <Text
            as="h1"
            fontSize={{ mobile: "3xl", tablet: "4xl" }}
            fontWeight="bold"
            textAlign="center"
            color={useColorModeValue("#386641", "#a7c957")}
          >
            My Grants Dashboard
          </Text>
        </Box>
        <Box marginBottom={10} display="flex" justifyContent="flex-end">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Button
              attributes={{
                backgroundColor: useColorModeValue("#386641", "#a7c957"),
                color: "#ffffff",
              }}
            >
              Back to Home
            </Button>
          </Link>
        </Box>
        <Box marginBottom={10} display="flex" justifyContent="flex-end">
          <Link href="/chat" style={{ textDecoration: "none" }}>
            <Button
              attributes={{
                backgroundColor: useColorModeValue("#386641", "#a7c957"),
                color: "#ffffff",
              }}
            >
              Secret Chat
            </Button>
          </Link>
        </Box>
        <Box display="flex" justifyContent="center" mb={4}>
          <Button intent="primary" onClick={() => handleTabChange("grantee")}>
            Grantee Grants
          </Button>
          <Button intent="primary" onClick={() => handleTabChange("granter")}>
            Granter Grants
          </Button>
          <Button intent="primary" onClick={persistGrants}>
            Persist Grants
          </Button>
        </Box>
        <Box
          backgroundColor={useColorModeValue(
            "#ffffff",
            "rgba(56, 102, 65, 0.1)"
          )}
          borderRadius="xl"
          boxShadow={useColorModeValue(
            "0 8px 16px rgba(56, 102, 65, 0.08)",
            "0 8px 16px rgba(0, 0, 0, 0.2)"
          )}
          border={useColorModeValue(
            "1px solid rgba(106, 153, 78, 0.1)",
            "1px solid rgba(167, 201, 87, 0.2)"
          )}
        >
          {activeTab === "grantee" && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Grantee</TableCell>
                  <TableCell>Permission</TableCell>
                  <TableCell>Expiration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {granteeGrants.length === 0 ? (
                  <TableRow>
                    <TableCell>
                      <Box textAlign="center" width="100%">
                        No grantee data available.
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  granteeGrants.map((grant, index) => (
                    <TableRow key={index}>
                      <TableCell>{grant.grantee}</TableCell>
                      <TableCell>{grant.permission}</TableCell>
                      <TableCell>{grant.expiration}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
          {activeTab === "granter" && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Granter</TableCell>
                  <TableCell>Permission</TableCell>
                  <TableCell>Expiration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {granterGrants.length === 0 ? (
                  <TableRow>
                    <TableCell>
                      <Box textAlign="center" width="100%">
                        No granter data available.
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  granterGrants.map((grant, index) => (
                    <TableRow key={index}>
                      <TableCell>{grant.granter}</TableCell>
                      <TableCell>{grant.permission}</TableCell>
                      <TableCell>{grant.expiration}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default GrantsDashboard;
