import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BackendStatusIndicator } from '../components/BackendStatusIndicator';
import logoMobile from '@assets/logos/Isotipo+tipografia.svg';
import logoWhite from '@assets/logos/Isotipo+tipografia-white.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      const from = location.state?.from || '/dashboard';
      navigate(from);
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const from = location.state?.from || '/dashboard';
      navigate(from);
    } else {
      setError(result.message || 'Erro ao fazer login');
    }

    setLoading(false);
  };

  return (
    <>
      <BackendStatusIndicator />
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          {/* Título e Descrição */}
          <h1 className="text-4xl font-bold mb-4 font-nunito text-brand-white">
            Bem-vindo de volta!
          </h1>
          <p className="text-xl text-gray-200 mb-8 font-poppins">
            Acesse sua conta e continue criando com as melhores ferramentas para designers.
          </p>

          {/* Features */}
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-200 font-poppins">Ferramentas profissionais de design</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-200 font-poppins">Planos flexíveis para suas necessidades</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-200 font-poppins">Suporte dedicado quando precisar</span>
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
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
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
            <h2 className="text-3xl font-bold text-brand-blue-900 mb-2 font-nunito">Entrar</h2>
            <p className="text-gray-600 font-poppins">Entre com suas credenciais</p>
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
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                Esqueceu a senha?
              </Link>
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
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Link para cadastro */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 font-poppins">
              Não tem uma conta?{' '}
              <Link 
                to="/register" 
                state={location.state}
                className="text-brand-green hover:text-brand-green-500 font-medium"
              >
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
