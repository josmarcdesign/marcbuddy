import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendConfigPath = path.resolve(__dirname, '../../frontend/src/config/supportBotConfig.js');

const sanitizeArray = (arr) => (Array.isArray(arr) ? arr : []);

const buildConfigContent = (data) => {
  const topics = sanitizeArray(data.topics);
  const quickReplies = sanitizeArray(data.quickReplies);
  const colors = data.colors || {};
  const trigger = data.trigger || {};

  return `const supportBotConfig = {
  name: ${JSON.stringify(data.name || 'Suporte / Bot')},
  subtitle: ${JSON.stringify(data.subtitle || 'Aproxima a equipe ou uma IA (futuro)')},
  assistantName: ${JSON.stringify(data.assistantName || 'assistente')},
  initialMessage: ${JSON.stringify(
    data.initialMessage ||
      'Olá! Sou seu assistente. Conte o que precisa e eu encaminho. Em breve você poderá plugar uma IA aqui.'
  )},
  topics: ${JSON.stringify(topics, null, 2)},
  quickReplies: ${JSON.stringify(quickReplies, null, 2)},
  colors: ${JSON.stringify(
    {
      headerFrom: colors.headerFrom || 'from-brand-blue-900',
      headerTo: colors.headerTo || 'to-brand-green',
      userBubble: colors.userBubble || 'bg-brand-blue-900 text-white shadow-sm',
      botBubble: colors.botBubble || 'bg-white text-gray-800 border border-gray-100 shadow-sm',
      border: colors.border || 'border-gray-100',
      chipBorder: colors.chipBorder || 'border-gray-200',
      chipHover: colors.chipHover || 'hover:border-brand-green/60 hover:text-brand-blue-900',
    },
    null,
    2
  )},
  avatarUrl: ${JSON.stringify(data.avatarUrl || null)},
  trigger: ${JSON.stringify(
    {
      title: (trigger && trigger.title) || 'Suporte / Bot',
      subtitle: (trigger && trigger.subtitle) || 'Configure com IA depois',
    },
    null,
    2
  )},
};

export default supportBotConfig;
`;
};

export const updateSupportBotConfig = async (req, res) => {
  try {
    const content = buildConfigContent(req.body || {});
    await fs.promises.writeFile(frontendConfigPath, content, 'utf-8');
    return res.json({ success: true, message: 'Config do bot atualizada.' });
  } catch (error) {
    console.error('Erro ao atualizar config do bot:', error);
    return res.status(500).json({ success: false, message: 'Erro ao salvar config do bot.' });
  }
};


