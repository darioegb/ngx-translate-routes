import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const packageJson = require('../projects/ngx-translate-routes/package.json')
const versionsConfig = require('../config/versions.json')

const readmePath = './README.md'
const newVersion = packageJson.version
const angularVersion = versionsConfig.angularCompatibility
const readmeContent = readFileSync(readmePath, 'utf8')

const updatedReadmeContent = readmeContent.replace(
  /(\| ngx-translate \| Angular\s+\|\n\| ------------- \| ------------ \|\n)/,
  `$1| ${newVersion}         | ${angularVersion} |\n`,
)

writeFileSync(readmePath, updatedReadmeContent)
