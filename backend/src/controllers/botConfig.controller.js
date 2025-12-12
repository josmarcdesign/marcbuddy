import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'config', 'supportBotConfig.json');

const ensureConfigFile = () => {
  if (!fs.existsSync(path.dirname(CONFIG_PATH))) {
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  }
  if (!fs.existsSync(CONFIG_PATH)) {
    const defaultConfig = {
      name: 'Suporte / Bot',
      subtitle: 'Aproxima a equipe ou uma IA (futuro)',
      assistantName: 'assistente',
      initialMessage:
        'Olá! Sou seu assistente. Conte o que precisa e eu encaminho. Em breve você poderá plugar uma IA aqui.',
      avatarUrl: null,
      topics: [
        { value: 'duvidas', label: 'Dúvidas gerais' },
        { value: 'pagamentos', label: 'Pagamentos/planos' },
        { value: 'mclients', label: 'MClients e briefings' },
        { value: 'plugins', label: 'Plugins e integrações' },
        { value: 'bugs', label: 'Problemas técnicos/bugs' },
      ],
      quickReplies: [
        'Quero ajuda com pagamento',
        'Como usar o MClients?',
        'Problema com plugin',
        'Fale com humano',
      ],
      colors: {
        headerFrom: 'from-brand-blue-900',
        headerTo: 'to-brand-green',
        userBubble: 'bg-brand-blue-900 text-white shadow-sm',
        botBubble: 'bg-white text-gray-800 border border-gray-100 shadow-sm',
        border: 'border-gray-100',
        chipBorder: 'border-gray-200',
        chipHover: 'hover:border-brand-green/60 hover:text-brand-blue-900',
      },
      trigger: {
        title: 'Suporte / Bot',
        subtitle: 'Configure com IA depois',
      },
    };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2), 'utf-8');
  }
};

export const getBotConfig = async (_req, res) => {
  try {
    ensureConfigFile();
    const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return res.json({ success: true, data: JSON.parse(data) });
  } catch (error) {
    console.error('Erro ao ler config do bot:', error);
    return res.status(500).json({ success: false, message: 'Erro ao ler configuração' });
  }
};

export const updateBotConfig = async (req, res) => {
  try {
    ensureConfigFile();
    const payload = req.body || {};
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(payload, null, 2), 'utf-8');
    return res.json({ success: true, message: 'Configuração atualizada', data: payload });
  } catch (error) {
    console.error('Erro ao salvar config do bot:', error);
    return res.status(500).json({ success: false, message: 'Erro ao salvar configuração' });
  }
};

