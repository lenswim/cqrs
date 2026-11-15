# Design

## Context

The app already reads conversation records from Supabase through `useConversationList` and renders them in `ListQuotes` using `ConversationCard`. The missing piece is a persisted like count on each conversation entry so the UI can reflect the same value after refresh.

## Goals / Non-Goals

**Goals:**
- Store a numeric like count with each conversation in Supabase.
- Keep the count visible and accurate after reload.
- Allow the user to change the count from the list view without entering a separate page.

**Non-Goals:**
- User-specific likes or authentication-based reactions.
- Per-line likes or comments.
- A separate social service or backend table.

## Decisions

- Use a `likes` numeric field on the conversation payload so the existing `conversations` table can store the reaction state without changing the overall schema structure.
- Keep the `ListQuotes` page as the single interaction surface for toggling likes, since the browse flow already owns presentation of each conversation entry.
- Use optimistic UI updates on the client, while persisting the canonical value in Supabase so reloads reflect the backend state.
- Treat the backend count as the source of truth after each successful toggle and normalize missing values to `0` during reads.

### Alternatives considered

- Local-only state: rejected because the requirement explicitly requires likes to remain visible after reload.
- A separate reactions table: rejected to keep the change minimal and consistent with the existing single-record conversation model.

## Risks / Trade-offs

- [Stale UI after failed writes] → Revert the optimistic state and keep the last persisted value until the request succeeds.
- [Duplicate toggles from rapid clicks] → Disable the button while the update is in flight.
- [Old records without a like field] → Read missing values as `0` and default new conversations to `0`.

## Migration Plan

- Default every new conversation to `likes: 0` when it is created.
- Read legacy conversations with no `likes` field as zero on the client.
- Persist future toggles by updating the conversation row in Supabase so the stored value remains available on reload.

## Open Questions

- None at this stage; the backend persistence model and reload behavior are clear.
