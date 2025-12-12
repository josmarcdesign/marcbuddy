import { useEffect, useState } from 'react';
import api from '../../services/api';
import supportBotConfig from '../../config/supportBotConfig';
import { Save, RefreshCcw, PaintBucket, User, Image, MessageCircle, Palette } from 'lucide-react';

const SupportBotSettings = () => {
  const [form, setForm] = useState(() => ({
    name: supportBotConfig.name,
    subtitle: supportBotConfig.subtitle,
    assistantName: supportBotConfig.assistantName,
    initialMessage: supportBotConfig.initialMessage,
    avatarUrl: supportBotConfig.avatarUrl || '',
    colors: { ...supportBotConfig.colors },
    topics: supportBotConfig.topics || [],
    quickReplies: supportBotConfig.quickReplies || [],
    trigger: { ...supportBotConfig.trigger },
  }));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const updateField = (path, value) => {
    setForm((prev) => {
      const cloned = structuredClone(prev);
      const parts = path.split('.');
      let ref = cloned;
      while (parts.length > 1) {
        const p = parts.shift();
        ref[p] = ref[p] || {};
        ref = ref[p];
      }
      ref[parts[0]] = value;
      return cloned;
    });
  };

  const handleTopicsChange = (val) => {
    const rows = val
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [value, label] = line.split('|').map((s) => s.trim());
        return { value: value || '', label: label || value || '' };
      })
      .filter((t) => t.value && t.label);
    updateField('topics', rows);
  };

  const handleQuickRepliesChange = (val) => {
    const rows = val
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    updateField('quickReplies', rows);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);
      await api.post('/admin/supportbot/config', form);
      setMessage({ type: 'success', text: 'Configuração atualizada e salva no arquivo.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erro ao salvar configuração.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: supportBotConfig.name,
      subtitle: supportBotConfig.subtitle,
      assistantName: supportBotConfig.assistantName,
      initialMessage: supportBotConfig.initialMessage,
      avatarUrl: supportBotConfig.avatarUrl || '',
      colors: { ...supportBotConfig.colors },
      topics: supportBotConfig.topics || [],
      quickReplies: supportBotConfig.quickReplies || [],
      trigger: { ...supportBotConfig.trigger },
    });
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-brand-green/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-brand-blue-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-blue-900 font-nunito">Configurar Bot de Suporte</h1>
            <p className="text-sm text-gray-600 font-poppins">
              Personalize nome, avatar, mensagens, tópicos, respostas rápidas e cores. Salva diretamente no arquivo de
              config.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm font-poppins ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 font-poppins">
              <User className="w-4 h-4 text-brand-green" />
              Identidade
            </div>
            <div className="space-y-2 text-sm font-poppins">
              <div>
                <label className="text-xs text-gray-600">Nome do bot</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Subtítulo</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                  value={form.subtitle}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Nome do assistente (texto)</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                  value={form.assistantName}
                  onChange={(e) => updateField('assistantName', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Avatar URL (opcional)</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                  value={form.avatarUrl}
                  onChange={(e) => updateField('avatarUrl', e.target.value)}
                  placeholder="https://...png"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 font-poppins">
              <MessageCircle className="w-4 h-4 text-brand-green" />
              Mensagens
            </div>
            <div className="space-y-2 text-sm font-poppins">
              <div>
                <label className="text-xs text-gray-600">Mensagem inicial</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green focus:border-brand-green resize-none"
                  rows={3}
                  value={form.initialMessage}
                  onChange={(e) => updateField('initialMessage', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Trigger - título</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                  value={form.trigger?.title || ''}
                  onChange={(e) => updateField('trigger.title', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Trigger - subtítulo</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                  value={form.trigger?.subtitle || ''}
                  onChange={(e) => updateField('trigger.subtitle', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 font-poppins">
              <Palette className="w-4 h-4 text-brand-green" />
              Cores
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-poppins">
              {[
                { key: 'headerFrom', label: 'Header from (gradient)' },
                { key: 'headerTo', label: 'Header to (gradient)' },
                { key: 'userBubble', label: 'Bolha usuário (classes)' },
                { key: 'botBubble', label: 'Bolha bot (classes)' },
                { key: 'border', label: 'Borda' },
                { key: 'chipBorder', label: 'Chip borda' },
                { key: 'chipHover', label: 'Chip hover classes' },
              ].map((item) => (
                <div key={item.key} className="space-y-1">
                  <label className="text-xs text-gray-600">{item.label}</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    value={form.colors?.[item.key] || ''}
                    onChange={(e) => updateField(`colors.${item.key}`, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 font-poppins">
              <PaintBucket className="w-4 h-4 text-brand-green" />
              Tópicos e Quick Replies
            </div>
            <div className="space-y-3 text-sm font-poppins">
              <div>
                <label className="text-xs text-gray-600">Tópicos (value|label por linha)</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green focus:border-brand-green resize-none"
                  rows={5}
                  defaultValue={(form.topics || []).map((t) => `${t.value}|${t.label}`).join('\n')}
                  onChange={(e) => handleTopicsChange(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Quick replies (uma por linha)</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green focus:border-brand-green resize-none"
                  rows={4}
                  defaultValue={(form.quickReplies || []).join('\n')}
                  onChange={(e) => handleQuickRepliesChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-green text-brand-blue-900 font-semibold text-sm font-poppins shadow-sm hover:bg-brand-green/90 disabled:opacity-60"
          >
            {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Salvando...' : 'Salvar e atualizar arquivo'}
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm font-poppins hover:bg-gray-200 disabled:opacity-60"
          >
            <RefreshCcw className="w-4 h-4" />
            Recarregar padrão
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportBotSettings;

