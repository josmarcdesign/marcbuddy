import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@assets/logos/mbuddy-horizontal-logo+suite-badge.svg';
import logoMobile from '@assets/logos/Isotipo+tipografia.svg';

const DocumentationNavbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Chama onSearch em tempo real enquanto digita
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Previne comportamento padrão, mas a busca já está sendo feita em tempo real
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src={logoMobile} 
                alt="MarcBuddy Logo" 
                className="h-6 w-auto lg:hidden"
              />
              <img 
                src={logo} 
                alt="MarcBuddy Logo" 
                className="hidden lg:block h-7 w-auto"
              />
            </Link>
          </div>

          {/* Barra de Pesquisa - Centralizada */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar na documentação..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins text-sm bg-gray-50 hover:bg-white transition-colors"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
          </div>

          {/* Links à Direita */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-brand-green transition-colors font-poppins"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao Site
            </Link>
            <Link
              to="/ferramentas"
              className="hidden md:flex items-center gap-2 text-sm bg-brand-green text-brand-blue-900 px-4 py-2 rounded-lg hover:bg-brand-green-500 transition-colors font-semibold font-poppins font-medium"
            >
              Ferramentas
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DocumentationNavbar;

