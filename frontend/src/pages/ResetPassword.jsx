import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoMobile from '@assets/logos/Isotipo+tipografia.svg';
import logoWhite from '@assets/logos/Isotipo+tipografia-white.svg';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Obtém o token da URL
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Token de redefinição não encontrado na URL');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validações
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!token) {
      setError('Token de redefinição inválido');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(token, password);

      if (result.success) {
        setSuccess('Senha redefinida com sucesso! Você será redirecionado para o login em alguns segundos...');

        // Redireciona para login após 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.message || 'Erro ao redefinir senha');
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Título e Descrição */}
          <h1 className="text-4xl font-bold mb-4 font-nunito text-brand-white">
            Nova Senha
          </h1>
          <p className="text-xl text-gray-200 mb-8 font-poppins">
            Digite sua nova senha para recuperar o acesso à sua conta.
          </p>

          {/* Features */}
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-200 font-poppins">Link validado com sucesso</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-gray-200 font-poppins">Senha segura criada</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-gray-200 font-poppins">Acesso recuperado instantaneamente</span>
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
            <h2 className="text-3xl font-bold text-brand-blue-900 mb-2 font-nunito">Redefinir Senha</h2>
            <p className="text-gray-600 font-poppins">Crie uma nova senha para sua conta</p>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-brand-green text-brand-blue-900 py-3 px-4 rounded-lg font-semibold hover:bg-brand-green-500 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-poppins font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redefinindo...
                </span>
              ) : (
                'Redefinir Senha'
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

export default ResetPassword;