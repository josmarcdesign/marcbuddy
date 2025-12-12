import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoMobile from '@assets/logos/Isotipo+tipografia.svg';
import logoWhite from '@assets/logos/Isotipo+tipografia-white.svg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação de email
    if (!email) {
      setError('Email é obrigatório');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setSuccess('Enviamos um link de redefinição para seu email. Verifique sua caixa de entrada e também a pasta de spam.');
        setEmail(''); // Limpa o campo
      } else {
        setError(result.message || 'Erro ao solicitar redefinição de senha');
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor. Tente novamente.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Coluna Esquerda - Informações */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-blue-900 p-12 text-brand-white relative overflow-hidden">
        {/* Padrão de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Logo no topo */}
        <div className="absolute top-12 left-12 z-10">
          <Link to="/">
            <img
              src={logoWhite}
              alt="MarcBuddy Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Conteúdo centralizado verticalmente, alinhado à esquerda */}
        <div className="relative z-10 flex flex-col justify-center w-full max-w-lg mx-auto">
          {/* Ícone */}
          <div className="mb-8">
            <svg className="w-20 h-20 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H7l5-5-5-5h4l2.257 2.257A6 6 0 0119 9z" />
            </svg>
          </div>

          {/* Título e Descrição */}
          <h1 className="text-4xl font-bold mb-4 font-nunito text-brand-white">
            Recupere seu Acesso
          </h1>
          <p className="text-xl text-gray-200 mb-8 font-poppins">
            Digite seu email e enviaremos um link seguro para redefinir sua senha.
          </p>

          {/* Features */}
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-200 font-poppins">Link seguro enviado por email</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-200 font-poppins">Válido por 15 minutos</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-gray-200 font-poppins">Processo seguro e criptografado</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Coluna Direita - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-brand-white">
        <div className="w-full max-w-md">
          {/* Botão Voltar */}
          <div className="mb-8">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar ao Login
            </Link>
          </div>

          {/* Logo Mobile */}
          <div className="lg:hidden mb-8">
            <Link to="/">
              <img
                src={logoMobile}
                alt="MarcBuddy Logo"
                className="h-6 w-auto"
              />
            </Link>
          </div>

          {/* Título */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-brand-blue-900 mb-2 font-nunito">Esqueceu sua Senha?</h2>
            <p className="text-gray-600 font-poppins">Digite seu email para receber o link de redefinição</p>
          </div>

          {/* Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Sucesso */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                onBlur={(e) => {
                  if (e.target.value && !validateEmail(e.target.value)) {
                    setError('Por favor, insira um email válido');
                  } else {
                    setError('');
                  }
                }}
                required
                className={`w-full px-4 py-3 bg-white text-gray-900 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500 ${
                  error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="seu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green text-brand-blue-900 py-3 px-4 rounded-lg font-semibold hover:bg-brand-green-500 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-poppins font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Enviar Link de Redefinição'
              )}
            </button>
          </form>

          {/* Link para login */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 font-poppins">
              Lembrou sua senha?{' '}
              <Link
                to="/login"
                className="text-brand-green hover:text-brand-green-500 font-medium"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;