import { forwardRef } from 'react';

/**
 * Componente de Select padrão da plataforma
 * Fundo branco com texto preto, seguindo o design system
 */
const Select = forwardRef(({
  value,
  onChange,
  children,
  className = '',
  style = {},
  disabled = false,
  ...props
}, ref) => {
  return (
    <select
      ref={ref}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-400 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        ...style
      }}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export default Select;

