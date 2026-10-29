# Energy systems contracts (Operation 111 · Agent 34)

Static checks that the V9.4 monolith still contains the energy architecture anchors documented in the Project store:

`docs/operation-111-agent-34-energy-systems-spec.md`

Run:

```bash
npm run test:energy-contracts
```

Agent 111 should run this on branches that touch energy, renewables, or national grid logic before merging into `(V9.4) australia-game-with-ai.tsx`.
