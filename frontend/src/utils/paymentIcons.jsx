import { 
  CreditCard, 
  Wallet, 
  FileText, 
  Globe,
  QrCode,
  Shield
} from 'lucide-react';

/**
 * Mapeia códigos de formas de pagamento para componentes de ícones Lucide
 * @param {string} code - Código da forma de pagamento (pix, credit_card, etc.)
 * @returns {React.Component} Componente de ícone
 */
export const getPaymentIcon = (code) => {
  const iconMap = {
    pix: QrCode,
    credit_card: CreditCard,
    debit_card: CreditCard,
    boleto: FileText,
    paypal: Globe,
    wallet: Wallet,
    stripe: Shield, // Stripe usa ícone de escudo (segurança)
  };

  const IconComponent = iconMap[code] || CreditCard;
  return IconComponent;
};

/**
 * Renderiza um ícone de forma de pagamento
 * @param {string} code - Código da forma de pagamento
 * @param {object} props - Props adicionais para o ícone (className, size, etc.)
 * @returns {JSX.Element} Elemento de ícone renderizado
 */
export const PaymentIcon = ({ code, className = "w-6 h-6", ...props }) => {
  const IconComponent = getPaymentIcon(code);
  return <IconComponent className={className} {...props} />;
};

