import { Box, Text } from "@interchain-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IoMdHome,
  IoMdCreate,
  IoMdCheckmarkCircleOutline,
  IoMdWallet,
} from "react-icons/io";

export function NavBar() {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: IoMdHome,
    },
    {
      name: "Create Grant",
      path: "/create-grant",
      icon: IoMdCreate,
    },
    {
      name: "Vote",
      path: "/vote",
      icon: IoMdCheckmarkCircleOutline,
    },
  ];

  return (
    <Box
      as="nav"
      width="100%"
      attributes={{
        backgroundColor: "#f2e8cf",
        borderBottom: "1px solid rgba(106, 153, 78, 0.2)",
        position: "sticky",
        top: "0",
        zIndex: "100",
        boxShadow: "0 2px 4px rgba(56, 102, 65, 0.1)",
      }}
    >
      <Box
        maxWidth="$containerLg"
        mx="auto"
        px={{ mobile: "$4", tablet: "$8" }}
        py={{ mobile: "$3", tablet: "$4" }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent={{ mobile: "space-between", tablet: "flex-start" }}
          gap={{ mobile: "$2", tablet: "$8" }}
          attributes={{
            overflowX: { mobile: "auto", tablet: "visible" },
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                style={{ textDecoration: "none" }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap="$2"
                  attributes={{
                    px: "$4",
                    py: "$2",
                    borderRadius: "$lg",
                    backgroundColor: isActive ? "#6a994e15" : "transparent",
                    color: isActive ? "#386641" : "#6a994e",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    _hover: {
                      backgroundColor: "#6a994e15",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Icon size={20} />
                  <Text
                    fontSize={{ mobile: "$sm", tablet: "$md" }}
                    fontWeight={isActive ? "$semibold" : "$medium"}
                  >
                    {item.name}
                  </Text>
                </Box>
              </Link>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
