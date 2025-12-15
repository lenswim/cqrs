import { Box, Text, Flex, VStack, SimpleGrid } from '@chakra-ui/react';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme, stylePresets, responsivePadding, responsiveSpacing } from '../styles/theme';
import { useConversationList } from '../hooks';
import { useStatistics } from '../hooks/useStatistics';
import { Chart, useChart } from '@chakra-ui/charts';
import {Bar, BarChart, XAxis, YAxis} from 'recharts';

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
      p={responsivePadding}
      border="1px solid"
      borderColor={theme.border.light}
      boxShadow={theme.shadow.sm}
    >
      <Flex align="center" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
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


function ChartCard({
  title,
  data,
  color,
  icon,
}: {
  title: string;
  data: Array<{ participant: string; count: number }>;
  color: string;
  icon: string;
}) {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <Box
      bg={theme.background.card}
      borderRadius="12px"
      p={responsivePadding}
      border="1px solid"
      borderColor={theme.border.light}
      boxShadow={theme.shadow.sm}
    >
      <Flex align="center" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }} mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.desktop }}>
        <Text fontSize="24px">{icon}</Text>
        <Text fontSize="18px" fontWeight="700" color={theme.text.primary}>
          {title}
        </Text>
      </Flex>

      <VStack align="stretch" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
          <BarChart
            width={400}
            height={250}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="participant" stroke={theme.text.secondary} />
            <YAxis stroke={theme.text.secondary} />
            <Bar dataKey="count" fill={color} />
          </BarChart>
      </VStack>

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
      p={responsivePadding}
      border="1px solid"
      borderColor={theme.border.light}
      boxShadow={theme.shadow.sm}
    >
      <Flex align="center" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }} mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.desktop }}>
        <Text fontSize="24px">{icon}</Text>
        <Text fontSize="18px" fontWeight="700" color={theme.text.primary}>
          {title}
        </Text>
      </Flex>

      <VStack align="stretch" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
        {items.slice(0, 5).map((item, index) => (
          <Flex
            key={item.name}
            align="center"
            justify="space-between"
            p={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
            bg={index === 0 ? color + '20' : theme.background.tertiary}
            borderRadius="8px"
            border="1px solid"
            borderColor={index === 0 ? color : theme.border.light}
          >
            <Flex align="center" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
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
    <Box {...stylePresets.pageContainer}>
      <Text {...stylePresets.pageTitle} color={theme.text.primary}>
        Statistics
      </Text>
      <Text {...stylePresets.pageSubtitle} color={theme.text.secondary}>
        Insights and metrics from your conversation library
      </Text>

      {/* Overview Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} 
        gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }} 
        mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.desktop }}>
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
      <SimpleGrid columns={{ base: 1, lg: 2 }} 
        gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }} 
        mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.desktop }}>
        
        <ChartCard
          title="Top Punchline Deliverers"
          data={stats.participantStats.map(p => ({
            participant: p.name,
            count: p.punchlineCount
          })).slice(0, 5)}
          icon="⚡"
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
    </Box>
  );
}

