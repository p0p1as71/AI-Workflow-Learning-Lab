# Changelog

## v1.0-learning-runtime

### What was built
- Project structure with separate folders: runtime, governance, scripts, experiments, docs, papers, assets.
- Event-sourced governance engine with append-only ledger.
- Constitutional validator enforcing VALID_TRANSITIONS and ROLE_ACTIONS.
- Deterministic replay for integrity checks.
- Node.js runtime demo (`src/index.js`).
- Pre-commit validation scripts and automated pipeline (`scripts/run_pipeline.sh`).
- Governance transition tests (`tests/governance.test.js`).
- Continuous Integration workflow for GitHub Actions (`.github/workflows/ci.yml`).

### Deliberately excluded
- Persistence layer: in-memory store only to focus on architecture.
- Production-ready CLI: omitted to keep scope on core engine.
- Domain-specific business logic: the system models governance architecture only.
- Advanced observability (logging, metrics, snapshots): out of scope for v1.
- Multi-tenant or namespace support: reserved for future releases.

### How to run
```bash
npm init -y
node src/index.js
node tests/governance.test.js