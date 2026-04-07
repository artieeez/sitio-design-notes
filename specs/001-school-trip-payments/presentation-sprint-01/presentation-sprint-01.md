# Sprint #1 — Apresentação da Proposta e Análise Contextual

**Projeto:** Controle de pagamentos e colaboração **agência–escola** em viagens escolares (turismo de pequeno/médio porte)  
**Duração sugerida:** ~10 minutos  
**Público:** professor e turma  

Este arquivo é **roteiro de conteúdo** para montar os slides em PDF. Não substitui a especificação em [`../spec.md`](../spec.md); resume a análise contextual para apresentação oral. A **visão de produto** abaixo (dois papéis, colaboração agência–escola) pode ser mais ampla que o recorte de **implementação** descrito na spec.

---

## 1. Problema, suposições e objetivos

### Problema

Empresas de turismo de **pequeno ou médio porte**, na prática, costumam ter uma **página de vendas** em alguma plataforma **no-code**, às vezes **integrada a um sistema de pagamentos** — mas **não têm um sistema** que:

- **mostre claramente o estado dos pagamentos** (quem já pagou, quem falta); e  
- **ofereça ferramentas de colaboração** entre a **agência** e as **escolas** para controlar o pagamento dos alunos.

**Isso é diferente** do cenário em que o **ciclo completo** de venda e cadastro é feito **só pela agência**: aqui o foco é **coordenação** e **visibilidade compartilhada** com a escola, não só fechar a venda online.

### Ideia da solução

Oferecer um sistema para **gerenciar viagens, passageiros e pagamentos**, **no escopo de cada cliente (escola)** — ou seja, dados e fluxos **organizados por escola**, com regras de negócio e interface pensadas para esse ecossistema.

### Dois tipos de usuários (visão)

| Papel | Responsabilidades |
|--------|-------------------|
| **Responsável pela agência** | Popular o sistema com **dados essenciais** (viagens, passageiros, estado de pagamentos conforme o produto permitir); **compartilhar um link de acesso** (ou convite) com o responsável da escola. |
| **Responsável pela escola** | Ter acesso a uma **lista atualizada** (idealmente em **tempo real** ou próximo disso) e, com base nela, **fazer o controle e a cobrança com os pais** dos alunos. |

**Nota de escopo do trabalho:** no produto completo, pressupõe-se **autenticação** e **integração com a plataforma de pagamentos** da agência — mas **isso fica fora do escopo** deste trabalho acadêmico (pode ser citado como evolução futura na apresentação).

### Suposições (alinhadas à especificação de apoio)

- O recorte de **implementação** em [`../spec.md`](../spec.md) pode focar no **lado da agência** (equipe interna); a **visão de IHC** acima orienta o desenho **no longo prazo** (dois públicos, colaboração).
- Valores em **BRL**, com **duas casas decimais**; **data de pagamento** é só **dia** (calendário), fuso **`America/Sao_Paulo`**.
- **Não** existe lista global de pagamentos: tudo é **no contexto da viagem**, a partir da **linha do passageiro** (menu por linha).
- Primeira versão voltada a **dashboard web** para operações; **exportação CSV / impressão dedicada** não são obrigatórios em v1.

### Objetivos

1. Permitir cadastro de **escola → viagem → passageiros** com regras claras (inativos, duplicados CPF/nome).
2. Permitir **registrar, consultar e corrigir pagamentos manuais** ligados a **um passageiro**, com histórico claro para auditoria.
3. Mostrar **pendente / quitado / indisponível** por passageiro, com distinção entre **quitado por pagamentos** e **“marcado como pago sem informação de pagamento”**.
4. Entregar **UX consistente**: barra lateral, rotas separadas lista vs. formulário, tabelas com busca/filtro/paginação (client-side aceitável em v1), breadcrumbs em `pt-BR`.

---

## 2. Trabalhos relacionados e estado da arte

### Como o problema é resolvido hoje (em geral)

| Abordagem | Vantagens | Limitações para este domínio |
|-----------|-----------|------------------------------|
| **Planilhas compartilhadas** | Baixo custo, familiar | Duplicidade de dados, pouca integridade (CPF, nomes), difícil ter “uma verdade” por viagem |
| **ERP / financeiro genérico** | Contabilidade forte | Pouco adaptado a **lista por viagem escolar** e a **status por passageiro** sem módulo sob medida |
| **CRM + cobrança** | Follow-up com cliente | Nem sempre modela **passageiro dentro de viagem** nem **pagamento manual fragmentado** |
| **Sistemas de turismo / reservas B2C** | E-commerce, vouchers | Foco em venda ao público; menos em **operação B2B escola** com **controle interno de quitação** |
| **Página no-code + gateway de pagamentos** | Presença online e cobrança | **Não** substitui visibilidade operacional nem **canal de colaboração** com a escola sobre quem falta pagar |

### Posicionamento da proposta

Um sistema que combina **dashboard operacional** (agência) com **visão futura** de **acesso pela escola** (lista compartilhada), centrado em:

- Hierarquia **escola → viagem → passageiro → pagamentos** (tudo no **escopo do cliente escola**).
- **Estado dos pagamentos** derivado (pendente/quitado) a partir de valores esperados e **registros**, com **exceções** explícitas (p.ex. marcação manual, remoção suave de passageiro) — detalhes em [`../spec.md`](../spec.md).
- Colaboração **agência ↔ escola**: a agência mantém a fonte da verdade; a escola **acompanha** e **age** junto às famílias (visão de produto; o escopo do trabalho pode se limitar a protótipos ou a um dos lados).

---

## 3. Modelo do usuário e personas

### Usuários-alvo (dois papéis)

1. **Lado agência** — quem **insere e mantém** dados operacionais (escolas, viagens, passageiros, pagamentos ou estados) e **compartilha acesso** com a escola. Precisa **ver rápido quem falta pagar** e **evitar erros** (duplicados, valores incoerentes).

2. **Lado escola** — quem **consulta** a lista **atualizada** e usa essa informação para **organizar a cobrança** com **pais e responsáveis** (ligações, reuniões, lembretes). Valoriza **simplicidade**, **confiança** nos dados e **sincronização** com o que a agência **registra**.

### Persona 1 — **Carla (Coordenadora na agência)**

- **Perfil:** 35 anos, **gerencia** várias escolas em paralelo; é quem **configura** viagens e **garante** que a escola recebe o link ou o acesso.
- **Objetivo:** Uma **fonte única confiável** por viagem e **compartilhamento claro** com o contato da escola.
- **Frustrações:** Planilhas desatualizadas; escola perguntando “quem falta?” com respostas diferentes das da agência.
- **Necessidades no produto:** Navegação clara, tabela com filtro e estado visível; fluxo simples para **compartilhar** ou **indicar** o acesso da escola.

### Persona 2 — **Ricardo (Operações / recepção de pagamentos na agência)**

- **Perfil:** **Registra** no sistema o que aconteceu na prática (transferência, dinheiro na loja, etc.).
- **Objetivo:** **Registro completo** e rápido sem repetir contexto (já está na viagem).
- **Frustrações:** Formulários longos ou seletores desnecessários.
- **Necessidades no produto:** Ações a partir da **linha do passageiro**; valor esperado pré-preenchido quando fizer sentido; histórico por aluno.

### Persona 3 — **Mariana (Responsável / coordenação na escola)**

- **Perfil:** Professora coordenadora ou secretaria escolar; **não** administra o sistema da agência, mas **depende** da lista para cobrar os pais a tempo.
- **Objetivo:** Ver **quem está pendente** e **quem já quitou**, alinhado com a agência, para **priorizar contatos** com responsáveis.
- **Frustrações:** Lista desatualizada; não saber se um aluno foi removido da viagem ou está só “pendente de pagamento”.
- **Necessidades no produto:** Tela **legível** (mobile ou desktop), **atualização** perceptível, estados **pendente / quitado** (e equivalentes) **sem jargão**; opcionalmente totais ou filtros simples.

*(Helena, supervisão na agência, pode ser uma quarta persona ou fundida na Carla se o tempo de apresentação for curto.)*

---

## 4. Modelo de tarefas — Análise Hierárquica de Tarefas (HTA)

Há **dois arquivos Mermaid** nesta pasta:

| Arquivo | Papel | Conteúdo em síntese |
|----------|--------|----------------------|
| [`hta-school-trip-payments.mmd`](hta-school-trip-payments.mmd) | **Responsável pela agência** | **1:** escola/viagem/passageiros + **link** para a escola · **2:** pagamentos por passageiro · **3:** acompanhar e corrigir. |
| [`hta-school-trip-payments-escola.mmd`](hta-school-trip-payments-escola.mmd) | **Responsável na escola** | **1:** abrir link e ver lista · **2:** cobrar responsáveis e falar com a agência se precisar. |

**Por que duas árvores?** Em HTA, **cada papel** costuma ter **objetivo global (0)** e **planos** diferentes. Misturar agência e escola num só diagrama confunde **a tarefa de cada um** e deixa os planos difíceis de ler. Duas HTAs (ou duas raízes) são uma abordagem **comum** em IHC quando há **dois usuários** com trabalho distinto.

- **Pré-visualização:** colar cada `.mmd` no [Mermaid Live Editor](https://mermaid.live) ou usar extensão Mermaid no editor.
- **Exportar PNG/SVG** (a partir de `presentation-sprint-01/`):

```bash
npx @mermaid-js/mermaid-cli -i hta-school-trip-payments.mmd -o hta-school-trip-payments.png
npx @mermaid-js/mermaid-cli -i hta-school-trip-payments-escola.mmd -o hta-school-trip-payments-escola.png
```

### Resumo textual dos planos (para os slides)

**Agência** — *Tarefa 0:* gerenciar os pagamentos da excursão. *Plano 0:* **1** monta base (escola, viagem, passageiros) e **link** para a escola; **2** e **3** voltam conforme a operação.

**Escola** — *Tarefa 0:* apoiar cobrança com dados da agência. *Plano 0:* **1** abrir link e ver lista · **2** cobrar responsáveis e alinhar com a agência se precisar.

**Subtarefas agência (resumo):**

1. Cadastrar escola, viagem e passageiros; **gerar link** para o responsável da escola.
2. **Atualizar pagamentos** por passageiro (inclui registrar, alterar e “pago sem informação”).
3. **Acompanhar** status, tratar exceções e **corrigir** dados.

**Subtarefas escola (resumo):** link → lista → cobrança (e contato com a agência quando necessário).

*(Detalhe e ligações entre nós: ver os dois `.mmd`.)*

---

## 5. Cenários de uso e exceções

### Cenário A — Feliz caminho: nova escola, viagem e primeiro passageiro

1. **Agência:** cria **escola** (opcionalmente com URL de landing para pré-preencher metadados).
2. Abre a **lista de viagens** dessa escola e cria **viagem** com valor esperado **padrão**.
3. Na **lista de passageiros** da viagem, adiciona passageiro; o estado passa a **pendente** se houver valor esperado e ainda não houver pagamentos.
4. **Registra** um **pagamento** pela linha do passageiro; quando a soma **≥** valor efetivo esperado, estado **quitado** por pagamentos.
5. **Colaboração (visão de produto):** a agência **compartilha o acesso** com a escola; a **Mariana** vê a mesma informação de estado e **fala com responsáveis** conforme a lista — sem depender de prints de tela ou planilhas paralelas.

### Cenário B — Pagamento parcial e novo pagamento

- Passageiro com soma **menor** que o esperado permanece **pendente**; a equipe **registra** pagamentos adicionais até atingir o limiar (regras de escala em BRL).

### Cenário C — Atalho operacional: “pago sem comprovante detalhado”

- A equipe usa a ação de **marcar como pago sem informação de pagamento**; a interface mostra texto equivalente a *“Marcado manualmente como pago sem informação de pagamento”* (`pt-BR`); ao **limpar** a marca, o estado recalcula com base nos pagamentos.

### Cenário D — Duplicados e validação

- **CPF** repetido na mesma viagem: **bloqueio**.
- **Nome completo** igual sem conflito de CPF: **aviso** + confirmação obrigatória.
- **CPF** inválido: **bloqueio** até corrigir ou limpar.

### Cenário E — Escola ou viagem inativada

- Deixam de aparecer nas listas **por padrão**; **não** é permitido criar nova viagem (escola inativa) ou novo passageiro (viagem inativa); dados existentes seguem consultáveis no contexto.

### Cenário F — Passageiro removido (soft-remove)

- **Deixa de aparecer** na lista **por padrão** e nos agregados **por padrão**; **os pagamentos continuam**; para novo pagamento é preciso **restaurar** o passageiro.

### Exceções / fora do escopo (mencionar no Q&A se necessário)

- **Autenticação** completa e **integração** com a **plataforma de pagamentos** da agência: **fora do escopo** deste trabalho (premissas de produto futuro).
- Conflitos de edição simultânea: **sem** detecção formal de “save obsoleto” em v1.
- Exportação CSV / relatório para impressão: **fora** de v1.
- Integração automática de pagamento no recorte da **spec** atual: **fora** de v1 (registros manuais ou estados espelhados).

---

## Sugestão de divisão de slides (≈10 min)

| # | Slide | Conteúdo |
|---|--------|----------|
| 1 | Título | Nome do projeto, equipe, Sprint #1 |
| 2 | Problema & objetivo | 1 frase problema + 3 bullets objetivos |
| 3 | Suposições & escopo | Dois papéis (agência + escola); auth/integração de pagamentos fora do trabalho; resto alinhado à spec |
| 4 | Estado da arte | Tabela resumo (incl. no-code + gateway vs. colaboração) |
| 5–6 | Personas | Carla e Ricardo (agência), Mariana (escola) |
| 7 | HTA | Dois diagramas simplificados (agência: base + link + pagamentos + acompanhar; escola: link → cobrar) |
| 8–9 | Cenários | Feliz caminho + 1 cenário de exceção (duplicados ou inativo) |
| 10 | Síntese | Objetivos de IHC cumpridos; próximos passos (p.ex. protótipos, avaliação com usuários) |

---

## Arquivos relacionados

| Arquivo | Descrição |
|----------|-----------|
| [`../spec.md`](../spec.md) | Especificação completa e requisitos |
| `hta-school-trip-payments.mmd` | HTA (Mermaid) — responsável pela **agência** (inclui link para escola) |
| `hta-school-trip-payments-escola.mmd` | HTA (Mermaid) — responsável pela **escola** |
