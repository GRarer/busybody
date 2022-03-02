# Busybody

Busybody is a prototype social todo list application currently being developed by Grace Rarer as her semester-long
project for CS 4365 (Intro to Enterprise Computing) at Georgia Tech.

Busybody is designed around the idea that social reinforcement makes it easier to meet our self-imposed goals.
Users will be able to designate their friends as "watchers" for particular tasks, and their watchers will be notified by
email if the task is not completed on time.

## Local Installation and Setup

To install and run a local development version of Busybody, follow these instructions.

### Source Code

You can fork or download the source code from https://github.com/GRarer/busybody

### Dependencies

This project consists of three NPM packages. `/core` is a dependency for both `/server` (NodeJS back-end) and `/app`
(React front-end). Run `npm ci` in each of these directories to install the dependencies, and run `npm run build` in
`/core` before compiling the front-end and back-end.

You will also need to install PostgreSQL (version 11 or higher). On some platforms you might have to manually add the
Postgres `psql` program to your PATH.

### Database initialization

Run `dbinit.sql` to initialize the database tables and populate them with example data. To be able to log
in as the example users, you will have to change `example_password_hash` to a bcrypt hash corresponding to a password
you know.

### Server environment variables

The server is configured with many environment variables, so it's helpful to create a `.env` file in the `/server`
directory. This file will contain your secret passwords, so you should not commit it to version control.

```sh
# port number for Fastify web server
BB_PORT = "3001"
# setting local test mode to "true" enables special API endpoints for local testing.
# DO NOT ENABLE THIS IN PRODUCTION.
BB_LOCAL_TEST_MODE = "false"
# database configuration
BB_DB_HOST = "localhost" # or use the host and port of your cloud database provider
BB_DB_PORT = "5432"
BB_DB_DATABASE = "busybody"
BB_DB_USER = "postgres"
BB_DB_PASSWORD = "your_postgres_superuser_password"
# email configuration
BB_EMAIL_FROM = '"Busybody Example" <busybody@example.com>'
BB_MAIL_ETHEREAL = "true"
# configuration for ethereal.mail for debugging email behavior
BB_MAIL_ETHEREAL_ADDRESS = "randomly_generated_fake_address@ethereal.email"
BB_MAIL_ETHEREAL_PASSWORD = "randomly_generated_password"
# configuration for live email service
BB_MAIL_LIVE_SERVICE = "service_name" # see https://nodemailer.com/smtp/well-known/
BB_MAIL_LIVE_USERNAME = "your_email_username"
BB_MAIL_LIVE_PASSWORD = "your_email_password"
# link to app used in emails
BB_APP_URL = "http://localhost:3000/" # or your production web-app URL
```
### Running locally

To build and run the application server locally, go to `/server` and run `npm start`. Similarly, to build and run
the web app locally, go to `/app` and run `npm start`; the app will be served on `localhost:3000/`.
