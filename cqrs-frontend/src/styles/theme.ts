// Professional theme system with light and dark modes
// Inspired by Spotify's design language

export const lightTheme = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F6F6F6',
    tertiary: '#FAFAFA',
    sidebar: '#000000',
    card: '#FFFFFF',
    cardHover: '#F6F6F6',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    primary: '#000000',
    secondary: '#6A6A6A',
    muted: '#A0A0A0',
    inverse: '#FFFFFF',
    onSidebar: '#FFFFFF',
    accent: '#1DB954', // Spotify green
  },
  border: {
    light: '#E5E5E5',
    medium: '#D4D4D4',
    dark: '#A0A0A0',
  },
  accent: {
    primary: '#1DB954',
    primaryHover: '#1ED760',
    secondary: '#2E77D0',
    danger: '#E91429',
    warning: '#FFA500',
    purple: '#8B5CF6',
    pink: '#EC4899',
  },
  stats: {
    punchlines: '#8B5CF6',
    victim: '#EC4899',
    participant: '#2E77D0',
    conversations: '#1DB954',
  },
  shadow: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px rgba(0, 0, 0, 0.10)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.15)',
  },
};

export const darkTheme = {
  background: {
    primary: '#121212',
    secondary: '#181818',
    tertiary: '#282828',
    sidebar: '#000000',
    card: '#181818',
    cardHover: '#282828',
    overlay: 'rgba(0, 0, 0, 0.75)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    muted: '#6A6A6A',
    inverse: '#000000',
    onSidebar: '#FFFFFF',
    accent: '#1DB954',
  },
  border: {
    light: '#282828',
    medium: '#404040',
    dark: '#535353',
  },
  accent: {
    primary: '#1DB954',
    primaryHover: '#1ED760',
    secondary: '#4A9EFF',
    danger: '#F15E6C',
    warning: '#FFA500',
    purple: '#A78BFA',
    pink: '#F472B6',
  },
  stats: {
    punchlines: '#A78BFA',
    victim: '#F472B6',
    participant: '#4A9EFF',
    conversations: '#1DB954',
  },
  shadow: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.6)',
  },
};

export const spacing = {
  sidebarWidth: '240px',
  headerHeight: '64px',
  cardGap: '24px',
  contentPadding: { base: '16px', md: '32px' },
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

// Reusable style presets to reduce inline styling in components
export const stylePresets = {
  card: {
    borderRadius: '8px',
    padding: '20px',
  },
  cardLarge: {
    borderRadius: '12px',
    padding: '32px',
  },
  button: {
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
  },
  buttonSmall: {
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
  },
  input: {
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
  },
  badge: {
    borderRadius: '16px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  pageContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  pageContainerWide: {
    maxWidth: '1600px',
    margin: '0 auto',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  pageSubtitle: {
    fontSize: '14px',
    marginBottom: '32px',
  },
};

export const responsiveSpacing = {
  mobile: 4,
  tablet: 6,
  desktop: 8,
};

export const responsivePadding = { base: 4, md: 8 };

export type Theme = typeof lightTheme;

