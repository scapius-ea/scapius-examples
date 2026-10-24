import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const layoutsDir = path.join(root, 'layouts');
const sourceFiles = fs.readdirSync(root).filter((file) => file.endsWith('.ea'));
const source = sourceFiles.map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
const declaredViews = new Set([...source.matchAll(/\b(?:landscape|container|integration|dashboard|capability_map|threat_model|risk_heatmap|compliance_matrix|data_flow|attack_surface|value_stream_map)\s+([A-Za-z_][A-Za-z0-9_-]*)/g)].map((match) => match[1]));

const orphaned = fs.readdirSync(layoutsDir)
  .filter((file) => file.endsWith('.layout.json'))
  .filter((file) => !declaredViews.has(file.replace(/\.layout\.json$/, '')));

if (orphaned.length > 0) {
  console.error(`Orphan layout files: ${orphaned.join(', ')}`);
  process.exit(1);
}
console.log(`Layout consistency check passed for ${declaredViews.size} declared views.`);
