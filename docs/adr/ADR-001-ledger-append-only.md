# ADR-001: Ledger Append-Only

**Status**: Accepted · **Date**: 2026-05-19 · **Decider**: initial

## Context

The system requires an immutable record of operational events. Without this, decision traceability, replay, and auditing are impossible.

## Decision

The ledger will be **append-only**. Entries are added to the end of a `request_id` history. Once written, they are neither modified nor deleted.

## Consequences

- Any correction must be recorded as a new `correction` event referencing the original event.  
- System state is derived from the full history; there is no mutable “current state” variable.  
- The ledger serves as the single source of operational truth.

## Considered Alternatives

- **Mutable database**: rejected because it allows altering the past and breaks traceability.  
- **Unstructured flat log**: rejected because it doesn’t support reconstructing state per `request_id`.