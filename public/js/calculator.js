// public/js/calculator.js
import apiClient from './api-client.js';

// public/js/calculator.js

// ✅ This remains a class — it handles validation + backend API calls
export default class WindowCalculator {
  // Example: validate inputs
  static validate(params) {
    if (!params.width || !params.height) {
      throw new Error("Width and height are required.");
    }
    // Add more validation rules here
  }

  // ✅ API call (async/await stays here)
  static async calculate(params) {
    try {
      // Validate first
      WindowCalculator.validate(params);

      // Make backend API call
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("❌ Calculation error:", err);
      throw err;
    }
  }
}
