import { useState } from 'react';
import { Link } from 'react-router-dom';
import DocumentationNavbar from '../components/DocumentationNavbar';

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');
  const [activeItem, setActiveItem] = useState('introduction');

  const sections = [
    {
      id: 'getting-started',
      title: 'Começando',
      items: [
        { id: 'introduction', title: 'Introdução', content: 'Bem-vindo ao MarcBuddy' },
        { id: 'quick-start', title: 'Início Rápido', content: 'Comece em minutos' },
        { id: 'installation', title: 'Instalação', content: 'Como instalar e configurar' },
      ]
    },
    {
      id: 'tools',
      title: 'Ferramentas',
      items: [
        { id: 'colorbuddy', title: 'ColorBuddy', content: 'Extração e geração de paletas' },
        { id: 'imagebuddy', title: 'ImageBuddy', content: 'Otimize, redimensione e converta suas imagens' },
        { id: 'batch-renamer', title: 'Renomeador em Lote', content: 'Renomeie múltiplos arquivos' },
      ]
    },
    {
      id: 'guides',
      title: 'Guias',
      items: [
        { id: 'color-extraction', title: 'Extração de Cores', content: 'Como extrair cores de imagens' },
        { id: 'palette-generation', title: 'Geração de Paletas', content: 'Crie paletas com IA' },
        { id: 'workflow', title: 'Fluxo de Trabalho', content: 'Otimize seu processo criativo' },
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Solução de Problemas',
      items: [
        { id: 'common-issues', title: 'Problemas Comuns', content: 'Soluções para problemas frequentes' },
        { id: 'faq', title: 'FAQ', content: 'Perguntas frequentes' },
        { id: 'support', title: 'Suporte', content: 'Como obter ajuda' },
      ]
    }
  ];

  const allItems = sections.flatMap(section => 
    section.items.map(item => ({ ...item, sectionId: section.id, sectionTitle: section.title }))
  );

  const filteredItems = searchQuery
    ? allItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];
  const currentItem = currentSection.items.find(item => item.id === activeItem) || currentSection.items[0];
  
  // Atualizar item ativo quando a seção mudar
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    const section = sections.find(s => s.id === sectionId);
    if (section && section.items.length > 0) {
      setActiveItem(section.items[0].id);
    }
  };
  
  const handleItemClick = (sectionId, itemId) => {
    setActiveSection(sectionId);
    setActiveItem(itemId);
  };

  const handleNavbarSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-brand-white flex flex-col">
      {/* Navbar Customizada */}
      <DocumentationNavbar onSearch={handleNavbarSearch} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Navegação */}
        <aside className="hidden lg:block w-64 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider font-nunito">
              Documentação
            </h2>
          </div>

          {/* Resultados da Pesquisa */}
          {searchQuery && filteredItems.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-brand-blue-900 mb-2 font-nunito">
                Resultados da Busca ({filteredItems.length})
              </h3>
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {filteredItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        handleItemClick(item.sectionId, item.id);
                        setSearchQuery('');
                      }}
                      className="text-sm text-brand-blue-900 hover:text-brand-green transition-colors font-poppins text-left w-full p-2 rounded hover:bg-gray-100"
                    >
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.sectionTitle}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {searchQuery && filteredItems.length === 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500 font-poppins">
                Nenhum resultado encontrado
              </p>
            </div>
          )}

          {/* Navegação por Seções */}
          {!searchQuery && (
            <nav className="space-y-6">
              {sections.map((section) => (
                <div key={section.id}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 font-nunito">
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleItemClick(section.id, item.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors font-poppins ${
                            activeSection === section.id && activeItem === item.id
                              ? 'bg-brand-green/10 text-brand-green font-semibold border-l-2 border-brand-green'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 font-poppins">
              <Link to="/" className="hover:text-brand-green transition-colors">Início</Link>
              <span>/</span>
              <Link to="/resources" className="hover:text-brand-green transition-colors">Recursos</Link>
              <span>/</span>
              <span className="text-brand-blue-900">Documentação</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-brand-blue-900 mb-4 font-nunito">
              {currentItem?.title || currentSection.title}
            </h1>
            <p className="text-xl text-gray-600 font-poppins">
              {currentItem?.content || 'Documentação completa do MarcBuddy'}
            </p>
          </div>

          {/* Conteúdo da Seção */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <div className="text-gray-700 font-poppins leading-relaxed space-y-4">
                {/* Conteúdo específico por item */}
                {activeItem === 'introduction' && (
                  <>
                    <p className="text-lg">
                      Bem-vindo à documentação completa do MarcBuddy! Esta é sua fonte definitiva de informações sobre como usar todas as ferramentas e recursos disponíveis na plataforma. Aqui você encontrará guias detalhados, exemplos práticos e todas as informações necessárias para aproveitar ao máximo o ecossistema MarcBuddy.
                    </p>
                    
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      O que é o MarcBuddy?
                    </h3>
                    <p>
                      O MarcBuddy é um ecossistema completo de ferramentas profissionais desenvolvido especificamente para designers, criadores de conteúdo e profissionais de marketing. Nossa plataforma foi criada com o objetivo de eliminar o trabalho pesado, simplificar tarefas complexas e permitir que você foque 100% na criação.
                    </p>
                    <p className="mt-4">
                      Com o MarcBuddy, você tem acesso a um conjunto integrado de ferramentas que cobrem desde a extração e geração de paletas de cores até a otimização de imagens e organização de arquivos. Tudo em uma única plataforma, com interface intuitiva e resultados profissionais.
                    </p>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Por que usar o MarcBuddy?
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito">🎯 Ferramentas Profissionais</h4>
                        <p className="text-sm text-gray-600">
                          Acesso a ferramentas de nível profissional que normalmente custariam centenas de dólares em softwares separados.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito">🤖 Inteligência Artificial</h4>
                        <p className="text-sm text-gray-600">
                          Tecnologia de IA avançada para gerar paletas personalizadas e otimizar seu fluxo de trabalho.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito">⚡ Interface Intuitiva</h4>
                        <p className="text-sm text-gray-600">
                          Design pensado para facilitar seu trabalho, sem necessidade de treinamento extensivo.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito">🔄 Integração Completa</h4>
                        <p className="text-sm text-gray-600">
                          Todas as ferramentas trabalham juntas, permitindo um fluxo de trabalho integrado e eficiente.
                        </p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Estrutura da Documentação
                    </h3>
                    <p>
                      Esta documentação está organizada em seções lógicas para facilitar sua navegação:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                      <li><strong>Começando:</strong> Guias para iniciantes, instalação e primeiros passos</li>
                      <li><strong>Ferramentas:</strong> Documentação detalhada de cada ferramenta disponível</li>
                      <li><strong>Guias:</strong> Tutoriais passo a passo e melhores práticas</li>
                      <li><strong>Solução de Problemas:</strong> FAQ e resolução de problemas comuns</li>
                    </ul>

                    <div className="bg-brand-green/10 border-l-4 border-brand-green p-4 rounded mt-6">
                      <p className="text-sm text-brand-blue-900 font-poppins">
                        <strong>💡 Dica:</strong> Use a barra de pesquisa no menu lateral para encontrar rapidamente qualquer tópico na documentação.
                      </p>
                    </div>
                  </>
                )}

                {activeItem === 'quick-start' && (
                  <>
                    <p className="text-lg">
                      Este guia rápido vai te ajudar a começar a usar o MarcBuddy em menos de 5 minutos. Siga os passos abaixo para configurar sua conta e começar a trabalhar imediatamente.
                    </p>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Passo 1: Criar sua Conta
                    </h3>
                    <p>
                      O primeiro passo é criar sua conta gratuita no MarcBuddy. Não é necessário cartão de crédito para começar.
                    </p>
                    <ol className="list-decimal list-inside space-y-2 ml-4 mt-4">
                      <li>Acesse a página de <Link to="/register" className="text-brand-green hover:underline">registro</Link></li>
                      <li>Preencha seus dados: nome, email e senha</li>
                      <li>Confirme seu email através do link enviado (verifique a caixa de spam)</li>
                      <li>Faça login na plataforma</li>
                    </ol>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
                      <p className="text-sm text-blue-800">
                        <strong>Importante:</strong> Você receberá 7 dias de teste gratuito automaticamente após criar sua conta, sem necessidade de cartão de crédito.
                      </p>
                    </div>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Passo 2: Escolher seu Plano
                    </h3>
                    <p>
                      Após criar sua conta, explore nossos planos e escolha o que melhor se adapta às suas necessidades. Você pode alterar ou cancelar a qualquer momento.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito">Planos Disponíveis:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                        <li><strong>Básico:</strong> Ideal para freelancers e pequenos projetos</li>
                        <li><strong>Profissional:</strong> Para equipes e projetos maiores</li>
                        <li><strong>Empresarial:</strong> Soluções customizadas para empresas</li>
                      </ul>
                    </div>
                    <p className="mt-4">
                      Durante o período de teste, você terá acesso a todas as funcionalidades do plano Profissional para experimentar tudo que o MarcBuddy oferece.
                    </p>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Passo 3: Acessar o Dashboard
                    </h3>
                    <p>
                      Após fazer login, você será redirecionado para o dashboard. Aqui você encontrará:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                      <li><strong>Visão Geral:</strong> Estatísticas do seu uso e atividades recentes</li>
                      <li><strong>Ferramentas:</strong> Acesso rápido a todas as ferramentas disponíveis</li>
                      <li><strong>Projetos:</strong> Organize e gerencie seus trabalhos</li>
                      <li><strong>Configurações:</strong> Personalize sua conta e preferências</li>
                    </ul>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Passo 4: Explorar as Ferramentas
                    </h3>
                    <p>
                      Agora você está pronto para começar! Acesse a seção de ferramentas e explore:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito">ColorBuddy</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Extraia paletas de cores de imagens ou gere paletas com IA
                        </p>
                        <Link to="/ferramentas/colorbuddy" className="text-brand-green text-sm hover:underline">
                          Acessar ferramenta →
                        </Link>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito">Mais Ferramentas</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Compressor de Imagens, Renomeador em Lote e muito mais
                        </p>
                        <Link to="/ferramentas" className="text-brand-green text-sm hover:underline">
                          Ver todas →
                        </Link>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Próximos Passos
                    </h3>
                    <p>
                      Agora que você já está configurado, recomendamos:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 ml-4 mt-4">
                      <li>Ler a documentação específica de cada ferramenta que pretende usar</li>
                      <li>Experimentar com projetos reais para familiarizar-se com a interface</li>
                      <li>Explorar os guias avançados para aprender técnicas e melhores práticas</li>
                    </ol>

                    <div className="bg-brand-green/10 border-l-4 border-brand-green p-4 rounded mt-6">
                      <p className="text-sm text-brand-blue-900 font-poppins">
                        <strong>🎉 Parabéns!</strong> Você está pronto para começar. Se tiver dúvidas, consulte a seção de <button onClick={() => handleItemClick('troubleshooting', 'faq')} className="text-brand-green hover:underline font-semibold">FAQ</button> ou entre em contato com nosso suporte.
                      </p>
                    </div>
                  </>
                )}

                {activeItem === 'installation' && (
                  <>
                    <p className="text-lg">
                      O MarcBuddy é uma plataforma web 100% baseada em navegador, o que significa que não é necessário instalar nenhum software. Tudo funciona diretamente no seu navegador, permitindo acesso de qualquer dispositivo com internet.
                    </p>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Requisitos do Sistema
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-6 mt-4">
                      <h4 className="font-semibold text-brand-blue-900 mb-4 font-nunito">Navegadores Suportados</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">✅ Totalmente Suportados:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                            <li>Google Chrome (versão 90+)</li>
                            <li>Mozilla Firefox (versão 88+)</li>
                            <li>Microsoft Edge (versão 90+)</li>
                            <li>Safari (versão 14+)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">⚠️ Suporte Parcial:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                            <li>Opera (versão 76+)</li>
                            <li>Brave (versão 1.25+)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-semibold text-brand-blue-900 mt-6 mb-3 font-nunito">Requisitos Técnicos</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>JavaScript:</strong> Deve estar habilitado (ativado por padrão na maioria dos navegadores)</li>
                      <li><strong>Conexão Internet:</strong> Mínimo de 2 Mbps para uso básico, 5 Mbps recomendado para upload de imagens</li>
                      <li><strong>Resolução de Tela:</strong> Mínimo 1280x720, recomendado 1920x1080 ou superior</li>
                      <li><strong>Cookies:</strong> Devem estar habilitados para manter sua sessão ativa</li>
                    </ul>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Primeiro Acesso
                    </h3>
                    <p>
                      Para começar a usar o MarcBuddy, siga estes passos simples:
                    </p>
                    <ol className="list-decimal list-inside space-y-3 ml-4 mt-4">
                      <li>
                        <strong>Acesse o site:</strong> Navegue até <code className="bg-gray-100 px-2 py-1 rounded text-sm">marcbuddy.com</code> no seu navegador
                      </li>
                      <li>
                        <strong>Verifique compatibilidade:</strong> O site detecta automaticamente se seu navegador é compatível
                      </li>
                      <li>
                        <strong>Crie sua conta:</strong> Clique em "Cadastrar" e preencha seus dados
                      </li>
                      <li>
                        <strong>Confirme seu email:</strong> Verifique sua caixa de entrada e confirme seu email
                      </li>
                      <li>
                        <strong>Faça login:</strong> Acesse com suas credenciais e comece a usar
                      </li>
                    </ol>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Solução de Problemas de Acesso
                    </h3>
                    <div className="space-y-3">
                      <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded">
                        <h4 className="font-semibold text-brand-blue-900 mb-1 font-nunito">Site não carrega</h4>
                        <p className="text-sm text-gray-700">
                          Verifique sua conexão com a internet, limpe o cache do navegador ou tente usar outro navegador.
                        </p>
                      </div>
                      <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded">
                        <h4 className="font-semibold text-brand-blue-900 mb-1 font-nunito">Erro de JavaScript</h4>
                        <p className="text-sm text-gray-700">
                          Certifique-se de que o JavaScript está habilitado nas configurações do seu navegador.
                        </p>
                      </div>
                      <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded">
                        <h4 className="font-semibold text-brand-blue-900 mb-1 font-nunito">Problemas de performance</h4>
                        <p className="text-sm text-gray-700">
                          Feche outras abas do navegador, desative extensões que possam interferir, ou atualize seu navegador para a versão mais recente.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeItem === 'colorbuddy' && (
                  <>
                    <p className="text-lg">
                      O ColorBuddy é uma ferramenta completa e profissional para trabalhar com cores. Desenvolvida especificamente para designers e criadores, ela oferece duas funcionalidades principais: extração de paletas de cores de imagens e geração de paletas personalizadas usando inteligência artificial.
                    </p>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Visão Geral
                    </h3>
                    <p>
                      O ColorBuddy foi projetado para ser a ferramenta definitiva de trabalho com cores. Seja você um designer gráfico criando identidades visuais, um desenvolvedor web escolhendo esquemas de cores, ou um criador de conteúdo buscando paletas harmoniosas, o ColorBuddy oferece tudo que você precisa em uma interface intuitiva e poderosa.
                    </p>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Funcionalidades Principais
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 rounded-lg p-5 border border-brand-green/20">
                        <h4 className="font-bold text-brand-blue-900 mb-2 font-nunito flex items-center gap-2">
                          <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                          Extrator de Cores
                        </h4>
                        <p className="text-sm text-gray-700 mb-3">
                          Extraia paletas profissionais de qualquer imagem com precisão. Use pontos interativos para coletar cores específicas ou deixe a ferramenta identificar automaticamente as cores principais.
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Coleta interativa de cores</li>
                          <li>• Detecção automática de paletas</li>
                          <li>• Lupa com ampliação para precisão</li>
                          <li>• Suporte para múltiplos formatos de imagem</li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 rounded-lg p-5 border border-brand-green/20">
                        <h4 className="font-bold text-brand-blue-900 mb-2 font-nunito flex items-center gap-2">
                          <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Gerador com IA
                        </h4>
                        <p className="text-sm text-gray-700 mb-3">
                          Crie paletas personalizadas usando inteligência artificial. Descreva o que você precisa em linguagem natural e receba paletas harmoniosas com nomes e significados contextuais.
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Geração baseada em descrições textuais</li>
                          <li>• Nomes personalizados para cada cor</li>
                          <li>• Explicações contextuais</li>
                          <li>• Paletas de 5 cores harmoniosas</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Formatos de Cores Suportados
                    </h3>
                    <p>
                      O ColorBuddy fornece códigos de cores em todos os formatos profissionais mais utilizados:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito">HEX</h4>
                        <code className="text-sm text-gray-700">#87c508</code>
                        <p className="text-xs text-gray-600 mt-2">Formato padrão para web e design digital</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito">RGB</h4>
                        <code className="text-sm text-gray-700">rgb(135, 197, 8)</code>
                        <p className="text-xs text-gray-600 mt-2">Para uso em CSS e desenvolvimento web</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito">CMYK</h4>
                        <code className="text-sm text-gray-700">cmyk(32%, 0%, 95%, 23%)</code>
                        <p className="text-xs text-gray-600 mt-2">Para impressão e design gráfico</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Como Usar o Extrator de Cores
                    </h3>
                    <ol className="list-decimal list-inside space-y-4 ml-4">
                      <li>
                        <strong>Acesse a ferramenta:</strong> No menu de ferramentas, clique em "ColorBuddy" e depois em "Extrator de Cores"
                      </li>
                      <li>
                        <strong>Faça upload da imagem:</strong> Arraste e solte uma imagem ou clique para selecionar. Formatos suportados: JPG, PNG, GIF (até 10MB)
                      </li>
                      <li>
                        <strong>Posicione os pontos de coleta:</strong> 
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-600">
                          <li>Clique na imagem para adicionar um novo ponto de coleta</li>
                          <li>Use a lupa para ver detalhes ao posicionar</li>
                          <li>Arraste os pontos existentes para reposicioná-los</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Visualize as cores:</strong> Cada ponto coletado gera uma cor com todos os formatos (HEX, RGB, CMYK)
                      </li>
                      <li>
                        <strong>Copie ou remova cores:</strong> Use os botões de copiar ao lado de cada código ou remova cores indesejadas
                      </li>
                    </ol>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Como Usar o Gerador de Paletas com IA
                    </h3>
                    <ol className="list-decimal list-inside space-y-4 ml-4">
                      <li>
                        <strong>Acesse o gerador:</strong> No menu ColorBuddy, clique em "Gerador de Paletas com IA"
                      </li>
                      <li>
                        <strong>Descreva sua paleta:</strong> Seja específico sobre cores, estilo e contexto de uso. Exemplos:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-600">
                          <li>"Paleta minimalista com tons de azul e branco para um site corporativo"</li>
                          <li>"Cores vibrantes e energéticas para uma marca de tecnologia"</li>
                          <li>"Paleta escura e aconchegante para uma cafeteria"</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Gere a paleta:</strong> Clique em "Gerar Paleta" e aguarde alguns segundos enquanto a IA processa
                      </li>
                      <li>
                        <strong>Explore os resultados:</strong> Você receberá:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-600">
                          <li>Nome da paleta gerada</li>
                          <li>5 cores harmoniosas com nomes específicos</li>
                          <li>Códigos HEX, RGB e CMYK para cada cor</li>
                          <li>Explicações sobre o significado de cada cor no contexto</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Copie e use:</strong> Copie os códigos de cores diretamente ou exporte a paleta completa
                      </li>
                    </ol>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Dicas e Melhores Práticas
                    </h3>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
                      <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito">Para Extração de Cores:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                        <li>Posicione os pontos em áreas representativas da imagem</li>
                        <li>Use a lupa para ver detalhes ao posicionar pontos</li>
                        <li>Experimente diferentes posições para obter variações</li>
                        <li>Remova cores que não fazem parte da paleta desejada</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mt-4">
                      <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito">Para Geração com IA:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                        <li>Seja específico sobre o contexto de uso (site, logo, impresso, etc.)</li>
                        <li>Mencione o estilo desejado (minimalista, vibrante, escuro, etc.)</li>
                        <li>Inclua informações sobre o público-alvo ou nicho</li>
                        <li>Experimente diferentes descrições para obter variações</li>
                      </ul>
                    </div>

                    <h3 className="text-xl font-bold text-brand-blue-900 mt-8 mb-4 font-nunito">
                      Limitações e Especificações
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li><strong>Tamanho máximo de imagem:</strong> 10MB por upload</li>
                        <li><strong>Formatos suportados:</strong> JPG, PNG, GIF</li>
                        <li><strong>Número de pontos de coleta:</strong> Ilimitado no Extrator</li>
                        <li><strong>Cores por paleta (IA):</strong> 5 cores fixas</li>
                        <li><strong>Processamento IA:</strong> Geralmente leva 2-5 segundos</li>
                      </ul>
                    </div>

                    <div className="bg-brand-green/10 border-l-4 border-brand-green p-4 rounded mt-6">
                      <p className="text-sm text-brand-blue-900 font-poppins">
                        <strong>💡 Dica Pro:</strong> Para melhores resultados na extração, use imagens de alta qualidade e bem iluminadas. Para geração com IA, quanto mais detalhada sua descrição, melhor será a paleta gerada.
                      </p>
                    </div>
                  </>
                )}

                {activeItem === 'imagebuddy' && (
                  <>
                    <p>
                      Ferramenta completa para otimizar, redimensionar e converter suas imagens. Tudo em um só lugar para todas as suas necessidades de edição de imagem.
                    </p>
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-6 mb-3 font-nunito">
                      Funcionalidades
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Compressão inteligente</strong> mantendo qualidade visual</li>
                      <li><strong>Redimensionamento</strong> com manutenção de proporção</li>
                      <li><strong>Conversão de formatos</strong> (JPG, PNG, WebP)</li>
                      <li>Preview antes e depois em tempo real</li>
                      <li>Modo escuro/claro</li>
                      <li>Histórico de configurações</li>
                    </ul>
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-6 mb-3 font-nunito">
                      Como Usar
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>Faça upload de uma imagem arrastando ou clicando</li>
                      <li>Ajuste a qualidade de compressão (0-100%)</li>
                      <li>Ative o redimensionamento se necessário</li>
                      <li>Escolha o formato de saída desejado</li>
                      <li>Clique em "Comprimir Imagem" para processar</li>
                    </ol>
                  </>
                )}

                {activeItem === 'batch-renamer' && (
                  <>
                    <p>
                      Renomeie múltiplos arquivos de uma vez usando padrões personalizáveis. Economize tempo e mantenha seus arquivos organizados.
                    </p>
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-6 mb-3 font-nunito">
                      Funcionalidades
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Renomeação em lote de múltiplos arquivos</li>
                      <li>Padrões customizáveis e variáveis</li>
                      <li>Preview antes de aplicar</li>
                      <li>Suporte para diferentes tipos de arquivo</li>
                    </ul>
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-6 mb-3 font-nunito">
                      Em Breve
                    </h3>
                    <p>
                      Esta ferramenta está em desenvolvimento e estará disponível em breve. Fique atento às atualizações!
                    </p>
                  </>
                )}

                {activeItem === 'color-extraction' && (
                  <>
                    <p>
                      Aprenda como extrair paletas de cores profissionais de qualquer imagem usando o ColorBuddy. Nossa ferramenta identifica automaticamente as cores principais e fornece códigos HEX, RGB e CMYK.
                    </p>
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-6 mb-3 font-nunito">
                      Passo a Passo
                    </h3>
                    <ol className="list-decimal list-inside space-y-3 ml-4">
                      <li>
                        <strong>Faça upload da imagem:</strong> Arraste e solte ou clique para selecionar uma imagem
                      </li>
                      <li>
                        <strong>Posicione os pontos de coleta:</strong> Clique na imagem para adicionar pontos onde deseja extrair cores
                      </li>
                      <li>
                        <strong>Ajuste os pontos:</strong> Arraste os pontos para reposicioná-los e obter cores diferentes
                      </li>
                      <li>
                        <strong>Visualize as cores:</strong> Veja a paleta gerada com todos os códigos de cores
                      </li>
                      <li>
                        <strong>Copie ou exporte:</strong> Use os botões de copiar para cada código ou exporte a paleta completa
                      </li>
                    </ol>
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-6 mb-3 font-nunito">
                      Dicas
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Posicione os pontos em áreas representativas da imagem</li>
                      <li>Use a lupa para ver detalhes ao posicionar os pontos</li>
                      <li>Experimente diferentes posições para obter variações de cores</li>
                    </ul>
                  </>
                )}

                {activeItem === 'palette-generation' && (
                  <>
                    <p>
                      Use nossa IA para gerar paletas de cores personalizadas baseadas em descrições textuais. Descreva o que você precisa e receba paletas harmoniosas e profissionais.
                    </p>
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-6 mb-3 font-nunito">
                      Como Funciona
                    </h3>
                    <p>
                      Nossa IA analisa sua descrição e gera uma paleta de 5 cores que se harmonizam entre si, incluindo nomes específicos para cada cor e explicações contextuais.
                    </p>
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-6 mb-3 font-nunito">
                      Exemplos de Descrições
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>"Paleta minimalista com tons de azul e branco para um site corporativo"</li>
                      <li>"Cores vibrantes para uma marca de tecnologia"</li>
                      <li>"Paleta escura e aconchegante para uma cafeteria"</li>
                    </ul>
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-6 mb-3 font-nunito">
                      Resultados
                    </h3>
                    <p>
                      Cada paleta gerada inclui: nome da paleta, nome de cada cor, códigos HEX/RGB/CMYK, e explicações sobre o significado de cada cor no contexto da sua descrição.
                    </p>
                  </>
                )}

                {activeItem === 'workflow' && (
                  <>
                    <p>
                      Otimize seu processo criativo usando as ferramentas do MarcBuddy de forma integrada. Aprenda as melhores práticas para um fluxo de trabalho eficiente.
                    </p>
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-6 mb-3 font-nunito">
                      Fluxo Recomendado
                    </h3>
                    <ol className="list-decimal list-inside space-y-3 ml-4">
                      <li>
                        <strong>Extraia ou gere paletas:</strong> Use o ColorBuddy para criar sua paleta de cores
                      </li>
                      <li>
                        <strong>Organize seus arquivos:</strong> Use o Renomeador em Lote para manter tudo organizado
                      </li>
                      <li>
                        <strong>Otimize imagens:</strong> Use o Compressor para reduzir tamanhos sem perder qualidade
                      </li>
                      <li>
                        <strong>Exporte e compartilhe:</strong> Use as opções de exportação para salvar seus trabalhos
                      </li>
                    </ol>
                  </>
                )}

                {activeItem === 'common-issues' && (
                  <>
                    <p>
                      Encontre soluções para problemas comuns que você pode encontrar ao usar o MarcBuddy.
                    </p>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito text-lg">
                          Não consigo fazer upload de imagens
                        </h4>
                        <p className="text-gray-600">
                          Verifique se o arquivo está em um formato suportado (JPG, PNG, GIF) e se o tamanho não excede 10MB. Certifique-se de que sua conexão com a internet está estável.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito text-lg">
                          As cores extraídas não estão corretas
                        </h4>
                        <p className="text-gray-600">
                          Tente ajustar os pontos de coleta na imagem ou use a opção de extração automática para melhores resultados. Certifique-se de que os pontos estão posicionados em áreas representativas da imagem.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito text-lg">
                          A geração de paletas com IA não está funcionando
                        </h4>
                        <p className="text-gray-600">
                          Certifique-se de que sua descrição é clara e específica. Tente reformular sua solicitação ou use exemplos mais detalhados.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeItem === 'faq' && (
                  <>
                    <p>
                      Perguntas frequentes sobre o MarcBuddy, planos, ferramentas e funcionalidades.
                    </p>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito text-lg">
                          Preciso de cartão de crédito para o teste gratuito?
                        </h4>
                        <p className="text-gray-600">
                          Não, o teste de 7 dias é completamente gratuito e não requer cartão de crédito.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito text-lg">
                          Posso cancelar minha assinatura a qualquer momento?
                        </h4>
                        <p className="text-gray-600">
                          Sim, você pode cancelar sua assinatura a qualquer momento através do dashboard. Não há taxas de cancelamento.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-blue-900 mb-2 font-nunito text-lg">
                          Quantas imagens posso processar por mês?
                        </h4>
                        <p className="text-gray-600">
                          O limite depende do seu plano. Consulte a página de planos para ver os limites de cada plano.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeItem === 'support' && (
                  <>
                    <p>
                      Se você não encontrou a solução para seu problema na documentação, nossa equipe de suporte está pronta para ajudar.
                    </p>
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-6 mb-3 font-nunito">
                      Canais de Suporte
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Email:</strong> suporte@marcbuddy.com</li>
                      <li><strong>Dashboard:</strong> Acesse a seção de suporte no seu dashboard</li>
                      <li><strong>Horário:</strong> Suporte 24/7 para todos os usuários</li>
                    </ul>
                    <h3 className="text-xl font-bold text-brand-blue-900 mt-6 mb-3 font-nunito">
                      O que incluir ao solicitar suporte
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Descrição detalhada do problema</li>
                      <li>Passos para reproduzir o problema</li>
                      <li>Screenshots ou exemplos, se aplicável</li>
                      <li>Informações do seu navegador e sistema</li>
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Navegação entre seções */}
            <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-200">
              <button
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1].id);
                  }
                }}
                className="flex items-center gap-2 text-brand-blue-900 hover:text-brand-green transition-colors font-poppins"
                disabled={sections.findIndex(s => s.id === activeSection) === 0}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Seção Anterior
              </button>
              <button
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  if (currentIndex < sections.length - 1) {
                    setActiveSection(sections[currentIndex + 1].id);
                  }
                }}
                className="flex items-center gap-2 text-brand-blue-900 hover:text-brand-green transition-colors font-poppins"
                disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
              >
                Próxima Seção
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            const menu = document.getElementById('mobile-docs-menu');
            menu?.classList.toggle('hidden');
          }}
          className="bg-brand-green text-brand-blue-900 p-4 rounded-full shadow-lg hover:bg-brand-green-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div id="mobile-docs-menu" className="lg:hidden fixed inset-0 bg-black/50 z-40 hidden">
        <div className="bg-white w-80 h-full overflow-y-auto p-6">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green font-poppins text-sm"
            />
          </div>

          {/* Resultados da Pesquisa */}
          {searchQuery && filteredItems.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-brand-blue-900 mb-2 font-nunito">
                Resultados da Busca ({filteredItems.length})
              </h3>
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {filteredItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        handleItemClick(item.sectionId, item.id);
                        setSearchQuery('');
                        document.getElementById('mobile-docs-menu')?.classList.add('hidden');
                      }}
                      className="text-sm text-brand-blue-900 hover:text-brand-green transition-colors font-poppins text-left w-full p-2 rounded hover:bg-gray-100"
                    >
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.sectionTitle}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {searchQuery && filteredItems.length === 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500 font-poppins">
                Nenhum resultado encontrado
              </p>
            </div>
          )}

          {/* Navegação por Seções */}
          {!searchQuery && (
          <nav className="space-y-6">
            {sections.map((section) => (
              <div key={section.id}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 font-nunito">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          handleItemClick(section.id, item.id);
                          document.getElementById('mobile-docs-menu')?.classList.add('hidden');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors font-poppins ${
                          activeSection === section.id && activeItem === item.id
                            ? 'bg-brand-green/10 text-brand-green font-semibold border-l-2 border-brand-green'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documentation;

