// import { Box, Text, Flex } from '@chakra-ui/react';
import { Box, Text } from '@chakra-ui/react';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme, transitions } from '../../styles/theme';
import type { Conversation } from '../../types/types';

interface ConversationCardProps {
  conversation: Conversation;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <Box
      bg={theme.background.card}
      borderRadius="8px"
      p={6}
      cursor="pointer"
      transition={transitions.normal}
      border="1px solid"
      borderColor="transparent"
      boxShadow={theme.shadow.sm}
      _hover={{
        bg: theme.background.cardHover,
        boxShadow: theme.shadow.md,
        transform: 'translateY(-2px)',
        borderColor: theme.border.medium,
      }}
    >
      <Box display="flex" flexDirection="column" gap={4}>
        {/* Date Badge */}
        <Text fontSize="12px" fontWeight="600" color={theme.text.accent}>
          {new Date(conversation.conversationDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>

        {/* Full Conversation Lines */}
        <Box>
          {conversation.lines.map((line, idx) => (
            <Box key={idx} mb={2}>
              {line.lineType === 'CONTEXT' ? (
                <Text fontSize="18px" color={theme.text.muted} fontStyle="italic" lineHeight="1.6">
                  {line.text}
                </Text>
              ) : (
                <Text
                  fontSize="16px"
                  color={theme.text.primary}
                  lineHeight="1.6"
                >
                  {line.participants && line.participants.length > 0 && (
                    <Text as="span" fontSize="11px" color={theme.text.accent} fontWeight="600" mr={2}>
                      {line.participants.map(p => p.name).join(', ')}:
                    </Text>
                  )}
                  {line.text}
                </Text>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

