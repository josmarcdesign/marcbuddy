import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoMobile from '@assets/logos/Isotipo+tipografia.svg';
import logoWhite from '@assets/logos/Isotipo+tipografia-white.svg';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Função para validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
    setEmailError('');

    // Validação de email
    if (!email) {
      setEmailError('Email é obrigatório');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um email válido');
      return;
    }

    // Validações
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    const result = await register({
      firstName,
      lastName,
      name,
      email,
      phone,
      password
    });

    if (result.success) {
      const from = location.state?.from || '/dashboard';
      navigate(from);
    } else {
      setError(result.message || 'Erro ao cadastrar');
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          {/* Título e Descrição */}
          <h1 className="text-4xl font-bold mb-4 font-nunito text-brand-white">
            Junte-se ao MarcBuddy
          </h1>
          <p className="text-xl text-gray-200 mb-8 font-poppins">
            Crie sua conta e tenha acesso às melhores ferramentas para designers e criadores.
          </p>

          {/* Features */}
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-200 font-poppins">Extração de paleta de cores</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-200 font-poppins">Compressão inteligente de imagens</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-brand-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-200 font-poppins">Renomeação em lote de arquivos</span>
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
            <h2 className="text-3xl font-bold text-brand-blue-900 mb-2 font-nunito">Criar Conta</h2>
            <p className="text-gray-600 font-poppins">Preencha os dados para começar</p>
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Primeiro Nome
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500"
                  placeholder="João"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Sobrenome
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500"
                  placeholder="Silva"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo (Opcional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500"
                placeholder="João Silva Santos"
              />
            </div>

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
                  setEmailError('');
                }}
                onBlur={(e) => {
                  if (e.target.value && !validateEmail(e.target.value)) {
                    setEmailError('Por favor, insira um email válido');
                  } else {
                    setEmailError('');
                  }
                }}
                required
                className={`w-full px-4 py-3 bg-white text-gray-900 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500 ${
                  emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="seu@email.com"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600 font-poppins">{emailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefone (Opcional)
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-500"
                placeholder="(11) 99999-9999"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
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

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-600 font-poppins">
                Eu aceito os{' '}
                <Link to="/termos" className="text-brand-green hover:text-brand-green-500 underline">
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link to="/privacidade" className="text-brand-green hover:text-brand-green-500 underline">
                  Política de Privacidade
                </Link>
              </label>
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
                  Cadastrando...
                </span>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          {/* Link para login */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 font-poppins">
              Já tem uma conta?{' '}
              <Link 
                to="/login" 
                state={location.state}
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

export default Register;
