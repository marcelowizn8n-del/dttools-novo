// DON'T DELETE THIS COMMENT
// Using javascript_gemini blueprint integration
import { GoogleGenAI } from "@google/genai";
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface DesignThinkingContext {
  projectId?: string;
  projectName?: string;
  projectDescription?: string;
  currentPhase: number;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
  personas?: any[];
  empathyMaps?: any[];
  ideas?: any[];
  prototypes?: any[];
}

export interface JourneyMapSuggestion {
  journey?: {
    name?: string;
    persona?: string;
    primaryGoal?: string;
    description?: string;
  };
  stages?: Array<{
    title?: string;
    description?: string;
  }>;
}

export interface BenchmarkingData {
  // DVF Assessment data
  dvfAssessments?: Array<{
    desirabilityScore: number;
    feasibilityScore: number;
    viabilityScore: number;
    recommendation: 'proceed' | 'modify' | 'stop';
    overallScore: number;
  }>;
  
  // Lovability Metrics data
  lovabilityMetrics?: {
    npsScore: number;
    satisfactionScore: number;
    engagementRate: number;
    emotionalDistribution: Record<string, number>;
    overallLovabilityScore: number;
  };
  
  // Project Analytics data
  projectAnalytics?: {
    completionRate: number;
    totalTimeSpent: number;
    teamSize: number;
    innovationLevel: number;
    overallSuccess: number;
    topPerformingTools: string[];
    timeBottlenecks: string[];
  };
  
  // Competitive Analysis data
  competitiveAnalysis?: Array<{
    competitorName: string;
    competitorType: 'direct' | 'indirect' | 'substitute';
    marketPosition: 'leader' | 'challenger' | 'niche' | 'follower';
    ourAdvantages: string[];
    functionalGaps: string[];
    competitivenessScore: number;
  }>;
  
  // Project context
  projectId: string;
  projectName: string;
  projectDescription?: string;
  industry?: string;
  companySize?: string;
}

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export class DesignThinkingGeminiAI {
  private readonly model = "gemini-2.5-flash";

  async chat(message: string, context: DesignThinkingContext, opts?: { kbSourcesText?: string }): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context, opts?.kbSourcesText);
      const prompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
      });

      return response.text || "Desculpe, não consegui processar sua mensagem no momento.";
    } catch (error) {
      console.error("Erro no chat da IA Gemini:", error);
      throw new Error("Erro ao processar sua mensagem. Verifique se a chave da API Gemini está configurada corretamente.");
    }
  }

  async generateJourneyMap(input: {
    projectName: string;
    projectDescription?: string;
    personas?: any[];
    empathyMaps?: any[];
    hmwQuestions?: any[];
    guidingCriteria?: any[];
    language?: string;
  }): Promise<JourneyMapSuggestion> {
    try {
      const lang = input.language || "pt-BR";
      const personasCount = input.personas?.length || 0;
      const empathyCount = input.empathyMaps?.length || 0;
      const hmwCount = input.hmwQuestions?.length || 0;
      const criteriaCount = input.guidingCriteria?.length || 0;

      const contextSummary = {
        projectName: input.projectName,
        projectDescription: input.projectDescription,
        personas: (input.personas || []).slice(0, 5),
        empathyMaps: (input.empathyMaps || []).slice(0, 3),
        hmwQuestions: (input.hmwQuestions || []).slice(0, 10),
        guidingCriteria: (input.guidingCriteria || []).slice(0, 10),
      };

      const languageInstruction = lang.startsWith("pt")
        ? "Responda APENAS em português do Brasil."
        : lang.startsWith("es")
        ? "Responda APENAS em espanhol."
        : lang.startsWith("fr")
        ? "Responda APENAS em francês."
        : "Responda APENAS em inglês.";

      const prompt = `Você é um especialista em Design Thinking criando um MAPA DE JORNADA DO USUÁRIO.

${languageInstruction}

CONTEXTO DO PROJETO:
- Nome do projeto: ${input.projectName}
- Descrição do projeto: ${input.projectDescription || "Sem descrição detalhada"}
- Quantidade de personas: ${personasCount}
- Mapas de empatia: ${empathyCount}
- Perguntas HMW: ${hmwCount}
- Critérios norteadores: ${criteriaCount}

Dados estruturados do projeto (resumidos):
${JSON.stringify(contextSummary, null, 2)}

TAREFA:
- Propor UMA jornada principal coerente com o projeto.
- Definir de 4 a 7 ETAPAS principais da jornada, em ordem lógica.
- Cada etapa deve representar um momento claro da experiência do usuário (descoberta, consideração, compra, uso, etc.).

Retorne APENAS um objeto JSON com esta estrutura exata:
{
  "journey": {
    "name": "Nome da jornada",
    "persona": "Persona foco (se houver)",
    "primaryGoal": "Objetivo principal da jornada",
    "description": "Breve descrição da jornada"
  },
  "stages": [
    {
      "title": "Nome da etapa",
      "description": "Breve descrição da etapa"
    }
  ]
}

NÃO inclua comentários, markdown ou texto fora do JSON.`;

      const response = await ai.models.generateContent({
        model: this.model,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            properties: {
              journey: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  persona: { type: "string" },
                  primaryGoal: { type: "string" },
                  description: { type: "string" },
                },
                required: ["name"],
              },
              stages: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                  },
                  required: ["title"],
                },
                minItems: 4,
                maxItems: 7,
              },
            },
            required: ["journey", "stages"],
          },
        },
        contents: prompt,
      });

      const text = response.text || "{}";

      try {
        const parsed = JSON.parse(text) as JourneyMapSuggestion;
        return parsed || {};
      } catch (parseError) {
        console.error(
          "Erro ao interpretar JSON da jornada com IA (Gemini):",
          parseError,
        );

        // Tentativa de recuperação: extrair o primeiro bloco JSON bem formado
        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace > firstBrace) {
          const candidate = text.slice(firstBrace, lastBrace + 1);
          try {
            const parsed = JSON.parse(candidate) as JourneyMapSuggestion;
            return parsed || {};
          } catch (innerError) {
            console.error(
              "Falha ao recuperar JSON da jornada com IA (Gemini):",
              innerError,
            );
          }
        }

        console.error(
          "Resposta bruta da IA (primeiros 500 caracteres):",
          text.slice(0, 500),
        );

        return {};
      }
    } catch (error) {
      console.error("Erro ao gerar jornada com IA (Gemini):", error);
      return {};
    }
  }

  async generateSuggestions(context: DesignThinkingContext): Promise<string[]> {
    try {
      const prompt = this.buildSuggestionsPrompt(context);

      const response = await ai.models.generateContent({
        model: this.model,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              suggestions: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 5
              }
            },
            required: ["suggestions"]
          }
        },
        contents: prompt,
      });

      const result = JSON.parse(response.text || "{}");
      return result.suggestions || [
        "Como podemos entender melhor nossos usuários?",
        "Que problemas estamos tentando resolver?",
        "Quais são as principais necessidades identificadas?"
      ];
    } catch (error) {
      console.error("Erro ao gerar sugestões:", error);
      // Fallback suggestions
      return [
        "Como podemos entender melhor nossos usuários?",
        "Que problemas estamos tentando resolver?",
        "Quais são as principais necessidades identificadas?"
      ];
    }
  }

  private buildSystemPrompt(context: DesignThinkingContext, kbSourcesText?: string): string {
    const phaseNames: Record<number, string> = {
      1: "Empatizar",
      2: "Definir", 
      3: "Idear",
      4: "Prototipar",
      5: "Testar"
    };

    const currentPhase = phaseNames[context.currentPhase] || "Desconhecida";

    const base = `Você é um especialista em Design Thinking e facilitador de inovação. 
Você está ajudando com um projeto chamado "${context.projectName}" na fase de ${currentPhase}.

Contexto do projeto:
- Fase atual: ${currentPhase} (${context.currentPhase}/5)
- Descrição: ${context.projectDescription}
- Personas criadas: ${context.personas?.length || 0}
- Mapas de empatia: ${context.empathyMaps?.length || 0}  
- Ideias geradas: ${context.ideas?.length || 0}
- Protótipos: ${context.prototypes?.length || 0}

Diretrizes:
- Seja prático e focado na metodologia de Design Thinking
- Faça perguntas que estimulem o pensamento criativo
- Sugira atividades específicas para a fase atual
- Mantenha o foco no usuário final
- Responda em português brasileiro
- Use uma linguagem acessível e motivadora
- Limite respostas a 150 palavras quando possível`;

    if (!kbSourcesText || !kbSourcesText.trim()) {
      return base;
    }

    return `${base}\n\nFontes (Biblioteca DTTools):\n${kbSourcesText}\n\nRegras de uso das fontes:\n- Use as fontes acima quando forem relevantes\n- Sempre que usar uma informação das fontes, cite usando o marcador [KB1], [KB2], etc.\n- Se a resposta não puder ser sustentada pelas fontes, deixe isso claro e responda apenas com base na metodologia de Design Thinking`;
  }

  private buildSuggestionsPrompt(context: DesignThinkingContext): string {
    const phasePrompts: Record<number, string> = {
      1: "Gere 4 sugestões de perguntas para a fase Empatizar, focando em entender o usuário:",
      2: "Gere 4 sugestões de perguntas para a fase Definir, focando em sintetizar insights:",
      3: "Gere 4 sugestões de perguntas para a fase Idear, focando em gerar soluções criativas:",
      4: "Gere 4 sugestões de perguntas para a fase Prototipar, focando em materializar ideias:",
      5: "Gere 4 sugestões de perguntas para a fase Testar, focando em validar soluções:"
    };

    const phasePrompt = phasePrompts[context.currentPhase] || phasePrompts[1];

    return `${phasePrompt}

Projeto: ${context.projectName || 'Projeto de Design Thinking'}
Descrição: ${context.projectDescription || 'Desenvolvimento de soluções centradas no usuário'}

Retorne apenas um JSON com o array "suggestions" contendo 4 perguntas curtas e práticas em português brasileiro.
Exemplo: {"suggestions": ["Como podemos...", "O que aconteceria se...", "Quais são...", "Por que nossos usuários..."]}`;
  }

  async generateBenchmarkingRecommendations(data: BenchmarkingData): Promise<{
    overallAssessment: string;
    keyInsights: string[];
    actionableRecommendations: string[];
    competitiveAdvantages: string[];
    improvementAreas: string[];
    nextSteps: string[];
  }> {
    try {
      const prompt = this.buildBenchmarkingPrompt(data);

      const response = await ai.models.generateContent({
        model: this.model,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              overallAssessment: { type: "string" },
              keyInsights: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 5
              },
              actionableRecommendations: {
                type: "array",
                items: { type: "string" },
                minItems: 4,
                maxItems: 6
              },
              competitiveAdvantages: {
                type: "array",
                items: { type: "string" },
                minItems: 2,
                maxItems: 4
              },
              improvementAreas: {
                type: "array",
                items: { type: "string" },
                minItems: 2,
                maxItems: 4
              },
              nextSteps: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 5
              }
            },
            required: ["overallAssessment", "keyInsights", "actionableRecommendations", "competitiveAdvantages", "improvementAreas", "nextSteps"]
          }
        },
        contents: prompt,
      });

      const result = JSON.parse(response.text || "{}");
      return result || this.getFallbackBenchmarkingRecommendations();
    } catch (error) {
      console.error("Erro ao gerar recomendações de benchmarking:", error);
      return this.getFallbackBenchmarkingRecommendations();
    }
  }

  private buildBenchmarkingPrompt(data: BenchmarkingData): string {
    // Calculate overall scores
    const dvfAverage = data.dvfAssessments?.length 
      ? data.dvfAssessments.reduce((acc, curr) => acc + curr.overallScore, 0) / data.dvfAssessments.length 
      : 0;
    
    const lovabilityScore = data.lovabilityMetrics?.overallLovabilityScore || 0;
    const projectSuccess = data.projectAnalytics?.overallSuccess || 0;
    const competitivenessAverage = data.competitiveAnalysis?.length
      ? data.competitiveAnalysis.reduce((acc, curr) => acc + curr.competitivenessScore, 0) / data.competitiveAnalysis.length
      : 0;

    return `Você é um consultor sênior especializado em Design Thinking e análise competitiva. Analise os dados de benchmarking abaixo e forneça recomendações estratégicas personalizadas.

DADOS DO PROJETO:
Projeto: ${data.projectName}
Descrição: ${data.projectDescription || 'Não informado'}
Indústria: ${data.industry || 'Não informado'}
Tamanho da empresa: ${data.companySize || 'Não informado'}

ANÁLISE DVF (Desejabilidade, Viabilidade, Exequibilidade):
Score médio: ${dvfAverage.toFixed(1)}/10
Avaliações realizadas: ${data.dvfAssessments?.length || 0}
${data.dvfAssessments?.map(a => `- Score: ${a.overallScore}/10, Recomendação: ${a.recommendation}`).join('\n') || 'Nenhuma avaliação DVF'}

MÉTRICAS DE LOVABILITY:
Score geral: ${lovabilityScore.toFixed(1)}/10
NPS: ${data.lovabilityMetrics?.npsScore || 0}
Satisfação: ${data.lovabilityMetrics?.satisfactionScore || 0}/10
Engajamento: ${data.lovabilityMetrics?.engagementRate || 0}%

ANALYTICS DO PROJETO:
Taxa de conclusão: ${data.projectAnalytics?.completionRate || 0}%
Tempo total investido: ${data.projectAnalytics?.totalTimeSpent || 0} horas
Tamanho da equipe: ${data.projectAnalytics?.teamSize || 1} pessoas
Nível de inovação: ${data.projectAnalytics?.innovationLevel || 0}/5
Success geral: ${projectSuccess}%
Ferramentas top: ${data.projectAnalytics?.topPerformingTools?.join(', ') || 'Nenhuma'}
Gargalos de tempo: ${data.projectAnalytics?.timeBottlenecks?.join(', ') || 'Nenhum'}

ANÁLISE COMPETITIVA:
Score médio de competitividade: ${competitivenessAverage.toFixed(1)}/10
Concorrentes analisados: ${data.competitiveAnalysis?.length || 0}
${data.competitiveAnalysis?.map(c => 
  `- ${c.competitorName} (${c.competitorType}, ${c.marketPosition}): Score ${c.competitivenessScore}/10`
).join('\n') || 'Nenhuma análise competitiva'}

INSTRUÇÕES:
1. Faça uma avaliação geral do estado do projeto considerando todos os aspectos
2. Identifique insights-chave baseados nos dados cruzados
3. Forneça recomendações acionáveis e específicas
4. Liste vantagens competitivas identificadas
5. Destaque áreas prioritárias de melhoria
6. Sugira próximos passos concretos

Foque em:
- Correlações entre métricas
- Gaps de performance
- Oportunidades competitivas
- Recomendações práticas e específicas
- Próximos passos com timeframe

Responda em português brasileiro, sendo direto e orientado a resultados.`;
  }

  private getFallbackBenchmarkingRecommendations() {
    return {
      overallAssessment: "Análise de benchmarking em andamento. Dados insuficientes para avaliação completa.",
      keyInsights: [
        "Necessário coletar mais dados de benchmarking",
        "Implementar avaliações DVF regulares",
        "Monitorar métricas de lovability"
      ],
      actionableRecommendations: [
        "Conduzir avaliação DVF completa",
        "Implementar coleta sistemática de feedback",
        "Realizar análise competitiva detalhada",
        "Definir KPIs específicos de projeto"
      ],
      competitiveAdvantages: [
        "Metodologia estruturada de Design Thinking",
        "Foco em dados e evidências"
      ],
      improvementAreas: [
        "Coleta de dados mais robusta",
        "Análise competitiva regular"
      ],
      nextSteps: [
        "Completar avaliação DVF",
        "Implementar sistema de métricas",
        "Agendar revisão mensal de benchmarks"
      ]
    };
  }
}

export const designThinkingGeminiAI = new DesignThinkingGeminiAI();