// LoginPage.tsx
import { useState } from "react";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { supabase } from "../util/supabase";
import { useTheme } from '../contexts/ThemeContext';
import { lightTheme, darkTheme, stylePresets} from '../styles/theme';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { mode } = useTheme();
const theme = mode === 'light' ? lightTheme : darkTheme;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setSent(true);
  }

  return (
    <Box maxW="sm" mx="auto" mt="20">
      {sent 
      ? (<Text color={theme.text.secondary}>Check your email for the login link.</Text>) 
      : (
        <form onSubmit={handleSubmit}>
          <Stack gap="4">
            <Text {...stylePresets.pageTitle} color={theme.text.primary}>
                                    Enter e-mail to log in
                                </Text>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color={theme.text.secondary}
            />
            <Button type="submit">Send login link</Button>
          </Stack>
        </form>
      )}
    </Box>
  );
}
