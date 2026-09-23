/** Original documentation-only starter. Real source facts must be supplied by its maintainer. */
export function createStarterSkillManifest({ id, name, repository, repositoryId, repositoryIsFork, commit }) {
  if (!/^skill:[a-z0-9][a-z0-9-]*\/[a-z0-9][a-z0-9-]*$/.test(id ?? '')) throw new TypeError('Choose a stable skill ID');
  if (typeof name !== 'string' || !name.trim() || name.length > 120) throw new TypeError('A skill name is required');
  if (!/^https:\/\/github\.com\/[A-Za-z0-9][A-Za-z0-9._-]{0,99}\/[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/.test(repository ?? '') || !/^[1-9][0-9]{0,19}$/.test(repositoryId ?? '') || typeof repositoryIsFork !== 'boolean' || !/^[a-f0-9]{40}$/.test(commit ?? '') || /^0+$/.test(commit)) throw new TypeError('Supply observed GitHub repository facts and a full source SHA');
  return {
    schema_version: 'freedom.skill/v1', id, name, version: '0.1.0-preview',
    source: { repository, repository_id: repositoryId, repository_is_fork: repositoryIsFork, commit, manifest_path: 'freedom-skill.yaml' },
    summary: 'A documentation-only starter: describe a task, evidence and the next human decision.',
    requested_capabilities: ['documentation'],
    entrypoints: { learn: 'README.md' },
    human_control: { principal_required: true, independent_review_same_agent_is_insufficient: true, a4_exact_digest_signature: true, never_store_chain_of_thought: true },
    data_and_runtime: { sends_data_to: [], secrets_required: [] },
    limitations: ['Starter only; not reviewed, installed, executable, commercially approved or automatically registered.'],
  };
}
