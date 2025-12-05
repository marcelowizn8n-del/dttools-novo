import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  Loader2,
  Sparkles,
  RefreshCw,
  Users,
  Target,
  Wrench,
  TestTube,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiRequest } from "@/lib/queryClient";
import type { Project } from "@shared/schema";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DesignThinkingContext {
  projectId?: string;
  projectName?: string;
  projectDescription?: string;
  currentPhase: number;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
}

const phases = [
  { id: 1, nameKey: "phases.empathize", icon: Users, color: "#90C5E0", focus: "empathize" },
  { id: 2, nameKey: "phases.define", icon: Target, color: "#3A5A7E", focus: "define" },
  { id: 3, nameKey: "phases.ideate", icon: Lightbulb, color: "#FFD700", focus: "ideate" },
  { id: 4, nameKey: "phases.prototype", icon: Wrench, color: "#FF6B35", focus: "prototype" },
  { id: 5, nameKey: "phases.test", icon: TestTube, color: "#2ECC71", focus: "test" }
];

const userLevels = [
  {
    value: "beginner",
    labelKey: "chat.userLevel.beginner.label",
    descriptionKey: "chat.userLevel.beginner.description",
  },
  {
    value: "intermediate",
    labelKey: "chat.userLevel.intermediate.label",
    descriptionKey: "chat.userLevel.intermediate.description",
  },
  {
    value: "advanced",
    labelKey: "chat.userLevel.advanced.label",
    descriptionKey: "chat.userLevel.advanced.description",
  },
];

export default function ChatPage() {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      content: t("chat.initialMessage"),
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [context, setContext] = useState<DesignThinkingContext>({
    currentPhase: 1,
    userLevel: 'beginner',
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const localeMap: Record<string, string> = {
    "pt-BR": "pt-BR",
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    zh: "zh-CN",
  };
  const timeLocale = localeMap[language] || "pt-BR";

  // Get projects for context selection
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    enabled: isAuthenticated
  });

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async ({ messages: msgHistory, context: ctx }: { messages: ChatMessage[], context: DesignThinkingContext }) => {
      const response = await apiRequest('POST', '/api/chat', { messages: msgHistory, context: ctx });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      generateSuggestions();
    },
    onError: (error) => {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: t("chat.error.generic"),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  // Suggestions mutation
  const suggestionsMutation = useMutation({
    mutationFn: async ({ context: ctx, topic }: { context: DesignThinkingContext, topic: string }) => {
      const response = await apiRequest('POST', '/api/chat/suggestions', { context: ctx, topic });
      return response.json();
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions || []);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateSuggestions = () => {
    if (messages.length > 0) {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      const topic = lastUserMessage?.content || t("chat.defaultTopic");
      suggestionsMutation.mutate({ context, topic });
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    chatMutation.mutate({ messages: updatedMessages, context });
    setInputValue('');
  };

  const useSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: t("chat.clear.message"),
      timestamp: new Date()
    }]);
    setSuggestions([]);
  };

  const currentPhase = phases.find(p => p.id === context.currentPhase);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {t("chat.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t("chat.unauth.message")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-2 sm:p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            {t("chat.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("chat.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 min-h-[500px]">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-3 lg:space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t("chat.settings.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Phase Selection */}
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t("chat.settings.phaseLabel")}
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {phases.map((phase) => (
                      <Button
                        key={phase.id}
                        variant={context.currentPhase === phase.id ? "default" : "outline"}
                        size="sm"
                        className={`justify-start text-xs ${
                          context.currentPhase === phase.id ? 'shadow-md' : ''
                        }`}
                        style={{
                          backgroundColor: context.currentPhase === phase.id ? phase.color : undefined
                        }}
                        onClick={() => setContext(prev => ({ ...prev, currentPhase: phase.id }))}
                        data-testid={`button-phase-${phase.id}`}
                      >
                        <phase.icon className="h-3 w-3 mr-2" />
                        {t(phase.nameKey)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* User Level */}
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t("chat.settings.levelLabel")}
                  </label>
                  <div className="space-y-1">
                    {userLevels.map((level) => (
                      <Button
                        key={level.value}
                        variant={context.userLevel === level.value ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setContext(prev => ({ 
                          ...prev, 
                          userLevel: level.value as 'beginner' | 'intermediate' | 'advanced' 
                        }))}
                        data-testid={`button-level-${level.value}`}
                      >
                        {t(level.labelKey)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Project Selection */}
                {projects.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t("chat.settings.projectLabel")}
                    </label>
                    <select
                      className="w-full p-2 text-xs border rounded-md bg-background"
                      value={context.projectId || ''}
                      onChange={(e) => {
                        const selectedProject = projects.find(p => p.id === e.target.value);
                        setContext(prev => ({ 
                          ...prev, 
                          projectId: e.target.value || undefined,
                          projectName: selectedProject?.name,
                          projectDescription: selectedProject?.description || undefined
                        }));
                      }}
                      data-testid="select-project"
                    >
                      <option value="">{t("chat.settings.projectPlaceholder")}</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={clearChat}
                  data-testid="button-clear-chat"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  {t("chat.clear.button")}
                </Button>
              </CardContent>
            </Card>

            {/* Current Context */}
            {currentPhase && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <currentPhase.icon className="h-4 w-4" style={{ color: currentPhase.color }} />
                    {t("chat.context.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs" data-testid="badge-current-phase">
                      {t(currentPhase.nameKey)}
                    </Badge>
                    <Badge variant="outline" className="text-xs" data-testid="badge-user-level">
                      {t(
                        userLevels.find((l) => l.value === context.userLevel)?.labelKey ||
                          "chat.userLevel.beginner.label"
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {t("chat.suggestions.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full text-left text-xs justify-start h-auto p-2 text-wrap"
                        onClick={() => useSuggestion(suggestion)}
                        data-testid={`button-suggestion-${index}`}
                      >
                        <Lightbulb className="h-3 w-3 mr-2 flex-shrink-0" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-full min-h-[400px] flex flex-col shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {t("chat.chatPanel.title")}
                  {chatMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col min-h-0 pb-2">
                {/* Messages */}
                <ScrollArea className="flex-1 pr-4 min-h-0">
                  <div className="space-y-4 pb-6">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
                          }`}>
                            {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          <div className={`rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap break-words" data-testid={`message-${index}`}>
                              {message.content}
                            </p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString(timeLocale)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <Separator className="my-2 sm:my-4" />

                {/* Input */}
                <div className="flex gap-2 pt-2 pb-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t("chat.input.placeholder")}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={chatMutation.isPending}
                    data-testid="input-chat-message"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!inputValue.trim() || chatMutation.isPending}
                    data-testid="button-send-message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}