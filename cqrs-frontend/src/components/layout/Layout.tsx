import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme, spacing } from '../../styles/theme';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <Box bg={theme.background.primary} minH="100vh">
      <Sidebar />
      <Header />
      <Box
        ml={spacing.sidebarWidth}
        mt={spacing.headerHeight}
        p={8}
        minH={`calc(100vh - ${spacing.headerHeight})`}
      >
        {children}
      </Box>
    </Box>
  );
}

