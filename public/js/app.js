// public/js/app.js
import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js';
import WindowCalculator from './calculator.js';
import apiClient from './api-client.js';
import previewService from './previewService.js';

console.log("✅ app.js loaded");

document.addEventListener('alpine:init', () => {
  console.log("✅ alpine:init fired");

  Alpine.data('windowCalculator', () => ({
    // --- Alpine state (all form fields bound via x-model in index.html) ---
    width: '',
    height: '',
    noOfPanels: '',
    fixedPartition: '',
    glassType: '',
    glassThickness: '',
    profileColour: '',
    material: '',

    // --- UI state ---
    isLoading: false,
    error: null,
    result: null,

    init() {
      console.log("✅ Alpine component initialized");
    },

    async start() {
      console.log("▶️ start() called with:", {
        width: this.width,
        height: this.height,
        material: this.material,
      });

      this.isLoading = true;
      this.error = null;
      this.result = null;

      try {
        // ✅ Gather params directly from reactive Alpine state
        const params = {
          height: this.height,
          width: this.width,
          noOfPanels: this.noOfPanels,
          fixedPartition: this.fixedPartition,
          glassType: this.glassType,
          glassThickness: this.glassThickness,
          profileColour: this.profileColour,
          material: this.material,
        };

        // ✅ Delegate calculation logic to WindowCalculator
        const result = await WindowCalculator.calculate(params);
        this.result = result;

        console.log("✅ Calculation result:", result);

        // (Optional) call previewService if needed
        // await previewService.updatePreview(params);

      } catch (err) {
        console.error("❌ start() failed:", err);
        this.error = err.message || 'An unexpected error occurred';
      } finally {
        this.isLoading = false;
      }
    }
  }));
});

window.Alpine = Alpine;
Alpine.start();
