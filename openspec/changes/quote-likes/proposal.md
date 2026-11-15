# Proposal

## Why

Users want a simple way to signal appreciation for memorable quotes directly from the list view. The current browse page shows conversations but offers no feedback mechanism, which makes it harder to surface the most popular quotes without drilling into each record.

## What Changes

- Add a visible like action to each conversation card in the quote list.
- Show the current like count next to the interaction so users can quickly see popularity.
- Allow a user to like or unlike a quote from the list without leaving the page.
- Keep the change scoped to the frontend quote browsing workflow while preserving the existing filtering and pagination flow.

## Capabilities

### New Capabilities
- `quote-likes`: supports per-conversation reactions and visible like counts in the quote list.

### Modified Capabilities
- None.

## Impact

- `cqrs-frontend/src/pages/ListQuotes.tsx`
- `cqrs-frontend/src/components/conversation/ConversationCard.tsx`
- `cqrs-frontend/src/hooks/useConversationList.ts`
- `cqrs-frontend/src/types/types.ts`
- `supabase/functions/create-conversation/index.ts` and the conversation payload shape used by the UI
