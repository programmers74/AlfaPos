const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hotel Management System API',
            version: '1.0.0',
            description: 'Offline HMS with Hardware Security',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
    apis: ['./routes/*.js'], // Routes files jahan documentation likhi hogi
};

module.exports = swaggerJsdoc(options);