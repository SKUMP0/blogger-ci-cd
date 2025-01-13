const { defineConfig } = require('cypress');
const codeCoverage = require('@cypress/code-coverage/task');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:6060', // Adjust this URL as needed
        setupNodeEvents(on, config) {
            // Enable code coverage tasks
            codeCoverage(on, config);
            return config;
        },
    },
});
