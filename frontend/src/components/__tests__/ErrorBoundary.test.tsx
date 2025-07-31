import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../ErrorBoundary'
import { ErrorInfo } from 'react'

// Component that throws an error for testing
const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error
beforeEach(() => {
  console.error = jest.fn()
})

afterEach(() => {
  console.error = originalConsoleError
})

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Refresh Page' })).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('logs error when error occurs', () => {
    const consoleSpy = jest.spyOn(console, 'error')

    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error caught by ErrorBoundary:',
      expect.any(Error),
      expect.any(Object)
    )
  })
})