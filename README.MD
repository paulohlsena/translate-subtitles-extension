
# 🎬 Subtitle Translator

Uma extensão para Chrome que traduz automaticamente as legendas visíveis ao pausar vídeos em plataformas de streaming como **HBO Max** e **Netflix**, exibindo a tradução em um popup centralizado na tela.

---

## ✨ Funcionalidades

- 🎥 Detecta vídeos automaticamente.
- 📋 Captura a legenda visível ao pausar.
- 🌍 Traduz automaticamente do **inglês para o português** (via [MyMemory API](https://mymemory.translated.net/)).
- 💬 Exibe a legenda traduzida em um popup discreto.
- 🖥️ Detecta tela cheia e oculta o popup automaticamente ao sair.

---

## ✅ Plataformas compatíveis

- [x] HBO Max
- [x] Netflix
- [ ] (em breve) Prime Video, Disney+, YouTube...

---

## 🧩 Como instalar

1. Baixe o projeto como `.zip` ou clone via Git:

   ```bash
   git clone https://github.com/seu-usuario/subtitle-translator.git
   ```

2. No Chrome, vá para `chrome://extensions/`.

3. Ative o **Modo de desenvolvedor** (canto superior direito).

4. Clique em **"Carregar sem compactação"**.

5. Selecione a pasta onde você salvou o projeto.

---

## ▶️ Como usar

1. Acesse o site do HBO Max ou Netflix e inicie um vídeo. (Assim que iniciar o vídeo recarregue a página)
2. Quando quiser traduzir a legenda atual, **pause o vídeo**.
3. A tradução será exibida automaticamente no centro da tela.
4. Ao retomar a reprodução, o popup desaparece.

---

## Importante: Por ser um MVP, a API de tradução é gratuita e pode apresentar instabilidades.

## ⚙️ Estrutura do Projeto

```bash
subtitle-translator/
│
├── content.js       # Script principal injetado nas páginas
├── style.css        # Estilo do popup de tradução
├── manifest.json    # Configuração da extensão
└── README.md        # Este documento
```

---

## 🌐 Traduções e Idiomas

Atualmente, a extensão traduz apenas **do inglês para o português**.  
Você pode mudar o idioma editando a linha no arquivo `content.js`:

```js
const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt`;
```

Substitua `en|pt` por outro par de idiomas suportado (ex: `es|fr` para espanhol → francês).

---

## 🛠️ Requisitos e Permissões

- Permissões:
  - `activeTab` (para acessar a aba ativa)
  - `scripting` (para injetar o conteúdo)
- Compatível com `manifest_version: 3`

---
