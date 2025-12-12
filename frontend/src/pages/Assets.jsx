import { useState } from 'react';
import { Search, Filter, Download, Image as ImageIcon, FileText, Video, Music } from 'lucide-react';

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - Biblioteca de assets
  const categories = [
    { id: 'all', name: 'Todos', icon: Filter },
    { id: 'images', name: 'Imagens', icon: ImageIcon },
    { id: 'icons', name: 'Ícones', icon: FileText },
    { id: 'videos', name: 'Vídeos', icon: Video },
    { id: 'audio', name: 'Áudio', icon: Music },
  ];

  const mockAssets = [
    {
      id: 1,
      name: 'Logo Principal',
      type: 'images',
      url: 'https://placehold.co/400x300/87c508/ffffff?text=Logo+Principal',
      category: 'images',
      tags: ['logo', 'marca', 'identidade'],
      size: '2.5 MB',
      format: 'PNG'
    },
    {
      id: 2,
      name: 'Ícone Dashboard',
      type: 'icons',
      url: 'https://placehold.co/200x200/011526/87c508?text=Icon',
      category: 'icons',
      tags: ['dashboard', 'interface', 'ui'],
      size: '45 KB',
      format: 'SVG'
    },
    {
      id: 3,
      name: 'Banner Hero',
      type: 'images',
      url: 'https://placehold.co/800x400/87c508/ffffff?text=Banner+Hero',
      category: 'images',
      tags: ['banner', 'hero', 'marketing'],
      size: '1.8 MB',
      format: 'JPG'
    },
    {
      id: 4,
      name: 'Ícone Usuário',
      type: 'icons',
      url: 'https://placehold.co/200x200/011526/87c508?text=User',
      category: 'icons',
      tags: ['usuário', 'perfil', 'avatar'],
      size: '32 KB',
      format: 'SVG'
    },
    {
      id: 5,
      name: 'Vídeo Tutorial',
      type: 'videos',
      url: 'https://placehold.co/400x300/011526/87c508?text=Video',
      category: 'videos',
      tags: ['tutorial', 'educação', 'vídeo'],
      size: '15.2 MB',
      format: 'MP4'
    },
    {
      id: 6,
      name: 'Música de Fundo',
      type: 'audio',
      url: 'https://placehold.co/400x200/87c508/ffffff?text=Audio',
      category: 'audio',
      tags: ['música', 'background', 'som'],
      size: '3.4 MB',
      format: 'MP3'
    },
    {
      id: 7,
      name: 'Ilustração Personagem',
      type: 'images',
      url: 'https://placehold.co/400x400/87c508/ffffff?text=Illustration',
      category: 'images',
      tags: ['ilustração', 'personagem', 'design'],
      size: '1.2 MB',
      format: 'PNG'
    },
    {
      id: 8,
      name: 'Ícone Configurações',
      type: 'icons',
      url: 'https://placehold.co/200x200/011526/87c508?text=Settings',
      category: 'icons',
      tags: ['configurações', 'settings', 'ui'],
      size: '28 KB',
      format: 'SVG'
    },
    {
      id: 9,
      name: 'Banner Promocional',
      type: 'images',
      url: 'https://placehold.co/600x300/87c508/ffffff?text=Promo',
      category: 'images',
      tags: ['banner', 'promoção', 'marketing'],
      size: '950 KB',
      format: 'JPG'
    },
    {
      id: 10,
      name: 'Ícone Notificações',
      type: 'icons',
      url: 'https://placehold.co/200x200/011526/87c508?text=Bell',
      category: 'icons',
      tags: ['notificações', 'alerta', 'ui'],
      size: '35 KB',
      format: 'SVG'
    },
    {
      id: 11,
      name: 'Vídeo Demo',
      type: 'videos',
      url: 'https://placehold.co/400x300/011526/87c508?text=Demo',
      category: 'videos',
      tags: ['demo', 'apresentação', 'vídeo'],
      size: '22.5 MB',
      format: 'MP4'
    },
    {
      id: 12,
      name: 'Efeito Sonoro',
      type: 'audio',
      url: 'https://placehold.co/400x200/87c508/ffffff?text=Sound',
      category: 'audio',
      tags: ['efeito', 'som', 'audio'],
      size: '125 KB',
      format: 'WAV'
    },
  ];

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (asset) => {
    // Mock download - em produção, faria download real
    console.log('Downloading:', asset.name);
    // Simular download
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = asset.name;
    link.click();
  };

  return (
    <div className="min-h-screen bg-brand-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-blue-900 mb-2 font-poppins font-medium">
            Biblioteca de Assets
          </h1>
          <p className="text-lg text-gray-600 font-poppins">
            Gerencie e organize todos os seus assets em um só lugar
          </p>
        </div>

        {/* Barra de busca e filtros */}
        <div className="mb-8 space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar assets por nome ou tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
            />
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors font-poppins ${
                    selectedCategory === category.id
                      ? 'bg-brand-green text-brand-blue-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de assets */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600 font-poppins">
            {filteredAssets.length} {filteredAssets.length === 1 ? 'asset encontrado' : 'assets encontrados'}
          </p>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-poppins">
              Nenhum asset encontrado com os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Preview do asset */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {asset.type === 'images' || asset.type === 'icons' ? (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : asset.type === 'videos' ? (
                    <div className="w-full h-full flex items-center justify-center bg-brand-blue-900">
                      <Video className="w-16 h-16 text-brand-green" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-green">
                      <Music className="w-16 h-16 text-white" />
                    </div>
                  )}
                  
                  {/* Overlay com botão de download */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDownload(asset)}
                      className="bg-brand-green text-brand-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-brand-green-500 transition-colors font-poppins font-medium flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>

                {/* Informações do asset */}
                <div className="p-4">
                  <h3 className="font-semibold text-brand-blue-900 mb-1 font-poppins font-medium truncate">
                    {asset.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2 font-poppins">
                    <span>{asset.format}</span>
                    <span>{asset.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {asset.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-poppins"
                      >
                        {tag}
                      </span>
                    ))}
                    {asset.tags.length > 2 && (
                      <span className="px-2 py-0.5 text-gray-500 text-xs font-poppins">
                        +{asset.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assets;

