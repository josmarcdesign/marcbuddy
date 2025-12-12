import { useState } from 'react';
import { BRAND_COLORS } from '../../../config/brand';

// Função auxiliar para converter RGB para HEX
const rgbToHex = (r, g, b) => {
  return `#${[r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
};

// Função auxiliar para converter RGB para CMYK
const rgbToCmyk = (r, g, b) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  const c = k === 1 ? 0 : (1 - rNorm - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - gNorm - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - bNorm - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
};

const ColorBuddyGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [paletteName, setPaletteName] = useState('');
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedFormat, setCopiedFormat] = useState(null);

  // Função para gerar paleta com IA (simulada por enquanto)
  const generatePalette = async () => {
    if (!prompt.trim()) {
      setError('Por favor, descreva a paleta que você deseja gerar.');
      return;
    }

    setLoading(true);
    setError(null);
    setColors([]);
    setPaletteName('');

    try {
      // TODO: Integrar com API de IA (OpenAI/Claude)
      // Por enquanto, vamos simular uma resposta baseada no prompt
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulação inteligente baseada no prompt (será substituída pela resposta real da API)
      const promptLower = prompt.toLowerCase();
      let mockPaletteName = '';
      let mockColors = [];
      let mockColorNames = [];
      let mockColorMeanings = [];

      // Detectar contexto do prompt para gerar paleta apropriada
      if (promptLower.includes('cafeteria') || promptLower.includes('café') || promptLower.includes('coffee')) {
        if (promptLower.includes('dark') || promptLower.includes('escuro')) {
          mockPaletteName = 'Café Noturno';
          mockColors = [
            { r: 30, g: 20, b: 15 },    // Marrom escuro
            { r: 101, g: 67, b: 33 },   // Marrom médio
            { r: 139, g: 90, b: 43 },   // Marrom claro
            { r: 200, g: 150, b: 100 }, // Bege
            { r: 45, g: 30, b: 20 }    // Preto acastanhado
          ];
          mockColorNames = [
            'Café Expresso',
            'Grão Torrado',
            'Caramelo Suave',
            'Creme Leitoso',
            'Sombra Noturna'
          ];
          mockColorMeanings = [
            'Representa a profundidade e intensidade do café expresso, transmitindo sofisticação e qualidade premium. No contexto de uma cafeteria dark, esta cor cria um ambiente acolhedor e intimista.',
            'Evoca o processo de torração dos grãos, simbolizando autenticidade e tradição. Esta cor conecta o cliente com a origem do produto, transmitindo confiança e expertise.',
            'Remete ao doce sutil do caramelo, adicionando calor e aconchego à paleta. Em um ambiente dark, esta cor cria contraste suave, destacando elementos importantes sem quebrar a atmosfera.',
            'Representa a leveza e suavidade do leite, oferecendo respiro visual na paleta escura. Esta cor é ideal para textos e elementos secundários, mantendo legibilidade sem perder a identidade dark.',
            'Cria profundidade e contraste, estabelecendo a base escura da identidade. Esta cor é fundamental para criar a atmosfera noturna e sofisticada que define uma cafeteria dark.'
          ];
        } else {
          mockPaletteName = 'Café Matinal';
          mockColors = [
            { r: 139, g: 90, b: 43 },   // Marrom
            { r: 200, g: 150, b: 100 }, // Bege
            { r: 255, g: 248, b: 240 }, // Creme
            { r: 101, g: 67, b: 33 },   // Marrom médio
            { r: 255, g: 255, b: 255 }  // Branco
          ];
          mockColorNames = [
            'Grão Natural',
            'Creme Suave',
            'Leite Espumado',
            'Café Claro',
            'Branco Puro'
          ];
          mockColorMeanings = [
            'Representa a autenticidade do grão de café, transmitindo naturalidade e qualidade. Em uma cafeteria, esta cor conecta o cliente com a origem do produto.',
            'Evoca a suavidade e acolhimento, criando um ambiente convidativo. Esta cor é ideal para áreas de descanso e socialização.',
            'Simboliza frescor e leveza, perfeita para criar espaços arejados e iluminados. Esta cor ajuda a equilibrar a paleta, oferecendo respiro visual.',
            'Representa o café no seu estado mais puro, transmitindo tradição e expertise. Esta cor é versátil e funciona bem em diferentes contextos.',
            'Cria contraste e limpeza visual, ideal para destacar informações importantes e manter a legibilidade em todos os elementos.'
          ];
        }
      } else if (promptLower.includes('corporativo') || promptLower.includes('empresa') || promptLower.includes('negócio')) {
        mockPaletteName = 'Profissional Moderno';
        mockColors = [
          { r: 15, g: 23, b: 42 },    // Azul escuro
          { r: 30, g: 58, b: 138 },   // Azul médio
          { r: 59, g: 130, b: 246 },  // Azul claro
          { r: 255, g: 255, b: 255 }, // Branco
          { r: 148, g: 163, b: 184 }  // Cinza
        ];
        mockColorNames = [
          'Azul Profundo',
          'Azul Confiança',
          'Azul Energia',
          'Branco Puro',
          'Cinza Neutro'
        ];
        mockColorMeanings = [
          'Transmite seriedade e profissionalismo, estabelecendo autoridade e confiança. No contexto corporativo, esta cor é associada à estabilidade e competência.',
          'Representa confiabilidade e comunicação eficaz, essenciais em ambientes corporativos. Esta cor promove sensação de segurança e parceria.',
          'Adiciona dinamismo e inovação à paleta, transmitindo modernidade e progresso. Ideal para destacar elementos de ação e crescimento.',
          'Cria clareza e organização visual, essencial para manter a comunicação profissional limpa e direta. Esta cor maximiza a legibilidade.',
          'Oferece equilíbrio e neutralidade, permitindo que as outras cores se destaquem. Perfeita para elementos de apoio e separadores.'
        ];
      } else {
        // Paleta genérica
        mockPaletteName = 'Paleta Harmoniosa';
        mockColors = [
          { r: 52, g: 152, b: 219 },   // Azul
          { r: 46, g: 204, b: 113 },   // Verde
          { r: 241, g: 196, b: 15 },   // Amarelo
          { r: 231, g: 76, b: 60 },   // Vermelho
          { r: 155, g: 89, b: 182 }   // Roxo
        ];
        mockColorNames = [
          'Azul Serenidade',
          'Verde Natureza',
          'Amarelo Energia',
          'Vermelho Paixão',
          'Roxo Criatividade'
        ];
        mockColorMeanings = [
          'Representa calma e confiança, transmitindo serenidade e estabilidade. Esta cor é ideal para criar ambientes tranquilos e profissionais.',
          'Evoca crescimento e harmonia, conectando com elementos naturais. Esta cor promove sensação de frescor e vitalidade.',
          'Simboliza otimismo e energia, adicionando vivacidade à paleta. Esta cor é perfeita para chamar atenção e transmitir positividade.',
          'Transmite paixão e intensidade, criando impacto visual forte. Esta cor é ideal para elementos de destaque e call-to-actions.',
          'Representa criatividade e inovação, adicionando sofisticação à paleta. Esta cor é versátil e funciona bem em diferentes contextos.'
        ];
      }

      const formattedColors = mockColors.map((color, index) => {
        const cmyk = rgbToCmyk(color.r, color.g, color.b);
        return {
          hex: rgbToHex(color.r, color.g, color.b),
          rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
          cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
          r: color.r,
          g: color.g,
          b: color.b,
          ...cmyk,
          name: mockColorNames[index] || `Cor ${index + 1}`,
          meaning: mockColorMeanings[index] || 'Esta cor foi selecionada para complementar a paleta.'
        };
      });

      setPaletteName(mockPaletteName);
      setColors(formattedColors);
    } catch (err) {
      setError('Erro ao gerar paleta. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Função para copiar cor
  const copyColor = async (color, index, format) => {
    let textToCopy = '';
    
    switch (format) {
      case 'hex':
        textToCopy = color.hex;
        break;
      case 'rgb':
        textToCopy = color.rgb;
        break;
      case 'cmyk':
        textToCopy = color.cmyk;
        break;
      default:
        return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopiedIndex(index);
      setCopiedFormat(format);
      setTimeout(() => {
        setCopiedIndex(null);
        setCopiedFormat(null);
      }, 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-blue-900 mb-4 font-poppins font-medium lg:text-5xl">
            Gerador de Paletas com IA
          </h1>
          <p className="text-lg text-gray-700 font-poppins lg:text-xl">
            Descreva a paleta que você precisa e deixe a IA criar para você
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <label htmlFor="prompt" className="block text-base sm:text-lg font-bold text-brand-blue-900 mb-3 font-poppins font-medium">
            Descreva sua paleta
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Paleta minimalista com tons de azul e branco para um site corporativo"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-green focus:outline-none font-poppins resize-none text-sm sm:text-base"
            rows="4"
            disabled={loading}
          />
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-500 font-poppins">
              Seja específico sobre cores, estilo e uso da paleta
            </p>
            <button
              onClick={generatePalette}
              disabled={loading || !prompt.trim()}
              className="w-full sm:w-auto bg-brand-green text-brand-blue-900 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-brand-green-500 transition-colors font-poppins font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647A5.97 5.97 0 0112 18c0-3.314-2.686-6-6-6z"></path>
                  </svg>
                  Gerando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Gerar Paleta
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800 font-poppins">{error}</p>
          </div>
        )}

        {/* Generated Palette */}
        {colors.length > 0 && (
          <div className="space-y-6">
            {/* Nome da Paleta */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <h2 className="text-2xl font-bold text-brand-blue-900 font-poppins font-medium">
                  {paletteName}
                </h2>
              </div>
              <p className="text-gray-600 font-poppins text-sm">
                Paleta gerada com base no seu pedido: "{prompt}"
              </p>
            </div>

            {/* Cores da Paleta */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-brand-blue-900 mb-4 sm:mb-6 font-poppins font-medium">
                Cores da Paleta
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4 hover:shadow-lg transition-shadow relative group"
                  >
                    {/* Nome da Cor */}
                    <div className="mb-2">
                      <h4 className="text-sm font-bold text-brand-blue-900 font-poppins font-medium">
                        {color.name}
                      </h4>
                    </div>

                    {/* Cor */}
                    <div className="mb-3">
                      <div
                        className="w-full h-24 rounded-lg border-2 border-gray-300 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                    </div>
                  
                  {/* Códigos de cor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-600 font-poppins flex-shrink-0">HEX:</span>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 relative">
                        <code className="text-xs font-mono text-brand-blue-900 font-bold truncate">{color.hex}</code>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyColor(color, index, 'hex');
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0 relative"
                          title="Copiar HEX"
                        >
                          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        {copiedIndex === index && copiedFormat === 'hex' && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                            Código Copiado!
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-600 font-poppins flex-shrink-0">RGB:</span>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 relative">
                        <code className="text-xs font-mono text-brand-blue-900 truncate">{color.rgb}</code>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyColor(color, index, 'rgb');
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0 relative"
                          title="Copiar RGB"
                        >
                          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        {copiedIndex === index && copiedFormat === 'rgb' && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                            Código Copiado!
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-600 font-poppins flex-shrink-0">CMYK:</span>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 relative">
                        <code className="text-xs font-mono text-brand-blue-900 truncate">{color.cmyk}</code>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyColor(color, index, 'cmyk');
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0 relative"
                          title="Copiar CMYK"
                        >
                          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        {copiedIndex === index && copiedFormat === 'cmyk' && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                            Código Copiado!
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Significado das Cores */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-brand-blue-900 mb-4 sm:mb-6 font-poppins font-medium">
                Significado das Cores
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-brand-green transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      {/* Amostra da Cor */}
                      <div
                        className="w-full sm:w-16 h-16 rounded-lg border-2 border-gray-300 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      
                      {/* Informações */}
                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h4 className="text-base sm:text-lg font-bold text-brand-blue-900 font-poppins font-medium">
                            {color.name}
                          </h4>
                          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                            {color.hex}
                          </span>
                        </div>
                        <p className="text-gray-700 font-poppins text-xs sm:text-sm leading-relaxed">
                          {color.meaning}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        {colors.length === 0 && !loading && (
          <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <p className="text-gray-600 font-poppins">
              Descreva a paleta que você precisa e clique em "Gerar Paleta" para começar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorBuddyGenerator;

