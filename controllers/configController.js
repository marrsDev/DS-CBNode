// controllers/configController.js
const PricingService = require('../services/PricingService');
const { validationResult } = require('express-validator');

module.exports = {
  /**
   * Updates profile configuration (matches config.js updateProfileConfig)
   * POST /api/config/profile
   * Body: { color: string }
   */
  updateProfileConfig: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { color } = req.body;
      const validColors = ['white', 'silver', 'brown', 'black', 'grey', 'champagne'];
      
      if (!validColors.includes(color)) {
        return res.status(400).json({ 
          error: `Invalid color. Valid options are: ${validColors.join(', ')}` 
        });
      }

      const updatedConfig = await PricingService.updateProfileConfig(color);
      res.json({
        message: 'Profile configuration updated successfully',
        config: updatedConfig
      });
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to update profile config',
        details: err.message 
      });
    }
  },

  /**
   * Gets glass price (matches config.js updateGlassConfig)
   * GET /api/config/glass-price?type=clear&thickness=5mm
   */
  getGlassPrice: async (req, res) => {
    try {
      const { type, thickness } = req.query;
      
      if (!type || !thickness) {
        return res.status(400).json({
          error: 'Both type and thickness parameters are required'
        });
      }

      const price = await PricingService.updateGlassConfig(type, thickness);
      res.json({ 
        glassType: type,
        thickness,
        price
      });
    } catch (err) {
      res.status(400).json({
        error: 'Invalid glass configuration',
        details: err.message
      });
    }
  },

  /**
   * Gets current full configuration 
   * GET /api/config
   */
  getConfig: async (req, res) => {
    try {
      // PricingService maintains the live config state
      res.json(PricingService.config);
    } catch (err) {
      res.status(500).json({
        error: 'Failed to retrieve configuration',
        details: err.message
      });
    }
  }
};