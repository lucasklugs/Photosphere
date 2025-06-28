const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'y4rbfy',
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // eventos customizados, se necessário
    },
  },
});