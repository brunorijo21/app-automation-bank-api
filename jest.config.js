module.exports = {
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    testMatch: ['**/tests/**/*.test.js'],
    reporters: [
        'default',
        ['jest-html-reporter', {
            outputPath: './reports/test-report.html',
            pageTitle: 'Relatório de Testes'
        }]
    ]
};
