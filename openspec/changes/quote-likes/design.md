# Design

## Context

The quote list already fetches conversation data through `useConversationList` and renders each item via `ConversationCard`. The feature can therefore be added in the existing list flow without changing the overall browse experience or the filter model.

## Goals / Non-Goals

**Goals:**
- Add a like control and count to each conversation card in the list page.
- Keep the interaction fast and visible without requiring navigation.
- Preserve the current pagination and filtering behavior.

**Non-Goals:**
- User accounts or per-user identity tracking.
- A separate social feed or comment system.
- Changing the underlying conversation data model beyond the required like metadata.

## Decisions

- Use a `likes` numeric field on each conversation record and default it to `0` when absent.
- Render the like action in `ConversationCard` so the interaction stays close to the content it belongs to.
- Keep the toggle optimistic in the UI and persist the updated count via the same conversation update path used by the rest of the quote data.
- Treat the feature as conversation-level feedback rather than line-level feedback because the list is organized by conversation, not by individual quote lines.

### Alternatives considered

- Per-line likes: rejected because the list page is organized by conversation and the required behavior is to like the quote as a whole.
- Dedicated social backend tables: rejected for now because the current app already stores and fetches conversations in a single record structure, and the change is scoped to the browse flow.

## Risks / Trade-offs

- [State drift between UI and persisted data] → Save the updated value as part of the conversation payload and restore the prior value if the backend request fails.
- [Repeated rapid clicks] → Disable or debounce the button while the update is in flight to avoid duplicate increments.
- [Existing records without a `likes` field] → Normalize missing values to `0` as part of the list fetch and creation flow.

## Migration Plan

- Add a default `likes` value of `0` to newly created conversation records.
- Normalize existing conversation records on fetch so old records render with a valid count.
- Keep the change backward-compatible by allowing records without a like count to behave as zero-valued entries.

## Open Questions

- None at this stage; the change is scoped to a lightweight anonymous like count without per-user identity.
