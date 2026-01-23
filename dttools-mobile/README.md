# dttools-mobile (Capacitor Wrapper)

Wrapper mobile do **Design Thinking Tools** (DTTools) usando **Capacitor**, configurado para abrir:

- https://www.dttools.app

## Identificadores

- iOS Bundle ID: `com.designthinkingtools.dttools`
- Android package name: `com.designthinkingtools.dttools`

## Como usar

1) Instalar dependências

```bash
npm install
```

2) Adicionar plataformas

```bash
npx cap add ios
npx cap add android
```

3) Sincronizar

```bash
npx cap sync
```

4) Abrir no IDE nativo

```bash
npx cap open ios
npx cap open android
```

## Observações

- Este wrapper abre a URL remota (não embarca o build do Vite).
- Para iOS, se houver login com Google no app, a Apple pode exigir também **Sign in with Apple**.
