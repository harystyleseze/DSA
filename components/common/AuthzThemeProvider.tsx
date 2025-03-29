import { ReactNode } from "react";
import { ThemeProvider } from "@interchain-ui/react";

const theme = {
  name: "authz-theme",
  vars: {
    colors: {
      primary500: "#386641",
    },
  },
};

interface AuthzThemeProviderProps {
  children: ReactNode;
}

export function AuthzThemeProvider({ children }: AuthzThemeProviderProps) {
  return (
    <ThemeProvider themeDefs={[theme]} customTheme="authz-theme">
      {children}
    </ThemeProvider>
  );
}
