#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'

const [, , version] = process.argv
if (!version) {
  console.error('Usage: set-lib-version.mjs <version>')
  process.exit(1)
}

const path = 'projects/ngx-translate-routes/package.json'
const pkg = JSON.parse(readFileSync(path, 'utf8'))
pkg.version = version
writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`)
