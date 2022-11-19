'use strict';

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: [
    "tests/mocks"
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "ts",
  ],
  rootDir: ".",
  testRegex: ".*\\.test\\.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  coverageDirectory: "tests/coverage",
  testEnvironment: "node",
};
