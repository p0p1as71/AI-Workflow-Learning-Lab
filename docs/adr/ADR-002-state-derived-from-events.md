# ADR-002: State Derived from Events

**Status**: Accepted · **Date**: 2026-05-19 · **Decider**: initial

## Context

The system must derive state purely by replaying historical events. Storing a separate mutable state risks divergence from the event log and undermines determinism.

## Decision

State will be computed on demand by processing the event history for each `request_id`. No separate state storage will be maintained.

## Consequences

- Event replay is required for every state lookup, trading off performance for consistency.  
- Eliminates risk of state vs. log inconsistency.  
- Simplifies rollback and debugging by re-executing the same event sequence.

## Considered Alternatives

- **Cached mutable state**: could improve performance but introduces complexity in keeping cache in sync.  
- **Hybrid model**: partial caching with fallback to replay; rejected to avoid cache invalidation logic.