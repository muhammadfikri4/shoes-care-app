export const validateImageAspectRatio = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
  
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const targetRatio = 16 / 9;
        const isValid = Math.abs(aspectRatio - targetRatio) < 0.01; // toleransi kecil
  
        URL.revokeObjectURL(url);
        resolve(isValid);
      };
  
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image."));
      };
  
      img.src = url;
    });
  };