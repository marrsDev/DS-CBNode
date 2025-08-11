// public/js/api-client.js
class ApiClient {
  static BASE_URL = '/api';

  static async getConfig() {
    const response = await fetch(`${this.BASE_URL}/config`);
    return this._handleResponse(response);
  }

  static async updateProfileConfig(color) {
    const response = await fetch(`${this.BASE_URL}/config/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color })
    });
    return this._handleResponse(response);
  }

  static async getGlassPrice(type, thickness) {
    const response = await fetch(
      `${this.BASE_URL}/config/glass-price?type=${type}&thickness=${thickness}`
    );
    return this._handleResponse(response);
  }

  static async calculateWindow(params) {
    const response = await fetch(`${this.BASE_URL}/calculation/window`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return this._handleResponse(response);
  }

  // Cart methods
  static async getCart() {
    const response = await fetch(`${this.BASE_URL}/cart`);
    return this._handleResponse(response);
  }

  static async addToCart(item) {
    const response = await fetch(`${this.BASE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return this._handleResponse(response);
  }

  static async updateQuantity(itemId, delta) {
    const response = await fetch(`${this.BASE_URL}/cart/${itemId}/quantity`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta })
    });
    return this._handleResponse(response);
  }

  static async removeItem(itemId) {
    const response = await fetch(`${this.BASE_URL}/cart/${itemId}`, {
      method: 'DELETE'
    });
    return this._handleResponse(response);
  }

  static async clearCart() {
    const response = await fetch(`${this.BASE_URL}/cart`, {
      method: 'DELETE'
    });
    return this._handleResponse(response);
  }

  static async _handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  }

  static async calculateWindowCost(params) {
    const response = await fetch(`${this.BASE_URL}/calculation/window`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return this._handleResponse(response);
  }

  static async getCurrentConfig() {
    const response = await fetch(`${this.BASE_URL}/config`);
    return this._handleResponse(response);
  }
}

// Export an instance instead of the class
export default new ApiClient();