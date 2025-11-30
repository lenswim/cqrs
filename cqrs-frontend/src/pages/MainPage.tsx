import { Box, Text } from "@chakra-ui/react";
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme, stylePresets } from '../styles/theme';
import { RotatingPunchlines } from '../components/ui';

export default function MainPage() {
    const { mode } = useTheme();
    const theme = mode === 'light' ? lightTheme : darkTheme;

    return (
        <Box {...stylePresets.pageContainer}>
            {/* Hero Section */}
            <Box textAlign="center" py={12} mb={8}>
                <Text
                    fontSize="56px"
                    fontWeight="800"
                    color={theme.text.primary}
                    letterSpacing="-0.02em"
                    mb={4}
                >
                    Cool Quote Registration System
                </Text>
                <Text fontSize="17px" color={theme.text.secondary} maxW="600px" mx="auto" lineHeight="1.6">
                    Capture and relive the best conversations.
                    Never let a great quote slip away.
                </Text>
            </Box>

            {/* Rotating Punchlines Section */}
            <RotatingPunchlines />

            {/* Stats Preview */}
            <Box
                bg={theme.background.card}
                borderRadius="12px"
                p={8}
                border="1px solid"
                borderColor={theme.border.light}
                boxShadow={theme.shadow.sm}
                textAlign="center"
            >
                <Text fontSize="14px" color={theme.text.secondary} mb={4}>
                    Making memories last, one quote at a time
                </Text>
            </Box>
        </Box>
    );
}