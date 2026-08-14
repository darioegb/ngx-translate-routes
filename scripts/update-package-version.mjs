import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { inc } from 'semver'

const packageJsonPath = 'projects/ngx-translate-routes/package.json'
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

const currentVersion = packageJson.version

const commitMessage = execSync('git log --merges -1 --pretty=%B')
  .toString()
  .trim()

let releaseType = 'patch'
if (/\bBREAKING CHANGE\b/.test(commitMessage)) {
  releaseType = 'major'
} else if (/\bfeat\b/.test(commitMessage)) {
  releaseType = 'minor'
}

packageJson.version = inc(currentVersion, releaseType)

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
