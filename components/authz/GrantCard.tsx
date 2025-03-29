// TODO fix type issues
// @ts-nocheck

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Text,
  TextField,
} from "@interchain-ui/react";
import { useChain } from "@cosmos-kit/react";

import {
  getChainLogoByChainName,
  PrettyGrant,
  PrettyPermission,
} from "@/utils";
import { useAuthzContext } from "@/context";
import { useAuthzTx, useGrants } from "@/hooks";
import { getCoin, permissionNameToRouteMap } from "@/configs";

import styles from "@/styles/custom.module.css";

type GrantCardProps = {
  role: "granter" | "grantee";
  grant: PrettyGrant;
  chainName: string;
  onViewDetails: () => void;
};

export const GrantCard = ({
  role,
  grant,
  chainName,
  onViewDetails,
}: GrantCardProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [revokingPermission, setRevokingPermission] =
    useState<PrettyPermission>();

  const { chain } = useChain(chainName);
  const { refetch } = useGrants(chainName);
  const { setPermission } = useAuthzContext();
  const { authzTx, createRevokeMsg } = useAuthzTx(chainName);

  const { address, permissions } = grant;

  const isGranter = role === "granter";
  const token = getCoin(chainName);

  const copy = (text: string) => {
    if (isCopied) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 800);
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
      });
  };

  const handleRevoke = (permission: PrettyPermission) => {
    setIsRevoking(true);

    authzTx({
      msgs: [createRevokeMsg(permission)],
      onSuccess: () => {
        refetch();
      },
      onComplete: () => {
        setIsRevoking(false);
      },
    });
  };

  return (
    <Box
      px="$10"
      py="$11"
      backgroundColor="#f2e8cf"
      borderRadius="$xl"
      width="$full"
      boxShadow="0 8px 16px rgba(56, 102, 65, 0.1)"
      transition="all 0.3s ease-in-out"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "0 12px 20px rgba(56, 102, 65, 0.15)",
      }}
      border="1px solid rgba(106, 153, 78, 0.1)"
    >
      <Stack
        space="$4"
        attributes={{
          alignItems: "center",
          mb: "$10",
          backgroundColor: "#6a994e15",
          padding: "$4",
          borderRadius: "$lg",
        }}
      >
        <Image
          alt={token.name}
          src={getChainLogoByChainName(chainName)}
          width="40"
          height="40"
          sizes="100vw"
        />
        <Text fontWeight="$semibold" fontSize="$xl" color="#386641">
          {chain.pretty_name}
        </Text>
      </Stack>

      <Box position="relative" mb="$10">
        <TextField
          id="address"
          label={isGranter ? "Grantee" : "Granter"}
          value={address}
          inputClassName={styles.customInput}
          attributes={{
            borderColor: "#6a994e",
            _focus: {
              borderColor: "#386641",
              boxShadow: "0 0 0 2px rgba(56, 102, 65, 0.2)",
            },
          }}
        />
        <Box position="absolute" bottom="$2" right="$2">
          <IconButton
            icon={isCopied ? "checkLine" : "copy"}
            size="sm"
            intent="secondary"
            iconSize={isCopied ? "$xl" : "$md"}
            onClick={() => copy(address)}
            attributes={{
              backgroundColor: isCopied ? "#a7c957" : "#6a994e",
              color: "#f2e8cf",
              _hover: {
                backgroundColor: isCopied ? "#6a994e" : "#386641",
              },
            }}
          />
        </Box>
      </Box>

      <Text
        color="#386641"
        fontSize="$sm"
        fontWeight="$semibold"
        lineHeight="$normal"
        attributes={{ mb: "$6" }}
      >
        Permissions
      </Text>

      <Box
        display="flex"
        gap="$6"
        flexWrap="wrap"
        mb="$12"
        height="auto"
        minHeight="$12"
        overflow="hidden"
        padding="$4"
        backgroundColor="#6a994e10"
        borderRadius="$lg"
      >
        {permissions.map((permission) =>
          isGranter ? (
            <Button
              key={permission.name}
              size="sm"
              intent="secondary"
              rightIcon="close"
              iconSize="$lg"
              onClick={() => {
                handleRevoke(permission);
                setRevokingPermission(permission);
              }}
              disabled={
                isRevoking && revokingPermission?.name === permission.name
              }
              attributes={{
                backgroundColor: "#bc4749",
                color: "#f2e8cf",
                _hover: {
                  backgroundColor: "#a33f41",
                },
                _disabled: {
                  backgroundColor: "#bc474980",
                  cursor: "not-allowed",
                },
              }}
            >
              {permission.name}
            </Button>
          ) : permissionNameToRouteMap[permission.name] ? (
            <Link
              href={permissionNameToRouteMap[permission.name]}
              style={{ textDecoration: "none" }}
            >
              <Button
                key={permission.name}
                size="sm"
                intent="secondary"
                rightIcon="arrowRightRounded"
                iconSize="$2xs"
                onClick={() => setPermission(permission)}
                attributes={{
                  backgroundColor: "#6a994e",
                  color: "#f2e8cf",
                  _hover: {
                    backgroundColor: "#386641",
                  },
                }}
              >
                {permission.name}
              </Button>
            </Link>
          ) : (
            <Button
              key={permission.name}
              size="sm"
              intent="secondary"
              attributes={{
                backgroundColor: "#a7c957",
                color: "#386641",
                _hover: {
                  backgroundColor: "#95b548",
                },
              }}
            >
              {permission.name}
            </Button>
          )
        )}
      </Box>

      <Button
        intent="tertiary"
        onClick={onViewDetails}
        attributes={{
          backgroundColor: "#386641",
          color: "#f2e8cf",
          _hover: {
            backgroundColor: "#2d5234",
          },
          _focus: {
            boxShadow: "0 0 0 3px rgba(56, 102, 65, 0.4)",
          },
        }}
      >
        View Details
      </Button>
    </Box>
  );
};
