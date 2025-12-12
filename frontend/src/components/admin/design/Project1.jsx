import { useState } from 'react';
import { 
  Move, 
  Square, 
  Circle as CircleIcon, 
  Type, 
  PenTool, 
  Eraser as EraserIcon, 
  Droplet, 
  Layers, 
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  FlipVertical
} from 'lucide-react';

const Project1 = ({ isFullscreen = false }) => {
  const [selectedTool, setSelectedTool] = useState('move');
  const [layers, setLayers] = useState([
    { id: 1, name: 'Camada 1', visible: true, locked: false },
    { id: 2, name: 'Background', visible: true, locked: false },
  ]);

  const tools = [
    { id: 'move', icon: Move, name: 'Mover' },
    { id: 'rectangle', icon: Square, name: 'Retângulo' },
    { id: 'circle', icon: CircleIcon, name: 'Círculo' },
    { id: 'type', icon: Type, name: 'Texto' },
    { id: 'pen', icon: PenTool, name: 'Caneta' },
    { id: 'eraser', icon: EraserIcon, name: 'Borracha' },
    { id: 'eyedropper', icon: Droplet, name: 'Conta-gotas' },
  ];

  const toggleLayerVisibility = (layerId) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const toggleLayerLock = (layerId) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  return (
    <div className={`min-h-[600px] ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-200px)]'} flex flex-col bg-[#1e1e1e] text-white overflow-hidden ${isFullscreen ? '' : 'rounded-lg'}`}>
      {/* Top Bar - Menu e Controles */}
      <div className="h-12 bg-[#2d2d2d] border-b border-[#3d3d3d] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold font-poppins">MarcBuddy Design</span>
          <div className="h-6 w-px bg-[#3d3d3d]"></div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs hover:bg-[#3d3d3d] rounded transition-colors font-poppins">
              Arquivo
            </button>
            <button className="px-3 py-1 text-xs hover:bg-[#3d3d3d] rounded transition-colors font-poppins">
              Editar
            </button>
            <button className="px-3 py-1 text-xs hover:bg-[#3d3d3d] rounded transition-colors font-poppins">
              Imagem
            </button>
            <button className="px-3 py-1 text-xs hover:bg-[#3d3d3d] rounded transition-colors font-poppins">
              Camadas
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-[#3d3d3d] rounded transition-colors" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-[#3d3d3d] rounded transition-colors" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-[#3d3d3d] mx-1"></div>
          <button className="p-1.5 hover:bg-[#3d3d3d] rounded transition-colors" title="Rotacionar">
            <RotateCw className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-[#3d3d3d] rounded transition-colors" title="Espelhar Horizontal">
            <FlipHorizontal className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-[#3d3d3d] rounded transition-colors" title="Espelhar Vertical">
            <FlipVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 bg-[#252525] border-r border-[#3d3d3d] flex flex-col items-center py-2 gap-1">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            const isSelected = selectedTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`w-12 h-12 flex items-center justify-center rounded transition-colors relative ${
                  isSelected 
                    ? 'bg-[#3d3d3d] text-brand-green' 
                    : 'hover:bg-[#2d2d2d] text-gray-400'
                }`}
                title={tool.name}
              >
                <IconComponent className="w-5 h-5" />
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-green"></div>
                )}
              </button>
            );
          })}
          <div className="h-px w-10 bg-[#3d3d3d] my-2"></div>
          <button className="w-12 h-12 flex items-center justify-center rounded hover:bg-[#2d2d2d] text-gray-400 transition-colors" title="Configurações">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-[#1a1a1a] relative overflow-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white w-full max-w-4xl h-full max-h-[600px] shadow-2xl relative">
              {/* Canvas Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `
                    linear-gradient(#000 1px, transparent 1px),
                    linear-gradient(90deg, #000 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              ></div>
              {/* Placeholder Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🎨</div>
                  <p className="text-sm font-poppins">Área de Design</p>
                  <p className="text-xs mt-1 font-poppins">Ferramenta selecionada: {tools.find(t => t.id === selectedTool)?.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Layers and Properties */}
        <div className="w-64 bg-[#252525] border-l border-[#3d3d3d] flex flex-col">
          {/* Properties Panel */}
          <div className="border-b border-[#3d3d3d]">
            <div className="px-3 py-2 bg-[#2d2d2d] border-b border-[#3d3d3d]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-nunito">
                Propriedades
              </h3>
            </div>
            <div className="p-3 space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-poppins">Cor de Preenchimento</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-green rounded border border-[#3d3d3d] cursor-pointer"></div>
                  <input 
                    type="text" 
                    value="#00FF88" 
                    readOnly
                    className="flex-1 bg-[#1e1e1e] border border-[#3d3d3d] rounded px-2 py-1 text-xs text-white font-poppins"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-poppins">Cor da Borda</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-transparent border-2 border-white rounded cursor-pointer"></div>
                  <input 
                    type="text" 
                    value="Transparente" 
                    readOnly
                    className="flex-1 bg-[#1e1e1e] border border-[#3d3d3d] rounded px-2 py-1 text-xs text-white font-poppins"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-poppins">Espessura da Borda</label>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  defaultValue="0"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-poppins">Opacidade</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue="100"
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-400 w-10 text-right font-poppins">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Layers Panel */}
          <div className="flex-1 overflow-auto">
            <div className="px-3 py-2 bg-[#2d2d2d] border-b border-[#3d3d3d] flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-nunito">
                Camadas
              </h3>
              <button className="text-xs text-gray-400 hover:text-white transition-colors font-poppins">
                +
              </button>
            </div>
            <div className="p-2 space-y-1">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#2d2d2d] transition-colors group"
                >
                  <button
                    onClick={() => toggleLayerVisibility(layer.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {layer.visible ? (
                      <div className="w-4 h-4 border border-gray-400 rounded"></div>
                    ) : (
                      <div className="w-4 h-4"></div>
                    )}
                  </button>
                  <button
                    onClick={() => toggleLayerLock(layer.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {layer.locked ? (
                      <div className="w-4 h-4 border border-gray-400 rounded"></div>
                    ) : (
                      <div className="w-4 h-4"></div>
                    )}
                  </button>
                  <span className="flex-1 text-sm text-white font-poppins">{layer.name}</span>
                  <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-6 bg-[#2d2d2d] border-t border-[#3d3d3d] flex items-center justify-between px-4 text-xs text-gray-400 font-poppins">
        <div className="flex items-center gap-4">
          <span>100%</span>
          <span>RGB</span>
          <span>8 bits</span>
        </div>
        <div className="flex items-center gap-4">
          <span>1920 x 1080 px</span>
          <span>72.0 ppi</span>
        </div>
      </div>
    </div>
  );
};

export default Project1;

