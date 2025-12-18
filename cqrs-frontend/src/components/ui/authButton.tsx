// AuthButton.tsx
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../util/supabase";
import { useAuth } from "../../hooks/auth";
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';

export function AuthButton() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const { mode } = useTheme();
    const theme = mode === 'light' ? lightTheme : darkTheme;

  if (loading) return null;

  async function handleClick() {
    if (!user) {
      navigate("/login");
    } else {
      await supabase.auth.signOut();
    }
  }

  return (
    <Button onClick={handleClick} variant="outline" color={theme.text.secondary} margin={8}>
      {user ? "Log out" : "Log in"}
    </Button>
  );
}
