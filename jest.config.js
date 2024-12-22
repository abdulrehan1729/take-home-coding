module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ["js", "ts"],
    testMatch: ["<rootDir>/src/tests/**/*.test.ts"], // Your tests should be in the `tests` folder
    collectCoverage: true,                      // To collect code coverage
    collectCoverageFrom: ["src/**/*.ts"],       // Coverage for your `src` folder
};
