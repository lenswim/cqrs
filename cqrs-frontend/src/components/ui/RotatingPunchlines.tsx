import { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import {useConversationList} from "../../hooks";
import type {Punchline} from "../../types/types.ts";


const ROTATION_INTERVAL = 4000; // 4 seconds
const FADE_DURATION = 500; // 0.5 seconds

export function RotatingPunchlines() {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;
  const allPunchlines : Punchline[] = useConversationList().allPunchlines;


  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
              setCurrentIndex((prev) => (prev + 1) % allPunchlines.length);
              setFade(true);
      }, FADE_DURATION);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [allPunchlines.length]);

    if (!allPunchlines || allPunchlines.length === 0) {
        return null;
    }

  const currentPunchline = allPunchlines[currentIndex];

  return (
    <Box
      textAlign="center"
      py={12}
      mb={12}
      minH="120px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        opacity={fade ? 1 : 0}
        transition={`opacity ${FADE_DURATION}ms ease-in-out`}
        maxW="800px"
      >
    <Text
          fontSize="28px"
          fontWeight="600"
          color={theme.text.primary}
          fontStyle="italic"
          lineHeight="1.4"
          mb={3}
        >
          "{currentPunchline.text}"
        </Text>
        <Text
          fontSize="14px"
          color={theme.text.accent}
          fontWeight="600"
        >
          — {currentPunchline.author}
        </Text>
    
      </Box>
    </Box>
  );
}

