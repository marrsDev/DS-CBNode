// routes/api/calculationRoutes.js
console.log("▶ calculationRoutes module loaded");

const express = require('express');
const router = express.Router();
const CalculationService = require('../../services/CalculationService');
const calculationController = require('../../controllers/calculationController');
console.log("▶ calculationRoutes router creation OK:", typeof router);


router.post('/window', async (req, res) => {
  console.log("▶ calculationRoutes POST / reached with body:", req.body);
  try {
    const { height, width, noOfPanels, fixedPartition } = req.body;
    
    // Calculate cost and get components
    const result = await CalculationService.calculateWindow({
      height,
      width,
      noOfPanels,
      fixedPartition
    });

    // Determine image name based on configuration
    const imageName = CalculationService.getPreviewImageName({
      noOfPanels,
      fixedPartition
    });

    res.json({
      success: true,
      total: result.total,
      components: result.components,
      previewImage: `/img/types/${imageName}.png` // Return image path
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
});



module.exports = router;