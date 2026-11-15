# Spec Delta

## Purpose

Lets users react to memorable conversations directly from the quote list and immediately see which ones are most appreciated.

## ADDED Requirements

### Requirement: Quote list shows likes and counts
The system SHALL display a like control and the current total number of likes for each conversation in the quote list.

#### Scenario: Quote cards show current like totals
- **WHEN** a user opens the list of quotes
- **THEN** each conversation card shows a like control and the current like count for that conversation

#### Scenario: Filters do not hide like data
- **WHEN** the user applies participant or year filters
- **THEN** each visible card continues to show the correct like total for its conversation

### Requirement: Users can toggle likes from the list
The system SHALL allow a user to like or unlike a conversation without navigating away from the quote list.

#### Scenario: Like a conversation
- **WHEN** a user clicks the like button on a quote card
- **THEN** the conversation is marked as liked and the count increases immediately

#### Scenario: Unlike a conversation
- **WHEN** a user clicks the like button again on a conversation that is already liked
- **THEN** the like is removed and the count decreases immediately

#### Scenario: Like action handles failures gracefully
- **WHEN** saving the like update fails
- **THEN** the UI restores the previous state and the user can retry without losing the original quote data
