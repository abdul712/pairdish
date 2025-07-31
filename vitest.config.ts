import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'miniflare',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'frontend/**',
      'frontend-new/**',
      'scraper/**',
      'test-*.spec.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        'coverage/**',
        'src/**/*.test.ts',
        'src/**/*.spec.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})