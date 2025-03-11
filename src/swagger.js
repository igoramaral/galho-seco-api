const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const version = packageJson.version;

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Galho Seco API',
      version: version,
      description: 'This is an API capable of supporting the functionalities of Galho Seco, a D&D character sheet manager app for mobile devices.',
      license: {
        name: 'Licensed under MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'Igor Amaral',
        url: 'https://www.github.com/igoramaral'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'development server'
      }
    ],
    tags: [
      { name: "Auth", description: "Authentication Route" },
      { name: "User", description: "User Management Routes" },
      { name: "Character", description: "Character Management Routes" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    }
  };
  
  const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, '/routes/*.js')]
  };



const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;