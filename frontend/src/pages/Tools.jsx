import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Tools = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const tools = [
    {
      id: 'colorbuddy',
      name: 'ColorBuddy',
      description: 'Extraia paletas de cores de imagens automaticamente.',
      link: '/ferramentas/colorbuddy/extrator',
      available: true,
      icon: '🎨'
    },
    {
      id: 'imagebuddy',
      name: 'ImageBuddy',
      description: 'Ferramentas profissionais para trabalhar com imagens.',
      link: '/ferramentas/imagebuddy',
      available: true,
      icon: '🖼️'
    },
    {
      id: 'mclients',
      name: 'MClients',
      description: 'Gestão completa de clientes, demandas e projetos.',
      link: '/ferramentas/mclients',
      available: true,
      icon: '👥'
    }
  ];

  const handleToolClick = (e, tool) => {
    if (tool.available && !user) {
      e.preventDefault();
      navigate('/login', { state: { from: tool.link } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ferramentas</h1>
          <p className="text-gray-600">Todas as ferramentas disponíveis no MarcBuddy</p>
        </div>

        {/* Grid de ferramentas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.link}
              onClick={(e) => handleToolClick(e, tool)}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-4xl mb-4">{tool.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {tool.name}
          </h3>
                  <p className="text-gray-600 text-sm">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;
