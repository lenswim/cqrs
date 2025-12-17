import { Flex, Text } from '@chakra-ui/react';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme, spacing, transitions, responsivePadding, responsiveSpacing } from '../../styles/theme';
import { MobileMenu } from './MobileMenu';
import { AuthButton } from '../ui/authButton';

export function Header() {
  const { mode, toggleTheme } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <Flex
      position="fixed"
      top={0}
      left={{ base: 0, md: spacing.sidebarWidth }}
      right={0}
      h={spacing.headerHeight}
      bg={theme.background.primary}
      borderBottom="1px solid"
      borderColor={theme.border.light}
      align="center"
      justify={{ base: 'space-between', md: 'flex-end' }}
      px={responsivePadding}
      zIndex={99}
    >
      <MobileMenu />

      <Text fontSize="16px" fontWeight="700" color={theme.text.primary} display={{ base: 'block', md: 'none' }}>
        CQRS
      </Text>

      {/* Theme Toggle */}
      
      <AuthButton />
      <Flex
        align="center"
        gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
        cursor="pointer"
        onClick={toggleTheme}
        px={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
        py={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
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
        <Text fontSize={{ base: '14px', md: '18px' }}>
          {mode === 'light' ? '🌙' : '☀️'}
        </Text>
        <Text fontSize={{ base: '11px', md: '13px' }} fontWeight="600" color={theme.text.primary} display={{ base: 'none', md: 'block' }}>
          {mode === 'light' ? 'Dark' : 'Light'} Mode
        </Text>
      </Flex>
    </Flex>
  );
}

