// public/js/calculator.js
import apiClient from './api-client.js';

export default class WindowCalculator {
  static async calculate(params) {
    try {
      // Validate inputs
      if (!params?.height || !params?.width) {
        throw new Error('Height and width are required');
      }

      // Parse numeric values
      const height = parseFloat(params.height);
      const width = parseFloat(params.width);

      if (isNaN(height)) throw new Error('Height must be a number');
      if (isNaN(width)) throw new Error('Width must be a number');

      // Call backend API
      const result = await apiClient.calculateWindowCost({
        height,
        width,
        noOfPanels: params.noOfPanels,
        fixedPartition: params.fixedPartition,
        glassType: params.glassType,
        glassThickness: params.glassThickness,
        profileColour: params.profileColour
      });

      return {
        success: true,
        cost: result.total,
        components: result.components
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Calculation failed'
      };
    }
  }

}