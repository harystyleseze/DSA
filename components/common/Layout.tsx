import Head from "next/head";
import { ThemeProvider, useTheme } from "@interchain-ui/react";
import "@interchain-ui/react/styles";
import { Container, Box, Text } from "@interchain-ui/react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NavBar } from "./NavBar";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { theme, themeClass, setTheme } = useTheme();
  return (
    <ThemeProvider className={themeClass}>
      <Container maxWidth="64rem" attributes={{ py: "$14" }}>
        <Head>
          <title>Delegated Staking Agent</title>
          <meta name="description" content="Built by Harystyles on Cosmos" />
          <link rel="icon" href="/image/favicon.ico" />
        </Head>
        <Box
          minHeight="100vh"
          display="flex"
          flexDirection="column"
          backgroundColor="#ffffff"
        >
          <NavBar />
          <Box
            as="main"
            flex="1"
            attributes={{
              color: {
                default: "#386641",
                _dark: "#f2e8cf",
              },
            }}
          >
            {/* @ts-ignore */}
            <Header />
            {children}
          </Box>
          <Footer />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
