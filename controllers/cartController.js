const CartService = require('../services/CartService');
const { BadRequestError } = require('../errors');
const { v4: uuidv4 } = require('uuid');

class CartController {
  // Get cart contents
  async getCart(req, res, next) {
    try {
      const cart = await CartService.getCartSummary(req.cartId);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  // Add item to cart
  async addToCart(req, res, next) {
    try {
      const { 
        windowType, 
        measurements, 
        glassType, 
        glassThickness, 
        profileColour,
        quantity = 1 
      } = req.body;

      if (!windowType || !measurements || !glassType || !glassThickness || !profileColour) {
        throw new BadRequestError('Missing required fields');
      }

      if (!measurements.height || !measurements.width) {
        throw new BadRequestError('Height and width are required');
      }

      const cart = await CartService.addToCart(
        req.cartId,
        windowType,
        measurements,
        glassType,
        glassThickness,
        profileColour,
        quantity
      );

      res.status(201).json(cart);
    } catch (error) {
      next(error);
    }
  }

  // Update item quantity
  async updateQuantity(req, res, next) {
    try {
      const { itemId } = req.params;
      const { delta } = req.body;

      if (delta === undefined || delta === null) {
        throw new BadRequestError('Delta value is required');
      }

      const cart = await CartService.adjustQuantity(req.cartId, itemId, delta);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  // Remove item from cart
  async removeItem(req, res, next) {
    try {
      const { itemId } = req.params;
      const cart = await CartService.removeFromCart(req.cartId, itemId);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  // Clear entire cart
  async clearCart(req, res, next) {
    try {
      const result = await CartService.clearCart(req.cartId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Start new cart (optional)
  async startNewCart(req, res, next) {
    try {
      // Clear existing cart
      await CartService.clearCart(req.cartId);
      
      // Generate new cart ID
      const newCartId = uuidv4();
      res.cookie('cartId', newCartId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      
      res.json({ message: 'New cart created', cartId: newCartId });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();