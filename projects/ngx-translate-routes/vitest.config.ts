import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['zone.js/testing'],
  },
})
