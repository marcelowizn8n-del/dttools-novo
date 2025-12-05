/*
 * AI Chat and Analysis Service
 * 
 * This service provides optional AI-powered features:
 * - Design Thinking mentor chat
 * - Project analysis and recommendations
 * 
 * Note: These features are currently disabled as we've migrated to 100% Google Gemini
 * for MVP generation. Future versions may implement these features using Gemini.
 * 
 * For now, all methods return helpful fallback messages and guidance.
 */

// OpenAI integration removed - all features use graceful fallbacks
const openai = null;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface DesignThinkingContext {
  projectId?: string;
  currentPhase: number;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
}

// Comprehensive AI Analysis interfaces
export interface ProjectAnalysisData {
  project: any;
  empathyMaps: any[];
  personas: any[];
  interviews: any[];
  observations: any[];
  povStatements: any[];
  hmwQuestions: any[];
  ideas: any[];
  prototypes: any[];
  testPlans: any[];
  testResults: any[];
  guidingCriteria: any[];
}

export interface PhaseAnalysis {
  phase: number;
  phaseName: string;
  completeness: number;
  quality: number;
  insights: string[];
  gaps: string[];
  recommendations: string[];
  strengths: string[];
}

export interface AIProjectAnalysis {
  executiveSummary: string;
  maturityScore: number;
  overallInsights: string[];
  attentionPoints: string[];
  priorityNextSteps: string[];
  phaseAnalyses: PhaseAnalysis[];
  consistency: {
    score: number;
    issues: string[];
    strengths: string[];
  };
  alignment: {
    problemSolutionAlignment: number;
    researchInsightsAlignment: number;
    comments: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export class DesignThinkingAI {
  private getSystemPrompt(context: DesignThinkingContext): string {
    const phaseGuides = {
      1: {
        name: "Empatizar",
        description: "compreender profundamente as necessidades dos usuários",
        tools: "mapas de empatia, personas, entrevistas, observações",
        questions: "Quem são seus usuários? Quais suas necessidades, desejos e frustrações?"
      },
      2: {
        name: "Definir", 
        description: "sintetizar insights para definir o problema principal",
        tools: "declarações de ponto de vista (POV), perguntas 'Como Podemos' (HMW)",
        questions: "Qual é o problema real que precisamos resolver? Como podemos reformular este desafio?"
      },
      3: {
        name: "Idear",
        description: "gerar soluções criativas e inovadoras",
        tools: "brainstorming, brainwriting, método das piores ideias",
        questions: "Que soluções podemos imaginar? Como podemos pensar fora da caixa?"
      },
      4: {
        name: "Prototipar",
        description: "construir representações rápidas e simples das ideias",
        tools: "protótipos de papel, wireframes, mockups, modelos 3D",
        questions: "Como podemos tornar nossa ideia tangível? Que versão mínima podemos testar?"
      },
      5: {
        name: "Testar",
        description: "validar protótipos com usuários reais",
        tools: "planos de teste, testes de usabilidade, entrevistas de feedback",
        questions: "O que os usuários pensam da nossa solução? Que melhorias precisamos fazer?"
      }
    };

    const currentPhaseInfo = phaseGuides[context.currentPhase as keyof typeof phaseGuides] || phaseGuides[1];
    
    return `Você é um mentor experiente em Design Thinking, especializado em guiar equipes através do processo de inovação centrada no usuário.

CONTEXTO ATUAL:
- Fase atual: ${currentPhaseInfo.name} (Fase ${context.currentPhase}/5)
- Objetivo da fase: ${currentPhaseInfo.description}
- Ferramentas principais: ${currentPhaseInfo.tools}
- Perguntas-chave: ${currentPhaseInfo.questions}
- Nível do usuário: ${context.userLevel === 'beginner' ? 'Iniciante' : context.userLevel === 'intermediate' ? 'Intermediário' : 'Avançado'}

SUAS RESPONSABILIDADES:
1. Fornecer orientações práticas e específicas para a fase atual
2. Sugerir métodos, ferramentas e exercícios apropriados
3. Fazer perguntas instigantes que guiem o pensamento criativo
4. Oferecer exemplos concretos e aplicáveis
5. Adaptar a linguagem ao nível de experiência do usuário
6. Motivar e encorajar a experimentação

ESTILO DE COMUNICAÇÃO:
- Use um tom amigável, encorajador e profissional
- Seja conciso mas informativo
- Faça perguntas abertas que estimulem a reflexão
- Ofereça sugestões práticas e acionáveis
- Use exemplos do mundo real quando relevante

FOCO ESPECIAL: ${context.focusArea ? `Concentre-se especialmente em ${context.focusArea}` : 'Mantenha foco na fase atual'}.

Responda sempre em português brasileiro de forma clara e didática.`;
  }

  async chat(
    messages: ChatMessage[],
    context: DesignThinkingContext
  ): Promise<string> {
    if (!openai) {
      // Return friendly fallback message similar to other methods
      const phaseGuides = {
        1: {
          name: "Empatizar",
          guidance: "foque em entender profundamente seus usuários através de mapas de empatia, personas, entrevistas e observações. Procure descobrir suas necessidades, desejos e frustrações."
        },
        2: {
          name: "Definir", 
          guidance: "sintetize os insights coletados para definir claramente o problema principal. Use declarações de ponto de vista (POV) e perguntas 'Como Podemos' (HMW)."
        },
        3: {
          name: "Idear",
          guidance: "gere o máximo de soluções criativas possível. Use brainstorming, brainwriting e outras técnicas para explorar diferentes abordagens."
        },
        4: {
          name: "Prototipar",
          guidance: "construa versões simples e rápidas das suas melhores ideias. Podem ser protótipos de papel, wireframes ou mockups básicos."
        },
        5: {
          name: "Testar",
          guidance: "valide seus protótipos com usuários reais. Colete feedback, observe comportamentos e identifique melhorias necessárias."
        }
      };

      const currentPhase = phaseGuides[context.currentPhase as keyof typeof phaseGuides] || phaseGuides[1];
      
      return `Olá! Sou seu mentor de Design Thinking. No momento, as funcionalidades avançadas de IA estão indisponíveis, mas posso te orientar com base na metodologia.

Você está na Fase ${context.currentPhase} - ${currentPhase.name}. Nesta etapa, ${currentPhase.guidance}

Algumas dicas práticas:
• Use as ferramentas disponíveis na plataforma para documentar seu progresso
• Mantenha sempre o foco no usuário e suas necessidades
• Não tenha pressa - cada fase tem sua importância no processo
• Colabore com sua equipe e compartilhe insights

Para funcionalidades avançadas de IA, configure a chave da API OpenAI nos Secrets do Replit. Posso te ajudar com mais alguma orientação sobre Design Thinking?`;
    }

    try {
      const systemPrompt = this.getSystemPrompt(context);
      
      const openaiMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      // This code is unreachable as openai is always null, but kept for future reference
      const response = await (openai as any).chat.completions.create({
        model: "gpt-5",
        messages: openaiMessages,
        max_tokens: 1000,
      });

      return response.choices[0].message.content || "Desculpe, não consegui gerar uma resposta. Tente novamente.";
    } catch (error) {
      console.error('Erro no chat da IA:', error);
      throw new Error("Erro ao processar sua mensagem. Verifique se a chave da API OpenAI está configurada corretamente.");
    }
  }

  async generateSuggestions(
    context: DesignThinkingContext,
    currentTopic: string
  ): Promise<string[]> {
    if (!openai) {
      return [
        "Como podemos entender melhor nossos usuários?",
        "Que ferramentas seriam mais úteis nesta fase?",
        "Qual seria o próximo passo mais importante?"
      ];
    }

    try {
      const prompt = `Baseado no contexto de Design Thinking na fase ${context.currentPhase} e no tópico "${currentTopic}", gere 3 sugestões práticas e específicas de próximos passos ou perguntas relevantes. Responda em formato JSON com um array de strings chamado "suggestions".`;

      // This code is unreachable as openai is always null, but kept for future reference
      const response = await (openai as any).chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: 'system', content: this.getSystemPrompt(context) },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
      return result.suggestions || [];
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      return [
        "Como podemos entender melhor nossos usuários?",
        "Que ferramentas seriam mais úteis nesta fase?",
        "Qual seria o próximo passo mais importante?"
      ];
    }
  }

  async analyzeProjectPhase(
    projectData: any,
    currentPhase: number
  ): Promise<{ insights: string[]; nextSteps: string[]; completeness: number }> {
    try {
      const prompt = `Analise os dados do projeto de Design Thinking e forneça insights sobre a fase ${currentPhase}. 

      Dados do projeto: ${JSON.stringify(projectData, null, 2)}

      Forneça sua análise em formato JSON com:
      - "insights": array de strings com insights sobre o progresso
      - "nextSteps": array de strings com próximos passos recomendados  
      - "completeness": número de 0 a 100 indicando o percentual de completude da fase`;

      if (!openai) {
        return {
          insights: ["Análise não disponível no momento"],
          nextSteps: ["Continue trabalhando nas ferramentas da fase atual"],
          completeness: 0
        };
      }

      // This code is unreachable as openai is always null, but kept for future reference
      const response = await (openai as any).chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: 'system', content: this.getSystemPrompt({ currentPhase, userLevel: 'intermediate' }) },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"insights": [], "nextSteps": [], "completeness": 0}');
      return {
        insights: result.insights || [],
        nextSteps: result.nextSteps || [],
        completeness: Math.max(0, Math.min(100, result.completeness || 0))
      };
    } catch (error) {
      console.error('Erro ao analisar fase do projeto:', error);
      return {
        insights: ["Análise não disponível no momento"],
        nextSteps: ["Continue trabalhando nas ferramentas da fase atual"],
        completeness: 0
      };
    }
  }

  async analyzeCompleteProject(
    analysisData: ProjectAnalysisData
  ): Promise<AIProjectAnalysis> {
    if (!openai) {
      // Retorna análise simulada para demonstração quando API key não estiver configurada
      return this.generateMockAnalysis(analysisData);
    }

    try {
      const prompt = `Como especialista em Design Thinking, analise este projeto completo e forneça uma análise abrangente.

DADOS DO PROJETO:
${JSON.stringify(analysisData, null, 2)}

Forneça uma análise completa em formato JSON com a seguinte estrutura:

{
  "executiveSummary": "Resumo executivo do projeto (2-3 frases)",
  "maturityScore": numero de 1-10 indicando maturidade geral do projeto,
  "overallInsights": ["insight geral 1", "insight geral 2", "..."],
  "attentionPoints": ["ponto que precisa atenção 1", "ponto que precisa atenção 2", "..."],
  "priorityNextSteps": ["próximo passo prioritário 1", "próximo passo prioritário 2", "..."],
  "phaseAnalyses": [
    {
      "phase": 1,
      "phaseName": "Empatizar",
      "completeness": numero 0-100,
      "quality": numero 0-100,
      "insights": ["insight específico da fase"],
      "gaps": ["gap ou oportunidade perdida"],
      "recommendations": ["recomendação específica"],
      "strengths": ["ponto forte da fase"]
    },
    // ... para cada uma das 5 fases
  ],
  "consistency": {
    "score": numero 0-100,
    "issues": ["problema de consistência"],
    "strengths": ["ponto forte de consistência"]
  },
  "alignment": {
    "problemSolutionAlignment": numero 0-100,
    "researchInsightsAlignment": numero 0-100,
    "comments": ["comentário sobre alinhamento"]
  },
  "recommendations": {
    "immediate": ["ação imediata"],
    "shortTerm": ["ação de curto prazo"],
    "longTerm": ["ação de longo prazo"]
  }
}

CRITÉRIOS DE ANÁLISE:
1. Completeness: Verifique se cada fase tem ferramentas suficientes e bem desenvolvidas
2. Quality: Avalie a profundidade e relevância dos insights e dados coletados
3. Consistency: Analise se há fluxo lógico e consistência entre as fases
4. Alignment: Verifique se as soluções propostas realmente abordam os problemas identificados
5. Research Quality: Avalie se a pesquisa de usuário foi robusta o suficiente
6. Innovation: Considere o nível de criatividade e inovação das soluções
7. Feasibility: Analise a viabilidade das soluções propostas
8. User-Centricity: Verifique se o foco no usuário é mantido consistentemente

Seja específico, construtivo e ofereça insights acionáveis. Responda em português brasileiro.`;

      // This code is unreachable as openai is always null, but kept for future reference
      const response = await (openai as any).chat.completions.create({
        model: "gpt-5",
        messages: [
          { 
            role: 'system', 
            content: `Você é um especialista sênior em Design Thinking com 15+ anos de experiência, conhecido por análises profundas e insights transformadores. Analise projetos com rigor acadêmico mas linguagem acessível.` 
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 3000,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Validate and provide defaults
      return {
        executiveSummary: result.executiveSummary || "Análise do projeto não pôde ser completada.",
        maturityScore: Math.max(1, Math.min(10, result.maturityScore || 5)),
        overallInsights: result.overallInsights || ["Análise detalhada não disponível no momento."],
        attentionPoints: result.attentionPoints || ["Verificar dados do projeto."],
        priorityNextSteps: result.priorityNextSteps || ["Continuar desenvolvimento do projeto."],
        phaseAnalyses: result.phaseAnalyses || this.getDefaultPhaseAnalyses(),
        consistency: {
          score: Math.max(0, Math.min(100, result.consistency?.score || 50)),
          issues: result.consistency?.issues || ["Dados insuficientes para análise de consistência."],
          strengths: result.consistency?.strengths || ["Projeto em desenvolvimento."]
        },
        alignment: {
          problemSolutionAlignment: Math.max(0, Math.min(100, result.alignment?.problemSolutionAlignment || 50)),
          researchInsightsAlignment: Math.max(0, Math.min(100, result.alignment?.researchInsightsAlignment || 50)),
          comments: result.alignment?.comments || ["Necessário mais dados para avaliar alinhamento."]
        },
        recommendations: {
          immediate: result.recommendations?.immediate || ["Continuar coletando dados de usuário."],
          shortTerm: result.recommendations?.shortTerm || ["Desenvolver ferramentas das fases atuais."],
          longTerm: result.recommendations?.longTerm || ["Planejar testes com usuários reais."]
        }
      };
    } catch (error) {
      console.error('Erro ao analisar projeto completo:', error);
      
      // Return default analysis on error
      return {
        executiveSummary: "Não foi possível gerar análise completa neste momento. Verifique a configuração da API OpenAI.",
        maturityScore: 5,
        overallInsights: ["Análise automática indisponível. Continue desenvolvendo o projeto seguindo as melhores práticas de Design Thinking."],
        attentionPoints: ["Serviço de análise IA temporariamente indisponível."],
        priorityNextSteps: ["Revisar dados do projeto e tentar análise novamente."],
        phaseAnalyses: this.getDefaultPhaseAnalyses(),
        consistency: {
          score: 50,
          issues: ["Análise de consistência indisponível."],
          strengths: ["Continue seguindo a metodologia Design Thinking."]
        },
        alignment: {
          problemSolutionAlignment: 50,
          researchInsightsAlignment: 50,
          comments: ["Análise de alinhamento indisponível no momento."]
        },
        recommendations: {
          immediate: ["Verificar configurações do sistema."],
          shortTerm: ["Continuar desenvolvimento seguindo metodologia."],
          longTerm: ["Considerar análise manual com especialista."]
        }
      };
    }
  }

  private generateMockAnalysis(analysisData: ProjectAnalysisData): AIProjectAnalysis {
    // Conta quantos dados reais o projeto tem
    const empathyDataCount = (analysisData.empathyMaps?.length || 0) + 
                           (analysisData.personas?.length || 0) + 
                           (analysisData.interviews?.length || 0) + 
                           (analysisData.observations?.length || 0);
    
    const defineDataCount = analysisData.povStatements?.length || 0;
    const ideateDataCount = analysisData.ideas?.length || 0;
    const prototypeDataCount = analysisData.prototypes?.length || 0;
    const testDataCount = (analysisData.testPlans?.length || 0) + (analysisData.testResults?.length || 0);

    // Calcula score baseado nos dados reais
    const maturityScore = Math.min(10, 
      Math.round(2 + (empathyDataCount * 0.5) + (defineDataCount * 0.8) + 
                 (ideateDataCount * 0.3) + (prototypeDataCount * 1.2) + (testDataCount * 1.5))
    );

    // Análise específica de alinhamento Ideias × Critérios Norteadores
    const criteriaList: any[] = (analysisData as any).guidingCriteria || [];
    const criteriaCount = criteriaList?.length || 0;

    let criteriaCoveredCount = 0;
    let ideasWithCriteriaCount = 0;

    if (criteriaCount > 0) {
      const criteriaIds = criteriaList.map((c: any) => c.id);
      const coveredCriteria = new Set<string>();

      for (const idea of analysisData.ideas || []) {
        const ideaCriteriaIds: string[] = Array.isArray((idea as any).guidingCriteriaIds)
          ? (idea as any).guidingCriteriaIds
          : [];

        if (ideaCriteriaIds.length > 0) {
          ideasWithCriteriaCount++;
        }

        for (const id of ideaCriteriaIds) {
          if (criteriaIds.includes(id)) {
            coveredCriteria.add(id);
          }
        }
      }

      criteriaCoveredCount = coveredCriteria.size;
    }

    const criteriaCoverage = criteriaCount === 0
      ? 0
      : Math.round((criteriaCoveredCount / criteriaCount) * 100);

    const ideasUsingCriteriaRatio = ideateDataCount === 0
      ? 0
      : Math.round((ideasWithCriteriaCount / ideateDataCount) * 100);

    const problemSolutionAlignment = criteriaCount === 0
      ? (ideateDataCount > 0 ? 60 : 40)
      : Math.max(
          20,
          Math.min(
            100,
            Math.round(criteriaCoverage * 0.6 + ideasUsingCriteriaRatio * 0.4)
          )
        );

    const researchInsightsAlignment = (defineDataCount > 0 || empathyDataCount > 0)
      ? Math.min(100, 40 + (defineDataCount * 10) + (empathyDataCount * 5))
      : 35;

    const alignmentComments: string[] = [];

    if (criteriaCount === 0) {
      alignmentComments.push(
        "Nenhum critério norteador foi definido ainda. Criar critérios claros na Fase 2 ajuda a orientar a geração e a priorização de ideias."
      );
    } else {
      alignmentComments.push(
        `${criteriaCoveredCount} de ${criteriaCount} critérios norteadores têm pelo menos uma ideia associada.`
      );

      if (criteriaCoverage < 60) {
        alignmentComments.push(
          "Vários critérios norteadores ainda não possuem ideias diretamente ligadas. Considere gerar novas ideias focadas nesses critérios descobertos."
        );
      } else {
        alignmentComments.push(
          "A maior parte dos critérios norteadores já está coberta por ideias, indicando bom alinhamento entre definição de problema e ideação."
        );
      }

      if (ideateDataCount > 0 && ideasUsingCriteriaRatio < 50) {
        alignmentComments.push(
          "Uma parcela relevante das ideias ainda não está explicitamente ligada a critérios norteadores. Relacione cada ideia a pelo menos um critério relevante para facilitar priorização."
        );
      }
    }

    if (alignmentComments.length === 0) {
      alignmentComments.push(
        "Projeto demonstra entendimento da metodologia.",
        "Continue aprofundando pesquisa com usuários."
      );
    }

    const overallInsights: string[] = [
      empathyDataCount > 2 ? "Excelente trabalho na fase de Empatia" : "Ampliar pesquisa empática trará mais insights",
      "Continue seguindo a metodologia estruturada do Design Thinking",
      "Dados coletados demonstram potencial para soluções inovadoras"
    ];

    if (criteriaCount > 0) {
      overallInsights.push(
        `Foram definidos ${criteriaCount} critérios norteadores na fase Definir, com ${criteriaCoveredCount} deles já cobertos por ideias.`
      );
    }

    const attentionPoints: string[] = [
      empathyDataCount === 0 ? "Necessário coletar mais dados de usuários" : "Considerar diversificar métodos de pesquisa",
      defineDataCount === 0 ? "Definir claramente o problema central" : "Refinar definição do problema",
      "Para análise completa, configure a chave da API OpenAI"
    ];

    if (criteriaCount > 0 && criteriaCoverage < 70) {
      attentionPoints.push(
        "Nem todos os critérios norteadores possuem ideias associadas. Avalie lacunas de cobertura entre critérios e ideação."
      );
    }

    const priorityNextSteps: string[] = [
      analysisData.project?.currentPhase === 1 ? "Finalizar ferramentas da fase Empatizar" : "Avançar para próxima fase",
      "Documentar todos os insights coletados",
      "Revisar progresso com equipe regularmente"
    ];

    if (criteriaCount > 0) {
      priorityNextSteps.push(
        "Mapear quais critérios norteadores ainda não possuem ideias associadas e planejar sessões de ideação direcionadas para cobri-los."
      );
    } else {
      priorityNextSteps.push(
        "Definir de 3 a 7 critérios norteadores claros na Fase 2 para orientar a geração e priorização de ideias."
      );
    }

    return {
      executiveSummary: `Projeto ${analysisData.project?.name || 'DTTools'} está na fase ${analysisData.project?.currentPhase || 1} do Design Thinking. ${empathyDataCount > 0 ? 'Demonstra boa base de pesquisa empática.' : 'Recomenda-se ampliar pesquisa com usuários.'} Análise baseada em dados demonstrativos.`,
      maturityScore,
      overallInsights,
      attentionPoints,
      priorityNextSteps,
      phaseAnalyses: this.generateSmartPhaseAnalyses(empathyDataCount, defineDataCount, ideateDataCount, prototypeDataCount, testDataCount),
      consistency: {
        score: Math.min(100, 40 + (empathyDataCount * 10) + (defineDataCount * 15)),
        issues: empathyDataCount < 2 ? ["Necessário mais dados de empatia"] : ["Continuar coletando feedback"],
        strengths: ["Seguindo metodologia Design Thinking", "Estrutura de projeto bem organizada"]
      },
      alignment: {
        problemSolutionAlignment,
        researchInsightsAlignment,
        comments: alignmentComments
      },
      recommendations: {
        immediate: [
          empathyDataCount === 0 ? "Criar mapas de empatia e personas" : "Analisar dados coletados",
          "Documentar insights principais",
          criteriaCount > 0
            ? "Revisar se cada critério norteador possui ao menos uma ideia associada."
            : "Criar critérios norteadores que reflitam as principais necessidades e objetivos do projeto."
        ],
        shortTerm: [
          "Avançar para próxima fase do Design Thinking",
          "Validar hipóteses com mais usuários",
          "Usar os critérios norteadores como filtro para priorizar ideias mais alinhadas à estratégia do projeto."
        ],
        longTerm: [
          "Implementar processo contínuo de feedback",
          "Considerar consultoria especializada para análises avançadas",
          "Monitorar ao longo do tempo se novas ideias continuam alinhadas aos critérios norteadores definidos."
        ]
      }
    };
  }

  private generateSmartPhaseAnalyses(empathy: number, define: number, ideate: number, prototype: number, test: number): PhaseAnalysis[] {
    return [
      {
        phase: 1,
        phaseName: "Empatizar",
        completeness: empathy === 0 ? 0 : Math.min(100, empathy * 25),
        quality: empathy === 0 ? 0 : empathy > 2 ? 85 : 65,
        insights: empathy > 0 ? [`${empathy} ferramentas de empatia criadas`, "Base sólida para entender usuários"] : ["Fase iniciada, continuar coletando dados"],
        gaps: empathy < 2 ? ["Ampliar métodos de pesquisa empática"] : ["Considerar entrevistas adicionais"],
        recommendations: empathy === 0 ? ["Começar com mapas de empatia"] : ["Analisar padrões nos dados coletados"],
        strengths: empathy > 0 ? ["Dados empáticos coletados"] : ["Estrutura preparada para pesquisa"]
      },
      {
        phase: 2,
        phaseName: "Definir",
        completeness: define === 0 ? 0 : Math.min(100, define * 30),
        quality: define === 0 ? 0 : 70,
        insights: define > 0 ? ["Problema começando a ser definido"] : ["Aguardando definição do problema"],
        gaps: define === 0 ? ["Criar declarações POV"] : ["Expandir definição do problema"],
        recommendations: ["Sintetizar insights da fase anterior"],
        strengths: define > 0 ? ["Processo de definição iniciado"] : ["Preparado para definir problema"]
      },
      {
        phase: 3,
        phaseName: "Idear",
        completeness: ideate === 0 ? 0 : Math.min(100, ideate * 20),
        quality: ideate === 0 ? 0 : 60,
        insights: ideate > 0 ? ["Processo criativo iniciado"] : ["Aguardando ideação"],
        gaps: ideate === 0 ? ["Gerar ideias iniciais"] : ["Gerar mais diversidade de ideias"],
        recommendations: ["Usar técnicas de brainstorming"],
        strengths: ideate > 0 ? ["Criatividade aplicada"] : ["Potencial criativo"]
      },
      {
        phase: 4,
        phaseName: "Prototipar",
        completeness: prototype === 0 ? 0 : Math.min(100, prototype * 25),
        quality: prototype === 0 ? 0 : 65,
        insights: prototype > 0 ? ["Ideias sendo materializadas"] : ["Aguardando prototipagem"],
        gaps: prototype === 0 ? ["Criar primeiros protótipos"] : ["Criar protótipos testáveis"],
        recommendations: ["Focar em protótipos rápidos"],
        strengths: prototype > 0 ? ["Pensamento tangível"] : ["Preparado para prototipar"]
      },
      {
        phase: 5,
        phaseName: "Testar",
        completeness: test === 0 ? 0 : Math.min(100, test * 30),
        quality: test === 0 ? 0 : 70,
        insights: test > 0 ? ["Validação com usuários iniciada"] : ["Aguardando testes"],
        gaps: test === 0 ? ["Planejar primeiros testes com usuários"] : ["Testar com usuários reais"],
        recommendations: ["Planejar sessões de teste"],
        strengths: test > 0 ? ["Foco na validação"] : ["Estrutura para testes"]
      }
    ];
  }

  private getDefaultPhaseAnalyses(): PhaseAnalysis[] {
    const phases = [
      { phase: 1, name: "Empatizar" },
      { phase: 2, name: "Definir" },
      { phase: 3, name: "Idear" },
      { phase: 4, name: "Prototipar" },
      { phase: 5, name: "Testar" }
    ];

    return phases.map(p => ({
      phase: p.phase,
      phaseName: p.name,
      completeness: 50,
      quality: 50,
      insights: [`Fase ${p.name} em desenvolvimento.`],
      gaps: ["Dados insuficientes para análise detalhada."],
      recommendations: [`Continue trabalhando nas ferramentas da fase ${p.name}.`],
      strengths: ["Seguindo metodologia correta."]
    }));
  }
}

export const designThinkingAI = new DesignThinkingAI();