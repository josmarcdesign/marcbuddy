import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, History, Settings } from 'lucide-react';
import isotipo from '@assets/logos/isotipo.svg';

const ToolPageNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { darkMode } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`${darkMode ? 'bg-brand-blue-900 shadow-lg' : 'bg-white shadow-md'} sticky top-0 z-50 transition-colors duration-300 ${mobileMenuOpen ? 'lg:relative' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative w-full">
          {/* Esquerda: Isotipo + Voltar para Ferramentas */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Isotipo */}
            <Link
              to="/ferramentas"
              className="flex items-center"
            >
              <img
                src={isotipo}
                alt="MarcBuddy"
                className="w-7 h-7"
              />
            </Link>

            {/* Botão Voltar para Ferramentas (Desktop) */}
            <Link
              to="/ferramentas"
              className={`hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors font-poppins rounded-lg ${
                darkMode
                  ? 'text-white hover:text-brand-green hover:bg-brand-blue-800'
                  : 'text-brand-blue-900 hover:text-brand-green hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Ferramentas</span>
            </Link>
          </div>

          {/* Central: Tool Controls */}
          <div className="flex items-center gap-2">
            {/* Histórico */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors font-poppins rounded-lg ${
                showHistory
                  ? 'bg-brand-green text-brand-blue-900'
                  : darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-brand-blue-800'
                    : 'text-gray-600 hover:text-brand-blue-900 hover:bg-gray-100'
              }`}
              title="Mostrar/ocultar histórico"
            >
              <History className="w-4 h-4" />
              <span className="hidden xl:inline">Histórico</span>
            </button>

            {/* Configurações */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors font-poppins rounded-lg ${
                showSettings
                  ? 'bg-brand-green text-brand-blue-900'
                  : darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-brand-blue-800'
                    : 'text-gray-600 hover:text-brand-blue-900 hover:bg-gray-100'
              }`}
              title="Mostrar/ocultar configurações"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden xl:inline">Configurações</span>
            </button>
          </div>

          {/* Direita: User Menu / Auth Buttons */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors font-poppins ${
                    darkMode ? 'text-white hover:text-brand-green' : 'text-gray-700 hover:text-brand-green'
                  }`}
                >
                  <div className="w-8 h-8 bg-brand-green text-white rounded-full flex items-center justify-center font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="hidden lg:inline">{user.name || 'Usuário'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 z-50 ${
                    darkMode ? 'bg-brand-blue-800 border-brand-blue-700' : 'bg-white border-gray-200'
                  }`}>
                    <Link
                      to="/dashboard"
                      className={`block px-4 py-2 text-sm font-poppins ${
                        darkMode ? 'text-white hover:bg-brand-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className={`block px-4 py-2 text-sm font-poppins ${
                        darkMode ? 'text-white hover:bg-brand-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Configurações
                    </Link>
                    <hr className={`my-1 ${darkMode ? 'border-brand-blue-700' : ''}`} />
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-poppins"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`transition-colors font-medium font-poppins text-sm ${
                    darkMode ? 'text-gray-300 hover:text-brand-green' : 'text-gray-600 hover:text-brand-green'
                  }`}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-green text-brand-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-brand-green-500 transition-colors font-poppins text-sm"
                >
                  Começar Grátis
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-md transition-colors ${
                darkMode ? 'text-gray-300 hover:text-brand-green hover:bg-brand-blue-800' : 'text-gray-600 hover:text-brand-green hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t bg-white ${
            darkMode ? 'border-brand-blue-700 bg-brand-blue-900' : 'border-gray-200'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Tool Controls */}
              <div className={`border-b pb-3 mb-3 ${
                darkMode ? 'border-brand-blue-700' : 'border-gray-200'
              }`}>
                <button
                  onClick={() => {
                    setShowHistory(!showHistory);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-base font-medium rounded-md font-poppins transition-colors ${
                    showHistory
                      ? 'bg-brand-green text-brand-blue-900'
                      : darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-brand-blue-800'
                        : 'text-gray-600 hover:text-brand-blue-900 hover:bg-gray-100'
                  }`}
                >
                  <History className="w-5 h-5" />
                  Histórico {showHistory ? '(ativo)' : '(inativo)'}
                </button>
                <button
                  onClick={() => {
                    setShowSettings(!showSettings);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-base font-medium rounded-md font-poppins transition-colors ${
                    showSettings
                      ? 'bg-brand-green text-brand-blue-900'
                      : darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-brand-blue-800'
                        : 'text-gray-600 hover:text-brand-blue-900 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Configurações {showSettings ? '(ativo)' : '(inativo)'}
                </button>
              </div>

              {/* Mobile Navigation */}
              <Link
                to="/ferramentas"
                className={`flex items-center gap-2 px-3 py-2 text-base font-medium hover:text-brand-green rounded-md font-poppins ${
                  darkMode ? 'text-white hover:bg-brand-blue-800' : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar para Ferramentas
              </Link>

              {user ? (
                <div className={`space-y-1 border-t pt-3 ${
                  darkMode ? 'border-brand-blue-700' : 'border-gray-200'
                }`}>
                  <div className={`px-3 py-2 text-base font-medium font-poppins ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {user.name || 'Usuário'}
                  </div>
                  <Link
                    to="/dashboard"
                    className={`block px-3 py-2 text-base font-medium hover:text-brand-green rounded-md font-poppins ${
                      darkMode ? 'text-white hover:bg-brand-blue-800' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    className={`block px-3 py-2 text-base font-medium hover:text-brand-green rounded-md font-poppins ${
                      darkMode ? 'text-white hover:bg-brand-blue-800' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Configurações
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md font-poppins"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className={`space-y-1 border-t pt-3 ${
                  darkMode ? 'border-brand-blue-700' : 'border-gray-200'
                }`}>
                  <Link
                    to="/login"
                    className={`block px-3 py-2 text-base font-medium hover:text-brand-green rounded-md font-poppins ${
                      darkMode ? 'text-white hover:bg-brand-blue-800' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium bg-brand-green text-brand-blue-900 hover:bg-brand-green-500 rounded-md font-poppins text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Começar Grátis
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ToolPageNavbar;