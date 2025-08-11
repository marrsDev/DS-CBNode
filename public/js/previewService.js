// public/js/previewService.js
export default {
  async updatePreview(pageType, configValue) {
    try {
      const response = await fetch(
        `/api/window-preview?windowType=${pageType}&config=${configValue}`
      );
      
      if (!response.ok) throw new Error('Preview fetch failed');
      
      const { imageUrl, typeId } = await response.json();
      
      const imgElement = document.getElementById('img-type');
      if (imgElement) {
        imgElement.src = imageUrl;
        imgElement.onerror = () => {
          imgElement.src = '/img/types/default-window.png';
        };
      }
      
      const typeIdElement = document.getElementById('type-code');
      if (typeIdElement) typeIdElement.textContent = typeId;
      
    } catch (error) {
      console.error('Preview error:', error);
      // Fallback to default preview
      const imgElement = document.getElementById('img-type');
      if (imgElement) imgElement.src = '/img/types/default-window.png';
    }
  }
};