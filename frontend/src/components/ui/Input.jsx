import { forwardRef } from 'react';

/**
 * Componente de Input padrão da plataforma
 * Fundo branco com texto preto, seguindo o design system
 */
const Input = forwardRef(({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  style = {},
  disabled = false,
  min,
  max,
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      className={`w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-400 focus:border-transparent outline-none transition-all placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        ...style
      }}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;

