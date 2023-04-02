import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  collectCoverage: false,
  verbose: true,
  rootDir: './src',
  testMatch: ['**/__tests__/**/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
};

export default config