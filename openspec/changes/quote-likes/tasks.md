# Tasks

## 1. Data model and persistence

- [x] 1.1 Add a `likes` field to the frontend conversation model and normalize missing values to `0` when reading list data.
- [x] 1.2 Update the conversation creation payload and Supabase schema path to persist a numeric like count for new records.

## 2. Quote list interaction

- [x] 2.1 Add a like button and count display to each `ConversationCard` in the list view.
- [x] 2.2 Add optimistic toggle logic to increment or decrement the count without navigating away from the page.
- [x] 2.3 Ensure repeated clicks and failed saves restore the correct prior state without duplicating increments.

## 3. Verification

- [x] 3.1 Run the frontend validation/build checks and confirm the quote list renders with likes without console or compile errors.
