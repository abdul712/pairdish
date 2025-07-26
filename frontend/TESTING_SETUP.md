# Testing Setup Instructions

This document outlines the testing dependencies that need to be installed and the testing setup that has been configured for the PairDish frontend application.

## Required Dependencies

To run the comprehensive test suite, install the following dependencies:

```bash
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest-environment-jsdom \
  playwright \
  @playwright/test
```

## Testing Configuration

### Jest Configuration
- **File**: `jest.config.js`
- **Setup**: `jest.setup.js`
- **Coverage Target**: 80% across all metrics (branches, functions, lines, statements)

### Playwright Configuration
- **File**: `playwright.config.ts`
- **E2E Tests**: Located in `e2e/` directory
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari

## Available Test Scripts

After installing dependencies, use these npm scripts:

```bash
# Unit Tests
npm run test              # Run all unit tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report

# E2E Tests
npm run test:e2e          # Run Playwright E2E tests
npm run test:e2e:ui       # Run E2E tests with UI
npm run playwright:install # Install Playwright browsers
```

## Test Structure

### Unit Tests
- **Location**: `src/components/__tests__/`
- **Coverage**: All React components with image error handling
- **Focus**: Component behavior, error boundaries, image fallbacks

### API Tests
- **Location**: `src/app/sitemap.xml/__tests__/`
- **Coverage**: Sitemap generation with XML escaping security tests
- **Focus**: Security vulnerability prevention, proper XML formatting

### E2E Tests
- **Location**: `e2e/`
- **Coverage**: Navigation, accessibility, error handling
- **Focus**: Real user workflows, responsive design, keyboard navigation

## Security Testing

The test suite includes specific security tests:

1. **XML Injection Prevention**: Tests verify that user-generated content in sitemaps is properly escaped
2. **XSS Protection**: Validates that malicious scripts cannot be injected through slugs
3. **Image Error Handling**: Ensures graceful fallbacks for broken images

## Test Coverage Goals

- **Minimum Coverage**: 80% for all metrics
- **Critical Components**: 100% coverage for security-related functions
- **Error Boundaries**: Complete integration test coverage
- **Image Components**: Full unit test coverage for error handling

## Running Tests

1. Install dependencies (see above)
2. Run `npm run test:coverage` to verify 80%+ coverage
3. Run `npm run test:e2e` for full integration testing
4. Check test reports in `coverage/` and `playwright-report/` directories

## Continuous Integration

Tests are configured to run in CI with:
- Retry logic for flaky tests
- Parallel execution where possible
- Comprehensive browser coverage
- Accessibility testing

All tests must pass before merging to main branch.