import { useState } from 'react';
import { Link } from 'react-router-dom';
import { brandStyle } from '../config/brand';

const ResourcesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/resources/documentation', label: 'Documentação' },
    { path: '/resources/community', label: 'Comunidade' },
    { path: '/resources/tutorials', label: 'Tutoriais' },
    { path: '/faq', label: 'FAQ' },
  ];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="text-brand-blue-900 hover:text-brand-green transition-colors font-medium font-poppins flex items-center">
        Recursos
        <svg 
          className={`ml-1 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 w-48 z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div 
            className="resources-dropdown rounded-lg shadow-xl border border-gray-200 py-2" 
            style={brandStyle({ bg: 'white' })}
          >
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-4 py-2 text-sm hover:bg-brand-green hover:text-white transition-colors font-poppins"
                style={brandStyle({ color: 'blue' })}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesDropdown;

