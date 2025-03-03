const fs = require('fs');
const execSync = require('child_process').execSync;

const changelogPath = 'CHANGELOG.md';

const newChangelog = execSync("npx auto-changelog --stdout").toString();

fs.writeFileSync(changelogPath, newChangelog);
