const { Router } = require('express');
const User = require('../models/User');
const UserService = require('../services/UserService');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      res.send(await UserService.createUser(req.body));
    } catch (error) {
      next(error);
    }
  });
