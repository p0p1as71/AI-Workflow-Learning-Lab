# Transition Rules

The system enforces a strict set of allowed transitions between actions. Each transition is defined in `src/validator/rules.js` under `VALID_TRANSITIONS`.

- **submitted** → reviewed, correction  
- **reviewed** → validated, rejected, correction  
- **validated** → executed, rejected, correction  
- **rejected** → correction  
- **executed** → correction  
- **correction** → (none)

Roles permitted to emit actions (from `ROLE_ACTIONS`):

- **intaker**: submitted, correction  
- **governor**: reviewed, rejected, correction  
- **validator**: validated, rejected, correction  
- **executor**: executed, correction  

Invalid transitions or unauthorized actions produce typed errors (`ruleId`, `expected`, `received`) for clear debugging and observability.