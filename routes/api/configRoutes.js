// routes/api/configRoutes.js
const express = require('express');
const { body } = require('express-validator');
const configController = require('../../controllers/configController');

const router = express.Router();

router.get('/', configController.getConfig);

router.post(
  '/profile',
  body('color').isString().trim().notEmpty(),
  configController.updateProfileConfig
);

router.get('/glass-price', configController.getGlassPrice);

module.exports = router;