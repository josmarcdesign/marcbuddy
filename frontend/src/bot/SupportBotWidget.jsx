import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import supportBotConfig from './supportBotConfig';

const mergeConfig = (base, override = {}) => ({
  ...base,
  ...override,
  colors: { ...base.colors, ...(override.colors || {}) },
  colorsHex: { ...(base.colorsHex || {}), ...(override.colorsHex || {}) },
  trigger: { ...base.trigger, ...(override.trigger || {}) },
});

const readLocalConfig = () => {
  try {
    const saved = localStorage.getItem('botConfigMock');
    return saved ? JSON.parse(saved) : null;
  } catch (_e) {
    return null;
  }
};

const SupportBotWidget = ({
  configOverride,
  forceOpen = false,
  hideTrigger = false,
  mode = 'floating', // 'floating' | 'inline'
  maxHeight = '85vh',
  wrapperClassName = '',
}) => {
  const localOverride = readLocalConfig();
  const config = useMemo(
    () => mergeConfig(supportBotConfig, { ...(localOverride || {}), ...(configOverride || {}) }),
    [localOverride, configOverride]
  );
  const [open, setOpen] = useState(forceOpen || mode === 'inline');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    {
      id: 'welcome',
      from: 'bot',
      text: config.initialMessage,
      meta: 'status',
    },
  ]);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history, open]);

  const handleSend = () => {
    if (!message.trim() || busy) return;
    const userMsg = {
      id: `user-${Date.now()}`,
      from: 'user',
      text: message.trim(),
    };
    setHistory((prev) => [...prev, userMsg]);
    setMessage('');
    setBusy(true);

    // Placeholder de resposta do agente (IA futura)
    setTimeout(() => {
      setHistory((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          from: 'bot',
          text:
            'Recebi sua mensagem! Aqui você poderá conectar uma IA ou sistema de atendimento humano. (Resposta simulada)',
        },
      ]);
      setBusy(false);
    }, 2000);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const headerStyle =
    config.colorsHex?.headerFrom && config.colorsHex?.headerTo
      ? { backgroundImage: `linear-gradient(90deg, ${config.colorsHex.headerFrom}, ${config.colorsHex.headerTo})` }
      : {};

  const userBubbleStyle = config.colorsHex?.userBubbleBg
    ? {
        backgroundColor: config.colorsHex.userBubbleBg,
        color: config.colorsHex.userBubbleColor || '#ffffff',
      }
    : {};

  const botBubbleStyle = config.colorsHex?.botBubbleBg
    ? {
        backgroundColor: config.colorsHex.botBubbleBg,
        color: config.colorsHex.botBubbleColor || '#1f2937',
        borderColor: config.colorsHex.border || undefined,
      }
    : {};

  const containerClass =
    mode === 'inline'
      ? `${wrapperClassName}`
      : `${wrapperClassName} fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3`;

  return (
    <div className={containerClass}>
      {open && (
        <div
          className={`w-[350px] max-w-[90vw] h-[450px] bg-white rounded-[15px] shadow-2xl border ${config.colors.border} flex flex-col overflow-hidden transition-all duration-300 ease-out`}
          style={{
            animation: 'slideUpFade 0.3s ease-out',
          }}
        >
          <div
            className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${config.colors.headerFrom} ${config.colors.headerTo} text-white border-0`}
            style={headerStyle}
          >
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-white/15 flex items-center justify-center border-0 outline-none ring-0">
                {config.avatarUrl ? (
                  <img src={config.avatarUrl} alt={config.name} className="h-6 w-6 rounded-lg object-cover border-0 outline-none" />
                ) : (
                  <MessageCircle className="w-3.5 h-3.5" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold font-poppins">{config.name}</p>
              </div>
            </div>
            <button
              aria-label="Fechar"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
              <div
                ref={chatRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50"
              >
                {history.map((msg) => (
                  <div
                    key={msg.id}
                  className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                  {msg.from === 'bot' && (
                    <div className="h-8 w-8 rounded-full bg-brand-blue-900 flex items-center justify-center flex-shrink-0">
                      {config.avatarUrl ? (
                        <img src={config.avatarUrl} alt={config.name} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm font-poppins ${
                        msg.from === 'user' ? config.colors.userBubble : config.colors.botBubble
                      }`}
                      style={msg.from === 'user' ? userBubbleStyle : botBubbleStyle}
                    >
                      <span>{msg.text}</span>
                    </div>
                  </div>
                ))}
                {busy && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="h-8 w-8 rounded-full bg-brand-blue-900 flex items-center justify-center flex-shrink-0">
                    {config.avatarUrl ? (
                      <img src={config.avatarUrl} alt={config.name} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <MessageCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-green" />
                    <span>Digitando...</span>
                    </div>
                  </div>
                )}
            </div>

            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKey}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-brand-green focus:border-brand-green bg-white"
                  placeholder="Digite sua mensagem..."
              />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={busy || !message.trim()}
                  className="px-4 py-2 rounded-lg bg-brand-green text-brand-blue-900 font-semibold text-sm font-poppins hover:bg-brand-green/90 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center gap-1"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!hideTrigger && !open && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative inline-flex items-center justify-center w-12 h-12 bg-brand-blue-900 text-white rounded-full shadow-xl hover:bg-brand-blue-800 transition"
          aria-label={config.trigger?.title || 'Abrir suporte'}
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SupportBotWidget;
