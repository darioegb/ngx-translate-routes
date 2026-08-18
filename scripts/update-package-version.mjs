import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { inc, valid, clean } from 'semver'

const packageJsonPath = 'projects/ngx-translate-routes/package.json'
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

// GITHUB_REF_NAME is set to the tag name (e.g. "v2.4.0") on release events
const releaseTag = process.env.GITHUB_REF_NAME
const tagVersion = releaseTag ? clean(releaseTag) : null

if (tagVersion && valid(tagVersion)) {
  packageJson.version = tagVersion
} else {
  // Fallback: infer bump type from the most recent non-squash merge commit
  const currentVersion = packageJson.version
  const commitMessage = execSync('git log --format=%s -1').toString().trim()

  let releaseType = 'patch'
  if (/\bBREAKING CHANGE\b/.test(commitMessage)) {
    releaseType = 'major'
  } else if (/^feat/.test(commitMessage)) {
    releaseType = 'minor'
  }

  packageJson.version = inc(currentVersion, releaseType)
}

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
