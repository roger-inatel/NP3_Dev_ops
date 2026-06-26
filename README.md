# Biblioteca NP3

Sistema de Biblioteca Simples criado para a NP3 da disciplina de DevOps e Testes.

O objetivo do projeto e demonstrar, de forma didatica, uma aplicacao com backend, frontend, banco de dados, testes automatizados, Docker, Docker Compose, Jenkins e notificacao por e-mail via MailHog.

## Objetivo

O sistema sera implementado de forma incremental. Nesta primeira versao, o repositorio contem apenas a estrutura inicial, arquivos base e configuracoes planejadas para desenvolvimento, testes e pipeline.

Funcionalidades planejadas:

- cadastrar livros;
- listar livros;
- cadastrar leitores ou usuarios;
- listar leitores ou usuarios;
- realizar emprestimo de livro;
- devolver livro;
- impedir emprestimo de livro ja emprestado;
- impedir emprestimo com livro ou usuario inexistente.

Regras de negocio planejadas:

- todo livro cadastrado comeca como disponivel;
- livro emprestado nao pode ser emprestado novamente;
- ao devolver um livro, ele volta a ficar disponivel;
- campos obrigatorios devem ser validados;
- operacoes invalidas devem retornar erro claro.

## Arquitetura planejada

```text
frontend -> backend -> database
jenkins  -> backend/frontend/docker/scripts
jenkins  -> mailhog
backend  -> mailhog
```

Containers previstos no `docker-compose.yml`:

- `frontend`: interface React com Vite.
- `backend`: API Node.js com Express.
- `database`: MySQL com volume persistente.
- `jenkins`: servidor de CI/CD executando o pipeline.
- `mailhog`: simulador de SMTP para validar notificacoes por e-mail.

Volumes previstos:

- `mysql_data`: persistencia dos dados do MySQL.
- `jenkins_home`: persistencia das configuracoes e jobs do Jenkins.

## Estrutura do repositorio

```text
biblioteca-np3/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── database/
│   │   └── app.js
│   ├── tests/
│   ├── Dockerfile
│   ├── package.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── jenkins/
│   └── Dockerfile
├── scripts/
│   └── send-email.js
├── docker-compose.yml
├── Jenkinsfile
├── README.md
├── .env.example
└── .gitignore
```

## Papel de cada pasta

- `backend/`: API da biblioteca, regras de negocio, acesso ao banco e testes.
- `backend/src/controllers/`: entrada das requisicoes HTTP.
- `backend/src/services/`: regras de negocio da biblioteca.
- `backend/src/repositories/`: acesso aos dados no MySQL.
- `backend/src/routes/`: definicao das rotas da API.
- `backend/src/database/`: conexao e scripts relacionados ao banco.
- `backend/tests/`: testes automatizados com Jest e Supertest.
- `frontend/`: interface web em React.
- `jenkins/`: imagem customizada do Jenkins para executar pipeline.
- `scripts/`: scripts auxiliares, como notificacao por e-mail.

## Como os containers se comunicam

- `frontend` acessa a API do `backend`.
- `backend` acessa o MySQL usando `DB_HOST=database`.
- `backend` pode enviar e-mails para `mailhog` usando `SMTP_HOST=mailhog`.
- `jenkins` executa testes, builds e scripts do projeto.
- `jenkins` envia notificacoes para `mailhog` usando variaveis de ambiente.

## Testes

Os testes do backend ficarao em `backend/tests/`.

Ferramentas previstas:

- Jest para executar testes.
- Supertest para testar endpoints HTTP.
- Cobertura minima planejada: 90%.

Comandos planejados:

```bash
cd backend
npm install
npm test
npm run test:coverage
```

## Pipeline

O pipeline fica no arquivo `Jenkinsfile`.

Estagios planejados:

- checkout do codigo;
- instalacao de dependencias do backend;
- execucao dos testes;
- geracao de cobertura;
- build da imagem Docker do backend;
- build do frontend;
- arquivamento de artefatos;
- notificacao por e-mail.

A notificacao usa `scripts/send-email.js` e depende da variavel `NOTIFY_EMAIL`. O e-mail nao deve ficar hardcoded no codigo.

## Variaveis de ambiente

Copie `.env.example` para `.env` antes de executar com Docker Compose.

Principais variaveis:

- `DATABASE_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `NOTIFY_EMAIL`
- `SMTP_HOST`
- `SMTP_PORT`

## Execucao planejada

```bash
docker compose up --build
```

Portas previstas:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Jenkins: `http://localhost:8081`
- MailHog: `http://localhost:8025`
- MySQL: `localhost:3306`

## Organizacao dos commits do grupo

- Integrante 1: backend, controllers, services, repositories e rotas.
- Integrante 2: testes com Jest/Supertest e cobertura.
- Integrante 3: frontend React, telas de cadastro e listagem.
- Integrante 4: Docker, Docker Compose, Jenkinsfile e MailHog.
- Todos: README, documentacao das decisoes e secao Uso de IA.

## Proximos passos

1. Implementar backend incrementalmente:
   - rotas de livros;
   - rotas de leitores;
   - rotas de emprestimos;
   - validacoes simples;
   - erros claros.

2. Implementar testes:
   - cadastro e listagem;
   - emprestimo e devolucao;
   - erros esperados;
   - cobertura minima de 90%.

3. Integrar banco:
   - criar conexao MySQL;
   - criar tabelas ou migrations simples;
   - persistir livros, leitores e emprestimos.

4. Evoluir Docker:
   - validar build do backend e frontend;
   - validar comunicacao entre containers;
   - manter volumes para MySQL e Jenkins.

5. Evoluir Jenkins:
   - rodar testes;
   - gerar cobertura;
   - arquivar artefatos;
   - simular envio de e-mail via MailHog;
   - preparar publicacao futura da imagem no Docker Hub.

## Uso de IA

A IA foi utilizada para auxiliar na estruturacao inicial do repositorio, organizacao das pastas, criacao dos arquivos base, definicao dos containers planejados e elaboracao da documentacao inicial.

O grupo deve revisar, entender e evoluir todo o codigo produzido. A IA nao substitui a implementacao, os testes, a validacao tecnica e a defesa oral dos integrantes.
