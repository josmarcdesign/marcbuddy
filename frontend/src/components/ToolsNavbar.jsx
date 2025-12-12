import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '@assets/logos/mbuddy-horizontal-logo+suite-badge.svg';
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
              className="text-gray-600 hover:text-brand-green transition-colors font-medium font-poppins text-sm"
            >
              Início
            </Link>
            <Link
              to="/ferramentas"
              className="text-brand-green font-semibold transition-colors font-poppins text-sm"
            >
              Ferramentas
            </Link>
            <Link
              to="/plans"
              className="text-gray-600 hover:text-brand-green transition-colors font-medium font-poppins text-sm"
            >
              Planos
            </Link>
          </div>

          {/* User Menu / Auth Buttons - Direita */}
          <div className="hidden lg:flex items-center space-x-4 ml-auto flex-shrink-0 relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-brand-green"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-brand-green-100 rounded-full flex items-center justify-center">
                      <span className="text-brand-blue-900 font-medium text-sm font-poppins">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-brand-blue-900 font-poppins">{user.name}</span>
                  <svg
                    className={`w-4 h-4 text-brand-blue-900 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-brand-blue-900 hover:bg-gray-100 font-poppins"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-brand-green hover:bg-gray-100 font-poppins"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-brand-blue-900 hover:bg-gray-100 font-poppins"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Configurações
                      </Link>
                      <div className="border-t border-gray-200 my-1" />
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
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-brand-blue-900 hover:text-brand-green transition-colors font-poppins"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors font-poppins font-medium"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile/Tablet menu button - Direita */}
          <div className="lg:hidden ml-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-brand-blue-900 hover:text-brand-green focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu - Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg z-50 lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
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
                className="block px-3 py-2 text-base font-medium text-brand-green font-semibold hover:bg-gray-50 rounded-md font-poppins"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ferramentas
              </Link>
              <Link
                to="/plans"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-brand-green hover:bg-gray-50 rounded-md font-poppins"
                onClick={() => setMobileMenuOpen(false)}
              >
                Planos
              </Link>
              
              {user ? (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-brand-blue-900 font-poppins">{user.name}</p>
                    <p className="text-xs text-gray-500 font-poppins">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-brand-blue-900 hover:text-brand-green hover:bg-gray-50 rounded-md font-poppins"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-base font-medium text-brand-green hover:bg-gray-50 rounded-md font-poppins"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/settings"
                    className="block px-3 py-2 text-base font-medium text-brand-blue-900 hover:text-brand-green hover:bg-gray-50 rounded-md font-poppins"
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
                <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium bg-brand-blue-900 text-white hover:bg-brand-blue-800 rounded-md font-poppins text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium bg-brand-green text-brand-blue-900 rounded-md hover:bg-brand-green-500 text-center font-poppins font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default ToolsPageNavbar;

