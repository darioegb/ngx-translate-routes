import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const packageJson = require('../projects/ngx-translate-routes/package.json')
const versionsConfig = require('../config/versions.json')

const newVersion = packageJson.version
const angularVersion = versionsConfig.angularCompatibility

// README uses the short "ngx-translate" header, the docs site uses the full package name.
const readmeTableHeader =
  /(\| ngx-translate \| Angular\s+\|\n\| ------------- \| ------------ \|\n)/
const introTableHeader =
  /(\| ngx-translate-routes \| Angular\s*\|\n\|[-\s]+\|[-\s]+\|\n)/

function addCompatibilityRow(filePath, tableHeader, angularRange, columnWidth) {
  if (!existsSync(filePath)) {
    return
  }
  const content = readFileSync(filePath, 'utf8')
  if (content.includes(`| ${newVersion} `)) {
    return
  }
  const updatedContent = content.replace(
    tableHeader,
    `$1| ${newVersion.padEnd(columnWidth)} | ${angularRange} |\n`,
  )
  writeFileSync(filePath, updatedContent)
}

addCompatibilityRow('./README.md', readmeTableHeader, angularVersion, 13)
addCompatibilityRow(
  './docs/docs/intro.md',
  introTableHeader,
  angularVersion,
  20,
)
// Keep the Spanish docs table in sync too, translating "to" -> "a".
addCompatibilityRow(
  './docs/i18n/es/docusaurus-plugin-content-docs/current/intro.md',
  introTableHeader,
  angularVersion.replace(' to ', ' a '),
  20,
)
