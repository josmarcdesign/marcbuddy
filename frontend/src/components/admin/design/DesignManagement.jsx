import { useState, useEffect } from 'react';
import { Folder, Plus, Trash2, Edit2, Maximize2, X } from 'lucide-react';
import Project1 from './Project1';
import Project2 from './Project2';
import Project3 from './Project3';
import Project4 from './Project4';
import Project5 from './Project5';
import Project6 from './Project6';
import Project7 from './Project7';
import Project8 from './Project8';

const DesignManagement = () => {
  const [selectedProject, setSelectedProject] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Fechar fullscreen com ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);
  const [projects, setProjects] = useState([
    { 
      id: 1, 
      name: 'Painel de Ferramentas - Photoshop Style', 
      description: 'Design inspirado no Photoshop Web com barra de ferramentas, canvas e painéis laterais',
      createdAt: '2025-01-03',
      component: Project1
    },
    { 
      id: 2, 
      name: 'Renomeador em Lote', 
      description: 'Painel para renomeação de arquivos em lote com personalização de cores e fontes',
      createdAt: new Date().toISOString().split('T')[0],
      component: Project2
    },
    { 
      id: 3, 
      name: 'Dashboard Moderno', 
      description: 'Painel dashboard com design moderno, estatísticas, gráficos e atividades recentes',
      createdAt: new Date().toISOString().split('T')[0],
      component: Project3
    },
    { 
      id: 4, 
      name: 'Dashboard do Usuário - MarcBuddy', 
      description: 'Dashboard completo para usuários da plataforma com ferramentas, plugins, chat e conteúdos',
      createdAt: new Date().toISOString().split('T')[0],
      component: Project4
    },
    { 
      id: 5, 
      name: 'Color Extractor Premium', 
      description: 'Design premium e intuitivo para extração de cores com funcionalidades avançadas',
      createdAt: new Date().toISOString().split('T')[0],
      component: Project5
    },
    { 
      id: 6, 
      name: 'Renomeador de Arquivos', 
      description: 'Ferramenta funcional para renomeação de arquivos em lote ou individual com padrões personalizados',
      createdAt: new Date().toISOString().split('T')[0],
      component: Project6
    },
    { 
      id: 7, 
      name: 'MClients - Gestão de Clientes', 
      description: 'Sistema completo de gestão de clientes com demandas, pagamentos, documentos e serviços',
      createdAt: new Date().toISOString().split('T')[0],
      component: Project7
    },
    { 
      id: 8, 
      name: 'Menu de Ferramentas - Steam Style', 
      description: 'Carrossel de ferramentas estilo Steam com navegação por arrasto e setas, efeitos 3D e perspectiva',
      createdAt: new Date().toISOString().split('T')[0],
      component: Project8
    },
  ]);

  const handleCreateProject = () => {
    const projectName = prompt('Nome do novo projeto:');
    if (!projectName || !projectName.trim()) {
      return;
    }

    const projectDescription = prompt('Descrição do projeto:') || 'Sem descrição';
    
    // Por enquanto, vamos criar um projeto vazio que pode ser implementado depois
    // Em uma implementação real, você poderia ter templates ou criar um componente dinamicamente
    const newProject = {
      id: Math.max(...projects.map(p => p.id)) + 1,
      name: projectName.trim(),
      description: projectDescription.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      component: () => (
        <div className="flex items-center justify-center h-[600px] text-gray-500 font-poppins">
          <div className="text-center">
            <p className="text-lg mb-2">Projeto: {projectName}</p>
            <p className="text-sm">Este projeto ainda não foi implementado.</p>
            <p className="text-xs mt-2 text-gray-400">Crie o componente Project{Math.max(...projects.map(p => p.id)) + 1}.jsx para implementar este design.</p>
          </div>
        </div>
      )
    };

    setProjects([...projects, newProject]);
    setSelectedProject(newProject.id);
  };

  const handleDeleteProject = (projectId) => {
    if (projectId === 1) {
      alert('Não é possível deletar o Projeto 1');
      return;
    }
    if (confirm('Tem certeza que deseja deletar este projeto?')) {
      setProjects(projects.filter(p => p.id !== projectId));
      if (selectedProject === projectId) {
        setSelectedProject(1);
      }
    }
  };

  const renderSelectedProject = () => {
    const project = projects.find(p => p.id === selectedProject);
    if (!project || !project.component) {
      return (
        <div className="flex items-center justify-center h-[600px] text-gray-500 font-poppins">
          Projeto não encontrado
        </div>
      );
    }
    const ProjectComponent = project.component;
    return <ProjectComponent isFullscreen={isFullscreen} />;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-blue-900 font-nunito">
            Projetos de Design
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-poppins mt-1">
            Gerencie e visualize seus projetos de design
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="sm:hidden flex items-center gap-2 px-3 py-2 bg-gray-200 text-brand-blue-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold font-nunito text-sm"
          >
            <Folder className="w-4 h-4" />
            Projetos
          </button>
        <button
          onClick={handleCreateProject}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors font-semibold font-poppins font-medium text-sm sm:text-base"
        >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Novo Projeto</span>
            <span className="xs:hidden">Novo</span>
        </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 relative" style={{ minHeight: 'calc(100vh - 250px)' }}>
        {/* Sidebar - Lista de Projetos */}
        <div className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 overflow-y-auto max-h-[400px] lg:max-h-none`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-brand-blue-900 font-nunito">
            Projetos
          </h3>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  setSelectedProject(project.id);
                  setShowSidebar(false);
                }}
                className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedProject === project.id
                    ? 'border-brand-green bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Folder className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      selectedProject === project.id ? 'text-brand-green' : 'text-gray-400'
                    }`} />
                    <h4 className="font-semibold text-brand-blue-900 font-poppins font-medium text-sm sm:text-base">
                      Projeto {project.id}
                    </h4>
                  </div>
                  {project.id !== 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title="Deletar projeto"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-poppins mb-1 sm:mb-2">
                  {project.name}
                </p>
                <p className="text-xs text-gray-500 font-poppins line-clamp-2">
                  {project.description}
                </p>
                <div className="mt-2 text-xs text-gray-400 font-poppins">
                  Criado em: {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Projeto Selecionado */}
        <div className="flex-1 relative overflow-hidden min-h-[400px] lg:min-h-0">
          {/* Botão de Tela Cheia - Sempre visível acima de tudo */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-brand-green z-50"
            title="Ver em tela cheia"
          >
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-blue-900" />
          </button>
          <div className="relative h-full overflow-y-auto" style={{ zIndex: 1 }}>
            {renderSelectedProject()}
          </div>
        </div>
      </div>

      {/* Modal Fullscreen */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-white z-[9999]"
          style={{ zIndex: 9999 }}
        >
          {/* Botão de Fechar - Flutuante */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="fixed top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors z-50 border border-gray-200"
            title="Fechar tela cheia (ESC)"
          >
            <X className="w-5 h-5 text-brand-blue-900" />
          </button>

          {/* Conteúdo Fullscreen - Sem header */}
          <div className="w-full h-full overflow-hidden">
            {renderSelectedProject()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignManagement;

