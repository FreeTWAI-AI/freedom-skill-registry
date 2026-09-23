import test from 'node:test';
import assert from 'node:assert/strict';
import { listRegisteredProjects, registerProject, projectManifestToImport, validateDeclarations } from '../src/index.mjs';
import { createStarterSkillManifest } from '../templates/starter-skill/create-manifest.mjs';

const manifest = { schema_version: 'freedom.project/v1', kind: 'Project', name: 'Example', summary: 'Example public project', repository: { visibility: 'public', repository_id: '42', html_url: 'https://github.com/example/project', full_name: 'example/project' }, data_boundary: { classification: 'public' } };
test('project commands use the common client and preserve command identity', async () => {
  const calls = [];
  const client = { async call(...args) { calls.push(args); return { items: [] }; } };
  await listRegisteredProjects(client);
  const body = projectManifestToImport(manifest, { relationship: 'curator', consentToShare: true, useNotes: 'Read the project documentation before using it.' });
  await registerProject(client, body, { idempotencyKey: 'import-a' });
  assert.deepEqual(calls, [['listProjects'], ['importProject', { body, idempotencyKey: 'import-a' }]]);
  assert.equal(body.demo_url, null);
});
test('private metadata, mismatched source identity and implicit consent cannot become imports', () => {
  assert.throws(() => projectManifestToImport({ ...manifest, repository: { ...manifest.repository, visibility: 'private' } }, { relationship: 'author', consentToShare: true }), /public/);
  assert.throws(() => projectManifestToImport({ ...manifest, repository: { ...manifest.repository, html_url: 'https://github.com/other/project' } }, { relationship: 'author', consentToShare: true }), /inconsistent/);
  assert.throws(() => projectManifestToImport(manifest, { relationship: 'author' }), /consent/);
  assert.throws(() => projectManifestToImport(manifest, { relationship: 'curator', consentToShare: true }), /Use notes/);
  assert.throws(() => registerProject({ call() {} }, { repository_url: 'http://localhost/a', relationship: 'author', consent_to_share: true }, { idempotencyKey: 'a' }), /public GitHub/);
});
test('declarations require immutable refs and cannot assert acceptance', () => {
  const entry = { package_id: 'skill:example/lesson', repository_url: 'https://github.com/example/lesson', commit: 'a'.repeat(40), manifest_path: 'freedom-skill.yaml', intent: 'request_import' };
  assert.equal(validateDeclarations({ schema_version: 'freedom.registry-declarations/v1', packages: [entry] }).packages.length, 1);
  assert.throws(() => validateDeclarations({ schema_version: 'freedom.registry-declarations/v1', packages: [entry, entry] }), /Duplicate/);
  assert.throws(() => validateDeclarations({ schema_version: 'freedom.registry-declarations/v1', packages: [{ ...entry, commit: 'main' }] }), /full commit/);
  assert.throws(() => validateDeclarations({ schema_version: 'freedom.registry-declarations/v1', packages: [{ ...entry, intent: 'official' }] }), /request import/);
  assert.throws(() => validateDeclarations({ schema_version: 'freedom.registry-declarations/v1', packages: [{ ...entry, official: true }] }), /Unknown declaration/);
});
test('starter is documentation-only and requires real-looking observed source refs', () => {
  const source = { id: 'skill:example/lesson', name: 'Lesson', repository: 'https://github.com/example/lesson', repositoryId: '42', repositoryIsFork: false, commit: 'a'.repeat(40) };
  const skill = createStarterSkillManifest(source);
  assert.deepEqual(skill.requested_capabilities, ['documentation']);
  assert.deepEqual(skill.entrypoints, { learn: 'README.md' });
  assert.throws(() => createStarterSkillManifest({ ...source, commit: '0'.repeat(40) }), /observed/);
});
