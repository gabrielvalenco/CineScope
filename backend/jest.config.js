module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  verbose: true
};
