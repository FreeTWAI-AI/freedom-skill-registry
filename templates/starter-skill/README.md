# Documentation-only starter skill

Copy this directory into a new project, then replace this lesson with an actual task your audience can learn. The starter has no install/run entrypoint, agent execution grant, billing ability or provider connection.

1. Explain the problem and who benefits.
2. List the inputs a learner supplies, excluding passwords and private customer files.
3. Give the steps, an observable result and a small verification example.
4. Record limitations and when a human must decide.
5. Provide the maintainer and the source license after you have chosen them.

`createStarterSkillManifest(...)` accepts observed GitHub repository identity and a full commit SHA; serialize its result as JSON to `freedom-skill.yaml` (JSON is valid YAML). It never invents source facts or declares the skill official. Final package/source resolution must be checked by the canonical capability validator; schema validation alone does not grant installation/execution. Do not register a placeholder SHA or use the registry repository's identity for your new skill.
