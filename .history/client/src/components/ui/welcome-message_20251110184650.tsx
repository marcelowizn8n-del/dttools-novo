import { Info, Sparkles, Target, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeMessageProps {
  userName?: string;
  onDismiss?: () => void;
  className?: string;
}

export function WelcomeMessage({ userName, onDismiss, className }: WelcomeMessageProps) {
  return (
    <Card className={`border-l-4 border-l-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Bem-vindo{userName ? `, ${userName}` : ""}! 👋
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              O <span className="font-semibold text-blue-600">DTTools</span> é sua plataforma de <strong>Design Thinking assistida por IA</strong>. 
              Vamos te guiar passo a passo na criação de soluções inovadoras para seus problemas de negócio.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Target className="w-3.5 h-3.5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">O que você vai fazer:</p>
                  <p className="text-sm text-gray-600">
                    Criar projetos de Design Thinking completos, seguindo as 5 fases do processo (Empatizar, Definir, Idear, Prototipar, Testar)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Como a IA te ajuda:</p>
                  <p className="text-sm text-gray-600">
                    Em cada etapa, você receberá orientações, exemplos práticos e insights gerados por IA para facilitar seu trabalho
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">O que você vai ganhar:</p>
                  <p className="text-sm text-gray-600">
                    Soluções validadas, insights sobre seus usuários, ideias priorizadas e protótipos testáveis – tudo organizado e documentado
                  </p>
                </div>
              </div>
            </div>

            <Alert className="mt-4 bg-white/60 border-blue-300">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-gray-700">
                <strong>Não sabe por onde começar?</strong> Use nossa ferramenta de <strong>Geração Automática de MVP</strong> acima. 
                Em 5-10 minutos, a IA cria um projeto completo para você explorar e aprender!
              </AlertDescription>
            </Alert>

            {onDismiss && (
              <button
                onClick={onDismiss}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                data-testid="button-dismiss-welcome"
              >
                Entendi, não mostrar novamente
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
