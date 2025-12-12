import { useState } from 'react';
import { createWorker } from 'tesseract.js';

export const useOCR = () => {
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrResults, setOcrResults] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

  const preprocessImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Aumentar tamanho para melhor qualidade do OCR
        const scale = 3;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Converter para escala de cinza e aumentar contraste
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          const contrast = (gray - 128) * 1.5 + 128;
          const brightness = Math.min(255, Math.max(0, contrast + 20));
          
          data[i] = brightness;
          data[i + 1] = brightness;
          data[i + 2] = brightness;
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        canvas.toBlob(resolve, 'image/png');
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  const processReceiptOCR = async (file) => {
    setIsProcessingOCR(true);
    setOcrResults(null);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      setReceiptPreview(e.target.result);
      setReceiptImage(file);

      try {
        const processedBlob = await preprocessImage(e.target.result);
        const worker = await createWorker('por');
        
        await worker.setParameters({
          tessedit_char_whitelist: '0123456789R$ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÁÉÍÓÚáéíóúÂÊÔâêôÀàÇçÃÕãõ.,/:- ',
          tessedit_pageseg_mode: '6',
          tessedit_ocr_engine_mode: '1'
        });
        
        const { data: { text, confidence } } = await worker.recognize(processedBlob || file);
        
        await worker.terminate();
        setIsProcessingOCR(false);
        
        return { text, confidence };
      } catch (error) {
        console.error('Erro ao processar OCR:', error);
        setIsProcessingOCR(false);
        throw error;
      }
    };
    reader.readAsDataURL(file);
  };

  return {
    isProcessingOCR,
    ocrResults,
    setOcrResults,
    receiptImage,
    setReceiptImage,
    receiptPreview,
    setReceiptPreview,
    processReceiptOCR
  };
};

