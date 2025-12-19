import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Política de Privacidade
          </h1>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Última atualização: 07 de outubro de 2025
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                1. Introdução
              </h2>
              <p>
                A DTTools ("nós", "nosso" ou "nossa") respeita sua privacidade e está comprometida em proteger seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações quando você usa nossa plataforma de Design Thinking.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                2. Informações que Coletamos
              </h2>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                2.1 Informações Fornecidas por Você
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Informações de conta (nome, email, senha criptografada)</li>
                <li>Dados de projetos e ferramentas de Design Thinking que você cria</li>
                <li>Informações de perfil e preferências</li>
                <li>Conteúdo que você compartilha na plataforma</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">
                2.2 Informações Coletadas Automaticamente
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dados de uso e interação com a plataforma</li>
                <li>Informações técnicas (tipo de dispositivo, navegador, sistema operacional)</li>
                <li>Endereço IP e dados de localização aproximada</li>
                <li>Cookies e tecnologias similares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                3. Como Usamos Suas Informações
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer, operar e manter nossa plataforma</li>
                <li>Melhorar, personalizar e expandir nossos serviços</li>
                <li>Comunicar com você sobre atualizações e suporte</li>
                <li>Processar transações e gerenciar sua conta</li>
                <li>Analisar uso para aprimorar a experiência do usuário</li>
                <li>Prevenir fraudes e garantir a segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                4. Compartilhamento de Dados
              </h2>
              <p className="mb-3">
                Não vendemos suas informações pessoais. Podemos compartilhar seus dados apenas nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Com seu consentimento explícito</li>
                <li>Com provedores de serviços que nos auxiliam na operação da plataforma</li>
                <li>Para cumprir obrigações legais ou proteger direitos</li>
                <li>Em caso de fusão, aquisição ou venda de ativos (com notificação prévia)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                4.1 Uso de Inteligência Artificial (Chat)
              </h2>
              <p className="mb-3">
                Para oferecer funcionalidades de chat com orientação e sugestões, a DTTools pode processar sua mensagem e partes do contexto do seu projeto com provedores de IA.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Podemos enviar o texto da sua mensagem e informações necessárias para responder (por exemplo: fase atual, nome/descrição do projeto quando você estiver usando o chat dentro de um projeto).</li>
                <li>Não temos intenção de enviar dados como senhas, dados bancários ou documentos pessoais. Por isso, pedimos que você NÃO compartilhe informações sensíveis no chat.</li>
                <li>O processamento ocorre com a finalidade de gerar a resposta e melhorar a experiência do usuário.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                5. Segurança dos Dados
              </h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Criptografia de senhas e dados sensíveis</li>
                <li>Conexões HTTPS seguras</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares e recuperação de dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                6. Seus Direitos (LGPD)
              </h2>
              <p className="mb-3">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Confirmação da existência de tratamento de dados</li>
                <li>Acesso aos seus dados pessoais</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                <li>Portabilidade dos dados a outro fornecedor</li>
                <li>Eliminação dos dados pessoais tratados com consentimento</li>
                <li>Revogação do consentimento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                7. Retenção de Dados
              </h2>
              <p>
                Mantemos suas informações pelo tempo necessário para fornecer nossos serviços e cumprir obrigações legais. Dados de projetos são mantidos enquanto sua conta estiver ativa. Após a exclusão da conta, os dados são permanentemente removidos em até 90 dias.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                8. Cookies
              </h2>
              <p>
                Utilizamos cookies essenciais para autenticação e funcionalidade da plataforma. Você pode controlar cookies através das configurações do seu navegador, mas isso pode afetar a funcionalidade do serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                9. Menores de Idade
              </h2>
              <p>
                Nossa plataforma não é direcionada a menores de 18 anos. Não coletamos intencionalmente informações de menores. Se descobrirmos que coletamos dados de um menor, excluiremos essas informações imediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                10. Alterações nesta Política
              </h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas por email ou através de aviso na plataforma. O uso continuado após as alterações constitui aceitação da nova política.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                11. Contato
              </h2>
              <p>
                Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato:
              </p>
              <ul className="list-none space-y-2 mt-3">
                <li><strong>Email:</strong> privacy@dttools.app</li>
                <li><strong>Suporte:</strong> <Link href="/support" className="text-blue-600 hover:underline">dttools.app/support</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
