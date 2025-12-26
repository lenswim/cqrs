import { Box, VStack, Flex, Text } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme, spacing, transitions, responsivePadding, responsiveSpacing } from '../../styles/theme';

interface NavItemProps {
  icon: string;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <Flex
      align="center"
      gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
      px={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
      py={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
      borderRadius="6px"
      cursor="pointer"
      transition={transitions.fast}
      bg={isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
      color={isActive ? theme.text.onSidebar : theme.text.secondary}
      fontWeight={isActive ? '600' : '500'}
      _hover={{
        bg: 'rgba(255, 255, 255, 0.1)',
        color: theme.text.onSidebar,
      }}
      onClick={onClick}
    >
      <Text fontSize="20px">{icon}</Text>
      <Text fontSize="14px" letterSpacing="0.02em">{label}</Text>
    </Flex>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔍', label: 'Browse Quotes', path: '/listQuotes' },
    { icon: '✨', label: 'Add Quote', path: '/newQuote' },
    { icon: '📊', label: 'Statistics', path: '/statistics' },
    { icon: '📑', label: 'Docs', path: 'https://lenswim.github.io/cqrs/' },
  ];

  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      w={spacing.sidebarWidth}
      bg={theme.background.sidebar}
      borderRight="1px solid"
      borderColor={theme.border.light}
      p={responsivePadding}
      zIndex={100}
    >
      <VStack align="stretch" gap={1}>
        {/* Logo */}
        <Box mb={6}>
          <Text
            fontSize="24px"
            fontWeight="700"
            color={theme.text.onSidebar}
            letterSpacing="-0.02em"
          >
            CQRS
          </Text>
          <Text fontSize="11px" color={theme.text.secondary} mt={1}>
            Cool Quote Registration System
          </Text>
        </Box>

        {/* Navigation */}
        <VStack align="stretch" gap={1}>
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </VStack>

        {/* Divider */}
        <Box h="1px" bg={theme.border.light} my={4} />

        {/* Info */}
        <Box mt="auto" pt={6}>
          <Text fontSize="11px" color={theme.text.muted} lineHeight="1.6">
            Making memories last, one quote at a time
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

