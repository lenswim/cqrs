import { Box, Text, Flex, VStack, Input } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme, transitions, stylePresets, responsiveSpacing } from '../styles/theme';
import { ConversationCard } from '../components/conversation';
import { useConversationList } from '../hooks';

interface FilterSectionProps<T extends string | number> {
  title: string;
  icon: string;
  items: T[];
  selectedItems: T[];
  onToggle: (item: T, checked: boolean) => void;
  searchable?: boolean;
  defaultOpen?: boolean;
}

function FilterSection<T extends string | number>({
  title,
  icon,
  items,
  selectedItems,
  onToggle,
  searchable = false,
  defaultOpen = true,
}: FilterSectionProps<T>) {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const filteredItems = searchable
    ? items.filter(item =>
        item.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items;

  const displayedItems = filteredItems.slice(0, isOpen ? filteredItems.length : 0);

  return (
    <Box mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
      <Flex
        align="center"
        justify="space-between"
        mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Flex align="center" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
          <Text fontSize="16px">{icon}</Text>
          <Text fontSize="13px" fontWeight="700" color={theme.text.primary} textTransform="uppercase" letterSpacing="0.1em">
            {title}
          </Text>
          {selectedItems.length > 0 && (
            <Box
              bg={theme.text.accent}
              color={theme.text.inverse}
              borderRadius="full"
              px={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
              py={{ base: 0.5, md: 1 }}
              fontSize="11px"
              fontWeight="600"
            >
              {selectedItems.length}
            </Box>
          )}
        </Flex>
        <Text fontSize="12px" color={theme.text.secondary}>
          {isOpen ? '▼' : '▶'}
        </Text>
      </Flex>

      {isOpen && (
        <Box>
          {searchable && (
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
              mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
              bg={theme.background.secondary}
              border="1px solid"
              borderColor={theme.border.dark}
              color={theme.text.primary}
              _placeholder={{ color: theme.text.secondary }}
              _focus={{
                borderColor: theme.text.accent,
                boxShadow: `0 0 0 1px ${theme.text.accent}`,
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <VStack align="stretch" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }} maxH="300px" overflowY="auto">
            {displayedItems.map((item) => {
              const isSelected = selectedItems.includes(item);
              return (
                <Flex
                  align="center"
                  gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
                  px={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
                  py={{ base: responsiveSpacing.mobile, md: 1 }}
                  borderRadius="4px"
                  cursor="pointer"
                  transition={transitions.fast}
                  bg={isSelected ? theme.background.tertiary : 'transparent'}
                  _hover={{ bg: theme.background.tertiary }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(item, !isSelected);
                  }}
                >
                  <Box
                    w="16px"
                    h="16px"
                    borderRadius="3px"
                    border="2px solid"
                    borderColor={isSelected ? theme.text.accent : theme.border.dark}
                    bg={isSelected ? theme.text.accent : 'transparent'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition={transitions.fast}
                  >
                    {isSelected && <Text fontSize="10px" color={theme.text.inverse}>✓</Text>}
                  </Box>
                  <Text fontSize="14px" color={theme.text.primary} fontWeight={isSelected ? '600' : '400'}>
                    {item}
                  </Text>
                </Flex>
              );
            })}
            {filteredItems.length === 0 && (
              <Text fontSize="13px" color={theme.text.secondary} py={2} textAlign="center">
                No matches found
              </Text>
            )}
          </VStack>
        </Box>
      )}
    </Box>
  );
}

export default function ListQuotes() {
    const { mode } = useTheme();
    const theme = mode === 'light' ? lightTheme : darkTheme;
    const {
        conversations,
        allParticipants,
        allYears,
        selectedParticipants,
        selectedYears,
        toggleParticipantFilter,
        toggleYearFilter,
        clearFilters,
    } = useConversationList();

    const hasActiveFilters = selectedParticipants.length > 0 || selectedYears.length > 0;

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Calculate pagination
    const totalPages = Math.ceil(conversations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedConversations = conversations.slice(startIndex, endIndex);

    // Reset page when filters change
    useEffect(() => {
        queueMicrotask(() => {
            setCurrentPage(1);
        });
    }, [selectedParticipants, selectedYears]);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Box maxW="1600px" mx="auto">
            {/* Header */}
            <Flex justify="space-between" align="center" mb={8}>
                <Box>
                    <Text {...stylePresets.pageTitle} color={theme.text.primary}>
                        Browse Quotes
                    </Text>
                    <Text fontSize="14px" color={theme.text.secondary}>
                        {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'} found
                    </Text>
                </Box>
                {hasActiveFilters && (
                    <Box
                        cursor="pointer"
                        onClick={clearFilters}
                        px={4}
                        py={2}
                        borderRadius="20px"
                        fontSize="13px"
                        fontWeight="600"
                        color={theme.text.accent}
                        border="1px solid"
                        borderColor={theme.text.accent}
                        transition={transitions.fast}
                        _hover={{
                            bg: theme.text.accent,
                            color: theme.text.inverse,
                        }}
                    >
                        Clear Filters
                    </Box>
                )}
            </Flex>

            <Flex gap={6} align="start">
                {/* Filters Sidebar */}
                <Box
                    w={{ base: '35%', md: '220px' }}
                    flexShrink={0}
                    position={{ base: 'relative', md: 'sticky' }}
                    top={{ md: '80px' }}
                    maxH={{ md: 'calc(100vh - 100px)' }}
                    overflowY={{ md: 'auto' }}
                    mb={{ base: responsiveSpacing.mobile, md: 0 }}
                >
                    <FilterSection
                        title="Participants"
                        icon="👥"
                        items={allParticipants}
                        selectedItems={selectedParticipants}
                        onToggle={toggleParticipantFilter}
                        searchable={true}
                    />
                    <FilterSection
                        title="Years"
                        icon="📅"
                        items={allYears}
                        selectedItems={selectedYears}
                        onToggle={toggleYearFilter}
                    />
                </Box>

                {/* Quotes Grid */}
                <Box flex="1">
                    {conversations.length === 0 ? (
                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            py={{ base: responsiveSpacing.desktop, md: 20 }}
                            gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
                        >
                            <Text fontSize="48px">🔍</Text>
                            <Text fontSize="18px" fontWeight="600" color={theme.text.primary}>
                                No conversations found
                            </Text>
                            <Text fontSize="14px" color={theme.text.secondary}>
                                Try adjusting your filters
                            </Text>
                        </Flex>
                    ) : (
                        <>
                            <VStack align="stretch" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }} mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.desktop }}>
                                {paginatedConversations.map((conversation) => (
                                    <ConversationCard
                                        key={conversation.id}
                                        conversation={conversation}
                                    />
                                ))}
                            </VStack>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <Flex justify="center" align="center" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }} mt={{ base: responsiveSpacing.mobile, md: responsiveSpacing.desktop }} mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
                                    <Box
                                        as="button"
                                        aria-label="First page"
                                        px={2}
                                        py={1}
                                        minW="32px"
                                        fontSize="14px"
                                        onClick={() => currentPage !== 1 && goToPage(1)}
                                        bg={theme.background.secondary}
                                        color={theme.text.primary}
                                        border="1px solid"
                                        borderColor={theme.border.dark}
                                        borderRadius="4px"
                                        cursor={currentPage === 1 ? 'not-allowed' : 'pointer'}
                                        opacity={currentPage === 1 ? 0.4 : 1}
                                        pointerEvents={currentPage === 1 ? 'none' : 'auto'}
                                        transition={transitions.fast}
                                        _hover={{ bg: theme.background.tertiary }}
                                    >
                                        ⟪
                                    </Box>
                                    <Box
                                        as="button"
                                        aria-label="Previous page"
                                        px={2}
                                        py={1}
                                        minW="32px"
                                        fontSize="14px"
                                        onClick={() => currentPage !== 1 && goToPage(currentPage - 1)}
                                        bg={theme.background.secondary}
                                        color={theme.text.primary}
                                        border="1px solid"
                                        borderColor={theme.border.dark}
                                        borderRadius="4px"
                                        cursor={currentPage === 1 ? 'not-allowed' : 'pointer'}
                                        opacity={currentPage === 1 ? 0.4 : 1}
                                        pointerEvents={currentPage === 1 ? 'none' : 'auto'}
                                        transition={transitions.fast}
                                        _hover={{ bg: theme.background.tertiary }}
                                    >
                                        ‹
                                    </Box>

                                    {/* Page Numbers */}
                                    {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                                        let pageNum: number;
                                        if (totalPages <= 7) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 4) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 3) {
                                            pageNum = totalPages - 6 + i;
                                        } else {
                                            pageNum = currentPage - 3 + i;
                                        }

                                        return (
                                            <Box
                                                key={pageNum}
                                                as="button"
                                                px={3}
                                                py={1}
                                                minW="32px"
                                                fontSize="13px"
                                                fontWeight={currentPage === pageNum ? '700' : '500'}
                                                bg={currentPage === pageNum ? theme.text.accent : theme.background.secondary}
                                                color={currentPage === pageNum ? theme.text.inverse : theme.text.primary}
                                                border="1px solid"
                                                borderColor={currentPage === pageNum ? theme.text.accent : theme.border.dark}
                                                borderRadius="4px"
                                                cursor="pointer"
                                                transition={transitions.fast}
                                                _hover={{
                                                    bg: currentPage === pageNum ? theme.text.accent : theme.background.tertiary,
                                                }}
                                                onClick={() => goToPage(pageNum)}
                                            >
                                                {pageNum}
                                            </Box>
                                        );
                                    })}

                                    <Box
                                        as="button"
                                        aria-label="Next page"
                                        px={2}
                                        py={1}
                                        minW="32px"
                                        fontSize="14px"
                                        onClick={() => currentPage !== totalPages && goToPage(currentPage + 1)}
                                        bg={theme.background.secondary}
                                        color={theme.text.primary}
                                        border="1px solid"
                                        borderColor={theme.border.dark}
                                        borderRadius="4px"
                                        cursor={currentPage === totalPages ? 'not-allowed' : 'pointer'}
                                        opacity={currentPage === totalPages ? 0.4 : 1}
                                        pointerEvents={currentPage === totalPages ? 'none' : 'auto'}
                                        transition={transitions.fast}
                                        _hover={{ bg: theme.background.tertiary }}
                                    >
                                        ›
                                    </Box>
                                    <Box
                                        as="button"
                                        aria-label="Last page"
                                        px={2}
                                        py={1}
                                        minW="32px"
                                        fontSize="14px"
                                        onClick={() => currentPage !== totalPages && goToPage(totalPages)}
                                        bg={theme.background.secondary}
                                        color={theme.text.primary}
                                        border="1px solid"
                                        borderColor={theme.border.dark}
                                        borderRadius="4px"
                                        cursor={currentPage === totalPages ? 'not-allowed' : 'pointer'}
                                        opacity={currentPage === totalPages ? 0.4 : 1}
                                        pointerEvents={currentPage === totalPages ? 'none' : 'auto'}
                                        transition={transitions.fast}
                                        _hover={{ bg: theme.background.tertiary }}
                                    >
                                        ⟫
                                    </Box>
                                </Flex>
                            )}

                            {/* Pagination Info */}
                            <Text fontSize="13px" color={theme.text.secondary} textAlign="center" mt={4}>
                                Showing {startIndex + 1}-{Math.min(endIndex, conversations.length)} of {conversations.length} conversations
                            </Text>
                        </>
                    )}
                </Box>
            </Flex>
        </Box>
    );
}

