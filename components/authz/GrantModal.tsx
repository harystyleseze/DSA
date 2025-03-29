// TODO fix type issues
// @ts-nocheck

import { useState } from "react";
import { ChainName } from "cosmos-kit";
import {
  BasicModal,
  Box,
  TextField,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  SelectButton,
  ListItem,
  Stack,
  FieldLabel,
} from "@interchain-ui/react";
import { coin } from "@cosmjs/amino";
import { useChain } from "@cosmos-kit/react";
import { IoMdCalendar } from "react-icons/io";
import Calendar from "react-calendar";
import dayjs from "dayjs";

import {
  getExponent,
  PermissionId,
  PermissionItem,
  permissions,
} from "@/configs";
import { AuthorizationType } from "@/src/codegen/cosmos/staking/v1beta1/authz";
import { GrantMsg, useAuthzTx, useGrants } from "@/hooks";
import { getTokenByChainName, shiftDigits } from "@/utils";
import { CustomizationField } from "./CustomizationField";
import { AddressInput } from "@/components";

import styles from "@/styles/custom.module.css";

export type AccessList = {
  type: "allowList" | "denyList";
  addresses: string[];
};

type GrantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  chainName: ChainName;
};

export const GrantModal = ({ isOpen, onClose, chainName }: GrantModalProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [granteeAddress, setGranteeAddress] = useState("");
  const [addressErrorMsg, setAddressErrorMsg] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionItem | null>(null);

  const [sendLimit, setSendLimit] = useState<number | undefined>(undefined);
  const [delegateLimit, setDelegateLimit] = useState<number | undefined>(
    undefined
  );
  const [accessList, setAccessList] = useState<AccessList>({
    type: "allowList",
    addresses: [],
  });

  const [isGranting, setIsGranting] = useState(false);

  const { refetch } = useGrants(chainName);
  const { address } = useChain(chainName);
  const { authzTx, createGrantMsg } = useAuthzTx(chainName);

  const token = getTokenByChainName(chainName);
  const exponent = getExponent(chainName);
  const denom = token.base;

  const onModalClose = () => {
    setGranteeAddress("");
    setExpiryDate(null);
    setSelectedPermission(null);
    setSendLimit(undefined);
    setDelegateLimit(undefined);
    setIsGranting(false);
    setAccessList({ type: "allowList", addresses: [] });
    onClose();
  };

  const onGrantClick = () => {
    if (!address || !granteeAddress || !expiryDate || !selectedPermission)
      return;

    setIsGranting(true);

    const sendMsg: GrantMsg = {
      grantType: "send",
      customize: sendLimit
        ? {
            spendLimit: [coin(shiftDigits(sendLimit, exponent), denom)],
          }
        : undefined,
    };

    const delegateMsg: GrantMsg = {
      grantType: "delegate",
      customize:
        delegateLimit || accessList.addresses.length > 0
          ? {
              authorizationType: AuthorizationType.AUTHORIZATION_TYPE_DELEGATE,
              maxTokens: coin(shiftDigits(delegateLimit, exponent), denom),
              [accessList.type]: { address: accessList.addresses },
            }
          : undefined,
    };

    const grantMsg: Record<PermissionId, GrantMsg> = {
      send: sendMsg,
      delegate: delegateMsg,
      vote: { grantType: "vote" },
      "claim-rewards": { grantType: "claim-rewards" },
    };

    const msg = createGrantMsg({
      grantee: granteeAddress,
      granter: address,
      expiration: expiryDate,
      ...grantMsg[selectedPermission.id],
    });

    authzTx({
      msgs: [msg],
      onSuccess: () => {
        refetch();
        onModalClose();
      },
      onComplete: () => {
        setIsGranting(false);
      },
    });
  };

  return (
    <BasicModal
      title="Create Grant"
      isOpen={isOpen}
      onClose={onModalClose}
      closeOnClickaway={false}
      attributes={{
        backgroundColor: "#f2e8cf",
        boxShadow: "0 12px 24px rgba(56, 102, 65, 0.15)",
        borderRadius: "$xl",
        border: "1px solid rgba(106, 153, 78, 0.2)",
        maxHeight: "95vh",
        width: {
          mobile: "95vw",
          tablet: "680px",
          desktop: "720px",
        },
        margin: "auto",
        ".modal-header": {
          backgroundColor: "#6a994e15",
          borderBottom: "1px solid rgba(106, 153, 78, 0.1)",
          color: "#386641",
          fontWeight: "$semibold",
          padding: { mobile: "$6", tablet: "$8" },
          fontSize: { mobile: "$xl", tablet: "$2xl" },
        },
        ".modal-content": {
          padding: { mobile: "$6", tablet: "$8" },
          maxHeight: "calc(95vh - 70px)",
          overflow: "auto",
        },
      }}
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        gap={{ mobile: "$8", tablet: "$10" }}
        backgroundColor="#f2e8cf"
      >
        <AddressInput
          label="Grantee Address"
          placeholder="Enter grantee address"
          chainName={chainName}
          address={granteeAddress}
          onAddressChange={setGranteeAddress}
          onInvalidAddress={setAddressErrorMsg}
          attributes={{
            borderColor: "#6a994e",
            backgroundColor: "#ffffff",
            fontSize: { mobile: "$md", tablet: "$lg" },
            _focus: {
              borderColor: "#386641",
              boxShadow: "0 0 0 2px rgba(56, 102, 65, 0.2)",
            },
          }}
        />

        <Box>
          <FieldLabel
            htmlFor=""
            label="Permission"
            attributes={{
              mb: "$3",
              color: "#386641",
              fontWeight: "$semibold",
              fontSize: { mobile: "$md", tablet: "$lg" },
            }}
          />

          <Box display="flex" flexDirection="column" gap="$6">
            <Popover
              triggerType="click"
              isOpen={isDropdownOpen}
              setIsOpen={setIsDropdownOpen}
            >
              <PopoverTrigger>
                <SelectButton
                  className={styles.containerSm}
                  placeholder={selectedPermission?.name || "Select permission"}
                  onClick={() => {}}
                  attributes={{
                    backgroundColor: "#ffffff",
                    borderColor: "#6a994e",
                    color: "#386641",
                    _hover: {
                      borderColor: "#386641",
                    },
                  }}
                />
              </PopoverTrigger>
              <PopoverContent
                attributes={{
                  backgroundColor: "#f2e8cf",
                  borderColor: "#6a994e",
                  boxShadow: "0 8px 16px rgba(56, 102, 65, 0.1)",
                  maxHeight: "200px",
                  overflow: "auto",
                }}
              >
                <Stack direction="vertical" space="$2">
                  {permissions.map((p) => (
                    <ListItem
                      key={p.id}
                      isActive={p.id === selectedPermission?.id}
                      className={styles.listItem}
                      attributes={{
                        onClick: () => {
                          setSelectedPermission(p);
                          setIsDropdownOpen(false);
                        },
                        backgroundColor:
                          p.id === selectedPermission?.id
                            ? "#6a994e"
                            : "transparent",
                        color:
                          p.id === selectedPermission?.id
                            ? "#f2e8cf"
                            : "#386641",
                        _hover: {
                          backgroundColor: "#a7c957",
                          color: "#386641",
                        },
                        padding: "$3",
                        marginBottom: "$2",
                      }}
                    >
                      {p.name}
                    </ListItem>
                  ))}
                </Stack>
              </PopoverContent>
            </Popover>

            {selectedPermission?.id === "send" && (
              <CustomizationField
                permissionType={selectedPermission.id}
                value={sendLimit}
                onChange={(val) => {
                  if (!val) {
                    setSendLimit(undefined);
                    return;
                  }
                  setSendLimit(Number(val));
                }}
              />
            )}

            {selectedPermission?.id === "delegate" && (
              <CustomizationField
                permissionType={selectedPermission.id}
                chainName={chainName}
                accessList={accessList}
                setAccessList={setAccessList}
                value={delegateLimit}
                onChange={(val) => {
                  if (!val) {
                    setDelegateLimit(undefined);
                    return;
                  }
                  setDelegateLimit(Number(val));
                }}
              />
            )}
          </Box>
        </Box>

        <Box position="relative">
          <TextField
            id="expiry-date"
            value={expiryDate ? dayjs(expiryDate).format("MM/DD/YYYY") : ""}
            label="Expiry Date"
            placeholder="Select expiry date"
            autoComplete="off"
            readOnly
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            attributes={{
              backgroundColor: "#ffffff",
              borderColor: "#6a994e",
              cursor: "pointer",
              fontSize: { mobile: "$md", tablet: "$lg" },
              _focus: {
                borderColor: "#386641",
                boxShadow: "0 0 0 2px rgba(56, 102, 65, 0.2)",
              },
            }}
          />
          <Box
            position="absolute"
            bottom="7px"
            right="10px"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <IoMdCalendar
              size="26px"
              color="#6a994e"
              style={{ cursor: "pointer" }}
            />
          </Box>
          {isCalendarOpen && (
            <Box
              position="absolute"
              top="calc(100% + 4px)"
              right="0"
              zIndex="10"
              backgroundColor="#ffffff"
              borderRadius="$lg"
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
              border="1px solid #6a994e"
              maxWidth="calc(100% - 2px)"
              overflow="hidden"
            >
              <Calendar
                onChange={(value) => {
                  setExpiryDate(value as Date);
                  setIsCalendarOpen(false);
                }}
                value={expiryDate}
                minDate={new Date()}
                className={styles.calendar}
              />
            </Box>
          )}
        </Box>

        <Box width="100%" mt={{ mobile: "$4", tablet: "$6" }}>
          <Button
            fluidWidth
            intent="tertiary"
            isLoading={isGranting}
            disabled={
              isGranting ||
              !!addressErrorMsg ||
              !granteeAddress ||
              !expiryDate ||
              !selectedPermission
            }
            onClick={onGrantClick}
            attributes={{
              backgroundColor: "#386641",
              color: "#f2e8cf",
              padding: { mobile: "$4", tablet: "$5" },
              fontSize: { mobile: "$md", tablet: "$lg" },
              height: { mobile: "44px", tablet: "48px" },
              _hover: {
                backgroundColor: "#2d5234",
              },
              _focus: {
                boxShadow: "0 0 0 3px rgba(56, 102, 65, 0.4)",
              },
              _disabled: {
                backgroundColor: "#38664180",
                cursor: "not-allowed",
              },
            }}
          >
            Grant
          </Button>
        </Box>
      </Box>
    </BasicModal>
  );
};
