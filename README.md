# Solutions ONE 🚀

Solutions ONE é um sistema completo de **gerenciamento de projetos, equipes e contratos**, desenvolvido como um MVP para **otimizar a organização, execução de tarefas e monitoramento de desempenho** dentro de times de trabalho. Com funcionalidades robustas, permite controle eficiente de acessos, autenticação segura, feedbacks internos, avaliações de clientes e integração com calendários.

## 📌 Objetivos
- **Facilitar o gerenciamento de projetos** e tarefas entre membros de uma equipe, garantindo um acompanhamento claro e estruturado.
- Implementar um **fluxo completo de contratos**, desde a formalização até a gestão de alterações.
- **Aprimorar a comunicação interna** entre colaboradores por meio de feedbacks e avaliações de desempenho.
- **Fornecer insights e métricas de produtividade** através de dashboards interativos.
- **Automatizar processos de autenticação e controle de acesso**, garantindo segurança e privacidade.
- **Registrar e monitorar a jornada de trabalho** com um sistema de ponto integrado.
- **Manter os usuários informados** com notificações e alertas relevantes sobre projetos e atividades.

# 📌 Histórias de Usuário

## 🏷 CRUD Usuários

### ✨ Descrição
Como **Administrador**, quero gerenciar usuários para controlar o acesso ao sistema.

### ✅ Critérios de Aceitação
- **Criar**: O administrador pode cadastrar um usuário com nome, e-mail e perfil de acesso.
- **Ler**: O administrador pode visualizar detalhes de um usuário.
- **Atualizar**: O administrador pode editar informações do usuário.
- **Excluir**: O administrador pode remover usuários.

---

## 📝 CRUD Contratos

### ✨ Descrição
Como **Gerente e Administrador**, quero gerenciar contratos para manter o controle sobre os acordos firmados.

### ✅ Critérios de Aceitação
- **Criar**: O gerente pode cadastrar um contrato informando cliente, datas e valor.
- **Ler**: O usuário pode visualizar detalhes de um contrato.
- **Atualizar**: O gerente pode editar informações do contrato.
- **Excluir**: O administrador e o gerente podem remover contratos.

---

## 📁 CRUD Projetos

### ✨ Descrição
Como **Gerente e Administrador**, quero gerenciar projetos para acompanhar seu andamento e responsáveis.

### ✅ Critérios de Aceitação
- **Criar**: O gerente pode cadastrar um projeto informando nome, datas e responsável.
- **Ler**: O usuário pode visualizar detalhes de um projeto.
- **Atualizar**: O gerente pode editar informações do projeto.
- **Excluir**: O administrador e o gerente podem remover projetos.

---

## 🔐 Autenticação

### ✨ Descrição
Como **Usuário**, quero autenticar-me no sistema para acessar minhas funcionalidades de forma segura.

### ✅ Critérios de Aceitação
- **Login**: O usuário pode acessar o sistema com e-mail e senha.
- **Logout**: O usuário pode encerrar sua sessão no sistema.
- **Recuperação**: O usuário pode recuperar sua senha por e-mail.

---

## 💬 Feedback entre Funcionários

### ✨ Descrição
Como **Funcionário**, quero fornecer e visualizar feedbacks para melhorar a comunicação interna.

### ✅ Critérios de Aceitação
- **Fornecer**: O funcionário pode enviar feedbacks para colegas (anônimo ou identificado).
- **Visualizar**: O funcionário pode ver os feedbacks recebidos.

---

## 🏆 Avaliação do Cliente

### ✨ Descrição
Como **Cliente**, quero avaliar os projetos para registrar minha satisfação.

### ✅ Critérios de Aceitação
- **Fornecer**: O cliente pode avaliar um projeto com base em qualidade e prazo.
- **Visualizar**: O gerente pode visualizar as avaliações dos clientes.

---

## 📊 Dashboard de Métricas

### ✨ Descrição
Como **Gerente**, quero visualizar métricas de desempenho para monitorar o rendimento da equipe.

### ✅ Critérios de Aceitação
- O gerente pode acessar um painel com métricas de desempenho dos funcionários.

---

## ⏳ Registrar Ponto

### ✨ Descrição
Como **Funcionário**, quero registrar meu ponto para controle de jornada de trabalho.

### ✅ Critérios de Aceitação
- **Entrada/Saída**: O funcionário pode registrar entrada e saída no sistema.
- **Histórico**: O funcionário pode visualizar seu histórico de pontos.
- **Gerente**: O gerente pode visualizar os registros de ponto dos funcionários.
- **Justificativa**: O funcionário pode justificar pontos ausentes ou incorretos.

---

## 🔔 Notificações/Alertas

### ✨ Descrição
Como **Usuário**, quero receber notificações sobre eventos do projeto para estar sempre atualizado.

### ✅ Critérios de Aceitação
- O usuário recebe alertas e notificações sobre eventos relevantes do projeto.

---

## 📅 Integração com Calendário

### ✨ Descrição
Como **Usuário**, quero integrar o sistema ao meu calendário pessoal para gerenciar compromissos.

### ✅ Critérios de Aceitação
- O usuário pode sincronizar o sistema com seu calendário pessoal.

# 👥 Membros e papeis
- **Allan:** Fullstack
- **Bernardo:** Fullstack
- **Bruno:** Fullstack
- **Eduardo:** Fullstack

# 🛠️ Tecnologias Utilizadas
- **Linguagem:** Typescript
- **Frontend:** React
- **Backend:** Node.js
- **Banco de Dados:** MySQL
- **ORM:** Prisma
- **Testes:** Jest
- **Gerenciamento de Versionamento:** Git/GitHub
