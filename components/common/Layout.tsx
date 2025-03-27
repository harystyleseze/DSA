import Head from "next/head";
import { ThemeProvider, useTheme } from "@interchain-ui/react";
import "@interchain-ui/react/styles";
import { Container } from "@interchain-ui/react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, themeClass, setTheme } = useTheme();
  return (
    <ThemeProvider className={themeClass}>
      <Container maxWidth="64rem" attributes={{ py: "$14" }}>
        <Head>
          <title>Delegated Staking Agent</title>
          <meta name="description" content="Built by Harystyles on Cosmos" />
          <link rel="icon" href="/image/favicon.ico" />
        </Head>
        {/* @ts-ignore */}
        <Header />
        {children}
        {/* @ts-ignore */}
        <Footer />
      </Container>
    </ThemeProvider>
  );
}
