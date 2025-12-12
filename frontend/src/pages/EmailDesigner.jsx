import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ExternalLink, Mail, Palette, Smartphone, Monitor, Tablet } from 'lucide-react';
import { useFloatingWindow } from '../contexts/FloatingWindowContext';
import { useTheme } from '../contexts/ThemeContext';
import { ToolProvider } from '../contexts/ToolContext';

const EmailDesigner = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const { openWindow } = useFloatingWindow();
  const { darkMode } = useTheme();

  const toolComponents = {
    builder: <div>Componente EmailBuilder será implementado aqui</div>,
    templates: <div>Componente EmailTemplates será implementado aqui</div>,
    preview: <div>Componente EmailPreview será implementado aqui</div>
  };

  const handleOpenInWindow = (e, tool) => {
    e.preventDefault();
    e.stopPropagation();
    if (tool.available && toolComponents[tool.id]) {
      openWindow(tool.id, tool.name, tool.link, toolComponents[tool.id]);
    }
  };

  const tools = [
    {
      id: 'builder',
      name: 'Construtor de Email',
      description: 'Crie emails profissionais com interface arrastar e soltar. Adicione textos, imagens, botões e muito mais.',
      image: 'https://placehold.co/600x400',
      link: '/ferramentas/emaildesigner/builder',
      available: false,
      category: 'Design',
      icon: <Mail className="w-12 h-12" />,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'templates',
      name: 'Templates Prontos',
      description: 'Biblioteca de templates profissionais para diferentes tipos de email marketing e corporativo.',
      image: 'https://placehold.co/600x400',
      link: '/ferramentas/emaildesigner/templates',
      available: false,
      category: 'Templates',
      icon: <Palette className="w-12 h-12" />,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'preview',
      name: 'Preview Responsivo',
      description: 'Visualize como seu email ficará em desktop, tablet e celular antes de enviar.',
      image: 'https://placehold.co/600x400',
      link: '/ferramentas/emaildesigner/preview',
      available: false,
      category: 'Teste',
      icon: (
        <div className="flex gap-1">
          <Monitor className="w-8 h-8" />
          <Tablet className="w-6 h-6" />
          <Smartphone className="w-4 h-4" />
        </div>
      ),
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Extrair categorias únicas
  const categories = useMemo(() => {
    const cats = ['Todas', ...new Set(tools.map(tool => tool.category))];
    return cats;
  }, []);

  // Filtrar ferramentas
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'Todas' || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-brand-white'} transition-colors`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-brand-blue-900 border-brand-blue-700' : 'bg-white border-gray-200'} border-b transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                to="/ferramentas"
                className={`transition-colors font-poppins text-sm flex items-center gap-1 ${
                  darkMode ? 'text-gray-300 hover:text-brand-green' : 'text-gray-500 hover:text-brand-green'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Ferramentas
              </Link>
              <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>/</span>
              <h1 className={`text-3xl md:text-4xl font-bold font-nunito ${
                darkMode ? 'text-white' : 'text-brand-blue-900'
              }`}>
                EmailDesigner
              </h1>
            </div>
            <p className={`font-poppins ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Crie emails profissionais e responsivos com ferramentas avançadas de design
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Sidebar de Categorias */}
        <aside className={`w-full lg:w-64 border-r lg:sticky lg:top-[140px] lg:h-[calc(100vh-140px)] lg:overflow-y-auto ${
          darkMode ? 'bg-brand-blue-900 border-brand-blue-700' : 'bg-white border-gray-200'
        } transition-colors`}>
          <div className="p-4 md:p-6">
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 font-nunito ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Categorias
            </h2>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-poppins ${
                    selectedCategory === category
                      ? 'bg-brand-green text-brand-blue-900 font-semibold'
                      : darkMode
                        ? 'text-gray-300 hover:bg-brand-blue-800'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category}</span>
                    {selectedCategory === category && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Grid de Ferramentas */}
        <main className={`flex-1 p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-brand-white'} transition-colors`}>
          {/* Contador de resultados */}
          <div className="mb-6">
            <p className={`text-sm font-poppins ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {filteredTools.length} {filteredTools.length === 1 ? 'ferramenta encontrada' : 'ferramentas encontradas'}
              {selectedCategory !== 'Todas' && ` em ${selectedCategory}`}
            </p>
          </div>

          {/* Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="group relative"
                >
                  {tool.available ? (
                    <Link
                      to={tool.link}
                      className="block h-full"
                    >
                      <div className={`h-full rounded-xl border-2 hover:border-brand-green transition-all duration-300 hover:shadow-xl overflow-hidden group-hover:-translate-y-1 ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      }`}>
                        {/* Card Header com Gradiente */}
                        <div className={`relative h-32 bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                          <div className="text-white opacity-90 group-hover:scale-110 transition-transform duration-300">
                            {tool.icon}
                          </div>

                          {/* Badge de Status */}
                          <div className="absolute top-3 right-3 flex items-center gap-2">
                            <button
                              onClick={(e) => handleOpenInWindow(e, tool)}
                              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
                              title="Abrir em janela flutuante"
                            >
                              <ExternalLink className="w-4 h-4 text-white" />
                            </button>
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold font-nunito">
                              Disponível
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5">
                          <h3 className={`text-lg font-bold mb-2 font-nunito group-hover:text-brand-green transition-colors ${
                            darkMode ? 'text-white' : 'text-brand-blue-900'
                          }`}>
                            {tool.name}
                          </h3>
                          <p className={`text-sm font-poppins line-clamp-2 mb-4 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {tool.description}
                          </p>

                          {/* CTA */}
                          <div className={`flex items-center text-brand-green font-semibold text-sm font-nunito ${
                            darkMode ? 'text-brand-green' : ''
                          }`}>
                            <span>Acessar</span>
                            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className={`h-full rounded-xl border-2 opacity-60 cursor-not-allowed ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      {/* Card Header com Gradiente */}
                      <div className={`relative h-32 bg-gradient-to-br ${tool.color} flex items-center justify-center opacity-50`}>
                        <div className="text-white opacity-70">
                          {tool.icon}
                        </div>

                        {/* Badge de Status */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold font-nunito">
                            Em breve
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5">
                        <h3 className={`text-lg font-bold mb-2 font-nunito ${
                          darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {tool.name}
                        </h3>
                        <p className={`text-sm font-poppins line-clamp-2 mb-4 ${
                          darkMode ? 'text-gray-600' : 'text-gray-500'
                        }`}>
                          {tool.description}
                        </p>

                        {/* Status */}
                        <div className={`flex items-center text-sm font-nunito ${
                          darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          <span>Em breve</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className={`mt-4 text-lg font-semibold font-nunito ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Nenhuma ferramenta encontrada
              </h3>
              <p className={`mt-2 text-sm font-poppins ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Tente ajustar sua busca ou selecione outra categoria
              </p>
            </div>
          )}
        </main>
      </div>

    </div>
  );
};

export default EmailDesigner;