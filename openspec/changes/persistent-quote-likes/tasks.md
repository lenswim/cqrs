# Tasks

## 1. Data model and persistence

- [x] 1.1 Add a numeric `likes` field to the conversation model, defaulting missing values to `0` when reading the list.
- [x] 1.2 Persist the like count for new conversations and keep the backend payload aligned with the frontend model.

## 2. Quote list interaction

- [x] 2.1 Add a like button and count to each conversation card in the list.
- [x] 2.2 Toggle the like state in the list and send the updated value to Supabase without leaving the page.
- [x] 2.3 Restore the previous count if a click is repeated or a save fails, so the state stays consistent.

## 3. Verification

- [x] 3.1 Run the frontend validation/build check and confirm the list still renders and shows persistent like counts after reload.
