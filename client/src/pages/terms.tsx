import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Terms() {
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
            Termos de Uso
          </h1>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Última atualização: 07 de outubro de 2025
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar e usar a plataforma DTTools ("Serviço"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar nosso Serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                2. Descrição do Serviço
              </h2>
              <p>
                DTTools é uma plataforma interativa de ferramentas para Design Thinking, oferecendo:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Ferramentas para as 5 fases do Design Thinking (Empatizar, Definir, Idear, Prototipar, Testar)</li>
                <li>Gestão de projetos de inovação</li>
                <li>Sistema de progresso e gamificação</li>
                <li>Biblioteca de conhecimento e recursos educacionais</li>
                <li>Funcionalidades de colaboração e exportação</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                3. Conta de Usuário
              </h2>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                3.1 Registro
              </h3>
              <p>
                Para usar o Serviço, você deve criar uma conta fornecendo informações precisas e completas. Você é responsável por manter a confidencialidade de suas credenciais.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">
                3.2 Responsabilidade
              </h3>
              <p>
                Você é responsável por todas as atividades que ocorrem em sua conta e deve notificar-nos imediatamente sobre qualquer uso não autorizado.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">
                3.3 Elegibilidade
              </h3>
              <p>
                Você deve ter pelo menos 18 anos para usar este Serviço. Ao criar uma conta, você confirma que atende a este requisito.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                4. Planos e Pagamentos
              </h2>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                4.1 Planos Disponíveis
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Gratuito:</strong> Acesso básico com limitações</li>
                <li><strong>Pro:</strong> Recursos avançados e projetos ilimitados</li>
                <li><strong>Enterprise:</strong> Soluções customizadas para empresas</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">
                4.2 Faturamento
              </h3>
              <p>
                Os planos pagos são cobrados mensalmente ou anualmente, conforme selecionado. As cobranças são processadas através de nossos parceiros de pagamento seguros.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">
                4.3 Cancelamento e Reembolsos
              </h3>
              <p>
                Você pode cancelar sua assinatura a qualquer momento. Cancelamentos terão efeito ao final do período de faturamento atual. Não oferecemos reembolsos proporcionais, exceto quando exigido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                5. Uso Aceitável
              </h2>
              <p className="mb-3">Você concorda em NÃO:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violar qualquer lei ou regulamento aplicável</li>
                <li>Infringir direitos de propriedade intelectual de terceiros</li>
                <li>Transmitir conteúdo ilegal, prejudicial ou ofensivo</li>
                <li>Tentar acessar áreas restritas do sistema</li>
                <li>Interferir ou interromper a operação do Serviço</li>
                <li>Usar o Serviço para spam ou atividades fraudulentas</li>
                <li>Fazer engenharia reversa ou copiar funcionalidades da plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                6. Propriedade Intelectual
              </h2>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                6.1 Propriedade da Plataforma
              </h3>
              <p>
                O Serviço, incluindo seu design, código, marca e conteúdo, é propriedade da DTTools e está protegido por leis de propriedade intelectual.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">
                6.2 Seu Conteúdo
              </h3>
              <p>
                Você mantém todos os direitos sobre o conteúdo que criar na plataforma (projetos, ideias, protótipos). Ao usar o Serviço, você nos concede uma licença limitada para hospedar e exibir seu conteúdo conforme necessário para operar o Serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                7. Privacidade e Dados
              </h2>
              <p>
                Seu uso do Serviço também é regido por nossa <Link href="/privacidade" className="text-blue-600 hover:underline">Política de Privacidade</Link>. Ao usar o Serviço, você consente com a coleta e uso de informações conforme descrito nessa política.
              </p>
              <p className="mt-3">
                Em funcionalidades que utilizam Inteligência Artificial (por exemplo, o chat), sua mensagem e partes do contexto do projeto podem ser processados por provedores de IA para gerar respostas. Você concorda em não inserir no chat informações sensíveis (como senhas, dados bancários, documentos pessoais ou segredos comerciais) e entende que a DTTools não se responsabiliza por informações sensíveis inseridas voluntariamente por você nessas funcionalidades.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                8. Limitação de Responsabilidade
              </h2>
              <p>
                O Serviço é fornecido "como está" e "conforme disponível". Não garantimos que o Serviço será ininterrupto, seguro ou livre de erros. Em nenhuma circunstância seremos responsáveis por:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Perda de dados ou conteúdo</li>
                <li>Lucros cessantes ou oportunidades perdidas</li>
                <li>Danos indiretos, incidentais ou consequenciais</li>
                <li>Problemas resultantes de caso fortuito ou força maior</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                9. Modificações do Serviço
              </h2>
              <p>
                Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer parte do Serviço a qualquer momento, com ou sem aviso prévio. Não seremos responsáveis por qualquer modificação, suspensão ou descontinuação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                10. Rescisão
              </h2>
              <p>
                Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, por violação destes Termos. Você pode encerrar sua conta a qualquer momento através das configurações da plataforma ou entrando em contato conosco.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                11. Lei Aplicável
              </h2>
              <p>
                Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida nos tribunais competentes de São Paulo, SP.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                12. Alterações nos Termos
              </h2>
              <p>
                Podemos atualizar estes Termos periodicamente. Notificaremos sobre mudanças significativas através de email ou aviso na plataforma. O uso continuado após as alterações constitui aceitação dos novos Termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                13. Contato
              </h2>
              <p>
                Para dúvidas sobre estes Termos de Uso, entre em contato:
              </p>
              <ul className="list-none space-y-2 mt-3">
                <li><strong>Email:</strong> legal@dttools.app</li>
                <li><strong>Suporte:</strong> <Link href="/support" className="text-blue-600 hover:underline">dttools.app/support</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
