import QRCode from 'qrcode';

/**
 * Gera QR Code Pix estático (MVP)
 * Para produção, integrar com gateway de pagamento
 */
export const generatePixQRCode = async (amount, description, orderId) => {
  try {
    // Chave Pix da empresa (configurar no .env)
    const pixKey = process.env.PIX_KEY || 'sua-chave-pix@exemplo.com';
    
    // Para MVP, vamos gerar um QR Code com informações básicas
    // Em produção, use biblioteca específica para gerar QR Code Pix EMV correto
    // Por enquanto, geramos um QR Code com dados do pagamento
    
    const pixData = `${pixKey}|${amount.toFixed(2)}|${description}|${orderId}`;

    // Gerar QR Code como string base64
    const qrCodeDataURL = await QRCode.toDataURL(pixData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 2
    });

    return {
      qrCode: qrCodeDataURL,
      pixKey: pixKey,
      amount: amount,
      description: description,
      orderId: orderId,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    };
  } catch (error) {
    console.error('Erro ao gerar QR Code Pix:', error);
    throw error;
  }
};

/**
 * Valida se o QR Code ainda é válido
 */
export const isQRCodeValid = (expiresAt) => {
  return new Date() < new Date(expiresAt);
};

