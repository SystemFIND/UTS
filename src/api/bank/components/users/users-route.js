const express = require('express');

const authenticationMiddleware = require('../../../middlewares/authentication-middleware');
const celebrate = require('../../../../core/celebrate-wrappers');
const usersControllers = require('./users-controller');
const usersValidator = require('./users-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  // Get list of users
  route.get('/', authenticationMiddleware, usersControllers.getUsers);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(usersValidator.createUser),
    usersControllers.createUser
  );

  route.post(
    '/deposit/:id',
    authenticationMiddleware,
    usersControllers.deposit
  );

  // Get user detail
  route.get('/:id', authenticationMiddleware, usersControllers.getUser);

  // Get user balance
  route.get(
    '/:id/balance',
    authenticationMiddleware,
    usersControllers.balanced
  );

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(usersValidator.updateUser),
    usersControllers.updateUser
  );

  // Delete user
  route.delete('/:id', authenticationMiddleware, usersControllers.deleteUser);

  // Change password
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate(usersValidator.changePassword),
    usersControllers.changePassword
  );

  route.post(
    '/:id/change-pin',
    authenticationMiddleware,
    celebrate(usersValidator.changePin),
    usersControllers.changePin
  );
};
