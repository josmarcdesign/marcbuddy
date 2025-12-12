import React from 'react';
import './BillingToggle.css';

const BillingToggle = ({ billingPeriod, onToggle }) => {
  const isAnnual = billingPeriod === 'annual';
  
  const handleChange = () => {
    onToggle();
  };
  
  return (
    <div className="flex flex-col items-center gap-2 mb-6 sm:mb-8 w-full">
      {/* Switch e labels centralizados */}
      <div className="flex items-center gap-2 sm:gap-4 w-full justify-center flex-wrap">
        <span className={`text-sm sm:text-lg font-medium font-poppins ${!isAnnual ? 'text-brand-blue-900' : 'text-gray-500'}`}>
          Mensal
        </span>
        <label className="billing-switch-label">
          <input
            type="checkbox"
            className="billing-switch-checkbox"
            checked={isAnnual}
            onChange={handleChange}
          />
          <div className="billing-switch-slider" />
        </label>
        {/* Anual - Simplificado no mobile, destacado no desktop */}
        <span className={`text-sm sm:text-lg font-medium font-poppins sm:hidden ${isAnnual ? 'text-brand-blue-900' : 'text-gray-500'}`}>
          Anual
        </span>
        {/* Container com retângulo arredondado para Anual - Destacado (apenas desktop) */}
        <div className="hidden sm:flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-brand-green bg-gradient-to-r from-brand-green/15 via-brand-green/10 to-brand-green/5 shadow-lg shadow-brand-green/20 relative overflow-visible group hover:shadow-xl hover:shadow-brand-green/30 transition-all duration-300">
          {/* Mini tag pulsante no canto superior direito */}
          <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold font-poppins font-medium px-2 py-1 rounded-md shadow-lg z-20 pulse-scale">
            % OFF
          </div>
          
          {/* Efeito de brilho animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green/10 via-transparent to-transparent pointer-events-none group-hover:from-brand-green/15 transition-all duration-300"></div>
          
          <span className={`text-lg font-bold font-poppins relative z-10 ${isAnnual ? 'text-brand-blue-900' : 'text-gray-500'}`}>
            Anual
          </span>
          
          {/* Separador vertical */}
          <div className="h-5 w-0.5 bg-brand-green/40 relative z-10"></div>
          
          {/* Badge de desconto com ícone */}
          <span className="text-sm font-bold text-brand-blue-900 font-poppins font-medium whitespace-nowrap relative z-10 flex items-center gap-1.5 bg-brand-green/10 px-2.5 py-1 rounded-md border border-brand-green/30">
            <svg className="w-4 h-4 flex-shrink-0 text-brand-blue-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Desconto de lançamento</span>
          </span>
        </div>
      </div>
      
      {/* Tag de desconto embaixo no mobile */}
      {isAnnual && (
        <div className="flex flex-col items-center gap-1 sm:hidden">
          <span className="text-xs font-bold text-brand-blue-900 font-poppins font-medium flex items-center gap-1.5 bg-brand-green/10 px-2.5 py-1 rounded-md border border-brand-green/30">
            <svg className="w-3 h-3 flex-shrink-0 text-brand-blue-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span>Desconto de lançamento</span>
          </span>
        </div>
      )}
      
      {/* Tag abaixo do switch no mobile, à direita no desktop */}
      {isAnnual && (
        <span className="px-3 py-1 bg-brand-green/20 text-brand-green text-sm font-semibold rounded-full font-poppins font-medium whitespace-nowrap md:absolute md:left-[calc(50%+140px)] md:top-0">
          Economize 2 meses
        </span>
      )}
    </div>
  );
};

export default BillingToggle;

