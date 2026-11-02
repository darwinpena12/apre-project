# APRE - Sales by Time Period

## Project Overview

The APRE (Advanced Project Reporting Environment) application provides reporting features that help users review and analyze sales data.

This project implements task M-071, Sales by Time Period, which allows users to select a start date and an end date to retrieve sales information within a specified period. The results are grouped by day and displayed in a bar chart showing the total sales for each date.

## M-071 - Sales by Time Period

Implementation Assumptions

Users select an inclusive start and end date.

Sales are grouped by day and totaled using the amount field.

Results are displayed chronologically in a bar chart.

Dates without sales are excluded.

UTC is used for consistent date grouping.

The backend endpoint is GET /api/reports/sales/by-time-period.

Additional Improvements

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