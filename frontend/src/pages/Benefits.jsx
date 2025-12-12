const Benefits = () => {
  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Economia de Tempo",
      description: "Automatize tarefas repetitivas e foque no que realmente importa: sua criatividade."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Segurança e Confiabilidade",
      description: "Seus arquivos são processados de forma segura e nunca são armazenados permanentemente."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Acesso em Qualquer Lugar",
      description: "Trabalhe de qualquer dispositivo, a qualquer hora. Tudo na nuvem, sempre disponível."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: "Ferramentas Profissionais",
      description: "Acesso a ferramentas avançadas de design que normalmente custariam centenas de reais."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Suporte Dedicado",
      description: "Equipe pronta para ajudar você a tirar o máximo proveito das ferramentas."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: "Atualizações Constantes",
      description: "Novas funcionalidades e melhorias são adicionadas regularmente, sem custo adicional."
    }
  ];

  return (
    <div className="min-h-screen bg-brand-white py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-blue-900 mb-3 sm:mb-4 font-poppins font-medium">
            Por que escolher o MarcBuddy?
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto font-poppins px-4">
            Descubra os benefícios que fazem do MarcBuddy a escolha ideal para designers e criadores profissionais.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-brand-white border-2 border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-brand-green rounded-lg flex items-center justify-center mb-4 text-brand-blue-900">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-blue-900 mb-3 font-poppins font-medium">
                {benefit.title}
              </h3>
              <p className="text-gray-600 font-poppins">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-brand-blue-900 rounded-lg p-6 sm:p-8 lg:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-white mb-3 sm:mb-4 font-poppins font-medium">
            Pronto para começar?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto font-poppins px-4">
            Experimente grátis por 7 dias e descubra como o MarcBuddy pode transformar seu fluxo de trabalho.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <a
              href="/plans"
              className="bg-brand-green text-brand-blue-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brand-green-500 transition-colors font-poppins font-medium"
            >
              Ver Planos
            </a>
            <a
              href="/register"
              className="bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brand-green hover:text-brand-blue-900 transition-colors font-poppins font-medium"
            >
              Começar Grátis
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;

