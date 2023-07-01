module.exports = {
    verbose: true,
    moduleFileExtensions: ['js', 'ts'],
    rootDir: 'src',
    testRegex: '.spec.(j|t)s$',
    testEnvironment: 'node',
    preset: 'ts-jest',
    coverageReporters: ["lcov", { "projectRoot": __dirname }],
    coverageDirectory: "../coverage/"
};
