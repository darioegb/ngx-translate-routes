import { writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const changelogPath = 'CHANGELOG.md'
const newChangelog = execSync('npx auto-changelog --stdout').toString()

writeFileSync(changelogPath, newChangelog)
