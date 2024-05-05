const express = require('express');

const authentication = require('./components/authentication/authentication-route');
// const users = require('./components/users/users-route');
const bank = require('../api/bank/components/users/users-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  // users(app);
  bank(app);

  return app;
};
