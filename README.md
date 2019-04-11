
# Bankr

[![Build Status](https://travis-ci.org/codeBlock-1984/bankr.svg?branch=develop)](https://travis-ci.org/codeBlock-1984/bankr)
[![Maintainability](https://api.codeclimate.com/v1/badges/4c637367f4e0eec66193/maintainability)](https://codeclimate.com/github/codeBlock-1984/bankr/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/codeBlock-1984/bankr/badge.svg?branch=develop)](https://coveralls.io/github/codeBlock-1984/bankr?branch=develop)

Secure online banking application. Easy to use, efficient, fast.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this application, you will need to have the latest versions of the following software installed on your system

* [NPM](https://www.npmjs.com/)
* [Node](https://nodejs.org)
* [Git](https://git-scm.com/)

### Running the app locally

Follow the steps below to get the development environment running locally

1. Clone the repo to your local machine

- On your local computer, open your terminal and navigate to the directory you want the repo to reside in
- Run the following command to clone the repo to your machine
```
    git clone https://github.com/codeBlock-1984/bankr.git
```
- Next, navigate into the project root directory and run the following command to install project dependencies
```
    npm install
```

## Running the tests

To run the automated tests, navigate to the project root directory and run the following command in your terminal
```
    npm test
```

## Built With

The following core packages where used in building this application

* [Express](https://expressjs.com/) - The web framework used
* [Babel](https://babeljs.io/) - Javascript transpiler
* [Express-validator](https://express-validator.github.io/docs/) - Middleware used for request validation and sanitization
* [Bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing function
* [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Used for generating and verify tokens for authentication and authorization
* [Body-parser](https://www.npmjs.com/package/body-parser) - Middleware for parsing request body
* [Mocha](https://mochajs.org/) - Test framework
* [Chai](https://www.chaijs.com/) - Assertion library used for tests
* [Eslint](https://eslint.org/) - Javascript linting utility

## Core features

**Users**

There are three types of users, namely: client, staff, and admin.

- **Client** - A normal user, with basic access and privileges
- **Staff** - A cashier. Has more more privileges than normal user
- **Admin** - The system administrator. Has superuser privileges

The main features of this application with respect to the various users are listed below.

#### A Client can do the following:

- Sign up with the application  
- Sign in with already created user account details  
- Create a bank account  
- View account profile  
- View transaction history

#### A Staff can do the following:

- Credit a client's bank account  
- Debit a client's bank account  
- View list of all client bank accounts  
- View a specific client's bank account  
- Delete a specific bank account  

#### An Admin can do the following:
- Create an admin or staff user account  
- Activate/deactivate user account  
- View list of all client bank accounts  
- View a specific client's bank account record 
- Delete a specific bank account

## Related links

* [User Interface](https://codeblock-1984.github.io/bankr/) - The UI of this application can be accessed here
* [Documentation](https://bankr-server.herokuapp.com/api-docs/) - The documentation can be accessed here

## Author

* **Emmanuel Ihemegbulam**


## License

This project is licensed under the ISC License
