FlowCheck — Inventory Management API

FlowCheck is a backend inventory management system built with Node.js, Express.js, and MongoDB. It provides RESTful APIs for managing products, categories, suppliers, inventory transactions, sales, and reports.

The project focuses on building a structured backend application with authentication, data validation, API documentation, rate limiting, and email notifications.

Features

Authentication and User Management

- User authentication and account management.
- Password hashing for secure credential storage.
- JWT-based authentication.
- Access and refresh token handling.
- OTP verification.
- Password reset functionality.
- Email notifications for relevant account activities.

Inventory Management

- Create, retrieve, update, and delete product records.
- Organize products into categories.
- Manage supplier information.
- Record inventory transactions.
- Track sales.
- Generate inventory and sales reports.

Validation and Error Handling

- Request validation using Zod.
- Centralized error-handling middleware.
- Middleware for handling unmatched routes.
- Consistent API error responses.

API Security

- Password hashing using bcrypt.
- JWT-based authentication.
- Rate limiting to help protect the API against excessive requests.
- Cookie handling for token-related operations.

Email Notifications

Email delivery is integrated with Zindua to support application email workflows, including OTP verification, password resets, login notifications, and user welcome emails.

API Documentation

- Interactive API documentation using Swagger UI.
- OpenAPI specification generated with swagger-jsdoc.

Tech Stack

Technology| Purpose
Node.js| JavaScript runtime
Express.js| Backend framework
MongoDB| Database
Mongoose| MongoDB object modelling
JavaScript (ES Modules)| Application development
JSON Web Tokens (JWT)| Authentication
bcrypt| Password hashing
Zod| Request validation
express-rate-limit| Rate limiting
Zindua| Email delivery
Swagger UI Express| Interactive API documentation
swagger-jsdoc| OpenAPI documentation generation
cookie-parser| Cookie parsing
CORS| Cross-origin resource sharing
Morgan| HTTP request logging
dotenv| Environment variable management
Nodemon| Development server restarts

Project Structure

The project follows a modular structure that separates routes, controllers, services, models, middleware, configuration, validation, and utility functions.

FlowCheck/
├── config/          # Application and database configuration
├── controller/      # Request handlers
├── middleware/      # Authentication, rate limiting and error handling
├── models/          # Database models
├── routes/          # API route definitions
├── services/        # Business logic and service functions
├── utils/           # Reusable utility functions
├── validators/      # Request validation schemas
├── app.js           # Application entry point
├── package.json     # Project metadata and dependencies
├── package-lock.json
└── README.md

Getting Started

Follow these steps to run FlowCheck locally.

Prerequisites

Make sure you have the following installed or available:

- "Node.js" (https://nodejs.org/)
- npm, which is included with Node.js
- A MongoDB database, either local or hosted
- A Zindua API key for email functionality

1. Clone the Repository

git clone https://github.com/ayomideaccess/FlowCheck.git

2. Navigate to the Project Directory

cd FlowCheck

3. Install Dependencies

npm install

4. Configure Environment Variables

Create a ".env" file in the project root directory.

Add the environment variables required by your application:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ZINDUA_API_KEY=your_zindua_api_key
APP_URL=your_application_url

Important: Confirm the exact environment variable names used in your database configuration, authentication code, and email service before running the application. If your code uses a different MongoDB variable name or additional variables, use the names expected by your code.

Replace each placeholder with the appropriate value. Never commit your actual credentials, API keys, database connection strings, or token secrets to GitHub.

5. Start the Application

To start the application normally:

npm start

To run the application in development mode with Nodemon:

npm run dev

By default, the application is configured to use port "5000" when "PORT" is not specified.

Once the server starts successfully, the API should be available at:

http://localhost:5000

API Documentation

FlowCheck uses Swagger UI to provide interactive API documentation.

After starting the server, visit:

http://localhost:5000/api-docs

The documentation allows you to explore the available endpoints and inspect their request and response specifications.

For protected endpoints, provide the required authentication credentials according to the endpoint's authentication requirements.

API Route Groups

The application organizes its endpoints into the following route groups:

Route Group| Base Path| Purpose
Authentication| "/auth"| Authentication and account-related operations
Users| "/"| User management
Categories| "/"| Category management
Products| "/products"| Product management
Suppliers| "/suppliers"| Supplier management
Inventory Transactions| "/transactions"| Inventory transaction management
Sales| "/sales"| Sales operations
Reports| "/reports"| Reporting functionality
API Documentation| "/api-docs"| Swagger UI

Note: The final endpoint paths depend on the routes defined within each router. Refer to the Swagger documentation for the available endpoints and their required parameters.

Error Handling and Validation

FlowCheck uses Zod to validate incoming data and middleware to handle errors centrally.

These mechanisms help maintain consistent request validation and error handling across the application.

Security Considerations

Security-related measures implemented in the project include:

- Password hashing with bcrypt.
- JWT-based authentication.
- Rate limiting for incoming requests.
- Cookie parsing for cookie-based authentication flows.
- Input validation using Zod.
- Environment variables for sensitive configuration.

These measures contribute to a more secure API, but they do not replace a comprehensive security review.

Testing

Automated testing with Vitest and Supertest is planned as part of the project's ongoing improvement work.

The test suite and test execution commands will be documented here once they have been implemented and verified.

Future Improvements

Potential improvements to the project include:

- Automated unit and integration tests.
- Expanded API documentation.
- Additional validation and error-handling coverage.
- Further security and performance improvements.
- Additional reporting and inventory-management capabilities.

Author

Ayomide Akinniyi

- GitHub: "@ayomideaccess" (https://github.com/ayomideaccess)

License

This project currently uses the ISC license declared in its "package.json".