# Use zod for validation

- Status: accepted
- Tags: validation,zod,supabase,edge function

## Context and Problem Statement

How to do input validation of new quotes, both in the frontend and the backend?

## Decision Drivers

- should be as easy as possible

## Considered Options

- zod

## Decision Outcome

Chosen option: zod, because I did not look for any other options.
Zod schema can be reused in an Supabase Edge function to provide backend validation.

### Positive Consequences <!-- optional -->

- The zod schema can be reused for backend validation

## Links <!-- optional -->

- [zod](https://zod.dev/)
- [supabase edge functions](https://supabase.com/docs/guides/functions)