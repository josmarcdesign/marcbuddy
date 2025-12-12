import { useEffect, useState } from 'react';
import api from '../services/api';
import supportBotConfig from './supportBotConfig';
import SupportBotWidget from './SupportBotWidget';

const BotConfig = () => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const colorPresets = [
    { name: 'Azul (brand-blue-900)', value: '#011526', tail: 'from-brand-blue-900' },
    { name: 'Verde (brand-green)', value: '#87c508', tail: 'from-brand-green' },
    { name: 'Off-white (background)', value: '#F5F5F5', tail: 'from-gray-50' },
    { name: 'Cinza texto', value: '#111827', tail: 'from-gray-900' },
  ];

  const bubbleClassPresets = [
    { name: 'Azul', value: 'bg-brand-blue-900 text-white shadow-sm' },
    { name: 'Verde', value: 'bg-brand-green text-brand-blue-900 shadow-sm' },
    { name: 'Claro (off-white)', value: 'bg-[#F5F5F5] text-gray-800 border border-gray-200 shadow-sm' },
  ];

  const bubblePresets = [
    { name: 'Default Azul', bg: '#011526', color: '#ffffff', tail: 'bg-brand-blue-900 text-white shadow-sm' },
    { name: 'Verde', bg: '#87c508', color: '#011526', tail: 'bg-brand-green text-brand-blue-900 shadow-sm' },
    { name: 'Claro', bg: '#F5F5F5', color: '#111827', tail: 'bg-[#F5F5F5] text-gray-800 border border-gray-200 shadow-sm' },
  ];

  const isMock = () => {
    const token = sessionStorage.getItem('token');
    return token?.startsWith('mock-token:');
  };

  const loadLocal = () => {
    try {
      const saved = localStorage.getItem('botConfigMock');
      if (saved) return JSON.parse(saved);
    } catch (_e) {
      /* ignore */
    }
    return null;
  };

  const saveLocal = (data) => {
    try {
      localStorage.setItem('botConfigMock', JSON.stringify(data));
    } catch (_e) {
      /* ignore */
    }
  };

  const fetchConfig = async () => {
    try {
      setLoading(true);
      if (isMock()) {
        const local = loadLocal();
        setForm(local || supportBotConfig);
        setToast({ type: 'info', msg: 'Modo mock: usando config local.' });
      } else {
        const { data } = await api.get('/admin/bot-config');
        setForm(data.data);
      }
    } catch (error) {
      setForm(loadLocal() || supportBotConfig);
      setToast({ type: 'error', msg: 'Backend indisponível. Usando config local (mock).' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSave = async () => {
    try {
      setSaving(true);
      if (isMock()) {
        saveLocal(form);
        setToast({ type: 'success', msg: 'Config salva localmente (modo mock)' });
      } else {
        await api.post('/admin/bot-config', form);
        setToast({ type: 'success', msg: 'Config atualizada' });
      }
    } catch (error) {
      setToast({ type: 'error', msg: 'Erro ao salvar' });
    } finally {
      setSaving(false);
    }
  };

  const parseList = (text) =>
    text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

  const topicsText =
    form?.topics?.map((t) => `${t.value}|${t.label}`).join('\n') || '';
  const quickText = form?.quickReplies?.join('\n') || '';

  const handlePreset = (field, value) => {
    setForm((prev) => ({
      ...prev,
      colorsHex: { ...(prev.colorsHex || {}), [field]: value },
    }));
  };

  const handleBubblePreset = (role, preset) => {
    setForm((prev) => ({
      ...prev,
      colorsHex: {
        ...(prev.colorsHex || {}),
        [`${role}BubbleBg`]: preset.bg,
        [`${role}BubbleColor`]: preset.color,
      },
      colors: {
        ...(prev.colors || {}),
        [role === 'user' ? 'userBubble' : 'botBubble']: preset.tail,
      },
    }));
  };

  if (loading || !form) {
    return <div className="p-4 text-sm">Carregando config...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-brand-blue-900 font-nunito">Configuração do Bot</h2>
          <p className="text-sm text-gray-600 font-poppins">Personalize nome, visual e respostas rápidas.</p>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-brand-green text-brand-blue-900 font-semibold text-sm shadow hover:bg-brand-green/90 disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Atualizar'}
        </button>
      </div>

      {toast && (
        <div
          className={`px-3 py-2 rounded-lg text-sm font-poppins mb-4 ${
            toast.type === 'success'
              ? 'bg-green-50 text-green-800'
              : toast.type === 'info'
              ? 'bg-amber-50 text-amber-800'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna de configurações */}
        <div className="space-y-4 max-h-[78vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 font-poppins">Nome</label>
              <input
                value={form.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-brand-green focus:border-brand-green"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 font-poppins">Subtítulo</label>
              <input
                value={form.subtitle || ''}
                onChange={(e) => updateField('subtitle', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-brand-green focus:border-brand-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 font-poppins">Nome do assistente</label>
              <input
                value={form.assistantName || ''}
                onChange={(e) => updateField('assistantName', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-brand-green focus:border-brand-green"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 font-poppins">Avatar URL</label>
              <input
                value={form.avatarUrl || ''}
                onChange={(e) => updateField('avatarUrl', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                placeholder="Ex: /assets/bot.png"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700 font-poppins">Mensagem inicial</label>
            <textarea
              value={form.initialMessage || ''}
              onChange={(e) => updateField('initialMessage', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-brand-green focus:border-brand-green resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 font-poppins">Tópicos (um por linha, valor|label)</label>
              <textarea
                value={topicsText}
                onChange={(e) =>
                  updateField(
                    'topics',
                    parseList(e.target.value).map((line) => {
                      const [value, label] = line.split('|');
                      return { value: value?.trim(), label: label?.trim() || value?.trim() };
                    })
                  )
                }
                rows={5}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-brand-green focus:border-brand-green resize-none"
                placeholder="duvidas|Dúvidas gerais"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 font-poppins">Respostas rápidas (uma por linha)</label>
              <textarea
                value={quickText}
                onChange={(e) => updateField('quickReplies', parseList(e.target.value))}
                rows={5}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-brand-green focus:border-brand-green resize-none"
                placeholder="Quero ajuda com pagamento"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-brand-blue-900 font-nunito">Cores (classes Tailwind)</h3>
              {['headerFrom', 'headerTo', 'border', 'chipBorder', 'chipHover'].map((key) => (
                <div key={key} className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 font-poppins">{key}</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {colorPresets.map((p) => (
                      <button
                        key={`${key}-${p.name}`}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            colors: { ...(prev.colors || {}), [key]: p.tail },
                          }))
                        }
                        className={`flex items-center gap-1 px-2 py-1 rounded border ${
                          form.colors?.[key] === p.tail ? 'border-brand-green bg-brand-green/10' : 'border-gray-200'
                        } hover:border-brand-green/60`}
                      >
                        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: p.value }} />
                        <span className="text-xs font-poppins text-gray-700">{p.name}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    value={form.colors?.[key] || ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        colors: { ...(prev.colors || {}), [key]: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    placeholder="Ex: from-brand-blue-900"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-brand-blue-900 font-nunito">Cores (hex/inline)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: 'headerFrom', label: 'Header cor 1' },
                  { key: 'headerTo', label: 'Header cor 2' },
                  { key: 'border', label: 'Borda' },
                  { key: 'chipBorder', label: 'Borda chips' },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 font-poppins">{label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.colorsHex?.[key] || '#0047FF'}
                        onChange={(e) => handlePreset(key, e.target.value)}
                        className="h-9 w-10 border border-gray-200 rounded"
                      />
                      <input
                        type="text"
                        placeholder="#0047FF"
                        value={form.colorsHex?.[key] || ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            colorsHex: { ...(prev.colorsHex || {}), [key]: e.target.value },
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600 font-poppins">
                  <span>Presets header:</span>
                  {colorPresets.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        handlePreset('headerFrom', p.value);
                        handlePreset('headerTo', p.value);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 hover:border-brand-green/60"
                    >
                      <span className="h-4 w-4 rounded-full" style={{ backgroundColor: p.value }} />
                      {p.name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 font-poppins">
                  <span>Bolha usuário:</span>
                  {bubblePresets.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleBubblePreset('user', p)}
                      className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 hover:border-brand-green/60"
                    >
                      <span className="h-4 w-4 rounded-full" style={{ backgroundColor: p.bg }} />
                      {p.name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 font-poppins">
                  <span>Bolha bot:</span>
                  {bubblePresets.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleBubblePreset('bot', p)}
                      className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 hover:border-brand-green/60"
                    >
                      <span className="h-4 w-4 rounded-full" style={{ backgroundColor: p.bg }} />
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-brand-blue-900 font-nunito">Bolhas (classes Tailwind)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['userBubble', 'botBubble'].map((key) => (
                <div key={key} className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 font-poppins">{key}</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {bubbleClassPresets.map((p) => (
                      <button
                        key={`${key}-${p.name}`}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            colors: { ...(prev.colors || {}), [key]: p.value },
                          }))
                        }
                        className={`flex items-center gap-1 px-2 py-1 rounded border ${
                          form.colors?.[key] === p.value ? 'border-brand-green bg-brand-green/10' : 'border-gray-200'
                        } hover:border-brand-green/60`}
                      >
                        <span className="h-4 w-4 rounded-full bg-current" style={{ color: '#0047FF' }} />
                        <span className="text-xs font-poppins text-gray-700">{p.name}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    value={form.colors?.[key] || ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        colors: { ...(prev.colors || {}), [key]: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    placeholder="Ex: bg-brand-blue-900 text-white shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna de preview */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-brand-blue-900 font-nunito">Preview ao vivo</h3>
          <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50 flex justify-center">
            <SupportBotWidget
              configOverride={form}
              forceOpen
              hideTrigger
              mode="inline"
              maxHeight="65vh"
              wrapperClassName="relative"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotConfig;

