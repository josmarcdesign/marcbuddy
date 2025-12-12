import { Link } from 'react-router-dom';
import { RefreshCw, Clock, CheckCircle, XCircle, Mail, AlertCircle } from 'lucide-react';

const Refund = () => {
  return (
    <div className="bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-8 h-8 text-brand-green" />
              <h1 className="text-3xl font-black text-brand-blue-900 font-nunito">
                Política de Reembolso
              </h1>
            </div>
            <p className="text-sm text-gray-600 font-poppins">
              Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </p>
          </div>

          {/* Conteúdo */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-8">
            {/* Introdução */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Introdução
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                A MarcBuddy está comprometida em fornecer serviços de alta qualidade e garantir a satisfação de nossos clientes. Esta Política de Reembolso descreve as condições sob as quais oferecemos reembolsos para assinaturas e serviços.
              </p>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Ao assinar nossos serviços, você concorda com esta política. Recomendamos que leia atentamente antes de fazer uma compra.
              </p>
            </section>

            {/* Período de Garantia */}
            <section className="bg-brand-green/10 rounded-lg p-6 border border-brand-green/20">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
                  Período de Garantia de Reembolso
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                Oferecemos uma <strong>garantia de reembolso de 7 dias</strong> a partir da data da primeira compra ou renovação de assinatura. Durante este período, você pode solicitar um reembolso completo por qualquer motivo.
              </p>
              <div className="bg-white rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-600 font-poppins mb-2">
                  <strong>Exemplo:</strong> Se você assinar em 1º de janeiro, terá até 8 de janeiro para solicitar o reembolso.
                </p>
              </div>
            </section>

            {/* Elegibilidade */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
                  Elegibilidade para Reembolso
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Reembolsos Elegíveis
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                    <li>Solicitações feitas dentro do período de garantia de 7 dias</li>
                    <li>Problemas técnicos que impedem o uso dos serviços e não foram resolvidos pelo suporte</li>
                    <li>Erros de cobrança ou cobranças duplicadas</li>
                    <li>Serviços não fornecidos conforme descrito</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Reembolsos Não Elegíveis
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                    <li>Solicitações feitas após o período de garantia de 7 dias</li>
                    <li>Uso excessivo ou abuso dos serviços antes do cancelamento</li>
                    <li>Violação dos Termos de Uso que resultou em encerramento da conta</li>
                    <li>Reembolsos parciais para períodos já utilizados (após 7 dias)</li>
                    <li>Assinaturas canceladas após o período de garantia (sem reembolso, mas sem renovação)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Processo de Solicitação */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Como Solicitar um Reembolso
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-3 font-nunito">
                    Passo 1: Entre em Contato
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-poppins mb-2">
                    Envie um e-mail para <strong>reembolsos@marcbuddy.com</strong> com as seguintes informações:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 font-poppins ml-4">
                    <li>Seu nome completo</li>
                    <li>E-mail associado à conta</li>
                    <li>Número da transação ou ID da assinatura</li>
                    <li>Data da compra</li>
                    <li>Motivo da solicitação de reembolso</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-3 font-nunito">
                    Passo 2: Revisão
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-poppins">
                    Nossa equipe revisará sua solicitação dentro de 2-3 dias úteis. Podemos entrar em contato para obter informações adicionais, se necessário.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-3 font-nunito">
                    Passo 3: Processamento
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-poppins">
                    Se aprovado, processaremos o reembolso no mesmo método de pagamento usado na compra original. O reembolso pode levar 5-10 dias úteis para aparecer em sua conta, dependendo do processador de pagamento.
                  </p>
                </div>
              </div>
            </section>

            {/* Métodos de Reembolso */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Métodos de Reembolso
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                <li><strong>Cartão de Crédito/Débito:</strong> O reembolso será creditado na mesma conta usada para a compra</li>
                <li><strong>PIX:</strong> O reembolso será enviado para a conta bancária ou chave PIX registrada</li>
                <li><strong>Boleto:</strong> O reembolso será processado via transferência bancária (pode levar mais tempo)</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800 font-poppins">
                    <strong>Importante:</strong> Se você não tiver mais acesso ao método de pagamento original, entre em contato conosco para fazer arranjos alternativos.
                  </p>
                </div>
              </div>
            </section>

            {/* Cancelamento vs Reembolso */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Cancelamento vs. Reembolso
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Cancelamento (Sem Reembolso)
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-poppins">
                    Você pode cancelar sua assinatura a qualquer momento através das configurações da conta. O cancelamento impede renovações futuras, mas <strong>não resulta em reembolso</strong> para o período já pago, exceto se solicitado dentro do período de garantia de 7 dias.
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Reembolso (Dentro de 7 Dias)
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-poppins">
                    Se você solicitar um reembolso dentro do período de garantia de 7 dias, sua assinatura será cancelada automaticamente e você receberá o reembolso completo.
                  </p>
                </div>
              </div>
            </section>

            {/* Assinaturas Anuais/Multi-anuais */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Assinaturas Anuais e Multi-anuais
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                Para assinaturas anuais, bienais ou trienais:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                <li>O período de garantia de 7 dias se aplica a partir da data da compra inicial</li>
                <li>Reembolsos são calculados com base no valor total pago</li>
                <li>Após o período de garantia, não oferecemos reembolsos parciais para períodos não utilizados</li>
                <li>Você pode cancelar a qualquer momento para evitar renovações futuras</li>
              </ul>
            </section>

            {/* Casos Especiais */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
                  Casos Especiais
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Problemas Técnicos
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-poppins">
                    Se você encontrar problemas técnicos que impedem o uso dos serviços, entre em contato com nosso suporte primeiro. Se o problema não puder ser resolvido, podemos oferecer um reembolso mesmo após o período de garantia, a nosso critério.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Erros de Cobrança
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-poppins">
                    Se você foi cobrado incorretamente ou houve uma cobrança duplicada, entre em contato imediatamente. Corrigiremos o erro e processaremos o reembolso conforme necessário, independentemente do período de garantia.
                  </p>
                </div>
              </div>
            </section>

            {/* Contato */}
            <section className="bg-brand-green/10 rounded-lg p-6 border border-brand-green/20">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
                  Contato para Reembolsos
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                Para solicitar um reembolso ou esclarecer dúvidas sobre esta política:
              </p>
              <div className="space-y-2 text-gray-700 font-poppins">
                <p><strong>E-mail:</strong> reembolsos@marcbuddy.com</p>
                <p><strong>Suporte Geral:</strong> suporte@marcbuddy.com</p>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Horário de Atendimento:</strong> Segunda a Sexta, 9h às 18h (horário de Brasília)
                </p>
              </div>
            </section>

            {/* Alterações */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Alterações nesta Política
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Podemos atualizar esta Política de Reembolso periodicamente. Mudanças significativas serão comunicadas por e-mail ou através de um aviso em nossos serviços. A política em vigor no momento da sua compra se aplica ao seu reembolso.
              </p>
            </section>

            {/* Links Úteis */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              <Link 
                to="/privacidade" 
                className="text-brand-green hover:text-brand-green-500 font-semibold font-poppins"
              >
                Política de Privacidade
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                to="/termos" 
                className="text-brand-green hover:text-brand-green-500 font-semibold font-poppins"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Refund;

