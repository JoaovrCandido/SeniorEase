# 🧓 SeniorEase

> Um "micro-Notion" desenhado para a terceira idade. Focado em acessibilidade extrema, usabilidade intuitiva e engenharia de software robusta.

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-yellow?logo=vitest)](https://vitest.dev/)
[![Next.js](https://img.shields.io/badge/Built_with-Next.js-black?logo=next.js)](https://nextjs.org/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions_%26_Vercel-success)](#)

O **SeniorEase** é uma aplicação de anotações e gestão pessoal que resolve o problema da exclusão digital. Interfaces modernas (como o Notion) são frequentemente esmagadoras para idosos. Esta aplicação simplifica a experiência através de tipografia adaptável, comandos de voz e alto contraste, sem sacrificar a flexibilidade de um sistema baseado em blocos.

---

## ✨ Funcionalidades Principais

*   **Sistema de Blocos Flexível:** Crie cadernos compostos por Títulos, Parágrafos, Tarefas (To-Do), Reuniões (com validação automática de URLs) e Lembretes.
*   **Acessibilidade Nativa (A11y):**
    *   Modo de Navegação Simples (Sênior) vs Avançado.
    *   Ajustes de contraste, espaçamento e tamanho de fonte em tempo real.
    *   Ditado por voz nativo (Web Speech API) para inserção de texto.
    *   Leitura em voz alta (Text-to-Speech) de qualquer anotação.
*   **Offline-First & Privacidade:** Os dados nunca saem do dispositivo. Armazenamento persistente no `localStorage` do navegador com reidratação inteligente de datas.
*   **Onboarding Interativo:** Uma *Tour* guiada e narrada que ensina o utilizador a interagir com a interface (desativada automaticamente no Modo Avançado).

---

## 🏗️ Arquitetura e Engenharia

Este projeto foi construído com foco rigoroso em boas práticas de engenharia de software, utilizando **Clean Architecture** para separar as regras de negócio da interface visual.

### Princípios Técnicos

1.  **TypeScript Strict (Zero `any`):** Toda a base de código é estritamente tipada. Não existem fugas de tipagem (Type Assertions inseguras ou `any`), garantindo previsibilidade em tempo de compilação.
2.  **Separação de Preocupações:**
    *   **Domain:** Entidades puras e Interfaces (Contratos).
    *   **Application (Use Cases):** Regras de negócio isoladas (ex: lógica de fusão de dados, validações de deleção lógica - *Soft Delete*).
    *   **Infrastructure:** Implementação de repositórios e serviços externos (Manipulação de APIs nativas do browser como `SpeechRecognition` e `Notification`).
    *   **Presentation:** Componentes React, Hooks customizados e Context API.

---

## 🧪 Cultura de Testes

O projeto possui uma suite de testes unitários abrangente utilizando **Vitest** e **React Testing Library**, garantindo que as regras de negócio e a interface nunca quebram durante refatorações.

*   **Testes de Casos de Uso:** Validação de toda a lógica matemática e manipulação de estado.
*   **Testes de Repositório:** Simulação de cenários de persistência e recuperação de dados, incluindo resiliência contra JSON corrompido e execução SSR (Server-Side Rendering).
*   **Testes de Serviços (Stubs):** Mock completo de APIs do navegador (Microfone, Voz, Notificações do SO).
*   **Testes de Componentes Visuais:** Validação de renderização, regras de formulários (validação de datas no passado, injeção de `https://`) e interações de hardware (teclado e atalhos).

---

## 🚀 Como Executar Localmente

**Pré-requisitos:** Node.js (v18+) e npm instalados.

1. Clone o repositório:
```bash
git clone [https://github.com/seu-usuario/seniorease-app.git](https://github.com/seu-usuario/seniorease-app.git)
```

2. Entre na pasta e instale as dependências:
```bash
cd seniorease-app
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Para executar a suite de testes:
```bash
npm run test
```
---

## ⚙️ CI/CD
O projeto conta com um pipeline de Integração e Entrega Contínua automatizado:

*   **GitHub Actions (CI):** A cada Push ou Pull Request, a pipeline verifica a tipagem (tsc --noEmit) e executa a suite completa do Vitest.

*   **Vercel (CD):** Deploy automático para produção (branch main) e geração de Preview Links para Pull Requests que passam nos testes.
