# Agent 18 — Team Intelligence 3.0 (Operation 600K)

Standalone integration module for **in-game AI team coordination, role assignment, and conflict prevention**.

## Artifact

- `team-intelligence-3.0-coordination.tsx` — planning-only layer (never executes game actions)

## Verification

```bash
npx tsx -e "import { runTeamCoordination3SelfTests } from './operation-600k/agent-18/team-intelligence-3.0-coordination.tsx'; console.log(runTeamCoordination3SelfTests());"
```

## Integration owner

Agent 25 merges into `(V9.4) australia-game-with-ai.tsx` per [integration contract](/cursor/stores/self/internal/agents/agent-18-team-intelligence-integration.md).
