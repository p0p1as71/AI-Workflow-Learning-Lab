# ADR-003: Validator Separated from Runtime

**Status**: Accepted · **Date**: 2026-05-19 · **Decider**: initial

## Context

Embedding validation logic directly in the runtime mixes concerns, complicates testing, and increases coupling.

## Decision

The validator will be implemented as a standalone module (`validateTransition.js`), decoupled from the runtime execution engine.

## Consequences

- Enables independent unit testing and reuse of validation logic.  
- Simplifies runtime code by focusing solely on event dispatching.  
- Facilitates future replacement or extension of validation rules without touching runtime.

## Considered Alternatives

- **In-process validation**: quicker integration but tangled code paths.  
- **External service**: decouples further but adds network overhead; rejected for simplicity.