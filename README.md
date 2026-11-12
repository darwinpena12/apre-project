# APRE - Advanced Project Reporting Environment

## Project Overview

The APRE (Advanced Project Reporting Environment) application provides reporting features that help users review and analyze sales data.

This project implements task M-071, Sales by Time Period, which allows users to select a start date and an end date to retrieve sales information within a specified period. The results are grouped by day and displayed in a bar chart showing the total sales for each date.

It also includes task M-087, Agent Performance by Region, which retrieves agent performance data grouped by region and displays the average performance for each region in a bar chart.

## M-071 - Sales by Time Period

Implementation Assumptions

Users select an inclusive start and end date.

Sales are grouped by day and totaled using the amount field.

Results are displayed chronologically in a bar chart.

Dates without sales are excluded.

UTC is used for consistent date grouping.

The backend endpoint is GET /api/reports/sales/by-time-period.

## M-087 - Agent Performance by Region

Added a report that retrieves agent performance data grouped by region and displays the average performance for each region in a bar chart.

### Implementation Details

Retrieves data from the agentPerformance MongoDB collection.

Groups performance records using the region field.

Calculates the average of the performance metric values for each region.

Sorts the results alphabetically by region.

Displays the results using the shared ChartComponent.

Added a navigation link under Agent Performance Reports.

### Backend Endpoint

GET /api/reports/agent-performance/by-region

### Unit Testing

Added three backend unit tests covering successful results, empty results, and database errors.

Added three Angular unit tests covering component creation, report title, and retrieval and display of regional performance data.

# Additional Improvements

## M-030 - Sign-In Submit Button Tooltip

Added a tooltip to the SigninComponent submit button to clarify its purpose when users hover over it.

Implementation Details

Added the HTML title attribute with the text "Click to sign in" to the Submit button.

Added a code comment explaining the change.

Updated apre-client/src/app/security/signin/signin.component.ts.

Unit Testing

Added a unit test in apre-client/src/app/security/signin/signin.component.spec.ts to verify that the submit button displays the expected tooltip text.

Verified that the tooltip attribute contains "Click to sign in".

GitHub Commit: 17e79be

## M-042 - Ajv Sign-In API Validation

Added Ajv validation to the Sign-In API to verify incoming request data before accessing the database.

Implementation Details

Created a JSON validation schema in apre-server/src/schemas.js.

Added validation for the required username and password fields, including password format requirements.

Integrated Ajv into apre-server/src/routes/security/index.js to reject invalid requests with an HTTP 400 response before accessing MongoDB.

Backend Endpoint

POST /api/security/signin

Before: The original Sign-In route did not validate the request body before accessing the database.

After: The updated route validates the request body using Ajv and rejects invalid data before database operations.

Unit Testing

Added four backend unit tests in apre-server/test/routes/security/index.spec.js covering missing usernames, invalid password formats, successful authentication, and incorrect passwords.

All four Sign-In API tests passed successfully. The complete backend test suite also passed, with all 35 tests across seven test suites.

GitHub Commit: 7a1da78

## M-054 - Table Pagination Indicator

Updated the shared TableComponent pagination section to display both the current page number and the total number of available pages.

Before: The pagination indicator displayed only the current page number.

After: The pagination indicator displays "Page X of Y" and dynamically updates when navigating between pages.

Modified file: apre-client/src/app/shared/table/table.component.ts

## Installation and Setup

The APRE project consists of two separate applications: an Angular client and a Node.js/Express server.

1. Install Dependencies

Open a terminal in each project directory and run:

npm install

2. Start the Server

From the apre-server directory:

npm start

3. Start the Client

From the apre-client directory, open a separate terminal and run:

npm start

The Angular application will be available at http://localhost:4200/.

## Testing

### Backend Tests

From the apre-server directory:

npm test -- --runInBand

### Frontend Tests

From the apre-client directory:

npm test -- --watch=false

## Build the Client

From the apre-client directory:

npm run build

## Database Configuration

The server requires a valid MongoDB connection string to connect to the APRE database. Configure the connection in the server configuration before running the application. Keep database credentials secure and do not commit sensitive connection information to the repository.