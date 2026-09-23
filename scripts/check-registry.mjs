import { readFile } from 'node:fs/promises';
import { validateDeclarations } from '../src/index.mjs';
const registry = validateDeclarations(JSON.parse(await readFile(new URL('../registry/packages.yaml', import.meta.url), 'utf8')));
console.log(`Registry declarations checked: ${registry.packages.length}. These are import requests, not Platform records.`);
