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
  language?: string;
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

    // Normaliza idioma (mock suporta pt-BR, en, es, fr)
    const rawLang = analysisData.language || "pt-BR";
    const lang = rawLang.startsWith("en")
      ? "en"
      : rawLang.startsWith("es")
      ? "es"
      : rawLang.startsWith("fr")
      ? "fr"
      : "pt-BR";

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
      if (lang === "en") {
        alignmentComments.push(
          "No guiding criteria have been defined yet. Creating clear criteria in Phase 2 helps guide idea generation and prioritization."
        );
      } else if (lang === "es") {
        alignmentComments.push(
          "Todavía no se han definido criterios orientadores. Definir criterios claros en la Fase 2 ayuda a guiar la generación y priorización de ideas."
        );
      } else if (lang === "fr") {
        alignmentComments.push(
          "Aucun critère directeur n'a encore été défini. Définir des critères clairs à la Phase 2 aide à orienter la génération et la priorisation des idées."
        );
      } else {
        alignmentComments.push(
          "Nenhum critério norteador foi definido ainda. Criar critérios claros na Fase 2 ajuda a orientar a geração e a priorização de ideias."
        );
      }
    } else {
      if (lang === "en") {
        alignmentComments.push(
          `${criteriaCoveredCount} of ${criteriaCount} guiding criteria have at least one associated idea.`
        );
      } else if (lang === "es") {
        alignmentComments.push(
          `${criteriaCoveredCount} de ${criteriaCount} criterios orientadores tienen al menos una idea asociada.`
        );
      } else if (lang === "fr") {
        alignmentComments.push(
          `${criteriaCoveredCount} sur ${criteriaCount} critères directeurs ont au moins une idée associée.`
        );
      } else {
        alignmentComments.push(
          `${criteriaCoveredCount} de ${criteriaCount} critérios norteadores têm pelo menos uma ideia associada.`
        );
      }

      if (criteriaCoverage < 60) {
        if (lang === "en") {
          alignmentComments.push(
            "Several guiding criteria still have no directly linked ideas. Consider generating new ideas focused on these uncovered criteria."
          );
        } else if (lang === "es") {
          alignmentComments.push(
            "Varios criterios orientadores aún no tienen ideas vinculadas directamente. Considera generar nuevas ideas centradas en estos criterios no cubiertos."
          );
        } else if (lang === "fr") {
          alignmentComments.push(
            "Plusieurs critères directeurs n'ont pas encore d'idées directement liées. Envisagez de générer de nouvelles idées centrées sur ces critères non couverts."
          );
        } else {
          alignmentComments.push(
            "Vários critérios norteadores ainda não possuem ideias diretamente ligadas. Considere gerar novas ideias focadas nesses critérios descobertos."
          );
        }
      } else {
        if (lang === "en") {
          alignmentComments.push(
            "Most guiding criteria are already covered by ideas, indicating good alignment between problem definition and ideation."
          );
        } else if (lang === "es") {
          alignmentComments.push(
            "La mayoría de los criterios orientadores ya están cubiertos por ideas, lo que indica un buen alineamiento entre definición de problema e ideación."
          );
        } else if (lang === "fr") {
          alignmentComments.push(
            "La plupart des critères directeurs sont déjà couverts par des idées, ce qui indique un bon alignement entre définition du problème et idéation."
          );
        } else {
          alignmentComments.push(
            "A maior parte dos critérios norteadores já está coberta por ideias, indicando bom alinhamento entre definição de problema e ideação."
          );
        }
      }

      if (ideateDataCount > 0 && ideasUsingCriteriaRatio < 50) {
        if (lang === "en") {
          alignmentComments.push(
            "A significant portion of ideas is not yet explicitly linked to guiding criteria. Link each idea to at least one relevant criterion to make prioritization easier."
          );
        } else if (lang === "es") {
          alignmentComments.push(
            "Una parte relevante de las ideas aún no está explícitamente vinculada a criterios orientadores. Relaciona cada idea con al menos un criterio relevante para facilitar la priorización."
          );
        } else if (lang === "fr") {
          alignmentComments.push(
            "Une partie importante des idées n'est pas encore explicitement liée aux critères directeurs. Reliez chaque idée à au moins un critère pertinent pour faciliter la priorisation."
          );
        } else {
          alignmentComments.push(
            "Uma parcela relevante das ideias ainda não está explicitamente ligada a critérios norteadores. Relacione cada ideia a pelo menos um critério relevante para facilitar priorização."
          );
        }
      }
    }

    if (alignmentComments.length === 0) {
      if (lang === "en") {
        alignmentComments.push(
          "The project shows understanding of the methodology.",
          "Keep deepening user research."
        );
      } else if (lang === "es") {
        alignmentComments.push(
          "El proyecto demuestra entendimiento de la metodología.",
          "Continúa profundizando la investigación con usuarios."
        );
      } else if (lang === "fr") {
        alignmentComments.push(
          "Le projet montre une bonne compréhension de la méthodologie.",
          "Continuez à approfondir la recherche avec les utilisateurs."
        );
      } else {
        alignmentComments.push(
          "Projeto demonstra entendimento da metodologia.",
          "Continue aprofundando pesquisa com usuários."
        );
      }
    }

    const overallInsights: string[] = [];
    if (lang === "en") {
      overallInsights.push(
        empathyDataCount > 2 ? "Excellent work in the Empathize phase" : "Expanding empathy research will bring more insights",
        "Keep following the structured Design Thinking methodology",
        "The collected data shows potential for innovative solutions"
      );
      if (criteriaCount > 0) {
        overallInsights.push(
          `You defined ${criteriaCount} guiding criteria in the Define phase, with ${criteriaCoveredCount} already covered by ideas.`
        );
      }
    } else if (lang === "es") {
      overallInsights.push(
        empathyDataCount > 2 ? "Excelente trabajo en la fase de Empatizar" : "Ampliar la investigación empática traerá más insights",
        "Sigue la metodología estructurada de Design Thinking",
        "Los datos recogidos demuestran potencial para soluciones innovadoras"
      );
      if (criteriaCount > 0) {
        overallInsights.push(
          `Se definieron ${criteriaCount} criterios orientadores en la fase Definir, con ${criteriaCoveredCount} de ellos ya cubiertos por ideas.`
        );
      }
    } else if (lang === "fr") {
      overallInsights.push(
        empathyDataCount > 2 ? "Excellent travail dans la phase Empathiser" : "Approfondir la recherche empathique apportera plus d'insights",
        "Continuez à suivre la méthodologie structurée de Design Thinking",
        "Les données collectées montrent un potentiel pour des solutions innovantes"
      );
      if (criteriaCount > 0) {
        overallInsights.push(
          `${criteriaCount} critères directeurs ont été définis dans la phase Définir, dont ${criteriaCoveredCount} déjà couverts par des idées.`
        );
      }
    } else {
      overallInsights.push(
        empathyDataCount > 2 ? "Excelente trabalho na fase de Empatia" : "Ampliar pesquisa empática trará mais insights",
        "Continue seguindo a metodologia estruturada do Design Thinking",
        "Dados coletados demonstram potencial para soluções inovadoras"
      );
      if (criteriaCount > 0) {
        overallInsights.push(
          `Foram definidos ${criteriaCount} critérios norteadores na fase Definir, com ${criteriaCoveredCount} deles já cobertos por ideias.`
        );
      }
    }

    const attentionPoints: string[] = [];
    if (lang === "en") {
      attentionPoints.push(
        empathyDataCount === 0 ? "More user data needs to be collected" : "Consider diversifying research methods",
        defineDataCount === 0 ? "Clearly define the core problem" : "Refine the problem definition",
        "To unlock full analysis, configure the OpenAI API key"
      );
      if (criteriaCount > 0 && criteriaCoverage < 70) {
        attentionPoints.push(
          "Not all guiding criteria have associated ideas. Check coverage gaps between criteria and ideation."
        );
      }
    } else if (lang === "es") {
      attentionPoints.push(
        empathyDataCount === 0 ? "Es necesario recoger más datos de usuarios" : "Considera diversificar los métodos de investigación",
        defineDataCount === 0 ? "Definir claramente el problema central" : "Refinar la definición del problema",
        "Para un análisis completo, configura la clave de la API de OpenAI"
      );
      if (criteriaCount > 0 && criteriaCoverage < 70) {
        attentionPoints.push(
          "No todos los criterios orientadores tienen ideas asociadas. Evalúa las brechas de cobertura entre criterios e ideación."
        );
      }
    } else if (lang === "fr") {
      attentionPoints.push(
        empathyDataCount === 0 ? "Il est nécessaire de collecter davantage de données utilisateurs" : "Envisagez de diversifier les méthodes de recherche",
        defineDataCount === 0 ? "Définir clairement le problème central" : "Affiner la définition du problème",
        "Pour une analyse complète, configurez la clé d'API OpenAI"
      );
      if (criteriaCount > 0 && criteriaCoverage < 70) {
        attentionPoints.push(
          "Tous les critères directeurs n'ont pas d'idées associées. Évaluez les écarts de couverture entre critères et idéation."
        );
      }
    } else {
      attentionPoints.push(
        empathyDataCount === 0 ? "Necessário coletar mais dados de usuários" : "Considerar diversificar métodos de pesquisa",
        defineDataCount === 0 ? "Definir claramente o problema central" : "Refinar definição do problema",
        "Para análise completa, configure a chave da API OpenAI"
      );
      if (criteriaCount > 0 && criteriaCoverage < 70) {
        attentionPoints.push(
          "Nem todos os critérios norteadores possuem ideias associadas. Avalie lacunas de cobertura entre critérios e ideação."
        );
      }
    }

    const priorityNextSteps: string[] = [];
    if (lang === "en") {
      priorityNextSteps.push(
        analysisData.project?.currentPhase === 1 ? "Finish the tools of the Empathize phase" : "Move on to the next phase",
        "Document all collected insights",
        "Review progress with the team regularly"
      );
      if (criteriaCount > 0) {
        priorityNextSteps.push(
          "Map which guiding criteria still have no associated ideas and plan ideation sessions to cover them."
        );
      } else {
        priorityNextSteps.push(
          "Define 3 to 7 clear guiding criteria in Phase 2 to guide idea generation and prioritization."
        );
      }
    } else if (lang === "es") {
      priorityNextSteps.push(
        analysisData.project?.currentPhase === 1 ? "Finalizar las herramientas de la fase Empatizar" : "Avanzar a la siguiente fase",
        "Documentar todos los insights recogidos",
        "Revisar el progreso con el equipo regularmente"
      );
      if (criteriaCount > 0) {
        priorityNextSteps.push(
          "Mapear qué criterios orientadores aún no tienen ideas asociadas y planear sesiones de ideación para cubrirlos."
        );
      } else {
        priorityNextSteps.push(
          "Definir de 3 a 7 criterios orientadores claros en la Fase 2 para guiar la generación y priorización de ideas."
        );
      }
    } else if (lang === "fr") {
      priorityNextSteps.push(
        analysisData.project?.currentPhase === 1 ? "Finaliser les outils de la phase Empathiser" : "Passer à la phase suivante",
        "Documenter tous les insights collectés",
        "Revoir régulièrement l'avancement avec l'équipe"
      );
      if (criteriaCount > 0) {
        priorityNextSteps.push(
          "Identifier quels critères directeurs n'ont pas encore d'idées associées et planifier des sessions d'idéation ciblées pour les couvrir."
        );
      } else {
        priorityNextSteps.push(
          "Définir de 3 à 7 critères directeurs clairs à la Phase 2 pour guider la génération et la priorisation des idées."
        );
      }
    } else {
      priorityNextSteps.push(
        analysisData.project?.currentPhase === 1 ? "Finalizar ferramentas da fase Empatizar" : "Avançar para próxima fase",
        "Documentar todos os insights coletados",
        "Revisar progresso com equipe regularmente"
      );
      if (criteriaCount > 0) {
        priorityNextSteps.push(
          "Mapear quais critérios norteadores ainda não possuem ideias associadas e planejar sessões de ideação direcionadas para cobri-los."
        );
      } else {
        priorityNextSteps.push(
          "Definir de 3 a 7 critérios norteadores claros na Fase 2 para orientar a geração e priorização de ideias."
        );
      }
    }

    let executiveSummary: string;
    const projectName = analysisData.project?.name || "DTTools";
    const phase = analysisData.project?.currentPhase || 1;

    if (lang === "en") {
      const empathySentence = empathyDataCount > 0
        ? "It shows a good basis of empathy research."
        : "It is recommended to expand user research.";
      executiveSummary = `Project ${projectName} is in phase ${phase} of the Design Thinking process. ${empathySentence} Analysis based on demonstration data.`;
    } else if (lang === "es") {
      const empathySentence = empathyDataCount > 0
        ? "Demuestra una buena base de investigación empática."
        : "Se recomienda ampliar la investigación con usuarios.";
      executiveSummary = `El proyecto ${projectName} está en la fase ${phase} del proceso de Design Thinking. ${empathySentence} Análisis basado en datos demostrativos.`;
    } else if (lang === "fr") {
      const empathySentence = empathyDataCount > 0
        ? "Il montre une bonne base de recherche empathique."
        : "Il est recommandé d'approfondir la recherche avec les utilisateurs.";
      executiveSummary = `Le projet ${projectName} est à la phase ${phase} du processus de Design Thinking. ${empathySentence} Analyse basée sur des données de démonstration.`;
    } else {
      const empathySentence = empathyDataCount > 0
        ? "Demonstra boa base de pesquisa empática."
        : "Recomenda-se ampliar pesquisa com usuários.";
      executiveSummary = `Projeto ${projectName} está na fase ${phase} do Design Thinking. ${empathySentence} Análise baseada em dados demonstrativos.`;
    }

    let consistencyIssues: string[];
    let consistencyStrengths: string[];
    if (lang === "en") {
      consistencyIssues = empathyDataCount < 2 ? ["More empathy data is needed"] : ["Keep collecting feedback"];
      consistencyStrengths = ["Following the Design Thinking methodology", "Project structure is well organized"];
    } else if (lang === "es") {
      consistencyIssues = empathyDataCount < 2 ? ["Es necesario más datos de empatía"] : ["Seguir recopilando feedback"];
      consistencyStrengths = ["Siguiendo la metodología de Design Thinking", "Estructura del proyecto bien organizada"];
    } else if (lang === "fr") {
      consistencyIssues = empathyDataCount < 2 ? ["Davantage de données d'empathie sont nécessaires"] : ["Continuer à collecter des retours"];
      consistencyStrengths = ["Suivi de la méthodologie Design Thinking", "Structure de projet bien organisée"];
    } else {
      consistencyIssues = empathyDataCount < 2 ? ["Necessário mais dados de empatia"] : ["Continuar coletando feedback"];
      consistencyStrengths = ["Seguindo metodologia Design Thinking", "Estrutura de projeto bem organizada"];
    }

    let immediateRecommendations: string[];
    let shortTermRecommendations: string[];
    let longTermRecommendations: string[];

    if (lang === "en") {
      immediateRecommendations = [
        empathyDataCount === 0 ? "Create empathy maps and personas" : "Analyze the data that has been collected",
        "Document key insights",
        criteriaCount > 0
          ? "Review whether each guiding criterion has at least one associated idea."
          : "Create guiding criteria that reflect the main needs and objectives of the project."
      ];
      shortTermRecommendations = [
        "Move forward to the next Design Thinking phase",
        "Validate hypotheses with more users",
        "Use guiding criteria as a filter to prioritize ideas most aligned with the project strategy."
      ];
      longTermRecommendations = [
        "Implement a continuous feedback process",
        "Consider specialized consulting for advanced analyses",
        "Monitor over time whether new ideas remain aligned with the defined guiding criteria."
      ];
    } else if (lang === "es") {
      immediateRecommendations = [
        empathyDataCount === 0 ? "Crear mapas de empatía y personas" : "Analizar los datos recogidos",
        "Documentar los insights principales",
        criteriaCount > 0
          ? "Revisar si cada criterio orientador tiene al menos una idea asociada."
          : "Crear criterios orientadores que reflejen las principales necesidades y objetivos del proyecto."
      ];
      shortTermRecommendations = [
        "Avanzar a la siguiente fase de Design Thinking",
        "Validar hipótesis con más usuarios",
        "Usar los criterios orientadores como filtro para priorizar las ideas más alineadas con la estrategia del proyecto."
      ];
      longTermRecommendations = [
        "Implementar un proceso continuo de feedback",
        "Considerar consultoría especializada para análisis avanzados",
        "Monitorear a lo largo del tiempo si las nuevas ideas siguen alineadas con los criterios orientadores definidos."
      ];
    } else if (lang === "fr") {
      immediateRecommendations = [
        empathyDataCount === 0 ? "Créer des cartes d'empathie et des personas" : "Analyser les données collectées",
        "Documenter les principaux insights",
        criteriaCount > 0
          ? "Vérifier si chaque critère directeur a au moins une idée associée."
          : "Créer des critères directeurs qui reflètent les principaux besoins et objectifs du projet."
      ];
      shortTermRecommendations = [
        "Avancer vers la prochaine phase du Design Thinking",
        "Valider les hypothèses avec davantage d'utilisateurs",
        "Utiliser les critères directeurs comme filtre pour prioriser les idées les plus alignées sur la stratégie du projet."
      ];
      longTermRecommendations = [
        "Mettre en place un processus de feedback continu",
        "Envisager un accompagnement spécialisé pour des analyses avancées",
        "Suivre dans le temps si les nouvelles idées restent alignées avec les critères directeurs définis."
      ];
    } else {
      immediateRecommendations = [
        empathyDataCount === 0 ? "Criar mapas de empatia e personas" : "Analisar dados coletados",
        "Documentar insights principais",
        criteriaCount > 0
          ? "Revisar se cada critério norteador possui ao menos uma ideia associada."
          : "Criar critérios norteadores que reflitam as principais necessidades e objetivos do projeto."
      ];
      shortTermRecommendations = [
        "Avançar para próxima fase do Design Thinking",
        "Validar hipóteses com mais usuários",
        "Usar os critérios norteadores como filtro para priorizar ideias mais alinhadas à estratégia do projeto."
      ];
      longTermRecommendations = [
        "Implementar processo contínuo de feedback",
        "Considerar consultoria especializada para análises avançadas",
        "Monitorar ao longo do tempo se novas ideias continuam alinhadas aos critérios norteadores definidos."
      ];
    }

    return {
      executiveSummary,
      maturityScore,
      overallInsights,
      attentionPoints,
      priorityNextSteps,
      phaseAnalyses: this.generateSmartPhaseAnalyses(empathyDataCount, defineDataCount, ideateDataCount, prototypeDataCount, testDataCount, lang),
      consistency: {
        score: Math.min(100, 40 + (empathyDataCount * 10) + (defineDataCount * 15)),
        issues: consistencyIssues,
        strengths: consistencyStrengths
      },
      alignment: {
        problemSolutionAlignment,
        researchInsightsAlignment,
        comments: alignmentComments
      },
      recommendations: {
        immediate: immediateRecommendations,
        shortTerm: shortTermRecommendations,
        longTerm: longTermRecommendations
      }
    };
  }

  private generateSmartPhaseAnalyses(empathy: number, define: number, ideate: number, prototype: number, test: number, lang: string): PhaseAnalysis[] {
    const phaseLang = lang === "en" || lang === "es" || lang === "fr" ? lang : "pt-BR";

    return [
      {
        phase: 1,
        phaseName:
          phaseLang === "en"
            ? "Empathize"
            : phaseLang === "es"
            ? "Empatizar"
            : phaseLang === "fr"
            ? "Empathiser"
            : "Empatizar",
        completeness: empathy === 0 ? 0 : Math.min(100, empathy * 25),
        quality: empathy === 0 ? 0 : empathy > 2 ? 85 : 65,
        insights:
          empathy > 0
            ? [
                phaseLang === "en"
                  ? `${empathy} empathy tools created`
                  : phaseLang === "es"
                  ? `${empathy} herramientas de empatía creadas`
                  : phaseLang === "fr"
                  ? `${empathy} outils d'empathie créés`
                  : `${empathy} ferramentas de empatia criadas`,
                phaseLang === "en"
                  ? "Solid basis to understand users"
                  : phaseLang === "es"
                  ? "Base sólida para entender a los usuarios"
                  : phaseLang === "fr"
                  ? "Base solide pour comprendre les utilisateurs"
                  : "Base sólida para entender usuários"
              ]
            : [
                phaseLang === "en"
                  ? "Phase started, keep collecting data"
                  : phaseLang === "es"
                  ? "Fase iniciada, seguir recopilando datos"
                  : phaseLang === "fr"
                  ? "Phase commencée, continuer à collecter des données"
                  : "Fase iniciada, continuar coletando dados"
              ],
        gaps:
          empathy < 2
            ? [
                phaseLang === "en"
                  ? "Expand empathy research methods"
                  : phaseLang === "es"
                  ? "Ampliar los métodos de investigación empática"
                  : phaseLang === "fr"
                  ? "Développer les méthodes de recherche empathique"
                  : "Ampliar métodos de pesquisa empática"
              ]
            : [
                phaseLang === "en"
                  ? "Consider additional interviews"
                  : phaseLang === "es"
                  ? "Considerar entrevistas adicionales"
                  : phaseLang === "fr"
                  ? "Envisager des entretiens supplémentaires"
                  : "Considerar entrevistas adicionais"
              ],
        recommendations:
          empathy === 0
            ? [
                phaseLang === "en"
                  ? "Start with empathy maps"
                  : phaseLang === "es"
                  ? "Comenzar con mapas de empatía"
                  : phaseLang === "fr"
                  ? "Commencer par des cartes d'empathie"
                  : "Começar com mapas de empatia"
              ]
            : [
                phaseLang === "en"
                  ? "Analyze patterns in collected data"
                  : phaseLang === "es"
                  ? "Analizar patrones en los datos recogidos"
                  : phaseLang === "fr"
                  ? "Analyser les motifs dans les données collectées"
                  : "Analisar padrões nos dados coletados"
              ],
        strengths:
          empathy > 0
            ? [
                phaseLang === "en"
                  ? "Empathy data collected"
                  : phaseLang === "es"
                  ? "Datos empáticos recogidos"
                  : phaseLang === "fr"
                  ? "Données empathiques collectées"
                  : "Dados empáticos coletados"
              ]
            : [
                phaseLang === "en"
                  ? "Structure ready for research"
                  : phaseLang === "es"
                  ? "Estructura preparada para la investigación"
                  : phaseLang === "fr"
                  ? "Structure prête pour la recherche"
                  : "Estrutura preparada para pesquisa"
              ]
      },
      {
        phase: 2,
        phaseName:
          phaseLang === "en"
            ? "Define"
            : phaseLang === "es"
            ? "Definir"
            : phaseLang === "fr"
            ? "Définir"
            : "Definir",
        completeness: define === 0 ? 0 : Math.min(100, define * 30),
        quality: define === 0 ? 0 : 70,
        insights:
          define > 0
            ? [
                phaseLang === "en"
                  ? "The problem is starting to be defined"
                  : phaseLang === "es"
                  ? "El problema empieza a definirse"
                  : phaseLang === "fr"
                  ? "Le problème commence à être défini"
                  : "Problema começando a ser definido"
              ]
            : [
                phaseLang === "en"
                  ? "Waiting for problem definition"
                  : phaseLang === "es"
                  ? "A la espera de la definición del problema"
                  : phaseLang === "fr"
                  ? "En attente de la définition du problème"
                  : "Aguardando definição do problema"
              ],
        gaps:
          define === 0
            ? [
                phaseLang === "en"
                  ? "Create POV statements"
                  : phaseLang === "es"
                  ? "Crear declaraciones POV"
                  : phaseLang === "fr"
                  ? "Créer des déclarations POV"
                  : "Criar declarações POV"
              ]
            : [
                phaseLang === "en"
                  ? "Expand the problem definition"
                  : phaseLang === "es"
                  ? "Ampliar la definición del problema"
                  : phaseLang === "fr"
                  ? "Élargir la définition du problème"
                  : "Expandir definição do problema"
              ],
        recommendations: [
          phaseLang === "en"
            ? "Synthesize insights from the previous phase"
            : phaseLang === "es"
            ? "Sintetizar los insights de la fase anterior"
            : phaseLang === "fr"
            ? "Synthétiser les insights de la phase précédente"
            : "Sintetizar insights da fase anterior"
        ],
        strengths:
          define > 0
            ? [
                phaseLang === "en"
                  ? "Definition process started"
                  : phaseLang === "es"
                  ? "Proceso de definición iniciado"
                  : phaseLang === "fr"
                  ? "Processus de définition lancé"
                  : "Processo de definição iniciado"
              ]
            : [
                phaseLang === "en"
                  ? "Ready to define the problem"
                  : phaseLang === "es"
                  ? "Preparado para definir el problema"
                  : phaseLang === "fr"
                  ? "Prêt à définir le problème"
                  : "Preparado para definir problema"
              ]
      },
      {
        phase: 3,
        phaseName:
          phaseLang === "en"
            ? "Ideate"
            : phaseLang === "es"
            ? "Idear"
            : phaseLang === "fr"
            ? "Idéer"
            : "Idear",
        completeness: ideate === 0 ? 0 : Math.min(100, ideate * 20),
        quality: ideate === 0 ? 0 : 60,
        insights:
          ideate > 0
            ? [
                phaseLang === "en"
                  ? "Creative process started"
                  : phaseLang === "es"
                  ? "Proceso creativo iniciado"
                  : phaseLang === "fr"
                  ? "Processus créatif lancé"
                  : "Processo criativo iniciado"
              ]
            : [
                phaseLang === "en"
                  ? "Waiting for ideation"
                  : phaseLang === "es"
                  ? "A la espera de ideación"
                  : phaseLang === "fr"
                  ? "En attente d'idéation"
                  : "Aguardando ideação"
              ],
        gaps:
          ideate === 0
            ? [
                phaseLang === "en"
                  ? "Generate initial ideas"
                  : phaseLang === "es"
                  ? "Generar ideas iniciales"
                  : phaseLang === "fr"
                  ? "Générer des idées initiales"
                  : "Gerar ideias iniciais"
              ]
            : [
                phaseLang === "en"
                  ? "Generate more diverse ideas"
                  : phaseLang === "es"
                  ? "Generar más diversidad de ideas"
                  : phaseLang === "fr"
                  ? "Générer davantage d'idées diverses"
                  : "Gerar mais diversidade de ideias"
              ],
        recommendations: [
          phaseLang === "en"
            ? "Use brainstorming techniques"
            : phaseLang === "es"
            ? "Usar técnicas de brainstorming"
            : phaseLang === "fr"
            ? "Utiliser des techniques de brainstorming"
            : "Usar técnicas de brainstorming"
        ],
        strengths:
          ideate > 0
            ? [
                phaseLang === "en"
                  ? "Creativity applied"
                  : phaseLang === "es"
                  ? "Creatividad aplicada"
                  : phaseLang === "fr"
                  ? "Créativité appliquée"
                  : "Criatividade aplicada"
              ]
            : [
                phaseLang === "en"
                  ? "Creative potential"
                  : phaseLang === "es"
                  ? "Potencial creativo"
                  : phaseLang === "fr"
                  ? "Potentiel créatif"
                  : "Potencial criativo"
              ]
      },
      {
        phase: 4,
        phaseName:
          phaseLang === "en"
            ? "Prototype"
            : phaseLang === "es"
            ? "Prototipar"
            : phaseLang === "fr"
            ? "Prototyper"
            : "Prototipar",
        completeness: prototype === 0 ? 0 : Math.min(100, prototype * 25),
        quality: prototype === 0 ? 0 : 65,
        insights:
          prototype > 0
            ? [
                phaseLang === "en"
                  ? "Ideas are being materialized"
                  : phaseLang === "es"
                  ? "Las ideas están siendo materializadas"
                  : phaseLang === "fr"
                  ? "Les idées sont en cours de matérialisation"
                  : "Ideias sendo materializadas"
              ]
            : [
                phaseLang === "en"
                  ? "Waiting for prototyping"
                  : phaseLang === "es"
                  ? "A la espera de prototipado"
                  : phaseLang === "fr"
                  ? "En attente de prototypage"
                  : "Aguardando prototipagem"
              ],
        gaps:
          prototype === 0
            ? [
                phaseLang === "en"
                  ? "Create first prototypes"
                  : phaseLang === "es"
                  ? "Crear los primeros prototipos"
                  : phaseLang === "fr"
                  ? "Créer les premiers prototypes"
                  : "Criar primeiros protótipos"
              ]
            : [
                phaseLang === "en"
                  ? "Create testable prototypes"
                  : phaseLang === "es"
                  ? "Crear prototipos que puedan probarse"
                  : phaseLang === "fr"
                  ? "Créer des prototypes testables"
                  : "Criar protótipos testáveis"
              ],
        recommendations: [
          phaseLang === "en"
            ? "Focus on quick prototypes"
            : phaseLang === "es"
            ? "Enfocarse en prototipos rápidos"
            : phaseLang === "fr"
            ? "Se concentrer sur des prototypes rapides"
            : "Focar em protótipos rápidos"
        ],
        strengths:
          prototype > 0
            ? [
                phaseLang === "en"
                  ? "Tangible thinking"
                  : phaseLang === "es"
                  ? "Pensamiento tangible"
                  : phaseLang === "fr"
                  ? "Pensée tangible"
                  : "Pensamento tangível"
              ]
            : [
                phaseLang === "en"
                  ? "Ready to prototype"
                  : phaseLang === "es"
                  ? "Preparado para prototipar"
                  : phaseLang === "fr"
                  ? "Prêt à prototyper"
                  : "Preparado para prototipar"
              ]
      },
      {
        phase: 5,
        phaseName:
          phaseLang === "en"
            ? "Test"
            : phaseLang === "es"
            ? "Testar"
            : phaseLang === "fr"
            ? "Tester"
            : "Testar",
        completeness: test === 0 ? 0 : Math.min(100, test * 30),
        quality: test === 0 ? 0 : 70,
        insights:
          test > 0
            ? [
                phaseLang === "en"
                  ? "User testing has started"
                  : phaseLang === "es"
                  ? "Se ha iniciado la validación con usuarios"
                  : phaseLang === "fr"
                  ? "La validation avec des utilisateurs a commencé"
                  : "Validação com usuários iniciada"
              ]
            : [
                phaseLang === "en"
                  ? "Waiting for tests"
                  : phaseLang === "es"
                  ? "A la espera de pruebas"
                  : phaseLang === "fr"
                  ? "En attente de tests"
                  : "Aguardando testes"
              ],
        gaps:
          test === 0
            ? [
                phaseLang === "en"
                  ? "Plan first user tests"
                  : phaseLang === "es"
                  ? "Planificar las primeras pruebas con usuarios"
                  : phaseLang === "fr"
                  ? "Planifier les premiers tests utilisateurs"
                  : "Planejar primeiros testes com usuários"
              ]
            : [
                phaseLang === "en"
                  ? "Test with real users"
                  : phaseLang === "es"
                  ? "Probar con usuarios reales"
                  : phaseLang === "fr"
                  ? "Tester avec de vrais utilisateurs"
                  : "Testar com usuários reais"
              ],
        recommendations: [
          phaseLang === "en"
            ? "Plan testing sessions"
            : phaseLang === "es"
            ? "Planificar sesiones de prueba"
            : phaseLang === "fr"
            ? "Planifier des sessions de test"
            : "Planejar sessões de teste"
        ],
        strengths:
          test > 0
            ? [
                phaseLang === "en"
                  ? "Focus on validation"
                  : phaseLang === "es"
                  ? "Enfoque en la validación"
                  : phaseLang === "fr"
                  ? "Focus sur la validation"
                  : "Foco na validação"
              ]
            : [
                phaseLang === "en"
                  ? "Structure ready for testing"
                  : phaseLang === "es"
                  ? "Estructura preparada para pruebas"
                  : phaseLang === "fr"
                  ? "Structure prête pour les tests"
                  : "Estrutura para testes"
              ]
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