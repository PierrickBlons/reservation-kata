/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types='vitest/config' />

// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
})
