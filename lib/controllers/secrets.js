const { Router } = require('express');
const Secret = require('../models/Secret');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      res.send(await Secret.getAll());
    } catch (error) {
      next(error);
    }
  });
