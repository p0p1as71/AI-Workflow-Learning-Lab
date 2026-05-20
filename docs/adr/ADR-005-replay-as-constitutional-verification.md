# ADR-005: Replay as Constitutional Verification

**Status**: Accepted · **Date**: 2026-05-19 · **Decider**: initial

## Context

Verifying ledger integrity requires ensuring that each new event respects constitutional rules across the entire history.

## Decision

Implement replay-based verification (`replayAll`) that re-processes all stored events through `validateTransition` to confirm the ledger remains consistent.

## Consequences

- Detects any corruption or invalid sequences after the fact.  
- Guarantees deterministic enforcement of rules over time.  
- Adds computation overhead proportional to ledger size.

## Considered Alternatives

- **Real-time strict enforcement only**: faster but lacks retrospective guarantees.  
- **Snapshot validation**: partial checks; rejected to avoid missing edge-case sequences.