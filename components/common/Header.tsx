// TODO fix type issues
// @ts-nocheck

import {
  Box,
  Button,
  Icon,
  Text,
  useTheme,
  useColorModeValue,
} from '@interchain-ui/react';

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleColorMode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb="$8"
        px={{ mobile: '$4', tablet: '$8' }}
      >
        <Text
          as="h1"
          fontWeight="$bold"
          fontSize={{ mobile: '$xl', tablet: '$2xl' }}
          color={useColorModeValue('$primary500', '$primary200')}
        >
          DSA
        </Text>
        <Button
          intent="secondary"
          size="sm"
          attributes={{
            paddingX: '$2',
          }}
          onClick={toggleColorMode}
        >
          <Icon name={useColorModeValue('moonLine', 'sunLine')} />
        </Button>
      </Box>

      <Box 
        textAlign="center"
        px={{ mobile: '$4', tablet: '$8' }}
        py={{ mobile: '$8', tablet: '$12' }}
      >
        <Text
          as="h1"
          fontWeight="$extrabold"
          fontSize={{ mobile: '$4xl', tablet: '$6xl', desktop: '$8xl' }}
          attributes={{
            marginBottom: '$4',
            background: useColorModeValue('linear-gradient(90deg, $primary500, $primary700)', 'linear-gradient(90deg, $primary200, $primary400)'),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Delegated Staking Agent
        </Text>
        <Text
          as="h2"
          fontWeight="$medium"
          fontSize={{ mobile: '$lg', tablet: '$xl' }}
          color={useColorModeValue('$blackAlpha700', '$whiteAlpha700')}
        >
          Secure and efficient staking management for your digital assets
        </Text>
      </Box>
    </>
  );
}
