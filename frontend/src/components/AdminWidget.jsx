import { useState, useRef, useEffect } from 'react';

const AdminWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(null); // null, 'mobile', 'desktop'
  const [mobileDevice, setMobileDevice] = useState('iphone-12');
  const [desktopResolution, setDesktopResolution] = useState('1920x1080');
  const [showContainerDebug, setShowContainerDebug] = useState(false);
  const [customScale, setCustomScale] = useState(1);
  const iframeRef = useRef(null);

  const mobileDevices = {
    'iphone-12': { width: 390, height: 844, name: 'iPhone 12/13' },
    'iphone-se': { width: 375, height: 667, name: 'iPhone SE' },
    'iphone-14-pro': { width: 393, height: 852, name: 'iPhone 14 Pro' },
    'samsung-galaxy': { width: 360, height: 800, name: 'Samsung Galaxy' },
    'ipad': { width: 768, height: 1024, name: 'iPad' },
  };

  const desktopResolutions = {
    '1920x1080': { width: 1920, height: 1080, name: 'Full HD (1920x1080)' },
    '1366x768': { width: 1366, height: 768, name: 'HD (1366x768)' },
    '1440x900': { width: 1440, height: 900, name: '1440x900' },
    '1536x864': { width: 1536, height: 864, name: '1536x864' },
    '2560x1440': { width: 2560, height: 1440, name: '2K (2560x1440)' },
  };

  const calculateScale = (deviceWidth, deviceHeight) => {
    // Área disponível no modal (descontando padding, header, controles)
    const modalPadding = 64; // 32px de cada lado
    const headerHeight = 80;
    const controlsHeight = 60;
    const infoHeight = 40;
    const availableWidth = window.innerWidth - modalPadding - 100; // Margem extra
    const availableHeight = window.innerHeight - headerHeight - controlsHeight - infoHeight - 100; // Margem extra
    
    const scaleX = availableWidth / deviceWidth;
    const scaleY = availableHeight / deviceHeight;
    
    return Math.min(scaleX, scaleY, 1); // Não aumentar além do tamanho original
  };

  const getDeviceInfo = () => {
    if (previewMode === 'mobile') {
      return mobileDevices[mobileDevice];
    } else if (previewMode === 'desktop') {
      return desktopResolutions[desktopResolution];
    }
    return null;
  };

  const deviceInfo = getDeviceInfo();
  const autoScale = deviceInfo ? calculateScale(deviceInfo.width, deviceInfo.height) : 1;
  const scale = previewMode ? (customScale * autoScale) : 1;

  // Injetar CSS no iframe para mostrar contornos dos containers
  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDoc) return;

    // Remover estilos anteriores se existirem
    const existingDebugStyle = iframeDoc.getElementById('container-debug-style');
    if (existingDebugStyle) {
      existingDebugStyle.remove();
    }
    
    const existingScrollbarStyle = iframeDoc.getElementById('hide-scrollbar-style');
    if (existingScrollbarStyle) {
      existingScrollbarStyle.remove();
    }

    // Sempre injetar CSS para esconder scrollbar mas manter rolagem
    const scrollbarStyle = iframeDoc.createElement('style');
    scrollbarStyle.id = 'hide-scrollbar-style';
    scrollbarStyle.textContent = `
      html, body {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      html::-webkit-scrollbar, body::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `;
    iframeDoc.head.appendChild(scrollbarStyle);

    // Remover event listeners anteriores
    const allElements = iframeDoc.querySelectorAll('div, section, main, header, footer, article, aside, nav');
    allElements.forEach(el => {
      const existingListener = el._debugClickListener;
      if (existingListener) {
        el.removeEventListener('click', existingListener);
        delete el._debugClickListener;
      }
    });

    if (showContainerDebug) {
      // Criar e injetar CSS
      const style = iframeDoc.createElement('style');
      style.id = 'container-debug-style';
      style.textContent = `
        div, section, main, header, footer, article, aside, nav {
          outline: 2px solid rgba(255, 0, 0, 0.5) !important;
          outline-offset: -1px !important;
          cursor: pointer !important;
          position: relative !important;
        }
        div:hover, section:hover, main:hover, header:hover, footer:hover, article:hover, aside:hover, nav:hover {
          outline: 2px solid rgba(255, 0, 0, 0.8) !important;
        }
        .container-debug-label {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          background: rgba(255, 0, 0, 0.9) !important;
          color: white !important;
          padding: 3px 6px !important;
          font-size: 10px !important;
          font-family: monospace !important;
          z-index: 999999 !important;
          pointer-events: none !important;
          white-space: nowrap !important;
          max-width: 300px !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          line-height: 1.3 !important;
          border-radius: 0 0 4px 0 !important;
        }
      `;
      iframeDoc.head.appendChild(style);

      // Adicionar labels informativos e event listeners
      allElements.forEach(el => {
        // Remover label anterior se existir
        const existingLabel = el.querySelector('.container-debug-label');
        if (existingLabel) {
          existingLabel.remove();
        }

        // Criar label com informações
        const label = iframeDoc.createElement('div');
        label.className = 'container-debug-label';
        
        // Coletar informações do elemento
        const info = [];
        
        // Tag name
        info.push(`<${el.tagName.toLowerCase()}>`);
        
        // ID
        if (el.id) {
          info.push(`#${el.id}`);
        }
        
        // Classes (primeiras 3)
        if (el.className && typeof el.className === 'string' && el.className.trim()) {
          const classes = el.className.trim().split(/\s+/).slice(0, 3);
          if (classes.length > 0) {
            info.push(`.${classes.join('.')}`);
            if (el.className.trim().split(/\s+/).length > 3) {
              info[info.length - 1] += '...';
            }
          }
        }
        
        label.textContent = info.join(' ');
        el.appendChild(label);
        const clickHandler = (e) => {
          e.stopPropagation();
          const elementId = el.id || el.className?.split(' ')[0] || el.tagName.toLowerCase();
          
          // Tentar copiar o ID primeiro, depois a primeira classe, depois a tag
          let textToCopy = '';
          if (el.id) {
            textToCopy = el.id;
          } else if (el.className && el.className.trim()) {
            textToCopy = el.className.split(' ')[0];
          } else {
            textToCopy = el.tagName.toLowerCase();
          }

          // Copiar para clipboard
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
              // Feedback visual temporário
              const originalOutline = el.style.outline;
              el.style.outline = '3px solid rgba(0, 255, 0, 0.8)';
              setTimeout(() => {
                el.style.outline = originalOutline || '';
              }, 500);
            }).catch(err => {
              console.error('Erro ao copiar:', err);
            });
          } else {
            // Fallback para navegadores antigos
            const textArea = iframeDoc.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            iframeDoc.body.appendChild(textArea);
            textArea.select();
            try {
              iframeDoc.execCommand('copy');
              const originalOutline = el.style.outline;
              el.style.outline = '3px solid rgba(0, 255, 0, 0.8)';
              setTimeout(() => {
                el.style.outline = originalOutline || '';
              }, 500);
            } catch (err) {
              console.error('Erro ao copiar:', err);
            }
            iframeDoc.body.removeChild(textArea);
          }
        };

        el.addEventListener('click', clickHandler);
        el._debugClickListener = clickHandler;
      });
    }

    // Cleanup
    return () => {
      if (iframeDoc) {
        const allElements = iframeDoc.querySelectorAll('div, section, main, header, footer, article, aside, nav');
        allElements.forEach(el => {
          const existingListener = el._debugClickListener;
          if (existingListener) {
            el.removeEventListener('click', existingListener);
            delete el._debugClickListener;
          }
        });
      }
    };
  }, [showContainerDebug, previewMode, mobileDevice, desktopResolution]);

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] bg-brand-green text-brand-blue-900 p-4 rounded-full shadow-2xl hover:bg-brand-green-500 transition-all duration-300 flex items-center justify-center w-16 h-16"
        aria-label="Abrir painel admin"
        style={{ zIndex: 9999 }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Modal Admin */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center p-4" style={{ zIndex: 9998 }}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
                Painel Admin - Debug
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setPreviewMode(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Fechar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-auto p-6">
              {!previewMode ? (
                /* Menu Principal */
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-brand-blue-900 font-nunito mb-4">
                    Opções de Debug
                  </h3>
                  
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className="w-full p-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-brand-blue-900 font-nunito">Preview Mobile</h4>
                        <p className="text-sm text-gray-600 font-poppins">Visualize o site em diferentes dispositivos móveis</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className="w-full p-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-brand-blue-900 font-nunito">Preview Desktop</h4>
                        <p className="text-sm text-gray-600 font-poppins">Visualize o site em diferentes resoluções de desktop</p>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                /* Preview de Dispositivo */
                <div className="space-y-4">
                  {/* Controles */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <button
                      onClick={() => setPreviewMode(null)}
                      className="flex items-center gap-2 text-brand-blue-900 hover:text-brand-green transition-colors font-poppins"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Voltar
                    </button>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="container-debug"
                          checked={showContainerDebug}
                          onChange={(e) => setShowContainerDebug(e.target.checked)}
                          className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                        />
                        <label htmlFor="container-debug" className="text-sm text-brand-blue-900 font-poppins cursor-pointer">
                          Mostrar contornos dos containers
                        </label>
                      </div>

                      {previewMode === 'mobile' && (
                        <div className="flex items-center gap-2">
                          <label htmlFor="scale-control" className="text-sm text-brand-blue-900 font-poppins whitespace-nowrap">
                            Escala:
                          </label>
                          <input
                            type="range"
                            id="scale-control"
                            min="0.25"
                            max="2"
                            step="0.05"
                            value={customScale}
                            onChange={(e) => setCustomScale(parseFloat(e.target.value))}
                            className="w-24"
                          />
                          <span className="text-sm text-brand-blue-900 font-poppins min-w-[3rem]">
                            {Math.round(customScale * 100)}%
                          </span>
                          <button
                            onClick={() => setCustomScale(1)}
                            className="text-xs text-brand-blue-900 hover:text-brand-green transition-colors font-poppins px-2 py-1 border border-gray-300 rounded hover:border-brand-green"
                          >
                            Reset
                          </button>
                        </div>
                      )}
                    </div>

                    {previewMode === 'mobile' ? (
                      <select
                        value={mobileDevice}
                        onChange={(e) => setMobileDevice(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green font-poppins"
                      >
                        {Object.entries(mobileDevices).map(([key, device]) => (
                          <option key={key} value={key}>
                            {device.name} ({device.width}x{device.height})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={desktopResolution}
                        onChange={(e) => setDesktopResolution(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green font-poppins"
                      >
                        {Object.entries(desktopResolutions).map(([key, res]) => (
                          <option key={key} value={key}>
                            {res.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Preview com Moldura */}
                  <div 
                    className="flex items-center justify-center bg-gray-100 rounded-lg p-4 overflow-auto preview-container" 
                    style={{ minHeight: '400px' }}
                  >
                    <style>{`
                      .preview-container {
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                      }
                      .preview-container::-webkit-scrollbar {
                        display: none;
                        width: 0;
                        height: 0;
                      }
                    `}</style>
                    <div
                      className="relative bg-white shadow-2xl mx-auto"
                      style={{
                        width: `${deviceInfo.width}px`,
                        height: `${deviceInfo.height}px`,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        minWidth: `${deviceInfo.width}px`,
                        minHeight: `${deviceInfo.height}px`,
                      }}
                    >
                      {/* Moldura Mobile */}
                      {previewMode === 'mobile' && (
                        <>
                          {/* Notch superior */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
                          {/* Borda arredondada */}
                          <div className="absolute inset-0 border-8 border-black rounded-[2.5rem] pointer-events-none"></div>
                          {/* Botão home (se iPhone) */}
                          {mobileDevice.includes('iphone') && !mobileDevice.includes('iphone-14-pro') && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full"></div>
                          )}
                        </>
                      )}

                      {/* Moldura Desktop */}
                      {previewMode === 'desktop' && (
                        <div className="absolute inset-0 border-4 border-gray-800 rounded-lg pointer-events-none">
                          {/* Webcam notch */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-800 rounded-b-lg"></div>
                        </div>
                      )}

                      {/* Conteúdo do Preview */}
                      <iframe
                        ref={iframeRef}
                        src={window.location.origin + window.location.pathname + window.location.search}
                        className="border-0 rounded-lg"
                        style={{
                          borderRadius: previewMode === 'mobile' ? '2rem' : '0.5rem',
                          pointerEvents: 'auto',
                          width: `${deviceInfo.width}px`,
                          height: `${deviceInfo.height}px`,
                          border: 'none',
                          display: 'block',
                        }}
                        title="Device Preview"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                        scrolling="yes"
                        onLoad={() => {
                          // Aplicar CSS para esconder scrollbar quando o iframe carregar
                          const iframe = iframeRef.current;
                          if (iframe) {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                            if (iframeDoc) {
                              // Remover estilo anterior se existir
                              const existingScrollbarStyle = iframeDoc.getElementById('hide-scrollbar-style');
                              if (existingScrollbarStyle) {
                                existingScrollbarStyle.remove();
                              }

                              // Injetar CSS para esconder scrollbar mas manter rolagem
                              const scrollbarStyle = iframeDoc.createElement('style');
                              scrollbarStyle.id = 'hide-scrollbar-style';
                              scrollbarStyle.textContent = `
                                html, body {
                                  scrollbar-width: none !important;
                                  -ms-overflow-style: none !important;
                                }
                                html::-webkit-scrollbar, body::-webkit-scrollbar {
                                  display: none !important;
                                  width: 0 !important;
                                  height: 0 !important;
                                }
                                * {
                                  scrollbar-width: none !important;
                                  -ms-overflow-style: none !important;
                                }
                                *::-webkit-scrollbar {
                                  display: none !important;
                                  width: 0 !important;
                                  height: 0 !important;
                                }
                              `;
                              iframeDoc.head.appendChild(scrollbarStyle);
                            }
                          }
                          
                          // Reaplicar o estilo quando o iframe carregar
                          if (showContainerDebug) {
                            setShowContainerDebug(false);
                            setTimeout(() => setShowContainerDebug(true), 100);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center text-sm text-gray-600 font-poppins">
                    <p>
                      Resolução: {deviceInfo.width} x {deviceInfo.height} 
                      {scale < 1 && ` (Escala: ${Math.round(scale * 100)}%)`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminWidget;

