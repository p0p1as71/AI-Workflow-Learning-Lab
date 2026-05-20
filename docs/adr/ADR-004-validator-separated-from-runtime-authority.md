# ADR-004: Validator Authority Separation

**Status**: Accepted · **Date**: 2026-05-19 · **Decider**: initial

## Context

Ensuring that authorization logic is not intermingled with validation ensures clarity of responsibility and easier policy updates.

## Decision

Separate authority checks (role-action permissions) into a distinct layer within the validator module (`rules.js`), rather than embedding them in core runtime logic.

## Consequences

- Role permissions can evolve independently of validation rules.  
- Improves maintainability by isolating authorization concerns.  
- Simplifies auditing of role-based constraints.

## Considered Alternatives

- **Unified rule engine**: single module for all rules; rejected to avoid monolithic logic.  
- **External policy service**: adds complexity and latency; rejected for MVP simplicity.