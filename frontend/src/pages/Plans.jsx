import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePlans } from '../contexts/PlansContext';
import PlanCard from '../components/PlanCard';
import BillingToggle from '../components/BillingToggle';
import subscriptionService from '../services/subscription.service';
import { CheckCircle2, HelpCircle, Shield, Zap, Users, HeadphonesIcon, ArrowRight, Star, ChevronDown, Check } from 'lucide-react';

const Plans = () => {
  const { getAllPlans, loading } = usePlans();
  const plans = getAllPlans();
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    loadActiveSubscription();
  }, []);

  const loadActiveSubscription = async () => {
    try {
      const response = await subscriptionService.getActive();
      setActiveSubscription(response.data.subscription);
    } catch (error) {
      setActiveSubscription(null);
    } finally {
      setLoadingSubscription(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-poppins">Carregando planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12 px-2 sm:px-0 pt-4 sm:pt-0">
          <h1 className="text-3xl sm:text-3xl lg:text-4xl font-black text-brand-blue-900 mb-2 sm:mb-1 font-poppins font-medium leading-none sm:leading-tight">
            Escolha o Plano<br className="sm:hidden" /> Ideal para Você
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-4 sm:mb-6 font-poppins" style={{ lineHeight: '1.3' }}>
            Planos flexíveis para atender suas necessidades e impulsionar sua criatividade.
          </p>
          
          <div className="px-2 sm:px-4">
            <BillingToggle 
              billingPeriod={billingPeriod}
              onToggle={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
            />
          </div>
        </div>

        {/* Planos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-2 sm:pt-4">
          {plans.filter(plan => plan.id !== 'free').map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isPopular={plan.popular}
              billingPeriod={billingPeriod}
              showDescription={true}
              showFeatures={true}
              showFullFeatures={true}
              variant="default"
              activeSubscription={activeSubscription}
            />
          ))}
        </div>

        {/* Seção: O que está incluído em todos os planos */}
        <section className="mt-16 sm:mt-20 py-12 sm:py-16 px-4 bg-brand-white rounded-2xl shadow-sm">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-blue-900 mb-3 font-poppins font-medium">
                O que está incluído em todos os planos
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-poppins">
                Recursos essenciais disponíveis em todos os planos
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: Zap, text: 'Atualizações automáticas' },
                { icon: HeadphonesIcon, text: 'Suporte técnico' },
                { icon: Shield, text: 'Segurança garantida' },
                { icon: Users, text: 'Comunidade ativa' },
                { icon: CheckCircle2, text: 'Sem compromisso' },
                { icon: Star, text: 'Novos recursos regulares' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <item.icon className="w-5 h-5 text-brand-green flex-shrink-0" />
                  <span className="text-sm font-poppins text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção: Comparação de Planos */}
        <section className="mt-16 sm:mt-20 py-12 sm:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-blue-900 mb-1 sm:mb-2 font-poppins font-medium">
                Compare os Planos
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-poppins">
                Veja em detalhes o que cada plano oferece
              </p>
            </div>
            
            <div className="bg-brand-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-300">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-brand-blue-900 font-poppins font-medium border-r border-gray-300">Recursos</th>
                      {plans.filter(plan => plan.id !== 'free').map((plan) => (
                        <th key={plan.id} className="px-4 py-4 text-center text-sm font-semibold text-brand-blue-900 font-poppins font-medium border-r border-gray-300 last:border-r-0">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-gray-300">
                    {[
                      { feature: 'Acesso às ferramentas básicas', plans: { classic: true, pro: true, team: true } },
                      { feature: 'Acesso às ferramentas avançadas', plans: { classic: false, pro: true, team: true } },
                      { feature: 'Suporte prioritário', plans: { classic: false, pro: true, team: true } },
                      { feature: 'Suporte dedicado', plans: { classic: false, pro: false, team: true } },
                      { feature: 'Customizações', plans: { classic: false, pro: false, team: true } },
                      { feature: 'SLA garantido', plans: { classic: false, pro: false, team: true } },
                      { feature: 'Gerente de conta', plans: { classic: false, pro: false, team: true } }
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-700 font-poppins border-r border-gray-300">{row.feature}</td>
                        {plans.filter(plan => plan.id !== 'free').map((plan) => (
                          <td key={plan.id} className="px-4 py-3 text-center border-r border-gray-300 last:border-r-0">
                            {row.plans[plan.id] ? (
                              <div className="flex justify-center">
                                <div className="w-7 h-7 bg-brand-green rounded-full flex items-center justify-center">
                                  <Check className="w-5 h-5 text-white" strokeWidth={4} />
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Seção: Perguntas Frequentes */}
        <section className="mt-8 sm:mt-10 py-12 sm:py-16 px-4 bg-gray-50 rounded-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <HelpCircle className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-blue-900 mb-1 sm:mb-2 font-poppins font-medium">
                Perguntas Frequentes
              </h2>
              <p className="text-base sm:text-lg text-gray-600 font-poppins">
                Tire suas dúvidas sobre nossos planos
              </p>
            </div>
            
            <div className="space-y-3">
              {[
                {
                  question: 'Posso mudar de plano a qualquer momento?',
                  answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações serão aplicadas no próximo ciclo de cobrança.'
                },
                {
                  question: 'Há período de teste gratuito?',
                  answer: 'Sim! O plano MBuddy Classic oferece 7 dias de teste gratuito. Você pode experimentar todas as funcionalidades sem compromisso.'
                },
                {
                  question: 'O que acontece se eu cancelar minha assinatura?',
                  answer: 'Você continuará tendo acesso até o final do período pago. Após isso, sua conta será convertida para o plano gratuito.'
                },
                {
                  question: 'Os planos incluem suporte técnico?',
                  answer: 'Sim! Todos os planos incluem suporte técnico. Planos Premium e Team incluem suporte prioritário e dedicado.'
                },
                {
                  question: 'Posso usar cupons de desconto?',
                  answer: 'Sim! Você pode aplicar cupons de desconto durante o checkout. Fique atento às promoções e ofertas especiais.'
                }
              ].map((faq, index) => (
                <div key={index} className="rounded-lg overflow-hidden mb-3">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between py-3 px-5 sm:px-6 text-left bg-brand-green hover:bg-brand-green-500 transition-colors"
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-brand-blue-900 font-poppins font-medium pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-white flex-shrink-0 transition-transform duration-300 ${
                        openFaq === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-5 sm:px-6 pt-4 pb-5 sm:pb-6 bg-white border border-black/10">
                      <p className="text-sm sm:text-base text-gray-700 font-poppins leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção: Garantias */}
        <section className="mt-16 sm:mt-20 py-12 sm:py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <Shield className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-blue-900 mb-3 font-poppins font-medium">
                Garantias e Benefícios
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-poppins">
                Sua satisfação é nossa prioridade
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Garantia de 7 dias',
                  description: 'Experimente com tranquilidade. Garantia de reembolso total nos primeiros 7 dias.'
                },
                {
                  icon: Zap,
                  title: 'Cancelamento fácil',
                  description: 'Cancele a qualquer momento, sem taxas ou multas. Sem complicações.'
                },
                {
                  icon: CheckCircle2,
                  title: 'Sem compromisso',
                  description: 'Teste grátis disponível. Sem necessidade de cartão de crédito para começar.'
                }
              ].map((item, index) => (
                <div key={index} className="bg-brand-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                  <item.icon className="w-10 h-10 text-brand-green mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-brand-blue-900 mb-2 font-poppins font-medium">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-poppins">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção: CTA Final */}
        <section className="mt-16 sm:mt-20 py-12 sm:py-16 px-4 bg-gradient-to-br from-brand-blue-900 to-brand-blue-800 rounded-2xl text-brand-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-poppins font-medium text-brand-green">
              Ainda tem dúvidas?
            </h2>
            <p className="text-base sm:text-lg text-gray-200 mb-8 font-poppins">
              Nossa equipe está pronta para ajudar você a escolher o plano ideal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-brand-green text-brand-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-brand-green-500 transition-colors font-poppins font-medium"
              >
                Falar com Vendas
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-brand-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors font-poppins font-medium border border-white/20"
              >
                Ver Documentação
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Informações Adicionais */}
        <div className="mt-12 sm:mt-16 text-center px-4">
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-poppins">
            Todos os planos incluem atualizações automáticas e suporte técnico.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 font-poppins">
            Precisa de um plano customizado? <a href="#" className="text-brand-green hover:underline font-semibold">Entre em contato</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Plans;

