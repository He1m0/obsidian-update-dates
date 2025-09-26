// Test setup file for Jest
import 'jest';

// Mock console.log to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toContainDate(date: string): R;
      toHaveHighlightedDate(date: string): R;
    }
  }
}

// Custom matchers for date-related assertions
expect.extend({
  toContainDate(received: string, expectedDate: string) {
    const dateRegex = /\b(20[0-9]{2}|19[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g;
    const dates = received.match(dateRegex) || [];
    const pass = dates.includes(expectedDate);

    return {
      message: () =>
        pass
          ? `Expected ${received} not to contain date ${expectedDate}`
          : `Expected ${received} to contain date ${expectedDate}`,
      pass,
    };
  },

  toHaveHighlightedDate(received: string, expectedDate: string) {
    const highlightedPattern = `==${expectedDate}==`;
    const pass = received.includes(highlightedPattern);

    return {
      message: () =>
        pass
          ? `Expected ${received} not to have highlighted date ${expectedDate}`
          : `Expected ${received} to have highlighted date ${expectedDate}`,
      pass,
    };
  },
});