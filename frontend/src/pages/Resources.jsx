import { Link } from 'react-router-dom';

const Resources = () => {
  return (
    <div className="min-h-screen bg-brand-white py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-blue-900 mb-3 sm:mb-4 font-nunito">
            Recursos e Documentação
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto font-poppins px-4">
            Aprenda a usar todas as ferramentas do MarcBuddy e otimize seu fluxo de trabalho.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Documentação */}
          <div className="bg-brand-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-green rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-brand-blue-900 mb-2 font-nunito">Documentação</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-poppins">
              Guias completos sobre como usar cada ferramenta e recursos disponíveis.
            </p>
            <span className="text-xs sm:text-sm text-gray-500 font-poppins">Em breve</span>
          </div>

          {/* Tutoriais */}
          <div className="bg-brand-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-green rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-brand-blue-900 mb-2 font-nunito">Tutoriais</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-poppins">
              Vídeos e tutoriais passo a passo para dominar todas as funcionalidades.
            </p>
            <span className="text-xs sm:text-sm text-gray-500 font-poppins">Em breve</span>
          </div>

          {/* FAQ */}
          <Link to="/faq" className="bg-brand-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow block">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-green rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-brand-blue-900 mb-2 font-nunito">FAQ</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-poppins">
              Perguntas frequentes e respostas sobre planos, ferramentas e funcionalidades.
            </p>
            <span className="text-xs sm:text-sm text-brand-green font-semibold font-poppins">Acessar FAQ →</span>
          </Link>

          {/* Casos de Uso */}
          <div className="bg-brand-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-green rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-brand-blue-900 mb-2 font-nunito">Casos de Uso</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-poppins">
              Veja como outros profissionais estão usando o MarcBuddy em seus projetos.
            </p>
            <span className="text-xs sm:text-sm text-gray-500 font-poppins">Em breve</span>
          </div>

          {/* Suporte */}
          <div className="bg-brand-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-green rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-brand-blue-900 mb-2 font-nunito">Suporte</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-poppins">
              Entre em contato com nossa equipe de suporte para tirar suas dúvidas.
            </p>
            <span className="text-xs sm:text-sm text-gray-500 font-poppins">Em breve</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;

