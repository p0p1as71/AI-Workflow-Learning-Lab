# Runtime Architecture

## Operational pipeline

```
proposal
   ↓
validator (constitutional enforcement)
   ↓
append (ledger)
   ↓
query (derived state)
   ↓
replay (historical verification)
```

Each layer has a single responsibility. No layer decides for another.

## Layer responsibilities

### Validator
Protects structural integrity. Verifies:
1. **Valid action** — the proposed action is a known event type
2. **Authorized role** — the actor can emit that action under their role
3. **Legal transition** — the jump from the last state is valid per the state machine
4. **Causal chain** — required prior events exist in the correct order
5. **Semantic conditions** — prior events have expected values (e.g. `decision === "approved"`)
6. **Required fields** — the event includes mandatory fields (e.g. `reason` for `correction`)

**Cannot**: decide business logic, interpret intent, improvise rules, mutate the event.

### Ledger (append)
If the validator approves, the event is appended to the end of the `request_id` history. Append only. Never modified or deleted.

### Store
Internal in-memory storage (`Map<request_id, events[]>`). In production: append-only file, database, or event stream.

### Query (derived state)
Current state is obtained by reading history. No mutable "current state" variable exists. `getState()` returns the last event and the complete action chain.

### Replay (historical verification)
Reconstructs state by re-applying validation to each event in sequence, as if for the first time. Verifies the ledger is internally consistent.

**Cannot**: mutate the ledger, modify events, skip validation.

## Module map

| Module     | File                                   | Responsibility                    |
|------------|----------------------------------------|-----------------------------------|
| Rules      | `src/validator/rules.js`               | Formal constitutional definition  |
| Validator  | `src/validator/validateTransition.js`  | Constitutional enforcement        |
| Ledger     | `src/ledger/ledger.js`                 | Governed append                   |
| Store      | `src/ledger/store.js`                  | Internal storage                  |
| Query      | `src/ledger/query.js`                  | State derived from history        |
| Replay     | `src/ledger/replay.js`                 | Historical integrity verification |
| Demo       | `src/index.js`                         | End-to-end flow                   |

## Architecture layers

```
┌─────────────────────────────────────────────┐
│           Runtime (src/index.js)            │
│  Proposes events, orchestrates flow         │
├─────────────────────────────────────────────┤
│               Validator                     │
│  validateTransition.js                      │
│  Constitutional enforcement. No inference.  │
├─────────────────────────────────────────────┤
│               Ledger                        │
│  ledger.js → store.js → query.js → replay  │
│  Append-only. Derived state. Deterministic. │
├─────────────────────────────────────────────┤
│            Constitution                     │
│  docs/governance-model.md                  │
│  docs/event-lifecycle.md                   │
│  docs/transition-rules.md                  │
│  src/validator/rules.js                    │
└─────────────────────────────────────────────┘
```

## Architectural principles

| Principle                         | Meaning                                                    |
|-----------------------------------|------------------------------------------------------------|
| Validate before persist           | The ledger never receives invalid events                   |
| State derived, not stored         | State emerges from history, not from a mutable variable    |
| Enforcement decoupled from inference | The validator applies rules, never reasons or interprets|
| Ledger as operational authority   | The ledger is the core of the system, not a secondary log  |
| Observable typed errors           | Every violation includes ruleId, expected, received        |
| The runtime is not free           | Every transition passes through constitutional enforcement |