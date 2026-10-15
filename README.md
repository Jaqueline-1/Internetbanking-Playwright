# 🏦 Internet Banking — Testes Automatizados com Playwright

Projeto de automação de testes desenvolvido com **Playwright e TypeScript**, com foco na validação de funcionalidades bancárias, testes End-to-End (E2E) e simulação de falhas de rede (Network Mocking).

O projeto faz parte dos meus estudos práticos em Quality Assurance (QA), com o objetivo de desenvolver habilidades em automação, análise de cenários e validação de regras de negócio.

## 🛠️ Tecnologias utilizadas

- Playwright
- TypeScript
- Node.js
- Git e GitHub
- Visual Studio Code
- GitHub Actions (CI)

## 🎯 Objetivos do projeto

- Automatizar cenários de testes funcionais.
- Validar fluxos completos de autenticação e transferência.
- Desenvolver testes positivos e negativos.
- Simular diferentes respostas HTTP.
- Verificar o comportamento da aplicação diante de falhas.
- Aplicar boas práticas de organização e manutenção de testes.

## 🧪 Aplicações utilizadas

### 1. TrustBank — Internet Banking

Aplicação utilizada para praticar testes funcionais e End-to-End.

🔗 https://www.practiceqaautomation.com/apps/bank

**Cenários trabalhados:**

- Login com autenticação em duas etapas.
- Login com credenciais inválidas.
- Validação de perguntas de segurança.
- Bloqueio após tentativas incorretas.
- Validação de acesso ao dashboard.
- Transferências bancárias.
- Confirmação de operações por OTP.
- Validação de regras de negócio.

### 2. Network Mocking

Laboratório utilizado para interceptar requisições e simular diferentes comportamentos do servidor.

🔗 https://www.practiceqaautomation.com/dynamic/network-mocking

**Cenários trabalhados:**

| ID | Cenário |
|---|---|
| NM-01 | Erro HTTP 500 e recuperação |
| NM-02 | Resposta lenta e Loading State |
| NM-03 | Lista de produtos vazia |
| NM-04 | Respostas com dados personalizados |
| NM-05 | Falha de conexão |
| NM-06 | Timeout |
| NM-07 | Validação de requisições HTTP |
| NM-08 | Modificação de respostas reais |
| NM-09 | Status HTTP 401 e 429 |
| NM-10 | Dados JSON inválidos |

## 🔍 Técnicas de automação

Durante o desenvolvimento, foram utilizadas técnicas como:

**Testes E2E (End-to-End)**

Validação de fluxos completos do usuário, desde a autenticação até a execução de operações bancárias.

**Network Mocking**

Interceptação e manipulação de requisições HTTP utilizando `page.route()`.

**Assertions**

Validação dos resultados esperados utilizando `expect()`.

**Testes negativos**

Verificação do comportamento da aplicação diante de informações inválidas, falhas e situações inesperadas.

**Test Steps**

Organização das etapas dos testes utilizando `test.step()`, facilitando a análise dos resultados.

## 📂 Estrutura do projeto

```text
playwright-network-lab/
│
├── tests/
│   ├── bank.spec.ts
│   ├── trustbank-e2e.spec.ts
│   └── network-mocking.spec.ts
│
├── playwright.config.ts
├── package.json
├── package-lock.json
└── README.md
```

## ⚙️ Como executar os testes

### 1. Clonar o repositório

```bash
git clone https://github.com/Jaqueline-1/Internetbanking-Playwright.git
```

### 2. Acessar a pasta

```bash
cd Internetbanking-Playwright
```

### 3. Instalar as dependências

```bash
npm ci
```

### 4. Instalar os navegadores

```bash
npx playwright install
```

### 5. Executar os testes

```bash
npx playwright test
```

### Executar somente no Chromium

```bash
npx playwright test --project=chromium
```

### Executar os testes com interface visual

```bash
npx playwright test --ui
```

### Executar somente os testes de Network Mocking

```bash
npx playwright test tests/network-mocking.spec.ts
```

### Visualizar o relatório de testes

```bash
npx playwright show-report
```

## 📊 Relatórios

O Playwright permite gerar relatórios de execução contendo informações sobre os testes realizados.

Esses relatórios auxiliam na identificação de falhas e na investigação dos resultados.

## 🚧 Status do projeto

**Em desenvolvimento.**

Os cenários estão sendo implementados, executados e revisados progressivamente.

As próximas etapas incluem:

- Finalizar a validação dos testes E2E.
- Revisar os cenários de Network Mocking.
- Melhorar a reutilização de código.
- Consolidar as evidências de execução.
- Revisar a integração contínua com GitHub Actions.

## 👩‍💻 Autora

**Jaqueline Andrade**

Estudante de Engenharia de Software, com foco em Quality Assurance (QA) e automação de testes.

Este projeto integra meu portfólio de estudos e desenvolvimento profissional na área de Qualidade de Software.

🔗 **GitHub:** https://github.com/Jaqueline-1
