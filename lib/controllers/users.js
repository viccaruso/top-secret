const { Router } = require('express');
const UserService = require('../services/UserService');
const EIGHT_HOURS_IN_MS = 1000 * 60 * 60 * 8;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      res.send(await UserService.createUser(req.body));
    } catch (error) {
      next(error);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const user = await UserService.signIn(req.body);
      res.cookie(process.env.COOKIE_NAME, user.authToken(), { httpOnly: true, maxAge: EIGHT_HOURS_IN_MS })
        .send({ message: 'Signed in successfully!', user });
    } catch (error) {
      next(error);
    }
  });
