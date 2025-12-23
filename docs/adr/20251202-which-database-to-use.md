# Which database to use?

- Status: accepted
- Date: 2025-12-02
- Tags: [database mongodb supabase postgres]

## Context and Problem Statement

Which database should I use for this project?

## Decision Drivers

- it has to be free
- it has to support json
- it has to be deployable locally

## Considered Options

- mongodb
- supabase
- postgres

## Decision Outcome

Chosen option: supabase, because Xan told me about this and it's a BaaS (Backend-as-a-Service) and I could delete the entire existing backend.

It's fronted by an api-gateway with a REST-API and the existing backend is a REST-api to talk to a mongodb.

### Positive Consequences

- no need for a custom backend

### Negative Consequences

- backend contains some validation, but I'll think about this later