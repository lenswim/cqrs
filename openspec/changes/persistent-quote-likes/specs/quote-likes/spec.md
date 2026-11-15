# Spec Delta

## Purpose

Lets users like memorable quotes from the list page and persist each conversation's like total so the count remains visible after reload.

## ADDED Requirements

### Requirement: Quote list shows the persisted like count
The system SHALL display the current like count for each conversation in the quote list using the stored value from the backend.

#### Scenario: Count is visible on list render
- **WHEN** a user opens the `ListQuotes` page
- **THEN** each conversation card shows the stored like count for that conversation

#### Scenario: Count remains after reload
- **WHEN** the user reloads the page after a previous interaction
- **THEN** the quote list shows the latest persisted like count from Supabase

### Requirement: Users can toggle likes from the list
The system SHALL allow a user to like or unlike a conversation directly from the quote list and persist that decision to Supabase.

#### Scenario: Like a quote
- **WHEN** a user clicks the like icon for a quote
- **THEN** the backend stores the updated like count and the list shows the new total immediately

#### Scenario: Unlike a quote
- **WHEN** a user clicks the like icon again for a quote that is already liked
- **THEN** the backend stores the decremented count and the list reflects the lower total

#### Scenario: Persisted state is restored after failure recovery
- **WHEN** a save request fails during a like toggle
- **THEN** the UI restores the previous state and does not silently lose the last known persisted count
