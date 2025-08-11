const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartController');
const cartSession = require('../../middleware/cartSession');

// Apply cart session middleware to all routes
router.use(cartSession);

// Cart routes
router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.patch('/:itemId/quantity', cartController.updateQuantity);
router.delete('/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);
router.post('/new', cartController.startNewCart);

module.exports = router;