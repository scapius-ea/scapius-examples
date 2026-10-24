import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const exampleRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliProject = path.resolve(exampleRoot, '../../backend/NexusEA.Cli/NexusEA.Cli.csproj');
const dotnet = process.env.DOTNET || 'dotnet';
const output = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'scapius-example-')), 'model.json');

try {
  execFileSync(dotnet, ['run', '--project', cliProject, '--no-restore', '--', 'validate', exampleRoot], {
    cwd: path.dirname(cliProject),
    stdio: 'inherit',
  });
  execFileSync(dotnet, ['run', '--project', cliProject, '--no-restore', '--', 'compile', exampleRoot, '--output', output], {
    cwd: path.dirname(cliProject),
    stdio: 'inherit',
  });
  if (!fs.existsSync(output) || fs.statSync(output).size === 0) {
    throw new Error('Community example compilation produced no output.');
  }
  console.log('Community Neobank example validation passed.');
} finally {
  fs.rmSync(path.dirname(output), { recursive: true, force: true });
}
