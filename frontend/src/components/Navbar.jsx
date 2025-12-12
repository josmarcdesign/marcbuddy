import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { brandColors, brandStyle } from '../config/brand';
import ResourcesDropdown from './ResourcesDropdown';
import logo from '@assets/logos/Isotipo+tipografia.svg';
import logoMobile from '@assets/logos/Isotipo+tipografia.svg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isToolsPage = location.pathname.startsWith('/ferramentas');
  
  // Sincronizar busca com a página Tools
  useEffect(() => {
    if (isToolsPage) {
      const storedSearch = sessionStorage.getItem('toolsSearchQuery') || '';
      setSearchQuery(storedSearch);
    }
  }, [isToolsPage]);
  
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    sessionStorage.setItem('toolsSearchQuery', value);
    // Disparar evento customizado para a página Tools atualizar
    window.dispatchEvent(new CustomEvent('toolsSearchChange', { detail: value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`bg-white shadow-md sticky top-0 z-50 ${mobileMenuOpen ? 'lg:relative' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative">
          {/* Logo - Esquerda */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center">
              {/* Logo Mobile/Tablet */}
              <img 
                src={logoMobile} 
                alt="MarcBuddy Logo" 
                className="h-6 w-auto lg:hidden"
              />
              {/* Logo Desktop */}
              <img 
                src={logo} 
                alt="MarcBuddy Logo" 
                className="hidden lg:block h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centralizada ou Busca (se estiver em ferramentas) */}
          {isToolsPage ? (
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-auto px-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar ferramentas..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green font-poppins text-sm"
                />
              </div>
            </div>
          ) : (
          <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/benefits"
              className="text-brand-blue-900 hover:text-brand-green transition-colors font-medium font-poppins"
            >
              Benefícios
            </Link>
            <Link
              to="/ferramentas"
              className="text-brand-blue-900 hover:text-brand-green transition-colors font-medium font-poppins"
            >
              Ferramentas
            </Link>
            <Link
              to="/plugins"
              className="text-brand-blue-900 hover:text-brand-green transition-colors font-medium font-poppins"
            >
              Plugins
            </Link>
            <Link
              to="/plans"
              className="text-brand-blue-900 hover:text-brand-green transition-colors font-medium font-poppins"
            >
              Planos
            </Link>
            
            {/* Recursos com Dropdown */}
            <ResourcesDropdown />
          </div>
          )}

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
                        to="/biblioteca"
                        className="block px-4 py-2 text-sm text-brand-blue-900 hover:bg-gray-100 font-poppins"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Biblioteca de Assets
                      </Link>
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
                  className="px-4 py-2 text-sm font-medium bg-brand-blue-900 text-white hover:bg-brand-blue-800 transition-colors font-poppins rounded-lg"
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
          {/* Backdrop - apenas para fechar ao clicar fora */}
          <div
            className="fixed inset-0 bg-transparent z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu Overlay */}
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg z-50 lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Busca Mobile - apenas na página de ferramentas */}
            {isToolsPage && (
              <div className="px-3 py-2 mb-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar ferramentas..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green font-poppins text-sm"
                  />
                </div>
              </div>
            )}
            <Link
              to="/benefits"
              className="block px-3 py-2 text-base font-medium text-brand-blue-900 hover:text-brand-green hover:bg-brand-white rounded-md font-poppins"
              onClick={() => setMobileMenuOpen(false)}
            >
              Benefícios
            </Link>
            <Link
              to="/ferramentas"
              className="block px-3 py-2 text-base font-medium text-brand-blue-900 hover:text-brand-green hover:bg-brand-white rounded-md font-poppins"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ferramentas
            </Link>
            <Link
              to="/plugins"
              className="block px-3 py-2 text-base font-medium text-brand-blue-900 hover:text-brand-green hover:bg-brand-white rounded-md font-poppins"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plugins
            </Link>
            <Link
              to="/plans"
              className="block px-3 py-2 text-base font-medium text-brand-blue-900 hover:text-brand-green hover:bg-brand-white rounded-md font-poppins"
              onClick={() => setMobileMenuOpen(false)}
            >
              Planos
            </Link>
            <div>
              <button
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-brand-blue-900 hover:text-brand-green hover:bg-brand-white rounded-md font-poppins"
              >
                <span>Recursos</span>
                <svg
                  className={`w-5 h-5 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileResourcesOpen && (
                <div className="pl-4 space-y-1 mt-1">
                  <Link
                    to="/resources/documentation"
                    className="block px-3 py-2 text-sm text-brand-blue-900 hover:text-brand-green hover:bg-brand-white rounded-md font-poppins"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileResourcesOpen(false);
                    }}
                  >
                    Documentação
                  </Link>
                  <Link
                    to="/resources/community"
                    className="block px-3 py-2 text-sm text-brand-blue-900 hover:text-brand-green hover:bg-brand-white rounded-md font-poppins"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileResourcesOpen(false);
                    }}
                  >
                    Comunidade
                  </Link>
                  <Link
                    to="/resources/tutorials"
                    className="block px-3 py-2 text-sm text-brand-blue-900 hover:text-brand-green hover:bg-brand-white rounded-md font-poppins"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileResourcesOpen(false);
                    }}
                  >
                    Tutoriais
                  </Link>
                  <Link
                    to="/resources/faq"
                    className="block px-3 py-2 text-sm text-brand-blue-900 hover:text-brand-green hover:bg-brand-white rounded-md font-poppins"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileResourcesOpen(false);
                    }}
                  >
                    FAQ
                  </Link>
                </div>
              )}
            </div>
            
            {user ? (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-brand-blue-900 font-poppins">{user.name}</p>
                  <p className="text-xs text-gray-500 font-poppins">{user.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-brand-blue-900 hover:text-brand-green hover:bg-brand-white rounded-md font-poppins"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-base font-medium text-brand-green hover:bg-brand-green/10 hover:bg-brand-white rounded-md font-poppins"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/settings"
                  className="block px-3 py-2 text-base font-medium text-brand-blue-900 hover:text-brand-green hover:bg-brand-white rounded-md font-poppins"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Configurações
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-status-error hover:bg-red-50 rounded-md font-poppins"
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

export default Navbar;

