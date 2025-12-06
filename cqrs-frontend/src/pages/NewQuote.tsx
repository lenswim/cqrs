import { Box, Text } from "@chakra-ui/react";
import { useTheme } from '../contexts/ThemeContext';
import { useToaster } from '../contexts/ToasterContext';
import { lightTheme, darkTheme, transitions, stylePresets, responsivePadding, responsiveSpacing } from '../styles/theme';
import { ConversationDateField, LineEditor } from '../components/conversation';
import { useConversationForm } from '../hooks';
import { useNavigate } from "react-router-dom";

export default function NewQuote() {
    const { mode } = useTheme();
    const theme = mode === 'light' ? lightTheme : darkTheme;
    const toaster = useToaster();
    const navigate = useNavigate();

    const handleSuccess = () => {
        toaster.create({
            title: "Quote added!",
            description: "Your conversation was saved.",
            type: "success",
            duration: 3000,
            onStatusChange: (details) => {
                if (details.status === "unmounted") {
                    navigate("/listQuotes");
                }
            },
        });
    };
    
    const {
        conversationDate,
        setConversationDate,
        lines,
        handleLineChange,
        addLine,
        handleSubmit,
    } = useConversationForm(handleSuccess);

    return (
        <Box {...stylePresets.pageContainer}>
            <Text {...stylePresets.pageTitle} color={theme.text.primary}>
                Add New Quote
            </Text>
            <Text {...stylePresets.pageSubtitle} color={theme.text.secondary}>
                Capture a memorable conversation with all the context and participants
            </Text>

            {/* Form Container */}
            <Box
                bg={theme.background.card}
                borderRadius="12px"
                p={responsivePadding}
                border="1px solid"
                borderColor={theme.border.light}
                boxShadow={theme.shadow.md}
            >
                {/* Conversation Date */}
                <Box mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.desktop }}>
                    <Text fontSize="14px" fontWeight="600" color={theme.text.primary} mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
                        📅 Conversation Date
                    </Text>
                    <ConversationDateField
                        value={conversationDate}
                        onChange={setConversationDate}
                    />
                </Box>

                {/* Lines */}
                <Box mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
                    <Text fontSize="14px" fontWeight="600" color={theme.text.primary} mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
                        💬 Conversation Lines
                    </Text>
                    <LineEditor lines={lines} onLineChange={handleLineChange} />
                </Box>

                {/* Action Buttons */}
                <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }} mt={{ base: responsiveSpacing.mobile, md: responsiveSpacing.desktop }}>
                    <Box
                        as="button"
                        onClick={addLine}
                        flex={{ base: '1', md: '1' }}
                        px={{ base: responsiveSpacing.mobile, md: responsiveSpacing.desktop }}
                        py={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
                        borderRadius="8px"
                        fontSize="14px"
                        fontWeight="600"
                        color={theme.text.primary}
                        bg={theme.background.tertiary}
                        border="1px solid"
                        borderColor={theme.border.medium}
                        cursor="pointer"
                        transition={transitions.fast}
                        _hover={{
                            bg: theme.background.cardHover,
                            borderColor: theme.border.dark,
                        }}
                    >
                        ➕ Add Line
                    </Box>

                    <Box
                        as="button"
                        onClick={handleSubmit}
                        flex={{ base: '1', md: '2' }}
                        px={{ base: responsiveSpacing.mobile, md: responsiveSpacing.desktop }}
                        py={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
                        borderRadius="8px"
                        fontSize="14px"
                        fontWeight="600"
                        color={theme.text.inverse}
                        bg={theme.accent.primary}
                        cursor="pointer"
                        transition={transitions.fast}
                        _hover={{
                            bg: theme.accent.primaryHover,
                        }}
                    >
                        💾 Save Conversation
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}