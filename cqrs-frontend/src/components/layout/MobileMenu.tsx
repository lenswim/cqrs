import { Box, VStack, Drawer } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme, transitions, responsivePadding, responsiveSpacing } from '../../styles/theme';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔍', label: 'Browse Quotes', path: '/listQuotes' },
    { icon: '✨', label: 'Add Quote', path: '/newQuote' },
    { icon: '📊', label: 'Statistics', path: '/statistics' },
    { icon: '🕸️', label: 'Social Web', path: '/social' },
    { icon: '📑', label: 'Docs', path: 'https://lenswim.github.io/cqrs/' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <Box
        as="button"
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
        display={{ base: 'flex', md: 'none' }}
        alignItems="center"
        justifyContent="center"
        fontSize="24px"
        cursor="pointer"
        bg="transparent"
        border="none"
        padding="8px"
        borderRadius="6px"
        _hover={{ bg: theme.background.tertiary }}
        transition={transitions.fast}
        color={theme.text.primary}
      >
        ☰
      </Box>

      <Drawer.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)} placement="start">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg={theme.background.sidebar}>
            <Drawer.CloseTrigger />
            <Box p={responsivePadding}>
              <VStack align="stretch" gap={2} mt={{ base: responsiveSpacing.mobile, md: responsiveSpacing.desktop }}>
                {navItems.map((item) => (
                  <Box
                    key={item.path}
                    p={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
                    cursor="pointer"
                    borderRadius="6px"
                    bg={location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
                    onClick={() => handleNavigation(item.path)}
                    transition={transitions.fast}
                    _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                    display="flex"
                    flexDirection="column"
                    gap="4px"
                    color={theme.text.onSidebar}
                  >
                    <Box fontSize="20px">{item.icon}</Box>
                    <Box fontSize="14px" fontWeight="500">
                      {item.label}
                    </Box>
                  </Box>
                ))}
              </VStack>
            </Box>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
}