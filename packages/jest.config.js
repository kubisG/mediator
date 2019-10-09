const { defaults } = require("jest-config");

// module.exports = {
//     verbose: true,
//     moduleFileExtensions: [
//         "js",
//         "json",
//         "ts",
//     ],
//     coverageThreshold: {
//         global: {
//             "branches": 1,
//             "functions": 1,
//             "lines": 1,
//             "statements": 1,
//         },
//     },
//     rootDir: "./",
//     testRegex: "(/tests/suites/.*|\\.(test|spec))\\.ts$",
//     transform: {
//         "^.+\\.(t|j)s$": "ts-jest",
//     },
//     coverageDirectory: "./coverage",
//     collectCoverage: true,
//     collectCoverageFrom: [
//         "src/**/*.ts",
//         "src/*.ts",
//         "!src/**/*.d.ts",
//         "!**/node_modules/**",
//         "!src/**/*.provider.ts",
//         "!src/**/*.providers.ts",
//         "!src/**/*.module.ts",
//         "!src/**/*.dto.ts",
//         "!src/**/*.interface.ts",
//         "!src/**/*.enum.ts",
//         "!src/**/main.ts",
//         "!src/**/main.hmr.ts",
//     ],
//     coverageReporters: [
//         "json-summary",
//         "lcov",
//         "text",
//     ],
// };

module.exports = {
    moduleFileExtensions: [
        "js",
        "json",
        "ts",
    ],
    transform: {
        "^.+\\.(ts|html)$": "ts-jest",
        "^.+\\.js$": "babel-jest"
    },
    rootDir: "./",
    testRegex: "(/tests/suites/.*|\\.(test|spec))\\.ts$",
    coverageDirectory: "./coverage",
    coverageReporters: [
        "json",
        "json-summary",
        "html",
        "lcov",
        "text"
    ],
    collectCoverageFrom: [
        "src/**/*.ts",
        "src/*.ts",
        "!src/**/*.d.ts",
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
    snapshotSerializers: [
        "<rootDir>/../../node_modules/jest-preset-angular/AngularSnapshotSerializer.js",
        "<rootDir>/../../node_modules/jest-preset-angular/HTMLCommentSerializer.js"
    ],
    modulePaths: [
        "<rootDir>/../../dist",
        "<rootDir>/../../node_modules"
    ],
    verbose: true
}
