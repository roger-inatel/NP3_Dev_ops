# Biblioteca NP3

Sistema de Biblioteca Simples criado para a NP3 da disciplina de DevOps e Testes.

O objetivo do projeto e demonstrar, de forma didatica, uma aplicacao com backend, frontend, banco de dados, testes automatizados, Docker, Docker Compose, Jenkins e notificacao por e-mail via MailHog.

## Objetivo

O sistema implementa uma API simples para controle de biblioteca, com foco em demonstrar praticas de DevOps e QA em um projeto pequeno e facil de defender.

Funcionalidades do backend:

- cadastrar livros;
- listar livros;
- cadastrar leitores ou usuarios;
- listar leitores ou usuarios;
- realizar emprestimo de livro;
- devolver livro;
- impedir emprestimo de livro ja emprestado;
- impedir emprestimo com livro ou usuario inexistente.

Regras de negocio:

- todo livro cadastrado comeca como disponivel;
- livro emprestado nao pode ser emprestado novamente;
- ao devolver um livro, ele volta a ficar disponivel;
- campos obrigatorios sao validados;
- operacoes invalidas retornam erro claro em JSON.

## Arquitetura

```text
frontend -> backend -> database
jenkins  -> backend/frontend/docker/scripts
jenkins  -> mailhog
backend  -> mailhog
```

Containers do `docker-compose.yml`:

- `frontend`: interface React com Vite, construida localmente pelo `frontend/Dockerfile`.
- `backend`: API Node.js com Express, usando imagem publicada no Docker Hub.
- `database`: MySQL com volume persistente.
- `jenkins`: servidor de CI/CD executando o pipeline, construido pelo `jenkins/Dockerfile`.
- `mailhog`: simulador de SMTP para validar notificacoes por e-mail.

Volumes:

- `mysql_data`: persistencia dos dados do MySQL.
- `jenkins_home`: persistencia das configuracoes e jobs do Jenkins.

Rede:

- `biblioteca_net`: rede bridge usada para comunicacao entre containers.

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

## Endpoints principais

- `GET /health`
- `POST /books`
- `GET /books`
- `POST /readers`
- `GET /readers`
- `POST /loans`
- `GET /loans`
- `POST /loans/:id/return`

## Como os containers se comunicam

- `frontend` fica configurado para acessar a API do `backend`.
- `backend` acessa o MySQL usando `DB_HOST=database`.
- `backend` pode enviar e-mails para `mailhog` usando `SMTP_HOST=mailhog`.
- `jenkins` executa testes, builds e scripts do projeto.
- `jenkins` envia notificacoes para `mailhog` usando variaveis de ambiente.

## Testes

Os testes do backend ficam em `backend/tests/`.

Ferramentas previstas:

- Jest para executar testes.
- Supertest para testar endpoints HTTP.
- Cobertura minima configurada: 90%.

Comandos planejados:

```bash
cd backend
npm install
npm test
npm run test:coverage
```

Na ultima validacao local, os testes passaram com 31 testes e cobertura global de 100% sobre os arquivos cobertos.

## Pipeline

O pipeline fica no arquivo `Jenkinsfile`.

Estagios planejados:

- checkout do codigo;
- instalacao de dependencias de notificacao;
- instalacao de dependencias do backend;
- execucao dos testes;
- geracao de cobertura;
- build e push da imagem Docker do backend;
- build do frontend;
- arquivamento de artefatos;
- notificacao por e-mail.

A notificacao usa `scripts/send-email.js` e depende da variavel `NOTIFY_EMAIL`. O e-mail nao deve ficar hardcoded no codigo.

Imagem do backend publicada no Docker Hub:

```text
sn4r0/biblioteca-np3-backend:latest
```

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
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `MAIL_FROM`

Para simular e-mail com MailHog rodando no Docker e executar o script direto no PowerShell:

```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM=jenkins@biblioteca-np3.local
```

Quando o envio acontece dentro da rede Docker, por exemplo a partir do Jenkins:

```env
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM=jenkins@biblioteca-np3.local
```

Para enviar e-mail real pelo Gmail, use uma senha de app do Google e configure:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app
MAIL_FROM=seu-email@gmail.com
NOTIFY_EMAIL=email-destino@gmail.com
```

Nunca coloque `.env` no Git. Senhas e credenciais devem ficar apenas em variaveis de ambiente locais ou nas credenciais do Jenkins.

## Execucao planejada

```bash
docker compose up -d --build
```

Portas atuais:

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173`
- Jenkins: `http://localhost:8082`
- MailHog: `http://localhost:8025`
- MySQL: `localhost:3307`

Para garantir que o backend publicado no Docker Hub seja atualizado localmente:

```bash
docker compose pull backend
docker compose up -d --build
```

## Organizacao dos commits do grupo

- Roger e Igor: estrutura inicial, Docker, Docker Compose, Jenkinsfile, MailHog, SMTP, Docker Hub e documentacao de DevOps.
- Joao Paulo: API do backend, banco MySQL, livros, leitores, emprestimos e devolucao.
- Fabio: testes automatizados com Jest/Supertest e cobertura minima de 90%.
- Todos: revisao, documentacao, commits relevantes e entendimento para defesa em Q&A.

## Status e pontos de defesa

- Backend funcional com livros, leitores, emprestimos e devolucao.
- Testes automatizados com cobertura minima configurada em 90%.
- Docker Compose com 5 containers e comunicacao entre servicos.
- Volume persistente para MySQL e volume do Jenkins.
- Backend publicado no Docker Hub e referenciado pelo Compose.
- Jenkinsfile declarativo com teste, build, push, artefatos e notificacao.
- Notificacao por e-mail com variaveis de ambiente, sem destinatario hardcoded.
- MailHog usado para simulacao local de e-mail e Gmail SMTP usado apenas para teste real controlado.

## Uso de IA

O grupo utilizou IA de forma transparente como apoio ao desenvolvimento, revisao e explicacao do projeto. A IA nao substituiu a responsabilidade do grupo: o codigo foi revisado, ajustado, testado e versionado pelos integrantes.

Modelos e ferramentas utilizadas:

- ChatGPT/Codex: utilizado como apoio tecnico durante o planejamento, estruturacao, revisao e depuracao do projeto, principalmente nas partes de Docker, Docker Compose, Jenkinsfile, SMTP/MailHog, Docker Hub, Git e documentacao.

Principais usos da IA:

- planejar a estrutura inicial do repositorio;
- revisar e discutir decisoes de infraestrutura como portas, imagens, containers, volumes e rede Docker;
- explicar Dockerfile, Docker Compose, Jenkinsfile, MailHog, SMTP e Docker Hub;
- apoiar a criacao e revisao de `README.md`, `.env.example`, `docker-compose.yml`, `Jenkinsfile` e `scripts/send-email.js`;
- ajudar no diagnostico de erros de Docker Desktop, `index.lock`, pull/push Git e SMTP;
- revisar a divisao de tarefas do grupo e preparar respostas para a defesa;
- orientar a implementacao incremental da API e dos testes.

Exemplos reais de prompts usados ( roger ):

1. Prompt: "Quero que voce me ajude a iniciar a estrutura de um projeto academico para a NP3 da disciplina de DevOps e Testes. O projeto sera um Sistema de Biblioteca Simples. Neste primeiro momento, nao quero que voce implemente o sistema inteiro, quero apenas que estruture corretamente o repositorio, crie as pastas principais, arquivos base e deixe o projeto preparado para desenvolvimento incremental."
   - Resposta aceita: criacao da base do projeto com backend, frontend, Docker, Compose, Jenkinsfile, MailHog, `.env.example`, `.gitignore` e README inicial.
   - Ajustes feitos pelo grupo: escolha de MySQL, separacao dos commits, evolucao posterior da API, publicacao da imagem do backend no Docker Hub e refinamento do pipeline.

2. Prompt: "chat quero entender melhor a estrutura de DevOps do projeto, entendendo como cada imagem sobe e simula o ambiente. Pode comecar me explicando o Dockerfile do backend? Quero confirmar se a API Express deve escutar na porta interna do container, que hoje e `3000`, enquanto a porta que meu PC acessa e definida no Docker Compose pelo mapeamento `3001:3000`. Ou seja, se eu quiser mudar a porta da API dentro do container eu altero `PORT`, mas se eu quiser mudar a porta local eu altero apenas o lado esquerdo de `ports`, correto?"
   - Resposta aceita: diferenca entre porta interna da API no container, porta publicada no host, `EXPOSE`, `ports` no Compose e variavel `PORT`.
   - Ajustes feitos pelo grupo: padronizacao da API Express escutando em `3000` dentro do container, backend acessivel no host por `3001`, MySQL em `3307:3306`, Jenkins em `8082:8080` e atualizacao da documentacao para explicar essas escolhas.

3. Prompt: "No Docker Compose, o backend usa `image: sn4r0/biblioteca-np3-backend:latest`, porque a imagem dele e buildada e publicada no Docker Hub pelo pipeline Jenkins definido no Jenkinsfile. Ja o frontend usa `build: ./frontend`, entao a imagem dele e construida localmente pelo Dockerfile. Minha duvida e: como o frontend esta preparado para consumir a API do backend, essa dependencia em tempo de execucao afeta o build da imagem do frontend, ou o build da imagem e independente e a comunicacao so acontece depois que os containers sobem?"
   - Resposta aceita: entendimento de que build e runtime sao fases diferentes. O frontend e buildado localmente pelo Dockerfile independentemente da imagem do backend; a relacao com o backend acontece em tempo de execucao, quando a interface passa a chamar a API.
   - Ajustes feitos pelo grupo: defesa da arquitetura com backend vindo do Docker Hub, frontend construido localmente, MySQL usando `mysql:8.0`, MailHog usando `mailhog/mailhog:v1.0.1` e Jenkins construido pelo Dockerfile local.
   
4. Prompt: "Uma vez que a imagem do backend ja foi publicada no Docker Hub, quando eu dou `docker compose up --build`, o backend nao necessariamente baixa uma imagem nova. Para atualizar a imagem local, preciso rodar `docker compose pull backend`, correto? E o frontend fica apenas configurado para acessar a API do backend em tempo de execucao?"
   - Resposta aceita: correcao do entendimento sobre build versus runtime: `--build` constroi servicos com `build:`, enquanto o backend com `image:` precisa de `docker compose pull backend` para garantir imagem atualizada.
   - Ajustes feitos pelo grupo: uso do fluxo `docker compose pull backend` seguido de `docker compose up -d --build`, e explicacao de que o frontend nao depende da imagem do backend para ser construido; ele apenas fica configurado para acessar a API em tempo de execucao.

5. Prompt: "Quando quero simular um email utilizando o MailHog, tenho que colocar `SMTP_HOST=localhost`; com `SMTP_HOST=mailhog` da erro `getaddrinfo ENOTFOUND mailhog`."
   - Resposta aceita: diferenca entre executar o script fora da rede Docker e executar dentro de um container.
   - Ajustes feitos pelo grupo: documentacao de dois cenarios SMTP: `SMTP_HOST=localhost` para teste no PowerShell acessando a porta publicada do MailHog, e `SMTP_HOST=mailhog` para execucao dentro do Jenkins/container na rede Docker.

Respostas ajustadas ou descartadas:

- A ideia de usar imagem do Jenkins publicada no Docker Hub foi testada, mas apresentou incompatibilidade de arquitetura em `linux/amd64`. Para manter reproducibilidade local, o Compose permaneceu usando build local do `jenkins/Dockerfile`.
- Algumas sugestoes iniciais eram apenas placeholders e foram substituidas por implementacoes reais de API, testes e pipeline.
- Nenhuma senha, token, e-mail sensivel ou credencial foi aceita como conteudo versionado.

Dinamica de uso:

- A IA foi usada em pair programming com os integrantes durante planejamento, implementacao incremental, explicacao de conceitos e debugging.
- As sugestoes foram revisadas antes de entrar no repositorio.
- O grupo usou commits separados para evidenciar contribuicoes individuais e facilitar a defesa.

O que nao foi feito por IA:

- execucao real dos comandos no ambiente dos integrantes;
- configuracao de credenciais no Jenkins e Docker Hub;
- criacao de senha de app no Google;
- validacao final do pipeline no Jenkins;
- decisao final sobre arquitetura aceita pelo grupo;
- defesa oral e entendimento tecnico dos arquivos.

O uso de IA foi documentado porque o projeto exige transparencia. O grupo entende que a avaliacao considera nao apenas o resultado gerado, mas a capacidade de explicar, ajustar e defender cada decisao tecnica.
