const WindowConfig = require('../models/WindowConfig');
const CalculationService = require('./CalculationService');
const { NotFoundError, BadRequestError } = require('../errors');

class CartService {
  static typeLabels = {
    type1: 'Sliding window',
    type2: 'Sliding window',
    type3: 'Sliding window',
    type4: 'Sliding window',
    type5: 'Sliding window',
    type6: 'Sliding window',
    type7: 'Sliding window',
    type8: 'Sliding window',
    type9: 'Sliding window',
    type10: 'Sliding window',
    type11: 'Sliding window',
    type12: 'Sliding window',
    type13: 'Top-Hung window',
    type14: 'Top-Hung window',
    type15: 'Projecting - Custom Light Window',
    type16: 'Centre Hung window',
    type17: 'Sliding Awning Top',
    type18: 'Folding - 4 Panels',
    type19: 'Folding - 3 Panels'
  };

  static typeIds = {
    type1: '#sw001',
    type2: '#sw002',
    type3: '#sw003',
    type4: '#sw004',
    type5: '#sw005',
    type6: '#sw006',
    type7: '#sw007',
    type8: '#sw008',
    type9: '#sw009',
    type10: '#sw010',
    type11: '#sw011',
    type12: '#sw012',
    type13: '#th013',
    type14: '#th014',
    type15: '#cw015',
    type16: '#ch016',
    type17: '#sw017',
    type18: '#fd018',
    type19: '#fd019'
  };

  static async addToCart(cartId, windowTypeKey, measurements, glassType, glassThickness, profileColour, quantity = 1) {
    if (!cartId || !windowTypeKey || !measurements || !glassType || !glassThickness || !profileColour) {
      throw new BadRequestError('Missing required fields');
    }

    if (!measurements.height || !measurements.width) {
      throw new BadRequestError('Height and width are required');
    }

    // 1. Get the appropriate calculator for this window type
    const calculator = CalculationService.windowTypes[windowTypeKey];
    if (!calculator) {
      throw new BadRequestError('Invalid window type');
    }

    // 2. Calculate base window components
    const result = calculator.calculate(measurements.height, measurements.width);
    
    // 3. Apply glass pricing
    const glassPrice = await PricingService.updateGlassConfig(glassType, glassThickness);
    const glassCost = result.glass * glassPrice;
    
    // 4. Apply profile color pricing
    await PricingService.updateProfileConfig(profileColour);

    // 5. Calculate totals
    const subtotal = result.totals();
    const installation = result.installation();
    const total = subtotal + installation + glassCost;

    // 6. Prepare components breakdown (existing cart logic expects this format)
    const calculations = {
      total,
      components: {
        ...result,
        glass: glassCost,
        installation
      }
    };

    const existingItem = await WindowConfig.findOne({
      cartId,
      type: windowTypeKey,
      'measurements.height': measurements.height,
      'measurements.width': measurements.width,
      glassType,
      glassThickness,
      profileColour,
      isActive: true
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.unitPrice = calculations.total;
      existingItem.components = calculations.components;
      await existingItem.save();
    } else {
      await WindowConfig.create({
        cartId,
        type: windowTypeKey,
        measurements,
        glassType,
        glassThickness,
        profileColour,
        quantity,
        unitPrice: calculations.total,
        components: calculations.components,
        isActive: true
      });
    }

    return this.getCartSummary(cartId);
  }

  static async removeFromCart(cartId, itemId) {
    const result = await WindowConfig.findOneAndUpdate(
      {
        _id: itemId,
        cartId,
        isActive: true
      },
      {
        $set: { isActive: false, lastModified: new Date() }
      },
      { new: true }
    );

    if (!result) {
      throw new NotFoundError('Cart item not found');
    }

    return this.getCartSummary(cartId);
  }

  static async adjustQuantity(cartId, itemId, delta) {
    const item = await WindowConfig.findOne({
      _id: itemId,
      cartId,
      isActive: true
    });

    if (!item) {
      throw new NotFoundError('Cart item not found');
    }

    item.quantity = Math.max(1, item.quantity + delta);

    const calculations = await CalculationService.calculateWindowPrice(
      item.type,
      item.measurements.height,
      item.measurements.width,
      item.glassType,
      item.glassThickness,
      item.profileColour
    );
    
    item.unitPrice = calculations.total;
    item.components = calculations.components;

    await item.save();
    return this.getCartSummary(cartId);
  }

  static async getCartSummary(cartId) {
    const items = await WindowConfig.find({ cartId, isActive: true }).lean();
    const totals = items.reduce((acc, item) => {
      acc.grandTotal += item.unitPrice * item.quantity;
      acc.totalItems += item.quantity;
      
      Object.entries(item.components).forEach(([key, value]) => {
        acc.components[key] = (acc.components[key] || 0) + (value * item.quantity);
      });
      
      return acc;
    }, { 
      grandTotal: 0, 
      totalItems: 0,
      components: {} 
    });

    return {
      items: items.map(item => ({
        id: item._id,
        type: item.type,
        typeLabel: this.typeLabels[item.type] || item.type,
        typeId: this.typeIds[item.type] || '',
        measurements: item.measurements,
        glassType: item.glassType,
        glassThickness: item.glassThickness,
        profileColour: item.profileColour,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        components: item.components
      })),
      summary: {
        grandTotal: totals.grandTotal,
        totalItems: totals.totalItems,
        componentTotals: totals.components
      }
    };
  }

  static async clearCart(cartId) {
    await WindowConfig.updateMany(
      { cartId, isActive: true },
      { $set: { isActive: false } }
    );
    return { message: 'Cart cleared successfully' };
  }
}

module.exports = CartService;