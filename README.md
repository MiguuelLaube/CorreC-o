# 🐾 CorrenteCão — Plataforma de Adoção e Apoio Animal

> **CorrenteCão** é uma plataforma web moderna e responsiva dedicada a conectar ONGs, abrigos independentes e futuros tutores responsáveis, facilitando a adoção de animais, lares temporários e a arrecadação de doações.

---

## 📋 Sumário
- [Requisitos Prévios](#-requisitos-prévios)
- [Passo a Passo de Instalação e Execução](#-passo-a-passo-de-instalação-e-execução)
  - [Método 1: Execução com 2 Cliques (Windows)](#método-1-execução-rápida-com-2-cliques-windows)
  - [Método 2: Execução pelo Terminal (VS Code, CMD ou PowerShell)](#método-2-execução-pelo-terminal-recomendado-para-desenvolvedores)
- [⚠️ Atenção: Por que não abrir o index.html diretamente?](#️-atenção-por-que-não-abrir-o-indexhtml-diretamente)
- [🚀 Funcionalidades Principais](#-funcionalidades-principais)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📂 Estrutura de Arquivos](#-estrutura-de-arquivos)
- [🌐 Como Publicar no GitHub Pages](#-como-publicar-no-github-pages)
- [📄 Licença](#-licença)

---

## 📌 Requisitos Prévios

Antes de começar, certifique-se de ter instalado em seu computador:
1. **[Node.js](https://nodejs.org/)** (versão 18 ou superior LTS recomendada) — *o instalador do Node.js já inclui o gerenciador `npm`*.
2. **Git** (opcional, caso vá clonar via repositório).
3. Um navegador moderno (Chrome, Brave, Edge, Firefox, etc.).

> **Como verificar se o Node.js está instalado?**  
> Abra o Prompt de Comando (CMD) ou PowerShell e digite:
> ```bash
> node -v
> npm -v
> ```

---

## 🚀 Passo a Passo de Instalação e Execução

### Método 1: Execução Rápida com 2 Cliques (Windows)

1. Abra a pasta do projeto no Windows Explorer.
2. Dê um duplo clique no arquivo:
   ```text
   iniciar-projeto.bat
   ```
3. O script irá:
   - Verificar se as dependências estão instaladas (executa `npm install` se necessário);
   - Iniciar o servidor local Vite;
   - Abrir automaticamente o navegador no endereço **`http://localhost:3000`**.

---

### Método 2: Execução pelo Terminal (Recomendado para Desenvolvedores)

#### 1. Clonar ou Acessar a Pasta do Projeto
Se estiver clonando do GitHub:
```bash
git clone https://github.com/SEU-USUARIO/correntecao.git
cd correntecao
```
*Ou simplesmente abra a pasta do projeto no seu editor de código (como o VS Code).*

#### 2. Instalar as Dependências
Execute no terminal dentro da pasta do projeto:
```bash
npm install
```
> Isso criará a pasta `node_modules` com todas as dependências necessárias (`React 19`, `Vite`, `Tailwind CSS`, `Lucide React`, `Motion`, etc.).

#### 3. Iniciar o Servidor de Desenvolvimento
Execute:
```bash
npm run dev
```

#### 4. Acessar a Aplicação
Após iniciar o servidor, abra seu navegador e acesse:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## ⚠️ Atenção: Por que não abrir o `index.html` diretamente?

Se você der dois cliques no arquivo `index.html` diretamente no Windows, a página ficará **em branco** e exibirá erros de CORS no console (`file:///C:/src/main.tsx`).

**Motivo:**  
O CorrenteCão utiliza **React 19**, **TypeScript (`.tsx`)** e **Vite**. Os navegadores não executam TypeScript/JSX nativamente nem carregam módulos locais via protocolo `file://`. Por isso, a aplicação **sempre deve ser acessada através do servidor local** (`http://localhost:3000`).

---

## 📦 Comandos Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm install` | Instala todas as dependências do projeto |
| `npm run dev` | Inicia o servidor local de desenvolvimento na porta 3000 |
| `npm run build` | Compila e otimiza a aplicação para produção (gera pasta `dist/`) |
| `npm run preview` | Executa localmente o build de produção gerado |
| `npm run lint` | Executa a checagem de tipos com TypeScript |

---

## 🐶 Funcionalidades Principais

- 🐕 **Vitrine de Adoção Inteligente**: Filtros dinâmicos por espécie (cães e gatos), porte, sexo, faixa etária e busca textual em tempo real.
- 📋 **Perfil Detalhado do Pet**: Galeria de fotos, histórico de resgate, status de vacinação/castração e formulário de interesse.
- 🤝 **Carrossel de Parceiros Interativo**: Cartões tridimensionais com benefícios exclusivos e cupons.
- 🏡 **Acolhimento Temporário (Lar Temporário)**: Formulário completo de voluntariado e triagem.
- 🏢 **Diretório de ONGs & Protetores**: Listagem de instituições parceiras com dados de contato, redes sociais e chave PIX.
- 📊 **Painel de Gestão para ONGs**: Área administrativa para gerenciar animais, solicitações de adoção e lares temporários.
- 💖 **Apoio e Doações Instantâneas**: Modal com QR Code e chave PIX "copia e cola".

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animações**: [Motion](https://motion.dev/)
- **Ícones**: [Lucide React](https://lucide.dev/) & [Google Material Symbols](https://fonts.google.com/icons)

---

## 📂 Estrutura de Arquivos

```text
correntecao/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automação de deploy para o GitHub Pages
├── assets/                     # Recursos visuais e mídias
├── src/
│   ├── components/             # Componentes modulares da interface
│   │   ├── AboutView.tsx       # Página institucional Sobre Nós
│   │   ├── AdoptionView.tsx    # Vitrine de adoção e filtros
│   │   ├── Footer.tsx          # Rodapé institucional
│   │   ├── FosterFormView.tsx  # Formulário de Lar Temporário
│   │   ├── Modals.tsx          # Modais de adoção, PIX, login e filtros
│   │   ├── Navbar.tsx          # Barra de navegação responsiva
│   │   ├── OngDashboardView.tsx# Painel administrativo da ONG
│   │   ├── OngsView.tsx        # Diretório de ONGs parceiras
│   │   └── PetDetailView.tsx   # Perfil completo do pet
│   ├── data/
│   │   └── initialData.ts      # Dados mockados iniciais de pets e ONGs
│   ├── App.tsx                 # Componente raiz e gerenciador de estado
│   ├── index.css               # Estilos globais e tokens Tailwind
│   ├── main.tsx                # Ponto de entrada React
│   └── types.ts                # Definições de tipos TypeScript
├── iniciar-projeto.bat         # Atalho de execução rápida para Windows
├── index.html                  # Template HTML base
├── package.json                # Dependências e scripts npm
├── tsconfig.json               # Configurações do compilador TypeScript
└── vite.config.ts              # Configuração do Vite
```

---

## 🌐 Como Publicar no GitHub Pages

O projeto já está configurado com `base: './'` no [vite.config.ts](file:///c:/Users/miguu/OneDrive/Desktop/correntecão/vite.config.ts) e possui uma automação pronta em `.github/workflows/deploy.yml`.

1. Suba o código para o seu repositório no GitHub na branch `main`.
2. Acesse a aba **Settings** > **Pages** do repositório no GitHub.
3. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
4. A automação construirá e publicará o site automaticamente a cada commit/push.

---

## 📄 Licença

Este projeto é disponibilizado sob a licença [MIT](https://opensource.org/licenses/MIT).
