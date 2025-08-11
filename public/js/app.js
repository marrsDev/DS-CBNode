// public/js/app.js
import apiClient from './api-client.js';
import WindowCalculator from './calculator.js';
import previewService from './previewService.js';

document.addEventListener('alpine:init', () => {
  Alpine.data('windowCalculator', () => ({
    cost: 0,
    isLoading: false,
    error: null,

    async init() {
      // Load initial config
      await this.loadConfig();
      // Initialize preview with current values
      this.updatePreview();
    },

    async loadConfig() {
      try {
        const config = await apiClient.getCurrentConfig();
        // You can use this to set default values if needed
      } catch (error) {
        this.error = 'Failed to load configuration';
      }
    },

    // New preview method
    async updatePreview() {
      const noOfPanels = document.getElementById('noOfPanels')?.value;
      const fixedPartition = document.getElementById('fixedPartition')?.value;
      
      if (noOfPanels && fixedPartition) {
        await previewService.updatePreview('sliding', `${noOfPanels}-${fixedPartition}`);
      }
    },

    async calculateCost() {
      this.isLoading = true;
      this.error = null;

      const params = {
        height: document.getElementById('heightId').value,
        width: document.getElementById('widthId').value,
        noOfPanels: document.getElementById('noOfPanels').value,
        fixedPartition: document.getElementById('fixedPartition').value,
        glassType: this.glassType,
        glassThickness: this.glassThickness,
        profileColour: this.profileColour
      };

      
      const result = await WindowCalculator.calculate(params); // Pass params
      
      if (result.success) {
        this.cost = result.cost;
        await this.updatePreview(); // Use the integrated preview method
      } else {
        this.error = result.error;
      }
      
      this.isLoading = false;
      console.log('Calculating with params:', params);
    },

    // Add to cart method
    async addToCart() {
      if (!this.cost || this.cost <= 0) {
        this.error = 'Please calculate cost first';
        return;
      }
      
      try {
        // Get current configuration
        const height = document.getElementById('heightId').value;
        const width = document.getElementById('widthId').value;
        const glassType = document.getElementById('glassType').value;
        const glassThickness = document.getElementById('glassThickness').value;
        const profileColour = document.getElementById('profileColour').value;
        
        // Determine window type based on selections
        const windowType = this.determineWindowType();
        
        await apiClient.addToCart({
          windowType,
          measurements: { height, width },
          glassType,
          glassThickness,
          profileColour,
          unitPrice: this.cost
        });
        
        // Show success message
        this.error = null;
        alert('Added to cart successfully!');
      } catch (error) {
        this.error = error.message;
      }
    }
  }));
});