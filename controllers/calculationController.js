// controllers/calculationController.js
const CalculationService = require('../services/CalculationService');
const { body, validationResult } = require('express-validator');

module.exports = {
  calculateWindow: [
    body('height').isFloat({ min: 100 }),
    body('width').isFloat({ min: 100 }),
    body('noOfPanels').optional().isIn(['2', '3', '4']),
    body('fixedPartition').optional().isIn([
      'noPartition', 'doubleFixed', 'fixedTop', 
      'fixedBottom', 'openAbleTopFxBtm'
    ]),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const result = await CalculationService.calculateWindowCost(req.body);
        res.json(result);
      } catch (err) {
        res.status(400).json({ 
          error: err.message,
          details: err.stack 
        });
      }
    }
  ]
};