import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, ClipboardList, Pencil, Plus, Target, Trash2 } from "lucide-react";

import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type {
  CommercialAccount,
  CommercialContact,
  CommercialOpportunity,
  CommercialPipelineStage,
  CommercialPlaybookTemplate,
  CommercialSwotAnalysis,
} from "@shared/schema";

const channels = ["phone", "email", "ecommerce", "visit", "campaign"];

function splitByLine(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export default function CommercialPage() {
  const { toast } = useToast();

  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  const [newAccount, setNewAccount] = useState({
    name: "",
    segment: "",
    city: "",
    state: "",
    country: "Brasil",
    website: "",
  });

  const [newContact, setNewContact] = useState({
    accountId: "",
    name: "",
    role: "",
    email: "",
    phone: "",
    preferredChannel: "email",
  });

  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    accountId: "",
    contactId: "",
    stageId: "",
    valueEstimate: "",
    probability: "",
    nextActionType: "email",
    nextActionDescription: "",
  });

  const [newSwot, setNewSwot] = useState({
    name: "",
    segment: "",
    context: "",
    strengths: "",
    weaknesses: "",
    opportunities: "",
    threats: "",
  });

  const [newPlaybook, setNewPlaybook] = useState({
    name: "",
    channel: "email",
    segment: "",
    objective: "",
    content: "",
    checklist: "",
  });

  const { data: accounts = [] } = useQuery<CommercialAccount[]>({
    queryKey: ["/api/commercial/accounts"],
  });

  const { data: stages = [] } = useQuery<CommercialPipelineStage[]>({
    queryKey: ["/api/commercial/stages"],
  });

  const { data: opportunities = [] } = useQuery<CommercialOpportunity[]>({
    queryKey: ["/api/commercial/opportunities"],
  });

  const { data: swotAnalyses = [] } = useQuery<CommercialSwotAnalysis[]>({
    queryKey: ["/api/commercial/swot"],
  });

  const { data: playbooks = [] } = useQuery<CommercialPlaybookTemplate[]>({
    queryKey: ["/api/commercial/playbooks"],
  });

  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  const { data: contacts = [] } = useQuery<CommercialContact[]>({
    queryKey: ["/api/commercial/accounts", selectedAccountId, "contacts"],
    enabled: !!selectedAccountId,
  });

  const contactsByAccount = useMemo(() => {
    const map = new Map<string, CommercialContact[]>();
    if (selectedAccountId) {
      map.set(selectedAccountId, contacts);
    }
    return map;
  }, [contacts, selectedAccountId]);

  const createAccountMutation = useMutation({
    mutationFn: (data: typeof newAccount) => apiRequest("POST", "/api/commercial/accounts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/accounts"] });
      setNewAccount({ name: "", segment: "", city: "", state: "", country: "Brasil", website: "" });
      toast({ title: "Conta criada", description: "Conta adicionada com sucesso." });
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CommercialAccount> }) =>
      apiRequest("PUT", `/api/commercial/accounts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/accounts"] });
      toast({ title: "Conta atualizada", description: "Conta atualizada com sucesso." });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/commercial/accounts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/opportunities"] });
      toast({ title: "Conta removida", description: "Conta removida com sucesso." });
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CommercialContact> }) =>
      apiRequest("PUT", `/api/commercial/contacts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/accounts", selectedAccountId, "contacts"] });
      toast({ title: "Contato atualizado", description: "Contato atualizado com sucesso." });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/commercial/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/accounts", selectedAccountId, "contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/opportunities"] });
      toast({ title: "Contato removido", description: "Contato removido com sucesso." });
    },
  });

  const createContactMutation = useMutation({
    mutationFn: (data: typeof newContact) => apiRequest("POST", "/api/commercial/contacts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/accounts", selectedAccountId, "contacts"] });
      setNewContact((prev) => ({ ...prev, name: "", role: "", email: "", phone: "" }));
      toast({ title: "Contato criado", description: "Contato adicionado com sucesso." });
    },
  });

  const createOpportunityMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/commercial/opportunities", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/opportunities"] });
      setNewOpportunity({
        title: "",
        accountId: "",
        contactId: "",
        stageId: "",
        valueEstimate: "",
        probability: "",
        nextActionType: "email",
        nextActionDescription: "",
      });
      toast({ title: "Oportunidade criada", description: "Oportunidade adicionada ao funil." });
    },
  });

  const updateOpportunityMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CommercialOpportunity> }) =>
      apiRequest("PUT", `/api/commercial/opportunities/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/opportunities"] });
    },
  });

  const deleteOpportunityMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/commercial/opportunities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/opportunities"] });
      toast({ title: "Oportunidade removida", description: "Oportunidade removida com sucesso." });
    },
  });

  const createSwotMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/commercial/swot", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/swot"] });
      setNewSwot({
        name: "",
        segment: "",
        context: "",
        strengths: "",
        weaknesses: "",
        opportunities: "",
        threats: "",
      });
      toast({ title: "SWOT criada", description: "Análise SWOT salva com sucesso." });
    },
  });

  const updateSwotMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CommercialSwotAnalysis> }) =>
      apiRequest("PUT", `/api/commercial/swot/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/swot"] });
      toast({ title: "SWOT atualizada", description: "Análise SWOT atualizada." });
    },
  });

  const deleteSwotMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/commercial/swot/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/swot"] });
      toast({ title: "SWOT removida", description: "Análise SWOT removida." });
    },
  });

  const createPlaybookMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/commercial/playbooks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/playbooks"] });
      setNewPlaybook({
        name: "",
        channel: "email",
        segment: "",
        objective: "",
        content: "",
        checklist: "",
      });
      toast({ title: "Playbook criado", description: "Template salvo com sucesso." });
    },
  });

  const updatePlaybookMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CommercialPlaybookTemplate> }) =>
      apiRequest("PUT", `/api/commercial/playbooks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/playbooks"] });
      toast({ title: "Playbook atualizado", description: "Playbook atualizado com sucesso." });
    },
  });

  const deletePlaybookMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/commercial/playbooks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commercial/playbooks"] });
      toast({ title: "Playbook removido", description: "Playbook removido com sucesso." });
    },
  });

  const selectedContacts = selectedAccountId ? contactsByAccount.get(selectedAccountId) ?? [] : [];
  const contactsForOpportunity = newOpportunity.accountId === selectedAccountId ? selectedContacts : [];

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Comercial (Fase 1 + Fase 2)</h1>
          <p className="text-muted-foreground">Contas, pipeline, SWOT e playbooks em um fluxo único.</p>
        </div>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Contas & Contatos</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="strategy">SWOT & Playbooks</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Nova conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Nome da conta" value={newAccount.name} onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })} />
                <Input placeholder="Segmento" value={newAccount.segment} onChange={(e) => setNewAccount({ ...newAccount, segment: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Cidade" value={newAccount.city} onChange={(e) => setNewAccount({ ...newAccount, city: e.target.value })} />
                  <Input placeholder="Estado" value={newAccount.state} onChange={(e) => setNewAccount({ ...newAccount, state: e.target.value })} />
                </div>
                <Input placeholder="Website" value={newAccount.website} onChange={(e) => setNewAccount({ ...newAccount, website: e.target.value })} />
                <Button
                  onClick={() => createAccountMutation.mutate(newAccount)}
                  disabled={!newAccount.name.trim() || createAccountMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" /> Criar conta
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contas</CardTitle>
                <CardDescription>Selecione uma conta para gerenciar contatos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {accounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma conta cadastrada.</p>
                ) : (
                  accounts.map((account) => (
                    <div
                      key={account.id}
                      className={`w-full text-left border rounded-md p-3 ${selectedAccountId === account.id ? "border-primary" : "border-border"}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedAccountId(account.id);
                        setNewContact((prev) => ({ ...prev, accountId: account.id }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedAccountId(account.id);
                          setNewContact((prev) => ({ ...prev, accountId: account.id }));
                        }
                      }}
                    >
                      <div className="font-medium">{account.name}</div>
                      <div className="text-xs text-muted-foreground">{account.segment || "Sem segmento"} • {account.city || "-"}</div>
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const name = window.prompt("Editar nome da conta", account.name);
                            if (name && name.trim()) {
                              updateAccountMutation.mutate({ id: account.id, data: { name: name.trim() } });
                            }
                          }}
                        >
                          <Pencil className="h-3 w-3 mr-1" /> Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Deseja remover esta conta?")) {
                              deleteAccountMutation.mutate(account.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Excluir
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contatos da conta selecionada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input placeholder="Nome" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
                <Input placeholder="Cargo" value={newContact.role} onChange={(e) => setNewContact({ ...newContact, role: e.target.value })} />
                <Input placeholder="Email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input placeholder="Telefone" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
                <select
                  className="h-10 rounded-md border border-input bg-background px-3"
                  value={newContact.preferredChannel}
                  onChange={(e) => setNewContact({ ...newContact, preferredChannel: e.target.value })}
                >
                  {channels.map((channel) => (
                    <option key={channel} value={channel}>{channel}</option>
                  ))}
                </select>
                <Button
                  onClick={() => createContactMutation.mutate({ ...newContact, accountId: selectedAccountId })}
                  disabled={!selectedAccountId || !newContact.name.trim() || createContactMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" /> Adicionar contato
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                {selectedContacts.map((contact) => (
                  <div key={contact.id} className="border rounded-md p-3">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.role || "Sem cargo"}</p>
                    <p className="text-xs text-muted-foreground">{contact.email || "Sem email"}</p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => {
                          const name = window.prompt("Editar nome do contato", contact.name);
                          if (name && name.trim()) {
                            updateContactMutation.mutate({ id: contact.id, data: { name: name.trim() } });
                          }
                        }}
                      >
                        <Pencil className="h-3 w-3 mr-1" /> Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        type="button"
                        onClick={() => {
                          if (window.confirm("Deseja remover este contato?")) {
                            deleteContactMutation.mutate(contact.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Nova oportunidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input placeholder="Título" value={newOpportunity.title} onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })} />
                <select
                  className="h-10 rounded-md border border-input bg-background px-3"
                  value={newOpportunity.accountId}
                  onChange={(e) => {
                    const accountId = e.target.value;
                    setNewOpportunity({ ...newOpportunity, accountId, contactId: "" });
                    if (accountId) {
                      setSelectedAccountId(accountId);
                    }
                  }}
                >
                  <option value="">Conta</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3"
                  value={newOpportunity.contactId}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, contactId: e.target.value })}
                >
                  <option value="">Contato</option>
                  {contactsForOpportunity.map((contact) => (
                    <option key={contact.id} value={contact.id}>{contact.name}</option>
                  ))}
                </select>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3"
                  value={newOpportunity.stageId}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, stageId: e.target.value })}
                >
                  <option value="">Etapa</option>
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>{stage.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input placeholder="Valor estimado" type="number" value={newOpportunity.valueEstimate} onChange={(e) => setNewOpportunity({ ...newOpportunity, valueEstimate: e.target.value })} />
                <Input placeholder="Probabilidade (%)" type="number" value={newOpportunity.probability} onChange={(e) => setNewOpportunity({ ...newOpportunity, probability: e.target.value })} />
                <select
                  className="h-10 rounded-md border border-input bg-background px-3"
                  value={newOpportunity.nextActionType}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, nextActionType: e.target.value })}
                >
                  {channels.map((channel) => (
                    <option key={channel} value={channel}>{channel}</option>
                  ))}
                </select>
                <Button
                  onClick={() =>
                    createOpportunityMutation.mutate({
                      ...newOpportunity,
                      valueEstimate: Number(newOpportunity.valueEstimate || 0),
                      probability: Number(newOpportunity.probability || 0),
                    })
                  }
                  disabled={!newOpportunity.title.trim() || !newOpportunity.accountId || !newOpportunity.stageId || createOpportunityMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" /> Criar
                </Button>
              </div>
              <Input
                placeholder="Descrição da próxima ação"
                value={newOpportunity.nextActionDescription}
                onChange={(e) => setNewOpportunity({ ...newOpportunity, nextActionDescription: e.target.value })}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {stages.map((stage) => (
              <Card key={stage.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm" style={{ color: stage.color || undefined }}>
                    {stage.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {opportunities.filter((op) => op.stageId === stage.id).map((op) => (
                    <div key={op.id} className="border rounded-md p-2 space-y-1">
                      <p className="text-sm font-medium">{op.title}</p>
                      <p className="text-xs text-muted-foreground">R$ {(op.valueEstimate || 0).toLocaleString("pt-BR")}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{op.probability || 0}%</Badge>
                        <select
                          className="h-7 rounded border border-input text-xs px-1"
                          value={op.stageId || ""}
                          onChange={(e) => updateOpportunityMutation.mutate({ id: op.id, data: { stageId: e.target.value } })}
                        >
                          {stages.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          onClick={() => {
                            const title = window.prompt("Editar título da oportunidade", op.title);
                            if (title && title.trim()) {
                              updateOpportunityMutation.mutate({ id: op.id, data: { title: title.trim() } });
                            }
                          }}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            if (window.confirm("Deseja remover esta oportunidade?")) {
                              deleteOpportunityMutation.mutate(op.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Nova SWOT</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input placeholder="Nome da análise" value={newSwot.name} onChange={(e) => setNewSwot({ ...newSwot, name: e.target.value })} />
                <Input placeholder="Segmento" value={newSwot.segment} onChange={(e) => setNewSwot({ ...newSwot, segment: e.target.value })} />
                <Textarea placeholder="Contexto" value={newSwot.context} onChange={(e) => setNewSwot({ ...newSwot, context: e.target.value })} />
                <Textarea placeholder="Forças (1 por linha)" value={newSwot.strengths} onChange={(e) => setNewSwot({ ...newSwot, strengths: e.target.value })} />
                <Textarea placeholder="Fraquezas (1 por linha)" value={newSwot.weaknesses} onChange={(e) => setNewSwot({ ...newSwot, weaknesses: e.target.value })} />
                <Textarea placeholder="Oportunidades (1 por linha)" value={newSwot.opportunities} onChange={(e) => setNewSwot({ ...newSwot, opportunities: e.target.value })} />
                <Textarea placeholder="Ameaças (1 por linha)" value={newSwot.threats} onChange={(e) => setNewSwot({ ...newSwot, threats: e.target.value })} />
                <Button
                  onClick={() =>
                    createSwotMutation.mutate({
                      ...newSwot,
                      strengths: splitByLine(newSwot.strengths),
                      weaknesses: splitByLine(newSwot.weaknesses),
                      opportunities: splitByLine(newSwot.opportunities),
                      threats: splitByLine(newSwot.threats),
                      actionPlan: [],
                    })
                  }
                  disabled={!newSwot.name.trim() || createSwotMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" /> Salvar SWOT
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Novo playbook por canal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input placeholder="Nome do playbook" value={newPlaybook.name} onChange={(e) => setNewPlaybook({ ...newPlaybook, name: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <select className="h-10 rounded-md border border-input bg-background px-3" value={newPlaybook.channel} onChange={(e) => setNewPlaybook({ ...newPlaybook, channel: e.target.value })}>
                    {channels.map((channel) => (
                      <option key={channel} value={channel}>{channel}</option>
                    ))}
                  </select>
                  <Input placeholder="Segmento" value={newPlaybook.segment} onChange={(e) => setNewPlaybook({ ...newPlaybook, segment: e.target.value })} />
                </div>
                <Input placeholder="Objetivo" value={newPlaybook.objective} onChange={(e) => setNewPlaybook({ ...newPlaybook, objective: e.target.value })} />
                <Textarea placeholder="Conteúdo do playbook" value={newPlaybook.content} onChange={(e) => setNewPlaybook({ ...newPlaybook, content: e.target.value })} />
                <Textarea placeholder="Checklist (1 item por linha)" value={newPlaybook.checklist} onChange={(e) => setNewPlaybook({ ...newPlaybook, checklist: e.target.value })} />
                <Button
                  onClick={() =>
                    createPlaybookMutation.mutate({
                      ...newPlaybook,
                      checklist: splitByLine(newPlaybook.checklist),
                      version: 1,
                      isActive: true,
                    })
                  }
                  disabled={!newPlaybook.name.trim() || !newPlaybook.content.trim() || createPlaybookMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" /> Salvar playbook
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Análises SWOT</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-auto">
                {swotAnalyses.map((swot) => (
                  <div key={swot.id} className="border rounded-md p-3">
                    <p className="font-medium">{swot.name}</p>
                    <p className="text-xs text-muted-foreground">{swot.segment || "Segmento livre"}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline">F: {Array.isArray(swot.strengths) ? swot.strengths.length : 0}</Badge>
                      <Badge variant="outline">W: {Array.isArray(swot.weaknesses) ? swot.weaknesses.length : 0}</Badge>
                      <Badge variant="outline">O: {Array.isArray(swot.opportunities) ? swot.opportunities.length : 0}</Badge>
                      <Badge variant="outline">T: {Array.isArray(swot.threats) ? swot.threats.length : 0}</Badge>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => {
                          const name = window.prompt("Editar nome da SWOT", swot.name);
                          if (name && name.trim()) {
                            updateSwotMutation.mutate({ id: swot.id, data: { name: name.trim() } });
                          }
                        }}
                      >
                        <Pencil className="h-3 w-3 mr-1" /> Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        type="button"
                        onClick={() => {
                          if (window.confirm("Deseja remover esta SWOT?")) {
                            deleteSwotMutation.mutate(swot.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Playbooks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-auto">
                {playbooks.map((playbook) => (
                  <div key={playbook.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{playbook.name}</p>
                      <Badge>{playbook.channel}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{playbook.segment || "Segmento livre"}</p>
                    <p className="text-sm mt-2 line-clamp-3">{playbook.content}</p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => {
                          const name = window.prompt("Editar nome do playbook", playbook.name);
                          if (name && name.trim()) {
                            updatePlaybookMutation.mutate({ id: playbook.id, data: { name: name.trim() } });
                          }
                        }}
                      >
                        <Pencil className="h-3 w-3 mr-1" /> Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        type="button"
                        onClick={() => {
                          if (window.confirm("Deseja remover este playbook?")) {
                            deletePlaybookMutation.mutate(playbook.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
