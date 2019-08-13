const { defaults } = require("jest-config");

module.exports = {
    verbose: true,
    moduleFileExtensions: [
        "js",
        "json",
        "ts",
    ],
    coverageThreshold: {
        global: {
            "branches": 1,
            "functions": 1,
            "lines": 1,
            "statements": 1,
        },
    },
    rootDir: "./",
    testRegex: "(/tests/suites/.*|\\.(test|spec))\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    coverageDirectory: "./coverage",
    collectCoverageFrom: [
        "src/**/*.{ts}",
        "!src/**/*.{d.ts}",
        "!**/node_modules/**",
        "!src/**/*.provider.ts",
        "!src/**/*.providers.ts",
        "!src/**/*.module.ts",
        "!src/**/*.dto.ts",
        "!src/**/*.interface.ts",
        "!src/**/*.enum.ts",
        "!src/**/main.ts",
        "!src/**/main.hmr.ts",
    ],
    coverageReporters: [
        "json-summary",
        "lcov",
        "text",
    ],
};
