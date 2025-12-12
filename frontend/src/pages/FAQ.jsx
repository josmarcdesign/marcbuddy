import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: 'Geral',
      questions: [
        {
          question: 'O que é o MarcBuddy?',
          answer: 'O MarcBuddy é uma plataforma SaaS completa que oferece ferramentas profissionais para designers e criadores. Incluímos ferramentas de extração de cores, compressão de imagens, renomeação em lote e muito mais para otimizar seu fluxo de trabalho criativo.'
        },
        {
          question: 'Preciso de conhecimento técnico para usar o MarcBuddy?',
          answer: 'Não! O MarcBuddy foi projetado para ser intuitivo e fácil de usar. Todas as ferramentas têm interfaces simples e diretas, permitindo que você comece a trabalhar imediatamente, mesmo sem experiência técnica prévia.'
        },
        {
          question: 'O MarcBuddy funciona em dispositivos móveis?',
          answer: 'Sim! Nossa plataforma é totalmente responsiva e funciona perfeitamente em tablets e smartphones. Você pode acessar todas as ferramentas de qualquer dispositivo com conexão à internet.'
        },
        {
          question: 'Posso usar o MarcBuddy gratuitamente?',
          answer: 'Sim! Oferecemos um plano gratuito que permite acesso a funcionalidades básicas. Para recursos avançados e uso ilimitado, você pode fazer upgrade para um de nossos planos pagos.'
        }
      ]
    },
    {
      category: 'Planos e Assinaturas',
      questions: [
        {
          question: 'Quais são os planos disponíveis?',
          answer: 'Oferecemos três planos principais: MBuddy Classic (básico), MBuddy Pro (profissional) e MBuddy Team (para equipes). Cada plano oferece diferentes recursos e limites de uso. Você pode ver todos os detalhes na página de Planos.'
        },
        {
          question: 'Posso mudar de plano a qualquer momento?',
          answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento através das configurações da conta. As alterações serão aplicadas no próximo ciclo de cobrança.'
        },
        {
          question: 'Como funciona o período de teste grátis?',
          answer: 'Alguns planos oferecem um período de teste grátis de 7 dias. Durante este período, você tem acesso completo a todos os recursos do plano escolhido. Se você não cancelar antes do final do período, sua assinatura será automaticamente convertida em uma assinatura paga.'
        },
        {
          question: 'O que acontece se eu cancelar minha assinatura?',
          answer: 'Ao cancelar, você continuará tendo acesso aos recursos do seu plano até o final do período já pago. Após isso, sua conta será convertida para o plano gratuito e você perderá acesso aos recursos premium.'
        },
        {
          question: 'Há descontos para planos anuais?',
          answer: 'Sim! Oferecemos descontos progressivos para compromissos de longo prazo: 15% de desconto no plano anual, 20% no plano de 2 anos e 25% no plano de 3 anos.'
        }
      ]
    },
    {
      category: 'Pagamentos',
      questions: [
        {
          question: 'Quais formas de pagamento são aceitas?',
          answer: 'Aceitamos cartão de crédito, débito, PIX e boleto bancário. Todas as transações são processadas de forma segura e criptografada.'
        },
        {
          question: 'Posso pagar em parcelas?',
          answer: 'Sim! Dependendo do método de pagamento escolhido, você pode parcelar sua assinatura. O número máximo de parcelas varia conforme o método e o valor da compra.'
        },
        {
          question: 'Como funciona a política de reembolso?',
          answer: 'Oferecemos uma garantia de reembolso de 7 dias a partir da data da compra. Durante este período, você pode solicitar um reembolso completo por qualquer motivo. Após este período, reembolsos são avaliados caso a caso.'
        },
        {
          question: 'Recebo nota fiscal?',
          answer: 'Sim! Enviamos nota fiscal eletrônica para todos os pagamentos. A nota é enviada automaticamente para o e-mail cadastrado após a confirmação do pagamento.'
        },
        {
          question: 'O que acontece se meu pagamento falhar?',
          answer: 'Se um pagamento falhar, você receberá uma notificação por e-mail. Tentaremos processar o pagamento novamente automaticamente. Se o problema persistir, entre em contato com nosso suporte para resolver.'
        }
      ]
    },
    {
      category: 'Ferramentas',
      questions: [
        {
          question: 'Quais ferramentas estão disponíveis?',
          answer: 'O MarcBuddy oferece várias ferramentas profissionais, incluindo: ColorBuddy (extrator de cores), Compressor de Imagens, Renomeador em Lote e outras ferramentas criativas. Novas ferramentas são adicionadas regularmente.'
        },
        {
          question: 'Posso usar as ferramentas sem limite?',
          answer: 'Depende do seu plano. O plano gratuito tem limites de uso, enquanto os planos pagos oferecem uso ilimitado ou limites muito mais altos. Consulte a página de Planos para ver os limites específicos de cada plano.'
        },
        {
          question: 'Os arquivos que eu faço upload são seguros?',
          answer: 'Absolutamente! Todos os arquivos são processados de forma segura e são automaticamente excluídos após o processamento. Não armazenamos seus arquivos permanentemente e nunca compartilhamos seus dados com terceiros.'
        },
        {
          question: 'Posso exportar meus projetos?',
          answer: 'Sim! Todas as ferramentas permitem exportar seus trabalhos em vários formatos. Você pode baixar seus projetos, paletas de cores, imagens otimizadas e muito mais.'
        },
        {
          question: 'As ferramentas funcionam offline?',
          answer: 'Não, as ferramentas requerem conexão com a internet para funcionar, pois o processamento é feito em nossos servidores seguros para garantir melhor desempenho e resultados.'
        }
      ]
    },
    {
      category: 'Conta e Segurança',
      questions: [
        {
          question: 'Como crio uma conta?',
          answer: 'É muito simples! Clique em "Cadastrar" ou "Começar Grátis" e preencha o formulário com seu nome, e-mail e senha. Você receberá um e-mail de confirmação para ativar sua conta.'
        },
        {
          question: 'Esqueci minha senha. Como recupero?',
          answer: 'Na página de login, clique em "Esqueci minha senha" e informe seu e-mail cadastrado. Você receberá um link para redefinir sua senha.'
        },
        {
          question: 'Como altero minhas informações pessoais?',
          answer: 'Você pode atualizar suas informações pessoais a qualquer momento através da página de Configurações no seu dashboard. Lá você pode alterar nome, e-mail, senha e outras preferências.'
        },
        {
          question: 'Meus dados estão seguros?',
          answer: 'Sim! Utilizamos criptografia SSL/TLS para todas as transações e armazenamos seus dados em servidores seguros. Seguimos rigorosamente a LGPD (Lei Geral de Proteção de Dados) para proteger sua privacidade.'
        },
        {
          question: 'Posso excluir minha conta?',
          answer: 'Sim, você pode excluir sua conta a qualquer momento através das configurações. Todos os seus dados serão permanentemente removidos, conforme nossa Política de Privacidade.'
        }
      ]
    },
    {
      category: 'Suporte',
      questions: [
        {
          question: 'Como entro em contato com o suporte?',
          answer: 'Você pode entrar em contato conosco através do e-mail suporte@marcbuddy.com ou através do chat de suporte disponível no dashboard. Nossa equipe está disponível de segunda a sexta, das 9h às 18h (horário de Brasília).'
        },
        {
          question: 'Qual é o tempo de resposta do suporte?',
          answer: 'Nosso tempo de resposta varia conforme o plano: usuários do plano gratuito recebem resposta em até 48 horas, enquanto usuários de planos pagos recebem suporte prioritário com resposta em até 24 horas.'
        },
        {
          question: 'Há documentação disponível?',
          answer: 'Sim! Oferecemos documentação completa, tutoriais em vídeo e guias passo a passo para todas as ferramentas. Você pode acessar a documentação através do menu Recursos.'
        },
        {
          question: 'Vocês oferecem treinamento?',
          answer: 'Sim! Para planos Team e Enterprise, oferecemos sessões de treinamento personalizadas para sua equipe. Entre em contato conosco para mais informações.'
        }
      ]
    }
  ];

  // Filtrar FAQs baseado no termo de busca
  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleFaq = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenFaq(openFaq === key ? null : key);
  };

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-brand-green" />
            <h1 className="text-3xl font-black text-brand-blue-900 font-poppins font-medium">
              Perguntas Frequentes (FAQ)
            </h1>
          </div>
          <p className="text-gray-600 font-poppins">
            Encontre respostas para as dúvidas mais comuns sobre o MarcBuddy
          </p>
        </div>

        {/* Busca */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar perguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none font-poppins"
            />
          </div>
        </div>

        {/* FAQs */}
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 font-poppins">
              Nenhuma pergunta encontrada para "{searchTerm}". Tente buscar com outros termos.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-brand-green/10 px-6 py-4 border-b border-brand-green/20">
                  <h2 className="text-xl font-bold text-brand-blue-900 font-poppins font-medium">
                    {category.category}
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {category.questions.map((faq, questionIndex) => {
                    const key = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openFaq === key;
                    return (
                      <div key={questionIndex} className="transition-all">
                        <button
                          onClick={() => toggleFaq(categoryIndex, questionIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-brand-blue-900 font-poppins pr-4">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-brand-green flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 py-4 bg-gray-50">
                            <p className="text-gray-700 leading-relaxed font-poppins">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ainda precisa de ajuda */}
        <div className="bg-brand-green/10 rounded-lg p-6 border border-brand-green/20 mt-8">
          <h2 className="text-xl font-bold text-brand-blue-900 mb-3 font-poppins font-medium">
            Ainda precisa de ajuda?
          </h2>
          <p className="text-gray-700 mb-4 font-poppins">
            Não encontrou a resposta que procurava? Nossa equipe de suporte está pronta para ajudar!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:suporte@marcbuddy.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-green text-brand-blue-900 rounded-lg font-semibold hover:bg-brand-green-500 transition-colors font-poppins font-medium"
            >
              Entrar em Contato
            </a>
            <a
              href="/docs"
              className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-brand-green text-brand-green rounded-lg font-semibold hover:bg-brand-green hover:text-brand-blue-900 transition-colors font-poppins font-medium"
            >
              Ver Documentação
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

