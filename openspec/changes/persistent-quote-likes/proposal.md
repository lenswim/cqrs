# Proposal

## Why

Users want to react to memorable quotes directly from the list view, and those reactions should remain visible after a page reload. Right now the quote list only shows conversations and no persistent feedback, so there is no way to record or retain appreciation across visits.

## What Changes

- Add a like control to every quote in the list view.
- Persist the current like count in Supabase so the value survives refreshes and future visits.
- Keep likes visible and current when users revisit the `ListQuotes` page.
- Preserve the existing filter and pagination flows while adding the reaction state.

## Capabilities

### New Capabilities
- `quote-likes`: supports storing per-conversation like counts and exposing them through the quote list.

### Modified Capabilities
- None.

## Impact

- `cqrs-frontend/src/pages/ListQuotes.tsx`
- `cqrs-frontend/src/components/conversation/ConversationCard.tsx`
- `cqrs-frontend/src/hooks/useConversationList.ts`
- `cqrs-frontend/src/hooks/useConversationForm.ts`
- `cqrs-frontend/src/types/types.ts`
- `supabase/functions/create-conversation/index.ts`
- Supabase `conversations` rows used by the frontend list view
