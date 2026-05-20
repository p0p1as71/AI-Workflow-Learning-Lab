# Operational Governance Model

## Pipeline

```
intake
   ↓
governance
   ↓
validation
   ↓
execution
   ↓
ledger (append-only in all stages)
```

Four distinct phases, not three. Separation between **governance** and **validation** is critical: one decides, the other verifies structural legitimacy.

## Conceptual Differentiation

| Phase       | Responsibility                                              | Analogy                        |
|-------------|-------------------------------------------------------------|-------------------------------|
| Intake      | Capture, normalize, and record the request                  | Single point of entry        |
| Governance  | Decide if an action should proceed                          | Parliament / authority       |
| Validation  | Verify that the decision complies with formal rules         | Tribunal / compliance        |
| Execution   | Execute the validated decision                              | Executive / operations       |

### Intake ≠ Governance

Receiving a request does not grant authority to decide on it.

### Governance ≠ Validation

A decision does not guarantee compliance with structural rules. A decision requires formal legitimacy in addition to authority.

### Validation ≠ Execution

Verifying rules is not executing. Checking compliance doesn’t imply implementation.

## Event Lifecycle

```
submitted → reviewed → validated → approved → executed → closed
```

Each transition records an entry in the ledger.

## Roles

| Role      | Responsibility                                         |
|-----------|--------------------------------------------------------|
| Intaker   | Record and normalize incoming requests                |
| Governor  | Evaluate and decide (approve, reject, request changes)|
| Validator | Verify decision against formal rules                   |
| Executor  | Implement the validated decision                       |
| Ledger    | Store events immutably (append-only)                   |

## Authority Boundaries

### Intake

**Can:**
- Receive requests from any source  
- Normalize and structure requests  
- Record requests in the ledger  

**Cannot:**
- Evaluate request content  
- Approve or reject  
- Execute request  
- Modify recorded requests  

(Continued for Governance, Validation, Execution, Ledger as in source)