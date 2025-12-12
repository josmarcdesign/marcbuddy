import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText, Mail } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-brand-green" />
              <h1 className="text-3xl font-black text-brand-blue-900 font-nunito">
                Política de Privacidade
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
                A MarcBuddy ("nós", "nosso" ou "plataforma") está comprometida em proteger a privacidade e os dados pessoais de nossos usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política. Recomendamos que leia atentamente este documento.
              </p>
            </section>

            {/* Dados Coletados */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
                  Dados que Coletamos
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Dados de Cadastro
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                    <li>Nome completo</li>
                    <li>Endereço de e-mail</li>
                    <li>Senha (criptografada)</li>
                    <li>Data de cadastro</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Dados de Pagamento
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                    <li>Informações de cartão de crédito (processadas por processadores de pagamento terceirizados e seguros)</li>
                    <li>Histórico de transações</li>
                    <li>Dados de faturamento (quando necessário)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Dados de Uso
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                    <li>Logs de acesso e atividade na plataforma</li>
                    <li>Preferências e configurações</li>
                    <li>Projetos e trabalhos criados</li>
                    <li>Dados de uso das ferramentas</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Dados Técnicos
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                    <li>Endereço IP</li>
                    <li>Tipo de navegador e dispositivo</li>
                    <li>Cookies e tecnologias similares</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Como Usamos */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
                  Como Utilizamos Seus Dados
                </h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                <li>Fornecer, manter e melhorar nossos serviços</li>
                <li>Processar pagamentos e gerenciar assinaturas</li>
                <li>Enviar comunicações importantes sobre sua conta e serviços</li>
                <li>Responder a solicitações e fornecer suporte ao cliente</li>
                <li>Enviar atualizações, newsletters e informações promocionais (com sua autorização)</li>
                <li>Detectar, prevenir e resolver problemas técnicos e de segurança</li>
                <li>Cumprir obrigações legais e regulatórias</li>
                <li>Realizar análises e pesquisas para melhorar nossos serviços</li>
              </ul>
            </section>

            {/* Compartilhamento */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Compartilhamento de Dados
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                Não vendemos seus dados pessoais. Podemos compartilhar suas informações apenas nas seguintes situações:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                <li><strong>Prestadores de Serviços:</strong> Compartilhamos dados com provedores de serviços confiáveis que nos ajudam a operar nossa plataforma (processadores de pagamento, hospedagem, análise de dados)</li>
                <li><strong>Obrigações Legais:</strong> Quando exigido por lei, ordem judicial ou processo legal</li>
                <li><strong>Proteção de Direitos:</strong> Para proteger nossos direitos, propriedade ou segurança, ou dos nossos usuários</li>
                <li><strong>Com seu Consentimento:</strong> Em outras situações, apenas com seu consentimento explícito</li>
              </ul>
            </section>

            {/* Segurança */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
                  Segurança dos Dados
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Senhas criptografadas usando algoritmos seguros</li>
                <li>Acesso restrito a dados pessoais apenas para funcionários autorizados</li>
                <li>Monitoramento regular de segurança e auditorias</li>
                <li>Backups regulares e planos de recuperação de desastres</li>
              </ul>
            </section>

            {/* Seus Direitos */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Seus Direitos (LGPD)
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                De acordo com a LGPD, você tem os seguintes direitos sobre seus dados pessoais:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                <li><strong>Confirmação e Acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                <li><strong>Correção:</strong> Solicitar correção de dados incompletos, inexatos ou desatualizados</li>
                <li><strong>Anonimização, Bloqueio ou Eliminação:</strong> Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos</li>
                <li><strong>Portabilidade:</strong> Solicitar a portabilidade dos dados para outro fornecedor</li>
                <li><strong>Eliminação:</strong> Solicitar a eliminação de dados tratados com seu consentimento</li>
                <li><strong>Revogação de Consentimento:</strong> Revogar seu consentimento a qualquer momento</li>
                <li><strong>Informação:</strong> Obter informações sobre entidades públicas e privadas com as quais compartilhamos dados</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Cookies e Tecnologias Similares
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
              </p>
            </section>

            {/* Retenção */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Retenção de Dados
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei. Quando você cancela sua conta, excluímos ou anonimizamos seus dados pessoais, exceto quando a retenção for necessária para cumprir obrigações legais.
              </p>
            </section>

            {/* Alterações */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Alterações nesta Política
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas publicando a nova política nesta página e atualizando a data de "Última atualização". Recomendamos que revise esta política regularmente.
              </p>
            </section>

            {/* Contato */}
            <section className="bg-brand-green/10 rounded-lg p-6 border border-brand-green/20">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
                  Contato
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                Se você tiver dúvidas, solicitações ou preocupações sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato conosco:
              </p>
              <div className="space-y-2 text-gray-700 font-poppins">
                <p><strong>E-mail:</strong> privacidade@marcbuddy.com</p>
                <p><strong>Encarregado de Dados (DPO):</strong> dpo@marcbuddy.com</p>
              </div>
            </section>

            {/* Links Úteis */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              <Link 
                to="/termos" 
                className="text-brand-green hover:text-brand-green-500 font-semibold font-poppins"
              >
                Termos de Uso
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                to="/reembolso" 
                className="text-brand-green hover:text-brand-green-500 font-semibold font-poppins"
              >
                Política de Reembolso
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Privacy;

