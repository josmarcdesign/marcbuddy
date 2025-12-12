import { Link } from 'react-router-dom';
import { FileText, AlertCircle, CheckCircle, XCircle, Mail } from 'lucide-react';

const Terms = () => {
  return (
    <div className="bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-brand-green" />
              <h1 className="text-3xl font-black text-brand-blue-900 font-nunito">
                Termos de Uso
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
                Bem-vindo à MarcBuddy! Estes Termos de Uso ("Termos") regem seu acesso e uso da plataforma MarcBuddy, incluindo nosso site, aplicações e serviços relacionados (coletivamente, os "Serviços").
              </p>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Ao acessar ou usar nossos Serviços, você concorda em ficar vinculado a estes Termos. Se você não concordar com qualquer parte destes Termos, não deve usar nossos Serviços.
              </p>
            </section>

            {/* Aceitação */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
                  Aceitação dos Termos
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Ao criar uma conta, fazer login ou usar nossos Serviços de qualquer forma, você confirma que:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4 mt-4">
                <li>Você tem pelo menos 18 anos de idade ou tem o consentimento de um responsável legal</li>
                <li>Você tem capacidade legal para celebrar estes Termos</li>
                <li>Você forneceu informações precisas e completas durante o registro</li>
                <li>Você manterá a segurança de sua conta e senha</li>
                <li>Você é responsável por todas as atividades que ocorrem em sua conta</li>
              </ul>
            </section>

            {/* Descrição dos Serviços */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Descrição dos Serviços
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                A MarcBuddy oferece uma plataforma SaaS (Software como Serviço) que fornece ferramentas e recursos para designers e profissionais criativos, incluindo mas não limitado a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                <li>Ferramentas de extração e gerenciamento de cores</li>
                <li>Ferramentas de compressão e otimização de imagens</li>
                <li>Ferramentas de renomeação em lote</li>
                <li>Outras ferramentas criativas e utilitárias</li>
              </ul>
              <p className="text-gray-700 leading-relaxed font-poppins mt-4">
                Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto dos Serviços a qualquer momento, com ou sem aviso prévio.
              </p>
            </section>

            {/* Contas e Assinaturas */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Contas de Usuário e Assinaturas
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Criação de Conta
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-poppins">
                    Para usar certos recursos dos Serviços, você deve criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrem em sua conta.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Planos e Assinaturas
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                    <li>Oferecemos diferentes planos de assinatura com recursos e limites variados</li>
                    <li>As assinaturas são renovadas automaticamente, a menos que canceladas</li>
                    <li>Você pode cancelar sua assinatura a qualquer momento através das configurações da conta</li>
                    <li>O cancelamento entra em vigor no final do período de cobrança atual</li>
                    <li>Não oferecemos reembolsos para períodos já pagos, exceto conforme nossa Política de Reembolso</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Período de Teste Grátis
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-poppins">
                    Alguns planos podem oferecer um período de teste grátis. Se você não cancelar antes do final do período de teste, sua assinatura será automaticamente convertida em uma assinatura paga.
                  </p>
                </div>
              </div>
            </section>

            {/* Uso Aceitável */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
                  Uso Aceitável
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                Você concorda em usar nossos Serviços apenas para fins legais e de acordo com estes Termos. Você concorda em NÃO:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                <li>Usar os Serviços de forma que viole qualquer lei, regulamento ou direito de terceiros</li>
                <li>Transmitir, armazenar ou processar conteúdo ilegal, difamatório, ofensivo ou prejudicial</li>
                <li>Tentar acessar não autorizado a qualquer parte dos Serviços, outras contas ou sistemas relacionados</li>
                <li>Interferir ou interromper a integridade ou desempenho dos Serviços</li>
                <li>Usar bots, scripts ou outros meios automatizados para acessar os Serviços sem autorização</li>
                <li>Reproduzir, duplicar, copiar, vender ou explorar comercialmente qualquer parte dos Serviços</li>
                <li>Remover ou alterar qualquer aviso de direitos autorais, marca registrada ou outro aviso de propriedade</li>
                <li>Usar os Serviços para competir conosco ou para fins comerciais não autorizados</li>
              </ul>
            </section>

            {/* Propriedade Intelectual */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Propriedade Intelectual
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Nossa Propriedade
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-poppins">
                    Todos os direitos, títulos e interesses nos Serviços, incluindo software, design, textos, gráficos, imagens, logotipos e outros materiais, são de nossa propriedade ou de nossos licenciadores e são protegidos por leis de direitos autorais, marcas registradas e outras leis de propriedade intelectual.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue-900 mb-2 font-nunito">
                    Seu Conteúdo
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-poppins mb-2">
                    Você mantém todos os direitos sobre o conteúdo que você cria, faz upload ou processa usando nossos Serviços ("Seu Conteúdo"). Ao usar nossos Serviços, você nos concede uma licença não exclusiva, mundial, livre de royalties e sublicenciável para usar, reproduzir, modificar e exibir Seu Conteúdo apenas na medida necessária para fornecer e melhorar os Serviços.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-poppins">
                    Você garante que possui todos os direitos necessários sobre Seu Conteúdo e que ele não viola os direitos de terceiros.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitação de Responsabilidade */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-blue-900 font-nunito">
                  Limitação de Responsabilidade
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                NA MÁXIMA EXTENSÃO PERMITIDA POR LEI:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 font-poppins ml-4">
                <li>OS SERVIÇOS SÃO FORNECIDOS "COMO ESTÃO" E "CONFORME DISPONÍVEL", SEM GARANTIAS DE QUALQUER TIPO</li>
                <li>NÃO GARANTIMOS QUE OS SERVIÇOS SERÃO ININTERRUPTOS, SEGUROS, LIVRES DE ERROS OU ATENDAM AOS SEUS REQUISITOS</li>
                <li>NÃO SEREMOS RESPONSÁVEIS POR DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS, CONSEQUENCIAIS OU PUNITIVOS</li>
                <li>NOSSA RESPONSABILIDADE TOTAL NÃO EXCEDERÁ O VALOR PAGO POR VOCÊ NOS ÚLTIMOS 12 MESES</li>
              </ul>
            </section>

            {/* Indenização */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Indenização
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Você concorda em indenizar, defender e isentar a MarcBuddy, seus afiliados, funcionários e agentes de quaisquer reivindicações, danos, obrigações, perdas, responsabilidades, custos ou dívidas, e despesas (incluindo honorários advocatícios) decorrentes de seu uso dos Serviços, violação destes Termos ou violação de qualquer direito de terceiros.
              </p>
            </section>

            {/* Rescisão */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Rescisão
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins mb-4">
                Podemos suspender ou encerrar sua conta e acesso aos Serviços imediatamente, sem aviso prévio, se você violar estes Termos ou por qualquer outro motivo a nosso critério.
              </p>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Você pode cancelar sua conta a qualquer momento através das configurações da conta. Após o cancelamento, você perderá o acesso aos Serviços e seus dados podem ser excluídos de acordo com nossa Política de Privacidade.
              </p>
            </section>

            {/* Alterações */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Alterações nos Termos
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos você sobre mudanças significativas por e-mail ou através de um aviso em nossos Serviços. O uso continuado dos Serviços após tais alterações constitui sua aceitação dos novos Termos.
              </p>
            </section>

            {/* Lei Aplicável */}
            <section>
              <h2 className="text-2xl font-bold text-brand-blue-900 mb-4 font-nunito">
                Lei Aplicável e Jurisdição
              </h2>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Estes Termos são regidos pelas leis do Brasil. Qualquer disputa relacionada a estes Termos será resolvida nos tribunais competentes do Brasil.
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
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <div className="space-y-2 text-gray-700 font-poppins">
                <p><strong>E-mail:</strong> suporte@marcbuddy.com</p>
                <p><strong>Assuntos Legais:</strong> legal@marcbuddy.com</p>
              </div>
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

export default Terms;

