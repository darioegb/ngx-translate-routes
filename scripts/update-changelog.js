const fs = require('fs');
const execSync = require('child_process').execSync;

const changelogPath = 'CHANGELOG.md';
let changelogContent = '';

if (fs.existsSync(changelogPath)) {
  changelogContent = fs.readFileSync(changelogPath, 'utf8');
}

const { version: latestVersion } = JSON.parse(fs.readFileSync('projects/ngx-translate-routes/package.json', 'utf8'));

const newChangelog = execSync(`npx auto-changelog --stdout --latest-version "${latestVersion}"`).toString();

const updatedChangelogContent = `${newChangelog}\n${changelogContent}`;
fs.writeFileSync(changelogPath, updatedChangelogContent);
