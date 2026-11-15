// import { Box, Text, Flex } from '@chakra-ui/react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme, transitions, responsivePadding, responsiveSpacing } from '../../styles/theme';
import type { Conversation } from '../../types/types';

interface ConversationCardProps {
  conversation: Conversation;
  liked?: boolean;
  onToggleLike?: (conversationId: string) => void;
  pendingLike?: boolean;
}

export function ConversationCard({ conversation, liked = false, onToggleLike, pendingLike = false }: ConversationCardProps) {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <Box
      bg={theme.background.card}
      borderRadius="8px"
      p={responsivePadding}
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
      <Flex justify="space-between" align="flex-start" gap={3}>
        <Box display="flex" flexDirection="column" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }} flex="1">
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
                {line.lineType === 'CONTEXT'
                  ? (
                    <Text fontSize="18px" color={theme.text.muted} fontStyle="italic" lineHeight="1.6">
                      {line.text}
                    </Text>
                  )
                  : (
                    <Text
                      fontSize="16px"
                      color={theme.text.primary}
                      lineHeight="1.6"
                    >
                      {line.participants && line.participants.length > 0 && (
                        <Text as="span" fontSize="16px" color={theme.text.accent} fontWeight="600" mr={2}>
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

        {onToggleLike && (
          <Button
            size="sm"
            variant="outline"
            onClick={(event) => {
              event.stopPropagation();
              onToggleLike(conversation.id);
            }}
            disabled={pendingLike}
            aria-label={liked ? 'Unlike quote' : 'Like quote'}
            borderRadius="999px"
            px={3}
            minW="fit-content"
            bg={liked ? theme.text.accent : theme.background.secondary}
            color={liked ? theme.text.inverse : theme.text.primary}
            borderColor={liked ? theme.text.accent : theme.border.medium}
            _hover={{
              bg: liked ? theme.text.accent : theme.background.tertiary,
              borderColor: liked ? theme.text.accent : theme.border.dark,
            }}
            _disabled={{
              opacity: 0.7,
              cursor: 'not-allowed',
            }}
          >
            <Text as="span" mr={1}>{liked ? '👍' : '👎'}</Text>
            <Text as="span" fontSize="13px" fontWeight="600">{conversation.likes}</Text>
          </Button>
        )}
      </Flex>
    </Box>
  );
}

