const mongoose = require('mongoose');

const windowMeasurementsSchema = new mongoose.Schema({
  height: { type: Number, required: true, min: 100, max: 9999 },
  width: { type: Number, required: true, min: 100, max: 9999 }
}, { _id: false });

const windowComponentsSchema = new mongoose.Schema({
  // ... (all component fields remain unchanged)
}, { _id: false });

const windowConfigSchema = new mongoose.Schema({
  cartId: { type: String, required: true, index: true },
  type: { type: String, required: true, enum: ['type1', /* ... */ 'type19'] },
  measurements: { type: windowMeasurementsSchema, required: true },
  glassType: { type: String, required: true, enum: ['clear', /* ... */ 'nashiji'] },
  glassThickness: { type: String, required: true, enum: ['4mm', /* ... */ '10mmTuff'] },
  profileColour: { type: String, required: true, enum: ['white', /* ... */ 'grey'] },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  unitPrice: { type: Number, required: true },
  components: { type: windowComponentsSchema, required: true },
  isActive: { type: Boolean, default: true },
  addedToCartAt: { type: Date, default: Date.now }
});

// Indexes
windowConfigSchema.index({ cartId: 1, isActive: 1 });
windowConfigSchema.index({ 
  cartId: 1, 
  type: 1, 
  'measurements.height': 1, 
  'measurements.width': 1,
  glassType: 1,
  glassThickness: 1,
  profileColour: 1,
  isActive: 1
});

// Static Methods
windowConfigSchema.statics = {
  async findActiveCart(cartId) {
    return this.find({ cartId, isActive: true }).sort({ addedToCartAt: -1 }).lean();
  },

  async clearCart(cartId) {
    return this.updateMany(
      { cartId, isActive: true },
      { $set: { isActive: false } }
    );
  },

  async calculateCartTotals(cartId) {
    const items = await this.find({ cartId, isActive: true }).lean();
    return items.reduce((totals, item) => {
      totals.grandTotal += item.unitPrice * item.quantity;
      totals.totalItems += item.quantity;
      Object.entries(item.components).forEach(([key, value]) => {
        if (typeof value === 'number') {
          totals.components[key] = (totals.components[key] || 0) + (value * item.quantity);
        }
      });
      return totals;
    }, { grandTotal: 0, totalItems: 0, components: {} });
  }
};

module.exports = mongoose.model('WindowConfig', windowConfigSchema);