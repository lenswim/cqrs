import { Flex, Text } from '@chakra-ui/react';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme, spacing, transitions } from '../../styles/theme';

export function Header() {
  const { mode, toggleTheme } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <Flex
      position="fixed"
      top={0}
      left={spacing.sidebarWidth}
      right={0}
      h={spacing.headerHeight}
      bg={theme.background.primary}
      borderBottom="1px solid"
      borderColor={theme.border.light}
      align="center"
      justify="flex-end"
      px={8}
      zIndex={99}
    >
      {/* Theme Toggle */}
      <Flex
        align="center"
        gap={2}
        cursor="pointer"
        onClick={toggleTheme}
        px={4}
        py={2}
        borderRadius="20px"
        bg={theme.background.tertiary}
        border="1px solid"
        borderColor={theme.border.medium}
        transition={transitions.fast}
        _hover={{
          bg: theme.background.cardHover,
          borderColor: theme.border.dark,
        }}
      >
        <Text fontSize="18px">{mode === 'light' ? '🌙' : '☀️'}</Text>
        <Text fontSize="13px" fontWeight="600" color={theme.text.primary}>
          {mode === 'light' ? 'Dark' : 'Light'} Mode
        </Text>
      </Flex>
    </Flex>
  );
}

