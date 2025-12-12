import { v4 as uuidv4 } from 'uuid';

/**
 * Gera uma license key única no formato MB-XXXX-XXXX-XXXX
 * @returns {string} License key formatada
 */
export const generateLicenseKey = () => {
  // Gerar UUID e remover hífens
  const uuid = uuidv4().replace(/-/g, '').toUpperCase();
  
  // Pegar os primeiros 12 caracteres e formatar como MB-XXXX-XXXX-XXXX
  const segments = [
    uuid.substring(0, 4),
    uuid.substring(4, 8),
    uuid.substring(8, 12)
  ];
  
  return `MB-${segments.join('-')}`;
};

/**
 * Valida o formato de uma license key
 * @param {string} licenseKey - License key para validar
 * @returns {boolean} True se válida
 */
export const validateLicenseKeyFormat = (licenseKey) => {
  const pattern = /^MB-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(licenseKey);
};

