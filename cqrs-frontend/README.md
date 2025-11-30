# CQRS Frontend - Clean Architecture Implementation

A React application implementing clean separation of concerns for better maintainability, reusability, and testability.

## 🏗️ Architecture Overview

This project has been refactored to implement a clean separation of concerns with the following layers:

### 📁 Project Structure
```
src/
├── components/
│   ├── ui/                    # 🎨 Reusable UI Components
│   │   ├── StyledButton.tsx   # Multi-variant button component
│   │   ├── StyledComponents.tsx # Container, Card, Heading components
│   │   └── index.ts           # Barrel exports
│   └── conversation/          # 💬 Domain-Specific Components
│       ├── FormComponents.tsx # Form-related UI elements
│       ├── ListComponents.tsx # List-related UI elements
│       └── index.ts           # Barrel exports
├── hooks/                     # 🎣 Business Logic Layer
│   ├── useConversationForm.ts # Form state management
│   ├── useConversationList.ts # List filtering & data fetching
│   └── index.ts               # Barrel exports
├── styles/                    # 🎨 Styling System
│   ├── theme.ts               # Design tokens & color palette
│   └── componentStyles.ts     # Reusable style objects
├── pages/                     # 📄 Page Orchestration
│   ├── MainPage.tsx           # Landing page
│   ├── NewQuote.tsx           # Create conversation form
│   └── ListQuotes.tsx         # Browse conversations
└── types/                     # 📝 TypeScript Definitions
    └── types.ts               # Shared type definitions
```

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🎯 Key Benefits

### ✅ Before vs After

**Before (Mixed Responsibilities):**
```tsx
// ❌ Everything mixed together
const MyPage = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    // Complex business logic mixed with UI
  };

  return (
    <Box maxW="800px" mx="auto" p={6}> {/* ❌ Inline styles */}
      <Box as="button" px={4} py={2} bg="purple.100" onClick={handleSubmit}>
        {/* ❌ Complex logic in JSX */}
      </Box>
    </Box>
  );
};
```

**After (Clean Separation):**
```tsx
// ✅ Clean composition
const MyPage = () => {
  const { data, loading, handleSubmit } = useMyBusinessLogic(); // 🎣 Business logic
  
  return (
    <Container variant="main"> {/* 🎨 Styled component */}
      <StyledButton variant="primary" onClick={handleSubmit}> {/* 🧩 Reusable component */}
        Save
      </StyledButton>
    </Container>
  );
};
```

## 🧩 Component Usage Examples

### Styled Components

```tsx
// Buttons with variants
<StyledButton variant="primary" onClick={handleSave}>
  Save Changes
</StyledButton>

<StyledButton variant="back" onClick={() => navigate(-1)}>
  ← Go Back
</StyledButton>

// Containers with built-in layouts
<Container variant="main">
  <Container variant="center">
    <StyledHeading variant="primary">Welcome</StyledHeading>
  </Container>
</Container>

// Cards with consistent styling
<StyledCard variant="form">
  {/* Form content */}
</StyledCard>
```

### Custom Hooks

```tsx
// Form management
const {
  conversationDate,
  setConversationDate,
  lines,
  handleLineChange,
  addLine,
  handleSubmit
} = useConversationForm();

// List with filtering
const {
  conversations,
  allParticipants,
  selectedParticipants,
  toggleParticipantFilter,
  clearFilters
} = useConversationList();
```

### Domain Components

```tsx
// Form components
<ConversationDateField
  value={conversationDate}
  onChange={setConversationDate}
/>

<LineEditor 
  lines={lines} 
  onLineChange={handleLineChange} 
/>

// List components
<ParticipantFilter
  participants={allParticipants}
  selectedParticipants={selectedParticipants}
  onToggleParticipant={toggleParticipantFilter}
  onClearFilters={clearFilters}
/>

<ConversationList conversations={conversations} />
```

## 🎨 Styling System

### Theme Usage
```tsx
import { theme } from '../styles/theme';

// Access design tokens
const myStyle = {
  color: theme.colors.primary[700],
  borderRadius: theme.borderRadius.lg,
  shadow: theme.shadows.md
};
```

### Component Styles
```tsx
import { buttonStyles, cardStyles } from '../styles/componentStyles';

// Use predefined style objects
<Box {...buttonStyles.primary} />
<Box {...cardStyles.form} />
```

## 🧪 Testing Strategy

### Testing Hooks (Business Logic)
```tsx
import { renderHook, act } from '@testing-library/react';
import { useConversationForm } from '../hooks/useConversationForm';

test('should add new line', () => {
  const { result } = renderHook(() => useConversationForm());
  
  act(() => {
    result.current.addLine();
  });
  
  expect(result.current.lines).toHaveLength(2);
});
```

### Testing Components (UI)
```tsx
import { render, screen } from '@testing-library/react';
import { StyledButton } from '../components/ui/StyledButton';

test('should render button with correct variant', () => {
  render(
    <StyledButton variant="primary" onClick={() => {}}>
      Click me
    </StyledButton>
  );
  
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

## 🔧 Development Guidelines

### Adding New Components

1. **UI Components** (`/components/ui/`)
   - Pure presentational components
   - Accept props for customization
   - No business logic
   - Export from `index.ts`

2. **Domain Components** (`/components/conversation/`)
   - Feature-specific components
   - Combine multiple UI components
   - Handle complex user interactions
   - Export from `index.ts`

3. **Hooks** (`/hooks/`)
   - Contain all business logic
   - Manage state and side effects
   - Return data and functions
   - Export from `index.ts`

### Styling Guidelines

1. **Use Design Tokens**
   ```tsx
   // ✅ Use theme values
   color: theme.colors.primary[500]
   
   // ❌ Avoid magic values
   color: '#9333ea'
   ```

2. **Component Style Objects**
   ```tsx
   // ✅ Use predefined styles
   {...buttonStyles.primary}
   
   // ❌ Avoid inline styles
   px={4} py={2} bg="blue.500"
   ```

3. **Responsive Design**
   ```tsx
   // Use Chakra UI responsive syntax
   fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
   ```

## 📈 Performance Considerations

- **Code Splitting**: Components are organized for easy dynamic imports
- **Bundle Size**: Barrel exports allow for tree-shaking
- **Memoization**: Custom hooks can easily implement `useMemo` and `useCallback`
- **Type Safety**: Full TypeScript support prevents runtime errors

## 🔄 Migration Guide

If you're updating existing components to use this architecture:

1. **Extract Business Logic** → Move to custom hooks
2. **Create Styled Components** → Replace inline styles
3. **Use Domain Components** → Combine related UI elements
4. **Update Imports** → Use barrel exports
5. **Add Type Safety** → Use proper TypeScript types

## 🏆 Best Practices Achieved

- ✅ **Single Responsibility**: Each file has one clear purpose
- ✅ **Reusability**: Components and hooks work across multiple pages
- ✅ **Testability**: Business logic is isolated and easily testable
- ✅ **Maintainability**: Clear structure and separation of concerns
- ✅ **Type Safety**: Full TypeScript support with proper type imports
- ✅ **Performance**: Optimized imports and bundle splitting
- ✅ **Accessibility**: Consistent component APIs for a11y features
- ✅ **Developer Experience**: Clean imports and intuitive component APIs

---

🎉 **Happy Coding!** This clean architecture will scale beautifully as your application grows.
