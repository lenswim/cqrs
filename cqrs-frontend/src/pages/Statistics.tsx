import { Box, Text, Flex, VStack, SimpleGrid } from '@chakra-ui/react';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme, stylePresets } from '../styles/theme';
import { useConversationList } from '../hooks';
import { useStatistics } from '../hooks/useStatistics';

function StatCard({
  title,
  value,
  icon,
  color
}: {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <Box
      bg={theme.background.card}
      borderRadius="12px"
      p={6}
      border="1px solid"
      borderColor={theme.border.light}
      boxShadow={theme.shadow.sm}
    >
      <Flex align="center" gap={4}>
        <Box
          fontSize="40px"
          bg={color}
          w="60px"
          h="60px"
          borderRadius="12px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
        <Box>
          <Text fontSize="13px" color={theme.text.secondary} fontWeight="600" mb={1}>
            {title}
          </Text>
          <Text fontSize="32px" fontWeight="700" color={theme.text.primary} lineHeight="1">
            {value}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

function LeaderboardCard({
  title,
  items,
  icon,
  metric,
  color,
}: {
  title: string;
  items: Array<{ name: string; count: number }>;
  icon: string;
  metric: string;
  color: string;
}) {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <Box
      bg={theme.background.card}
      borderRadius="12px"
      p={6}
      border="1px solid"
      borderColor={theme.border.light}
      boxShadow={theme.shadow.sm}
    >
      <Flex align="center" gap={3} mb={5}>
        <Text fontSize="24px">{icon}</Text>
        <Text fontSize="18px" fontWeight="700" color={theme.text.primary}>
          {title}
        </Text>
      </Flex>

      <VStack align="stretch" gap={3}>
        {items.slice(0, 5).map((item, index) => (
          <Flex
            key={item.name}
            align="center"
            justify="space-between"
            p={3}
            bg={index === 0 ? color + '20' : theme.background.tertiary}
            borderRadius="8px"
            border="1px solid"
            borderColor={index === 0 ? color : theme.border.light}
          >
            <Flex align="center" gap={3}>
              <Flex
                w="28px"
                h="28px"
                borderRadius="50%"
                bg={index === 0 ? color : theme.background.secondary}
                color={index === 0 ? theme.text.inverse : theme.text.primary}
                align="center"
                justify="center"
                fontSize="14px"
                fontWeight="700"
              >
                {index + 1}
              </Flex>
              <Text fontSize="15px" fontWeight="600" color={theme.text.primary}>
                {item.name}
              </Text>
            </Flex>
            <Text fontSize="14px" fontWeight="700" color={index === 0 ? color : theme.text.secondary}>
              {item.count} {metric}
            </Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}

export default function Statistics() {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;
  const { conversations } = useConversationList();
  const stats = useStatistics(conversations);

  return (
    <Box maxW="1400px" mx="auto">
      <Text {...stylePresets.pageTitle} color={theme.text.primary}>
        Statistics
      </Text>
      <Text {...stylePresets.pageSubtitle} color={theme.text.secondary}>
        Insights and metrics from your conversation library
      </Text>

      {/* Overview Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
        <StatCard
          title="Total Conversations"
          value={stats.totalConversations}
          icon="💬"
          color={theme.stats.conversations}
        />
        <StatCard
          title="Total Punchlines"
          value={stats.totalPunchlines}
          icon="⚡"
          color={theme.stats.punchlines}
        />
        <StatCard
          title="Active Participants"
          value={stats.participantStats.length}
          icon="👥"
          color={theme.stats.participant}
        />
        <StatCard
          title="Years Covered"
          value={stats.yearStats.length}
          icon="📅"
          color={theme.accent.warning}
        />
      </SimpleGrid>

      {/* Leaderboards */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} mb={8}>
        <LeaderboardCard
          title="Top Punchline Deliverers"
          items={stats.participantStats.map(p => ({
            name: p.name,
            count: p.punchlineCount
          }))}
          icon="⚡"
          metric="punchlines"
          color={theme.stats.punchlines}
        />
        <LeaderboardCard
          title="Most Victimized"
          items={stats.participantStats
            .filter(p => p.victimCount > 0)
            .sort((a, b) => b.victimCount - a.victimCount)
            .map(p => ({
              name: p.name,
              count: p.victimCount
            }))}
          icon="🎯"
          metric="times"
          color={theme.stats.victim}
        />
      </SimpleGrid>

      {/* All Participants */}
      <Box
        bg={theme.background.card}
        borderRadius="12px"
        p={6}
        border="1px solid"
        borderColor={theme.border.light}
        boxShadow={theme.shadow.sm}
      >
        <Flex align="center" gap={3} mb={5}>
          <Text fontSize="24px">👥</Text>
          <Text fontSize="18px" fontWeight="700" color={theme.text.primary}>
            All Participants
          </Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {stats.participantStats.map((participant) => (
            <Box
              key={participant.name}
              p={4}
              bg={theme.background.tertiary}
              borderRadius="8px"
              border="1px solid"
              borderColor={theme.border.light}
            >
              <Text fontSize="15px" fontWeight="700" color={theme.text.primary} mb={2}>
                {participant.name}
              </Text>
              <Flex gap={4} fontSize="12px">
                <Text color={theme.text.secondary}>
                  ⚡ {participant.punchlineCount}
                </Text>
                <Text color={theme.text.secondary}>
                  🎯 {participant.victimCount}
                </Text>
                <Text color={theme.text.secondary}>
                  💬 {participant.appearanceCount}
                </Text>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

