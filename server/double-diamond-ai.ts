import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

// ===== PHASE 1: DISCOVER (Divergence) =====

export interface DiscoverResult {
  painPoints: Array<{
    text: string;
    category: string;
    severity: number; // 1-5
  }>;
  insights: Array<{
    text: string;
    source: string; // 'sector', 'case', 'persona'
  }>;
  userNeeds: Array<{
    need: string;
    priority: number; // 1-5
  }>;
  empathyMap: {
    says: string[];
    thinks: string[];
    does: string[];
    feels: string[];
  };
}

export async function generateDiscoverPhase(input: {
  sector: string;
  successCase?: string;
  targetAudience: string;
  problemStatement: string;
  language?: string;
}): Promise<DiscoverResult> {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  
  const languageInstruction = isPortuguese 
    ? "IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL. Todos os textos devem estar em português."
    : isSpanish
    ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol."
    : isFrench
    ? "IMPORTANTE: Responda APENAS em FRANCÊS. Todos os textos devem estar em francês."
    : "IMPORTANTE: Responda APENAS em INGLÊS. Todos os textos devem estar em inglês.";

  const prompt = `Você é um especialista em Design Thinking conduzindo a fase DISCOVER do framework Double Diamond.

${languageInstruction}

CONTEXTO:
- Setor: ${input.sector}
- Case de Sucesso de Referência: ${input.successCase || 'Nenhum'}
- Público-Alvo: ${input.targetAudience}
- Declaração do Problema: ${input.problemStatement}

Gere uma análise de descoberta abrangente com:

1. **Pain Points** (8-12 itens): Identifique problemas específicos, frustrações e desafios que o público-alvo enfrenta
   - Inclua categoria (operacional, emocional, financeiro, tecnológico)
   - Classifique severidade 1-5 (5 = crítico)

2. **Insights** (6-10 itens): Observações-chave sobre comportamento do usuário, tendências de mercado ou padrões do setor
   - Marque fonte: 'setor', 'case' ou 'persona'

3. **Necessidades do Usuário** (8-12 itens): Necessidades centrais que os usuários estão tentando satisfazer
   - Priorize 1-5 (5 = essencial)

4. **Mapa de Empatia**: O que o usuário Diz, Pensa, Faz e Sente (3-5 itens por quadrante)

Retorne APENAS um objeto JSON (sem markdown):
{
  "painPoints": [{"text": "...", "category": "...", "severity": 3}],
  "insights": [{"text": "...", "source": "sector"}],
  "userNeeds": [{"need": "...", "priority": 4}],
  "empathyMap": {
    "says": ["..."],
    "thinks": ["..."],
    "does": ["..."],
    "feels": ["..."]
  }
}`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = result.text;
    if (!text) throw new Error("Empty AI response");
    if (!text) throw new Error("Empty AI response");
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Discover phase generation error: - double-diamond-ai.ts:103", error);
    throw error;
  }
}

// ===== PHASE 2: DEFINE (Convergence) =====

export interface DefineResult {
  povStatements: Array<{
    user: string;
    need: string;
    insight: string;
    fullStatement: string;
  }>;
  hmwQuestions: Array<{
    question: string;
    focusArea: string; // 'desirability', 'feasibility', 'viability'
  }>;
}

export async function generateDefinePhase(input: {
  painPoints: Array<{ text: string; category: string; severity: number }>;
  userNeeds: Array<{ need: string; priority: number }>;
  insights: Array<{ text: string; source: string }>;
  language?: string;
}): Promise<DefineResult> {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  
  const languageInstruction = isPortuguese 
    ? "IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL. Todos os textos devem estar em português."
    : isSpanish
    ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol."
    : isFrench
    ? "IMPORTANTE: Responda APENAS em FRANCÊS. Todos os textos devem estar em francês."
    : "IMPORTANTE: Responda APENAS em INGLÊS. Todos os textos devem estar em inglês.";

  const prompt = `Você é um especialista em Design Thinking conduzindo a fase DEFINE do framework Double Diamond.

${languageInstruction}

Based on the DISCOVER phase findings, synthesize the problem:

PAIN POINTS:
${input.painPoints.map(p => `- [${p.severity}/5] ${p.text}`).join('\n')}

USER NEEDS:
${input.userNeeds.map(n => `- [${n.priority}/5] ${n.need}`).join('\n')}

INSIGHTS:
${input.insights.map(i => `- ${i.text}`).join('\n')}

Generate:

1. **POV Statements** (3-5): Using formula: [User] needs [Need] because [Insight]
   - Focus on the most critical pain points and needs
   - Each POV should be specific and actionable

2. **HMW Questions** (8-12): "How Might We..." questions that open up solution space
   - Tag each with focus area: 'desirability', 'feasibility', or 'viability'
   - Avoid too broad or too narrow questions
   - Each HMW should be inspiring and solution-oriented

Return ONLY a JSON object (no markdown):
{
  "povStatements": [{
    "user": "busy professionals",
    "need": "quick healthy meals",
    "insight": "they have limited time but care about nutrition",
    "fullStatement": "Busy professionals need quick healthy meals because they have limited time but care about nutrition"
  }],
  "hmwQuestions": [{
    "question": "How might we make healthy eating as convenient as fast food?",
    "focusArea": "desirability"
  }]
}`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = result.text;
    if (!text) throw new Error("Empty AI response");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Define phase generation error: - double-diamond-ai.ts:195", error);
    throw error;
  }
}

// ===== PHASE 3: DEVELOP (Divergence) =====

export interface DevelopResult {
  ideas: Array<{
    title: string;
    description: string;
    category: string;
    innovationLevel: number; // 1-5 (5 = highly innovative)
  }>;
  crossPollinatedIdeas: Array<{
    title: string;
    description: string;
    domains: string[]; // domains combined
    uniqueness: number; // 1-5
  }>;
}

export async function generateDevelopPhase(input: {
  selectedPov: string;
  selectedHmw: string;
  sector: string;
  language?: string;
}): Promise<DevelopResult> {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  
  const languageInstruction = isPortuguese 
    ? "IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL. Todos os textos devem estar em português."
    : isSpanish
    ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol."
    : isFrench
    ? "IMPORTANTE: Responda APENAS em FRANCÊS. Todos os textos devem estar em francês."
    : "IMPORTANTE: Responda APENAS em INGLÊS. Todos os textos devem estar em inglês.";

  const prompt = `Você é um facilitador criativo de Design Thinking conduzindo a fase DEVELOP (Ideação).

${languageInstruction}

POV STATEMENT: ${input.selectedPov}
HMW QUESTION: ${input.selectedHmw}
SECTOR: ${input.sector}

Generate a LARGE quantity of diverse ideas:

1. **Regular Ideas** (15-20 ideas): Creative solutions to the HMW question
   - Categories: digital product, physical product, service, platform, hybrid
   - Rate innovation level 1-5 (1=incremental, 5=breakthrough)
   - Be bold and imaginative

2. **Cross-Pollinated Ideas** (5-8 ideas): Innovative solutions by combining concepts from different domains
   - Example: Combine "ride-sharing" (Uber) + "subscription model" (Netflix) + "social gaming" (TikTok)
   - Show which domains were combined
   - Rate uniqueness 1-5

Return ONLY a JSON object (no markdown):
{
  "ideas": [{
    "title": "AI-Powered Meal Planner",
    "description": "An app that creates personalized weekly meal plans based on dietary preferences, budget, and available time",
    "category": "digital product",
    "innovationLevel": 3
  }],
  "crossPollinatedIdeas": [{
    "title": "Netflix for Meal Kits",
    "description": "Subscription service that delivers ready-to-cook meal ingredients with recipe videos you can binge-watch",
    "domains": ["subscription model", "meal delivery", "video streaming"],
    "uniqueness": 4
  }]
}`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = result.text;
    if (!text) throw new Error("Empty AI response");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Develop phase generation error: - double-diamond-ai.ts:285", error);
    throw error;
  }
}

// ===== PHASE 4: DELIVER (Convergence) =====

export interface DeliverResult {
  mvpConcept: {
    name: string;
    tagline: string;
    coreFeatures: string[];
    valueProposition: string;
  };
  logoSuggestions: Array<{
    description: string;
    style: string; // 'modern', 'minimalist', 'playful', 'professional', 'bold'
    colors: string[];
    symbolism: string;
  }>;
  landingPage: {
    headline: string;
    subheadline: string;
    sections: Array<{
      title: string;
      content: string;
      cta?: string;
    }>;
    finalCta: string;
  };
  socialMediaLines: {
    twitter: string[];
    linkedin: string[];
    instagram: string[];
  };
  testPlan: {
    objectives: string[];
    targetUsers: string;
    metrics: string[];
    testMethods: string[];
  };
}

export async function generateDeliverPhase(input: {
  selectedIdeas: Array<{ title: string; description: string }>;
  pov: string;
  sector: string;
  language?: string;
}): Promise<DeliverResult> {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  
  const languageInstruction = isPortuguese 
    ? "IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL. Todos os textos devem estar em português."
    : isSpanish
    ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol."
    : isFrench
    ? "IMPORTANTE: Responda APENAS em FRANCÊS. Todos os textos devem estar em francês."
    : "IMPORTANTE: Responda APENAS em INGLÊS. Todos os textos devem estar em inglês.";

  const ideaDescriptions = input.selectedIdeas.map(idea => 
    `- ${idea.title}: ${idea.description}`
  ).join('\n');

  const prompt = `Você é um especialista em Design Thinking conduzindo a fase DELIVER - criando um MVP funcional.

${languageInstruction}

POV: ${input.pov}
SECTOR: ${input.sector}

SELECTED IDEAS FOR MVP:
${ideaDescriptions}

Generate a complete MVP package:

1. **MVP Concept**: Name, tagline, 3-5 core features, value proposition

2. **Logo Suggestions** (3-4 options): Description, style, color palette, symbolism

3. **Landing Page Structure**:
   - Compelling headline and subheadline
   - 4-5 sections (hero, problem, solution, features, testimonials/social proof)
   - Final CTA (call to action)

4. **Social Media Lines** (3-4 per platform):
   - Twitter (concise, engaging)
   - LinkedIn (professional, value-focused)
   - Instagram (visual, aspirational)

5. **Test Plan**: Objectives, target users, key metrics, test methods

Return ONLY a JSON object (no markdown):
{
  "mvpConcept": {
    "name": "QuickBite",
    "tagline": "Healthy meals in minutes",
    "coreFeatures": ["AI meal planning", "15-min recipes", "Nutrition tracking"],
    "valueProposition": "..."
  },
  "logoSuggestions": [{
    "description": "Modern fork and clock combined",
    "style": "minimalist",
    "colors": ["#2ECC71", "#34495E"],
    "symbolism": "Speed meets nutrition"
  }],
  "landingPage": {
    "headline": "...",
    "subheadline": "...",
    "sections": [{"title": "...", "content": "...", "cta": "..."}],
    "finalCta": "Start Your Free Trial"
  },
  "socialMediaLines": {
    "twitter": ["..."],
    "linkedin": ["..."],
    "instagram": ["..."]
  },
  "testPlan": {
    "objectives": ["..."],
    "targetUsers": "...",
    "metrics": ["..."],
    "testMethods": ["..."]
  }
}`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = result.text;
    if (!text) throw new Error("Empty AI response");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Deliver phase generation error: - double-diamond-ai.ts:425", error);
    throw error;
  }
}

// ===== DFV ANALYSIS (Desirability, Feasibility, Viability) =====

export interface DFVAnalysis {
  desirabilityScore: number; // 0-100
  feasibilityScore: number; // 0-100
  viabilityScore: number; // 0-100
  analysis: {
    desirability: {
      strengths: string[];
      concerns: string[];
      reasoning: string;
    };
    feasibility: {
      strengths: string[];
      concerns: string[];
      reasoning: string;
    };
    viability: {
      strengths: string[];
      concerns: string[];
      reasoning: string;
    };
  };
  overallAssessment: string;
  recommendations: string[];
  nextSteps: string[];
}

export async function analyzeDFV(input: {
  pov: string;
  mvpConcept: any;
  sector: string;
  selectedIdeas: any[];
  language?: string;
}): Promise<DFVAnalysis> {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");
  
  const languageInstruction = isPortuguese 
    ? "IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL. Todos os textos devem estar em português."
    : isSpanish
    ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol."
    : isFrench
    ? "IMPORTANTE: Responda APENAS em FRANCÊS. Todos os textos devem estar em francês."
    : "IMPORTANTE: Responda APENAS em INGLÊS. Todos os textos devem estar em inglês.";

  const prompt = `Você é um estrategista de negócios analisando um projeto de Design Thinking usando o framework DFV.

${languageInstruction}

POV: ${input.pov}
MVP: ${JSON.stringify(input.mvpConcept, null, 2)}
SETOR: ${input.sector}
IDEIAS: ${JSON.stringify(input.selectedIdeas, null, 2)}

Analise este projeto em três dimensões:

1. **DESIRABILITY (Desejabilidade)** (0-100): Os usuários querem isso?
   - Resolve um problema real e validado?
   - A proposta de valor é convincente?
   - Os usuários escolheriam isso ao invés de alternativas?

2. **FEASIBILITY (Viabilidade Técnica)** (0-100): Conseguimos construir isso?
   - Complexidade técnica
   - Requisitos de recursos
   - Tempo para mercado
   - Capacidades da equipe

3. **VIABILITY (Viabilidade de Negócio)** (0-100): É um negócio sustentável?
   - Potencial de receita
   - Estrutura de custos
   - Vantagem competitiva
   - Tamanho do mercado

Para cada dimensão, forneça:
- Score (0-100)
- Pontos Fortes (2-3 pontos)
- Preocupações (2-3 pontos)
- Raciocínio (1-2 frases explicando o score)

Depois forneça:
- Avaliação geral (overall assessment)
- Top 3-5 recomendações
- Próximos passos (priorizados)

Retorne APENAS um objeto JSON (sem markdown):
{
  "desirabilityScore": 75,
  "feasibilityScore": 60,
  "viabilityScore": 80,
  "analysis": {
    "desirability": {
      "strengths": ["Resolve problema validado", "Proposta de valor clara"],
      "concerns": ["Mercado saturado", "Mudança de comportamento do usuário necessária"],
      "reasoning": "Forte fit produto-mercado baseado no POV, mas o cenário competitivo está lotado"
    },
    "feasibility": {
      "strengths": ["Tecnologia disponível", "Equipe capacitada"],
      "concerns": ["Complexidade de integração", "Recursos necessários"],
      "reasoning": "Viável tecnicamente, mas requer investimento significativo em desenvolvimento"
    },
    "viability": {
      "strengths": ["Bom potencial de receita", "Modelo de negócio claro"],
      "concerns": ["Custos iniciais altos", "Competição intensa"],
      "reasoning": "Negócio viável com potencial de crescimento, mas precisa de capital inicial"
    }
  },
  "overallAssessment": "Conceito promissor com forte viabilidade mas desafios moderados de viabilidade técnica",
  "recommendations": ["Começar com MVP", "Validar com 20 usuários", "Buscar investimento inicial"],
  "nextSteps": ["Construir landing page", "Executar campanha pré-lançamento", "Montar equipe técnica"]
}`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });
    
    const text = result.text;
    if (!text) throw new Error("Empty AI response");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("DFV analysis error: - double-diamond-ai.ts:557", error);
    throw error;
  }
}

// ===== BPMN PROCESS ANALYSIS =====

export interface BpmnAnalysisResult {
  overview: string;
  bottlenecks: string[];
  unassignedTasks: string[];
  unclearEnds: string[];
  improvementIdeas: string[];
  doubleDiamondLinks: {
    discover: string[];
    define: string[];
    develop: string[];
    deliver: string[];
  };
}

export async function analyzeBpmnProcess(input: {
  bpmnXml: string;
  language?: string;
}): Promise<BpmnAnalysisResult> {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");

  const languageInstruction = isPortuguese
    ? "IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL. Todos os textos devem estar em português."
    : isSpanish
    ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol."
    : isFrench
    ? "IMPORTANTE: Responda APENAS em FRANCÊS. Todos os textos devem estar em francês."
    : "IMPORTANTE: Responda APENAS em INGLÊS. Todos os textos devem estar em inglês.";

  const prompt = `Você é um especialista em melhoria de processos e Design Thinking.

${languageInstruction}

Você receberá um diagrama BPMN em XML e deve analisá-lo para um gestor de negócios que não é técnico.

BPMN XML (não reescreva, apenas analise):
${input.bpmnXml}

Analise o processo e produza:

1. VISÃO GERAL (overview)
   - Explique em poucas frases como o processo começa, principais etapas e como termina.

2. GARGALOS (bottlenecks)
   - Liste pontos prováveis de fila, espera, retrabalho ou excesso de aprovações.

3. TAREFAS SEM DONO CLARO (unassignedTasks)
   - Destaque etapas em que não está claro quem é o responsável (ex: cliente, SDR, CS, marketing).

4. FINS POUCO CLAROS (unclearEnds)
   - Aponte caminhos que não levam a um fim claro ou que terminam de forma confusa/incompleta.

5. IDEIAS DE MELHORIA (improvementIdeas)
   - Sugestões práticas para simplificar, automatizar ou melhorar a experiência do cliente.

6. CONEXÃO COM DOUBLE DIAMOND (doubleDiamondLinks)
   - Descubra: que observações sobre dores/jornada dos usuários o processo sugere?
   - Define: que problemas/"How Might We" aparentes surgem a partir do desenho do processo?
   - Develop: que tipos de ideias ou experimentos o time poderia testar?
   - Deliver: que hipóteses de MVP ou ajustes de entrega aparecem a partir do processo?

Retorne APENAS um objeto JSON (sem markdown):
{
  "overview": "...",
  "bottlenecks": ["..."],
  "unassignedTasks": ["..."],
  "unclearEnds": ["..."],
  "improvementIdeas": ["..."],
  "doubleDiamondLinks": {
    "discover": ["..."],
    "define": ["..."],
    "develop": ["..."],
    "deliver": ["..."]
  }
}`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt
    });

    const text = result.text;
    if (!text) throw new Error("Empty AI response");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("BPMN process analysis error: - double-diamond-ai.ts:655", error);
    throw error;
  }
}

export interface BpmnHmwFromAnalysisResult {
  hmwQuestions: Array<{
    question: string;
    source: "bottleneck" | "unclearEnd";
    relatedItem: string;
  }>;
}

export async function generateHmwFromBpmnAnalysis(input: {
  analysis: BpmnAnalysisResult;
  language?: string;
}): Promise<BpmnHmwFromAnalysisResult> {
  const lang = input.language || "pt-BR";
  const isPortuguese = lang.startsWith("pt");
  const isSpanish = lang.startsWith("es");
  const isFrench = lang.startsWith("fr");

  const languageInstruction = isPortuguese
    ? "IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL. Todos os textos devem estar em português."
    : isSpanish
    ? "IMPORTANTE: Responda APENAS em ESPANHOL. Todos os textos devem estar em espanhol."
    : isFrench
    ? "IMPORTANTE: Responda APENAS em FRANCÊS. Todos os textos devem estar em francês."
    : "IMPORTANTE: Responda APENAS em INGLÊS. Todos os textos devem estar em inglês.";

  const { analysis } = input;

  const prompt = `Você é um facilitador experiente de Design Thinking ajudando um time na fase DEFINE.

${languageInstruction}

Você receberá um resumo de análise de um processo em BPMN com:
- lista de GARGALOS (bottlenecks)
- lista de FINS POUCO CLAROS (unclearEnds)

Sua tarefa é transformar esses problemas em perguntas "How Might We" (Como poderíamos...) claras e acionáveis.

Siga estas regras:
- Crie entre 6 e 12 perguntas HMW no total.
- Use linguagem simples, focada em resultado para o usuário.
- Cada pergunta deve estar relacionada diretamente a um gargalo OU a um fim pouco claro.
- Não proponha soluções prontas na pergunta, apenas a oportunidade.

ANÁLISE DO PROCESSO (resumo de texto gerado anteriormente pela IA):

VISÃO GERAL:
${analysis.overview}

GARGALOS (bottlenecks):
${(analysis.bottlenecks || [])
  .map((b, i) => `- [B${i + 1}] ${b}`)
  .join("\n")}

FINS POUCO CLAROS (unclearEnds):
${(analysis.unclearEnds || [])
  .map((u, i) => `- [U${i + 1}] ${u}`)
  .join("\n")}

Retorne APENAS um objeto JSON (sem markdown) com o formato:
{
  "hmwQuestions": [
    {
      "question": "Como poderíamos...",
      "source": "bottleneck" | "unclearEnd",
      "relatedItem": "Texto completo do gargalo ou fim pouco claro que originou esta pergunta"
    }
  ]
}`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const text = result.text;
    if (!text) throw new Error("Empty AI response");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("BPMN HMW generation error: - double-diamond-ai.ts:742", error);
    throw error;
  }
}