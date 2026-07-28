import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "FlowCheck API",
            version: "1.0.0",
            description: "API documentation for FlowCheck",
        },
        servers: [
            {
                url: "http://localhost:8000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
            },
        },
        // security: [
        //     {
        //         bearerAuth: [],
        //     },
        // ],
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec }