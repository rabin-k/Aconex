module.exports = {
    verbose: true,
    moduleFileExtensions: ['js', 'ts'],
    rootDir: 'src',
    testRegex: '.int.spec.(j|t)s$',
    testEnvironment: 'node',
    testTimeout: 10000,
    preset: 'ts-jest',
    coverageReporters: ["lcov", { "projectRoot": __dirname }],
    coverageDirectory: "../coverage/"
};
