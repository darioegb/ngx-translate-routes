const fs = require('fs');
const { execSync } = require('child_process');
const semver = require('semver');
const packageJsonPath = 'projects/ngx-translate-routes/package.json';
const packageJson = require(`../${packageJsonPath}`);

const currentVersion = packageJson.version;

// Get the commit message of the latest commit
const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
let releaseType = 'patch';

if (commitMessage.includes('feat') || commitMessage.includes('feature')) {
  releaseType = 'minor';
} else if (commitMessage.includes('BREAKING CHANGE')) {
  releaseType = 'major';
}

const newVersion = semver.inc(currentVersion, releaseType);

packageJson.version = newVersion;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
