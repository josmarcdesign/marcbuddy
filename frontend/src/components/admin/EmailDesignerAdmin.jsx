import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Mail, Copy, Save, FileText, Palette, RefreshCw, Send, X } from 'lucide-react';
import api from '../../services/api';

const EmailDesignerAdmin = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop', 'mobile'
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedTemplateForTest, setSelectedTemplateForTest] = useState(null);
  const [testEmail, setTestEmail] = useState('josmarcdesign@gmail.com');
  const [sendingTest, setSendingTest] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    html_content: '',
    type: 'welcome', // welcome, confirmation, reset, newsletter
    variables: [] // variáveis disponíveis no template
  });

  // Tipos de email disponíveis
  const emailTypes = [
    { value: 'welcome', label: 'Boas-vindas', description: 'Email enviado após cadastro' },
    { value: 'confirmation', label: 'Confirmação', description: 'Email de confirmação de conta' },
    { value: 'reset', label: 'Reset de Senha', description: 'Email para redefinir senha' },
    { value: 'newsletter', label: 'Newsletter', description: 'Email promocional/marketing' },
    { value: 'notification', label: 'Notificação', description: 'Email de notificações gerais' }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/email-templates');
      setTemplates(response.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      // Fallback para dados mockados se a API falhar
      setTemplates([
        {
          id: 1,
          name: 'Bem-vindo à MarcBuddy',
          subject: 'Bem-vindo! Sua conta foi criada com sucesso',
          type: 'welcome',
          html_content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo à MarcBuddy</title>
  <style>
    body { font-family: 'Nunito', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 800; }
    .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
    .content h2 { color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 700; }
    .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2); }
    .button:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3); }
    .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    .footer a { color: #10b981; text-decoration: none; }
    .highlight { background-color: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎨 MarcBuddy</h1>
    </div>
    <div class="content">
      <h2>Olá {{user_name}}!</h2>
      <p>Seja muito bem-vindo à <strong>MarcBuddy</strong>, sua plataforma completa de design gráfico e gestão de clientes!</p>

      <div class="highlight">
        <p><strong>🚀 O que você pode fazer agora:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Acessar ferramentas de design avançadas</li>
          <li>Gerenciar seus clientes e projetos</li>
          <li>Criar briefings e follow-throughs</li>
          <li>Organizar pagamentos e documentos</li>
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="{{dashboard_url}}" class="button">Acessar Minha Conta</a>
      </p>

      <p>Precisa de ajuda? Nossa equipe está sempre pronta para ajudar. Entre em contato conosco!</p>

      <p>Atenciosamente,<br>
      <strong>Equipe MarcBuddy</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 MarcBuddy. Todos os direitos reservados.</p>
      <p><a href="{{support_url}}">Suporte</a> | <a href="{{privacy_url}}">Política de Privacidade</a> | <a href="{{terms_url}}">Termos de Uso</a></p>
    </div>
  </div>
</body>
</html>`,
          variables: ['{{user_name}}', '{{user_email}}'],
          created_at: '2024-12-11',
          updated_at: '2024-12-11'
        },
        {
          id: 2,
          name: 'Confirmação de Email',
          subject: 'Confirme seu email na MarcBuddy',
          type: 'confirmation',
          html_content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirme seu Email</title>
  <style>
    body { font-family: 'Nunito', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 800; }
    .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
    .content h2 { color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 700; }
    .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2); }
    .button:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3); }
    .warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .warning h3 { color: #92400e; margin-top: 0; }
    .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    .footer a { color: #3b82f6; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎨 MarcBuddy</h1>
    </div>
    <div class="content">
      <h2>Confirme seu Email</h2>
      <p>Olá {{user_name}}!</p>
      <p>Obrigado por se cadastrar na <strong>MarcBuddy</strong>! Para ativar sua conta e começar a usar todas as nossas ferramentas, você precisa confirmar seu endereço de email.</p>

      <div class="warning">
        <h3>⚠️ Ação necessária</h3>
        <p>Este link é válido por <strong>24 horas</strong>. Após esse período, você precisará solicitar um novo link de confirmação.</p>
      </div>

      <p style="text-align: center;">
        <a href="{{confirmation_url}}" class="button">Confirmar Email</a>
      </p>

      <p><strong>Não consegue clicar no botão?</strong> Copie e cole este link no seu navegador:</p>
      <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">{{confirmation_url}}</p>

      <p>Se você não se cadastrou na MarcBuddy, ignore este email.</p>

      <p>Atenciosamente,<br>
      <strong>Equipe MarcBuddy</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 MarcBuddy. Todos os direitos reservados.</p>
      <p><a href="{{support_url}}">Suporte</a> | <a href="{{privacy_url}}">Política de Privacidade</a></p>
    </div>
  </div>
</body>
</html>`,
          variables: ['{{confirmation_link}}', '{{user_name}}'],
          created_at: '2024-12-10',
          updated_at: '2024-12-10'
        },
        {
          id: 3,
          name: 'Reset de Senha',
          subject: 'Redefina sua senha - MarcBuddy',
          type: 'reset',
          html_content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinir Senha</title>
  <style>
    body { font-family: 'Nunito', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 800; }
    .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
    .content h2 { color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 700; }
    .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2); }
    .button:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3); }
    .security { background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .security h3 { color: #991b1b; margin-top: 0; }
    .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    .footer a { color: #ef4444; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 MarcBuddy</h1>
    </div>
    <div class="content">
      <h2>Redefinir Senha</h2>
      <p>Olá {{user_name}}!</p>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta na <strong>MarcBuddy</strong>.</p>

      <div class="security">
        <h3>🛡️ Segurança</h3>
        <p>Se você não solicitou esta alteração, ignore este email. Sua senha permanecerá a mesma.</p>
        <p>Este link é válido por <strong>1 hora</strong> por questões de segurança.</p>
      </div>

      <p style="text-align: center;">
        <a href="{{reset_url}}" class="button">Redefinir Senha</a>
      </p>

      <p><strong>Não consegue clicar no botão?</strong> Copie e cole este link no seu navegador:</p>
      <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">{{reset_url}}</p>

      <p>Após redefinir sua senha, você poderá continuar usando todas as ferramentas da MarcBuddy normalmente.</p>

      <p>Atenciosamente,<br>
      <strong>Equipe MarcBuddy</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 MarcBuddy. Todos os direitos reservados.</p>
      <p><a href="{{support_url}}">Suporte</a> | <a href="{{privacy_url}}">Política de Privacidade</a></p>
    </div>
  </div>
</body>
</html>`,
          variables: ['{{user_name}}', '{{reset_url}}'],
          created_at: '2024-12-11',
          updated_at: '2024-12-11'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setFormData({
      name: '',
      subject: '',
      html_content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; }
    .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MarcBuddy</h1>
    </div>
    <div class="content">
      <h2>Olá {{user_name}}!</h2>
      <p>Conteúdo do email aqui...</p>
      <a href="{{action_url}}" class="button">Clique Aqui</a>
    </div>
    <div class="footer">
      <p>© 2024 MarcBuddy. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>`,
      type: 'welcome',
      variables: ['{{user_name}}', '{{user_email}}', '{{action_url}}']
    });
    setSelectedTemplate(null);
    setIsEditing(true);
  };

  const handleEditTemplate = (template) => {
    setFormData({
      name: template.name,
      subject: template.subject,
      html_content: template.html_content,
      type: template.type,
      variables: template.variables || []
    });
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleSaveTemplate = async () => {
    try {
      if (selectedTemplate) {
        // Atualizar template existente
        await api.put(`/admin/email-templates/${selectedTemplate.id}`, formData);
      } else {
        // Criar novo template
        await api.post('/admin/email-templates', formData);
      }

      // Recarregar templates
      await loadTemplates();
      setIsEditing(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Erro ao salvar template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) return;

    try {
      await api.delete(`/admin/email-templates/${templateId}`);
      // Recarregar templates
      await loadTemplates();
    } catch (error) {
      console.error('Erro ao excluir template:', error);
    }
  };

  const handleDuplicateTemplate = async (template) => {
    const duplicatedTemplate = {
      ...template,
      name: `${template.name} (Cópia)`,
      id: null
    };
    handleEditTemplate(duplicatedTemplate);
  };

  const handlePreviewTemplate = (template) => {
    console.log('🎨 Template selecionado para preview:', template);
    console.log('📄 Conteúdo HTML:', template.html_content ? template.html_content.substring(0, 200) + '...' : 'Nenhum conteúdo');

    // Garantir que o template tenha conteúdo HTML
    const templateWithContent = {
      ...template,
      html_content: template.html_content || `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; color: #666; }
            .error { color: #e74c3c; font-size: 18px; margin-bottom: 20px; }
            .info { font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="error">⚠️ Conteúdo do template não disponível</div>
          <div class="info">
            <p>O arquivo <strong>${template.type}.html</strong> não foi encontrado.</p>
            <p>Verifique se o template existe na pasta <code>backend/templates/emails/</code></p>
          </div>
        </body>
        </html>
      `
    };
    setSelectedTemplate(templateWithContent);
    setShowPreview(true);
  };

  const handleTestEmail = (template) => {
    setSelectedTemplateForTest(template);
    setShowTestModal(true);
  };

  const handleSendTestEmail = async () => {
    if (!selectedTemplateForTest || !testEmail) return;

    setSendingTest(true);
    try {
      await api.post(`/admin/email-templates/${selectedTemplateForTest.id}/send-test`, {
        templateId: selectedTemplateForTest.id,
        testEmail: testEmail
      });

      alert(`✅ Email de teste enviado com sucesso para ${testEmail}!`);
      setShowTestModal(false);
      setSelectedTemplateForTest(null);
      setTestEmail('josmarcdesign@gmail.com');
    } catch (error) {
      console.error('Erro ao enviar email de teste:', error);
      alert('❌ Erro ao enviar email de teste. Verifique o console para mais detalhes.');
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins">Carregando templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
            Designer de Emails
          </h2>
          <p className="text-gray-600 font-poppins mt-1">
            Crie e gerencie templates de email para notificações e comunicações
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadTemplates()}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-poppins text-sm"
            title="Recarregar templates"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
          <button
            onClick={handleCreateTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors font-semibold font-poppins"
          >
            <Plus className="w-5 h-5" />
            Novo Template
          </button>
        </div>
      </div>

      {/* Lista de Templates */}
      {!isEditing && !showPreview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-green/10 rounded-lg">
                    <Mail className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-blue-900 font-nunito">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-poppins">
                      {emailTypes.find(type => type.value === template.type)?.label || template.type}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 font-poppins line-clamp-2">
                  <strong>Assunto:</strong> {template.subject}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {template.variables?.slice(0, 3).map((variable, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded font-mono">
                    {variable}
                  </span>
                ))}
                {template.variables?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                    +{template.variables.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 font-poppins">
                <span>Atualizado: {new Date(template.updated_at).toLocaleDateString('pt-BR')}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handlePreviewTemplate(template)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-poppins border ${
                    template.html_content
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
                      : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200'
                  }`}
                  title={template.html_content ? "Visualizar email completo" : "Template sem conteúdo HTML"}
                >
                  <Eye className="w-4 h-4" />
                  {template.html_content ? 'Visualizar' : 'Sem Preview'}
                </button>
                <button
                  onClick={() => handleTestEmail(template)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-poppins border border-green-200"
                  title="Enviar email de teste"
                >
                  <Send className="w-4 h-4" />
                  Teste
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicateTemplate(template)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Duplicar"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor de Template */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-brand-blue-900 font-nunito">
              {selectedTemplate ? 'Editar Template' : 'Novo Template'}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors font-semibold font-poppins"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 font-poppins mb-2">
                  Nome do Template
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                  placeholder="Ex: Email de Boas-vindas"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 font-poppins mb-2">
                  Tipo de Email
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                >
                  {emailTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 font-poppins mb-2">
                  Assunto do Email
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                  placeholder="Ex: Bem-vindo à nossa plataforma!"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 font-poppins mb-2">
                  Variáveis Disponíveis
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.variables.map((variable, index) => (
                    <span key={index} className="px-2 py-1 bg-brand-green/10 text-brand-green rounded text-sm font-mono">
                      {variable}
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Adicionar variável (ex: {{user_name}})"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const newVar = e.target.value.trim();
                      if (!formData.variables.includes(newVar)) {
                        setFormData({
                          ...formData,
                          variables: [...formData.variables, newVar]
                        });
                      }
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>

            {/* Editor HTML */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 font-poppins mb-2">
                Conteúdo HTML
              </label>
              <textarea
                value={formData.html_content}
                onChange={(e) => setFormData({...formData, html_content: e.target.value})}
                className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-mono text-sm resize-none"
                placeholder="Cole seu código HTML aqui..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-brand-blue-900 font-nunito">
                  Preview: {selectedTemplate.name}
                </h3>
                {/* Controles de Visualização */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-3 py-1 text-sm rounded font-poppins transition-colors ${
                      previewMode === 'desktop'
                        ? 'bg-white text-brand-blue-900 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    🖥️ Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1 text-sm rounded font-poppins transition-colors ${
                      previewMode === 'mobile'
                        ? 'bg-white text-brand-blue-900 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    📱 Mobile
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {/* Email Headers */}
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-semibold text-gray-700">De:</span>
                    <span className="ml-2 text-gray-900">MarcBuddy &lt;noreply@marcbuddy.com&gt;</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Para:</span>
                    <span className="ml-2 text-gray-900">usuario@email.com</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Assunto:</span>
                    <span className="ml-2 text-gray-900">{selectedTemplate.subject}</span>
                  </div>
                </div>

                {/* Status do Template */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      selectedTemplate.html_content
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {selectedTemplate.html_content ? 'Template carregado' : 'Arquivo não encontrado'}
                    </span>
                  </div>

                  {/* Variáveis Disponíveis */}
                  {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                    <div>
                      <span className="font-semibold text-gray-700">Variáveis:</span>
                      <span className="ml-2 text-gray-600">{selectedTemplate.variables.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Preview */}
              <div className="flex-1 overflow-auto bg-gray-100 p-4">
                <div className={`mx-auto bg-white shadow-lg ${
                  previewMode === 'mobile'
                    ? 'max-w-sm'
                    : 'max-w-4xl'
                } transition-all duration-300`}>
                  <iframe
                    srcDoc={selectedTemplate.html_content}
                    className={`w-full border-0 ${
                      previewMode === 'mobile'
                        ? 'h-[600px]'
                        : 'h-[800px]'
                    }`}
                    title="Email Preview"
                    style={{
                      transform: previewMode === 'mobile' ? 'scale(0.8)' : 'scale(1)',
                      transformOrigin: 'top center'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Teste de Email */}
      {showTestModal && selectedTemplateForTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-brand-blue-900 font-nunito">
                Enviar Email de Teste
              </h3>
              <button
                onClick={() => setShowTestModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 font-poppins mb-2">
                  <strong>Template:</strong> {selectedTemplateForTest.name}
                </p>
                <p className="text-sm text-gray-600 font-poppins mb-4">
                  <strong>Assunto:</strong> {selectedTemplateForTest.subject}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 font-poppins mb-2">
                  Email de Destino
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                  placeholder="exemplo@email.com"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-blue-900 font-poppins mb-2">
                  📧 Sobre o Email de Teste
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• As variáveis serão substituídas por valores de exemplo</li>
                  <li>• O email será enviado usando o template HTML real</li>
                  <li>• Verifique sua caixa de entrada/spam</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowTestModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
                  disabled={sendingTest}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendTestEmail}
                  disabled={sendingTest || !testEmail}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors font-semibold font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingTest ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-blue-900"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Teste
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDesignerAdmin;