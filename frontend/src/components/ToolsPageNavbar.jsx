import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '@assets/logos/Isotipo+tipografia.svg';
import logoMobile from '@assets/logos/Isotipo+tipografia.svg';

const ToolsPageNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - Esquerda */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={logoMobile}
                alt="MarcBuddy Logo"
                className="h-6 w-auto lg:hidden"
              />
              <img
                src={logo}
                alt="MarcBuddy Logo"
                className="hidden lg:block h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centralizada */}
          <div className="hidden lg:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="text-gray-600 hover:text-brand-green transition-colors font-medium font-poppins"
            >
              Início
            </Link>
            <Link
              to="/ferramentas"
              className="text-brand-green font-semibold transition-colors font-poppins"
            >
              Ferramentas
            </Link>
          </div>

          {/* Desktop Auth/User Menu - Direita */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0 ml-auto">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-brand-green transition-colors font-poppins"
                >
                  <div className="w-8 h-8 bg-brand-green text-white rounded-full flex items-center justify-center font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <span>{user.name || 'Usuário'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-poppins"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-poppins"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Configurações
                    </Link>
                    <hr className="my-1" />
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
                  className="text-gray-600 hover:text-brand-green transition-colors font-medium font-poppins text-sm"
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
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden ml-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-brand-green hover:bg-gray-100 transition-colors"
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
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-brand-green hover:bg-gray-50 rounded-md font-poppins"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                to="/ferramentas"
                className="block px-3 py-2 text-base font-medium text-brand-green hover:bg-gray-50 rounded-md font-poppins"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ferramentas
              </Link>

              <div className="border-t border-gray-200 pt-3 mt-3">
                {user ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-base font-medium text-gray-900 font-poppins">
                      {user.name || 'Usuário'}
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-brand-green hover:bg-gray-50 rounded-md font-poppins"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-brand-green hover:bg-gray-50 rounded-md font-poppins"
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
                  <div className="space-y-1">
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-brand-green hover:bg-gray-50 rounded-md font-poppins"
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
          </div>
        )}
      </div>
    </nav>
  );
};

export default ToolsPageNavbar;