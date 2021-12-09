module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  coverageReporters: ['html'],
  moduleFileExtensions: ['ts', 'js'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['./setup-jest.js'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': './src/__mocks__/styleMock.js'
  }
};
