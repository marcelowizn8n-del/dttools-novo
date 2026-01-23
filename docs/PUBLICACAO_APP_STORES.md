# Design Thinking Tools (DTTools) — Publicação na Apple App Store e Google Play (Guia Atualizado)

Este documento consolida, em um único lugar, o material necessário e o passo a passo para publicar o **Design Thinking Tools (DTTools)** nas lojas.

Links do produto:

- https://designthinkingtools.com
- https://www.dttools.app

Textos já existentes no repositório (reutilizáveis):

- `app-store-descriptions-final.md` (textos finais multi-idioma)
- `marketing/app-stores/app-store-apple.md` (rascunho Apple)
- `marketing/app-stores/app-store-google.md` (rascunho Google)

---

## 1. Primeiro: qual é o “tipo” do app hoje?

Pelo estado atual do projeto:

- Existe `client/public/manifest.json` com `display: standalone` (característica de PWA)
- O `Service Worker` está desativado/limpo no `client/index.html` e no `client/src/main.tsx`
- Não existem pastas `ios/` ou `android/` no repositório (não há wrapper nativo versionado aqui)

Isso indica que o DTTools está **como Web App/PWA**, e não como app nativo.

Para publicar em lojas, você normalmente escolhe um destes caminhos:

### Caminho A — Publicar como PWA (limitado)
- **Apple App Store:** não aceita “PWA pura” como submissão normal. Você precisa de um wrapper nativo (WKWebView) ou de uma solução tipo Capacitor.
- **Google Play:** aceita via **Trusted Web Activity (TWA)** ou wrapper (Capacitor). PWA pura não vai como “APK/AAB” sem empacotar.

### Caminho B — Empacotar web em app de loja (recomendado)
- **iOS + Android:** Capacitor (recomendação padrão)
- **Android (apenas):** TWA (mais próximo de PWA, bom se você quer o mínimo de nativo)

Este guia cobre o Caminho B, que é o que efetivamente viabiliza App Store + Play.

---

## 2. Checklist de materiais (Apple + Google)

### Identidade e assets
- Nome: **Design Thinking Tools**
- Ícone:
  - 1024x1024 (App Store)
  - 512x512 (Play)
- Feature graphic (Play): 1024x500
- Screenshots:
  - iPhone (App Store)
  - iPad (App Store, se suportar)
  - Phone + Tablet (Play)
- Vídeo (opcional, recomendado): 15–30s

### Links obrigatórios
- Política de privacidade: ideal existir uma URL pública estável (ex.: `/privacy-policy`)
- Termos de uso: ideal existir uma URL pública estável (ex.: `/terms`)
- Suporte: URL ou email

### Textos
- Use como base: `app-store-descriptions-final.md`

### Compliance (lojas)
- Declaração de coleta de dados (Data Safety no Play / App Privacy no iOS)
- Classificação etária
- Informações de conta (se exige login)

---

## 3. Preparação técnica: empacotar com Capacitor (recomendado)

> Observação: este repositório não tem `ios/` e `android/`. Normalmente você cria um “app wrapper” em um projeto separado ou dentro do repo (se decidir versionar).

 Decisão final (aprovada):

 - Empacotamento: **Capacitor (iOS + Android)**
 - Conteúdo do app: **abre a URL `https://www.dttools.app`** dentro do wrapper
 - Identificadores:
   - iOS Bundle ID: **`com.designthinkingtools.dttools`**
   - Android package name: **`com.designthinkingtools.dttools`**

### 3.1 Decisão de arquitetura
Escolha uma abordagem:

- **Wrapper apontando para a URL (recommended para updates rápidos)**
  - O app nativo abre `https://www.dttools.app` dentro de uma WebView.
  - Prós: updates sem precisar subir build.
  - Contras: precisa garantir UX e sessão, e lidar com comportamento offline (se houver).

- **Wrapper com build embarcado (opção mais clássica)**
  - Você empacota o build do Vite dentro do app.
  - Prós: performance e controle.
  - Contras: toda mudança exige novo upload para as lojas.

### 3.2 Itens que você precisa definir
- **Bundle Identifier (iOS)**: ex. `com.seudominio.dttools` (precisa ser único)
- **Package name (Android)**: ex. `com.seudominio.dttools`
- **Version (semver)** e build numbers:
  - iOS: `CFBundleShortVersionString` e `CFBundleVersion`
  - Android: `versionName` e `versionCode`

---

## 4. Apple App Store — Checklist atualizado

### 4.1 Contas
- Apple Developer Program ativo
- App Store Connect acesso

### 4.2 Certificados e assinatura
- Criar/validar:
  - Certificate (Apple Distribution)
  - Identifiers (App ID / Bundle ID)
  - Provisioning Profile (App Store)

### 4.3 Build e upload
- Gerar build `ipa` (ou archive via Xcode)
- Enviar via Xcode Organizer ou Transporter

### 4.4 Configurar listagem
Campos típicos:
- Nome
- Subtítulo
- Categoria
- Descrição
- Keywords (100 chars)
- Screenshots
- URL de suporte
- URL de privacidade

Use como base:
- `marketing/app-stores/app-store-apple.md`
- `app-store-descriptions-final.md`

### 4.5 App Privacy (muito importante)
Você precisa declarar (no App Store Connect):
- Dados coletados (ex.: email, nome, conteúdo do usuário)
- Se compartilha com terceiros
- Finalidade (account, analytics, etc.)

### 4.6 Review (o que costuma reprovar WebView)
Se usar WebView:
- O app precisa parecer um app, não “um site embrulhado”
- Precisa ter:
  - navegação clara
  - comportamento consistente
  - política de privacidade acessível dentro do app

---

## 5. Google Play — Checklist atualizado

### 5.1 Conta e configurações
- Google Play Console ativo

### 5.2 Assinatura
- Criar **keystore** (e guardar com segurança)
- Configurar signing key (Play App Signing recomendado)

### 5.3 Build
- Gerar **AAB** (Android App Bundle)
- Subir para Internal testing → Closed testing → Production

### 5.4 Store listing
- Nome (50 chars)
- Short description (80 chars)
- Full description (4000 chars)
- Feature graphic
- Screenshots (mín. 8 recomendado)
- Categoria + tags
- Política de privacidade

Use como base:
- `marketing/app-stores/app-store-google.md`
- `app-store-descriptions-final.md`

### 5.5 Data Safety
Você precisa preencher com base no comportamento real do app:
- Quais dados coleta (email, nome, fotos/anexos, etc.)
- Se dados são criptografados em trânsito
- Se o usuário pode pedir deleção

---

## 6. Atualizações após “mudanças no app” (o que revisar sempre)

Sempre que o app muda, revise:

- Versão do app (iOS/Android)
- Descrição/Whats New
- Screenshots (se UI mudou)
- Política de privacidade (se fluxo de dados mudou)
- Data Safety / App Privacy (se coleta mudou)
- Permissões (câmera/galeria/arquivos) se o wrapper pedir

---

## 7. Roteiro executável (Capacitor + URL) — o que fazer na prática

### 7.1 Criar o projeto wrapper (recomendado em pasta separada)

Como este repositório não contém `ios/` e `android/`, o fluxo mais seguro é criar um projeto separado, por exemplo:

- `dttools-mobile/` (wrapper)

Esse wrapper:

- não precisa “compilar” seu Vite
- só abre a URL `https://www.dttools.app`

### 7.2 Configuração do Capacitor (valores finais)

Defina estes valores no wrapper:

- `appId`: `com.designthinkingtools.dttools`
- `appName`: `Design Thinking Tools`
- `server.url`: `https://www.dttools.app`

### 7.3 URLs obrigatórias (já existem no app web)

Como o DTTools já possui páginas no frontend, padronize as URLs públicas para usar nas lojas:

- Política de privacidade: `https://www.dttools.app/privacy-policy`
- Termos de uso: `https://www.dttools.app/terms`
- Suporte: `https://www.dttools.app/support`

### 7.4 Atenção: login social e regra da Apple

Se o app oferecer **login com Google** dentro do app iOS, a Apple pode exigir **Sign in with Apple** como opção equivalente.

Antes de enviar para review, escolha um caminho:

- manter somente login por email/senha no iOS, ou
- adicionar Sign in with Apple

### 7.5 Checklist de build e versionamento

Defina uma política simples de versões:

- `1.0.0` para lançamento inicial
- a cada envio de loja, incrementar:
  - iOS: `CFBundleVersion` (build number)
  - Android: `versionCode`

### 7.6 Apple App Store — roteiro de submissão

1) **Apple Developer / App Store Connect**
   - Criar o app com Bundle ID `com.designthinkingtools.dttools`
   - Definir categoria (ex.: Productivity / Business)

2) **Assinatura e perfil**
   - Certificate (Apple Distribution)
   - Provisioning Profile (App Store)

3) **Upload do build**
   - Gerar Archive no Xcode
   - Enviar via Xcode Organizer

4) **Listagem**
   - Use os textos de `app-store-descriptions-final.md`
   - Screenshots iPhone (e iPad se suportar)
   - URLs: privacidade/termos/suporte

5) **App Privacy**
   - Preencher com base no comportamento real do app (conta, projetos e anexos)

6) **Submeter para Review**
   - Garantir navegação, login e páginas legais acessíveis

### 7.7 Google Play — roteiro de submissão

1) **Play Console**
   - Criar app com package `com.designthinkingtools.dttools`

2) **App Signing**
   - Ativar Play App Signing
   - Guardar o keystore com segurança

3) **Upload AAB**
   - Subir primeiro em Internal testing
   - Depois Closed/Open testing
   - Por fim Production

4) **Store Listing**
   - Use `app-store-descriptions-final.md` e `marketing/app-stores/app-store-google.md`
   - Subir screenshots + feature graphic
   - Informar URLs (privacidade/termos/suporte)

5) **Data Safety**
   - Declarar dados coletados e práticas de segurança com base no app real

---

## 8. O que já está pronto no repo (reaproveitar)

- Textos multi-idioma: `app-store-descriptions-final.md`
- Rascunhos de listagem:
  - Apple: `marketing/app-stores/app-store-apple.md`
  - Google: `marketing/app-stores/app-store-google.md`


