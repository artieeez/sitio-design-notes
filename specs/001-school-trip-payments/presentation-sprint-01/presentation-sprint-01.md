# Sprint #1 — Apresentação da Proposta e Análise Contextual

**Projeto:** Controlo de pagamentos e colaboração **agência–escola** em viagens escolares (turismo de pequeno/médio porte)  
**Duração sugerida:** ~10 minutos  
**Público:** professor e turma  

Este ficheiro é **roteiro de conteúdo** para montar os slides em PDF. Não substitui a especificação em [`../spec.md`](../spec.md); resume a análise contextual para apresentação oral. A **visão de produto** abaixo (dois papéis, colaboração agência–escola) pode ser mais ampla que o recorte de **implementação** descrito na spec.

---

## 1. Problema, suposições e objetivos

### Problema

Empresas de turismo de **pequeno ou médio porte**, no máximo, costumam ter uma **página de vendas** em alguma plataforma **no-code**, por vezes **integrada com um sistema de pagamentos** — mas **carecem de um sistema** que:

- **disponibilize o estado dos pagamentos** (quem já pagou, quem falta) de forma clara; e  
- **ofereça ferramentas de colaboração** entre a **agência** e as **escolas** para controlar o pagamento dos alunos.

Isto é um **caso diferente** do cenário em que o **ciclo completo** de venda e cadastro é feito **só pela agência**: aqui o foco é **coordenação** e **visibilidade partilhada** com a escola, não apenas fechar a venda online.

### Ideia da solução

Oferecer um sistema para **gerir viagens, passageiros e pagamentos**, **no âmbito de cada cliente (escola)** — ou seja, dados e fluxos **organizados por escola**, com regras de negócio e interface pensadas para esse ecossistema.

### Dois tipos de utilizadores (visão)

| Papel | Responsabilidades |
|--------|-------------------|
| **Responsável pela agência** | Popular o sistema com **dados essenciais** (viagens, passageiros, estado de pagamentos conforme o produto permitir); **partilhar um link de acesso** (ou convite) com o responsável da escola. |
| **Responsável pela escola** | Ter acesso a uma **lista atualizada** (idealmente em **tempo real** ou próximo disso) e, com base nela, **fazer o controlo e a cobrança junto dos pais** dos alunos. |

**Nota de âmbito do trabalho:** pressupõe-se, no produto completo, **autenticação** e **integração com a plataforma de pagamentos** da agência — mas **isso fica fora do escopo** deste trabalho académico (podem ser mencionados como evolução futura na apresentação).

### Suposições (alinhadas à especificação de apoio)

- O recorte de **implementação** em [`../spec.md`](../spec.md) pode focar no **lado da agência** (staff); a **visão de IHC** acima guia o desenho a **longo prazo** (dois públicos, colaboração).
- Valores em **BRL**, com **duas casas decimais**; **data de pagamento** é só **dia** (calendário), fuso **`America/Sao_Paulo`**.
- **Não** existe lista global de pagamentos: tudo é **no contexto da viagem**, a partir da **linha do passageiro** (menu por linha).
- Primeira versão orientada a **dashboard web** para operações; **export CSV / impressão dedicada** não são obrigatórios em v1.

### Objetivos

1. Permitir cadastro de **escola → viagem → passageiros** com regras claras (inativos, duplicados CPF/nome).
2. Permitir **registar, consultar e corrigir pagamentos manuais** ligados a **um passageiro**, com histórico claro para auditoria.
3. Mostrar **pendente / quitado / indisponível** por passageiro, com distinção entre **quitado por pagamentos** e **“marcado como pago sem informação de pagamento”**.
4. Entregar **UX consistente**: sidebar, rotas separadas lista vs formulário, tabelas com busca/filtro/paginação (client-side aceitável em v1), breadcrumbs em `pt-BR`.

---

## 2. Trabalhos relacionados e estado da arte

### Como o problema é resolvido hoje (em geral)

| Abordagem | Vantagens | Limitações para este domínio |
|-----------|-----------|------------------------------|
| **Planilhas compartilhadas** | Baixo custo, familiar | Duplicidade de dados, pouca integridade (CPF, nomes), difícil “uma verdade” por viagem |
| **ERP / financeiro genérico** | Contabilidade forte | Pouco adaptado a **roster por viagem escolar** e a **status por passageiro** sem módulo custom |
| **CRM + cobrança** | Follow-up com cliente | Nem sempre modela **passageiro dentro de viagem** nem **pagamento manual fragmentado** |
| **Sistemas de turismo / reservas B2C** | E-commerce, vouchers | Foco em venda ao público; menos em **operação B2B escola** com **controlo interno de quitação** |
| **Página no-code + gateway de pagamentos** | Presença online e cobrança | **Não** substitui visibilidade operacional nem **canal de colaboração** com a escola sobre quem falta pagar |

### Posicionamento da proposta

Um sistema que combina **dashboard operacional** (agência) com **visão futura** de **acesso escola** (lista partilhada), centrado em:

- Hierarquia **escola → viagem → passageiro → pagamentos** (tudo no **âmbito do cliente escola**).
- **Estado dos pagamentos** derivado (pendente/quitado) a partir de montantes esperados e registos, com **exceções** explícitas (p.ex. marcação manual, remoção suave de passageiro) — detalhes em [`../spec.md`](../spec.md).
- Colaboração **agência ↔ escola**: a agência mantém a fonte de verdade; a escola **acompanha** e **age** junto das famílias (visão de produto; o âmbito do trabalho pode limitar-se a protótipos ou a um dos lados).

---

## 3. Modelo do utilizador e personas

### Utilizadores-alvo (dois papéis)

1. **Lado agência** — quem **introduz e mantém** dados operacionais (escolas, viagens, passageiros, pagamentos ou estados), e **partilha acesso** com a escola. Precisa de **ver rapidamente quem falta pagar** e de **evitar erros** (duplicados, valores incoerentes).

2. **Lado escola** — quem **consulta** a lista **atualizada** e usa essa informação para **organizar a cobrança** junto dos encarregados de educação (telefonemas, reuniões, lembretes). Valoriza **simplicidade**, **confiança** nos dados e **sincronização** com o que a agência regista.

### Persona 1 — **Carla (Coordenadora na agência)**

- **Perfil:** 35 anos, gere várias escolas em paralelo; é quem **configura** viagens e **garante** que a escola recebe o link ou acesso.
- **Objetivo:** Uma **fonte única fiável** por viagem e **partilha clara** com o contacto da escola.
- **Frustrações:** Planilhas desatualizadas; escola a perguntar “quem falta?” com respostas diferentes das da agência.
- **Necessidades no produto:** Navegação clara, tabela com filtro e estado visível; fluxo simples para **partilhar** ou **indicar** o acesso escola.

### Persona 2 — **Ricardo (Operações / receção de pagamentos na agência)**

- **Perfil:** Regista no sistema o que aconteceu na prática (transferência, dinheiro na loja, etc.).
- **Objetivo:** **Registo completo** e rápido sem repetir contexto (já está na viagem).
- **Frustrações:** Formulários longos ou seletores desnecessários.
- **Necessidades no produto:** Ações a partir da **linha do passageiro**; valor esperado pré-preenchido quando fizer sentido; histórico por aluno.

### Persona 3 — **Mariana (Responsável / coordenação na escola)**

- **Perfil:** Professora coordenadora ou secretaria escolar; **não** gere o sistema da agência, mas **depende** da lista para cobrar pais a tempo.
- **Objetivo:** Ver **quem está pendente** e **quem já quitou**, alinhado com a agência, para **priorizar contactos** aos encarregados.
- **Frustrações:** Lista desatualizada; não saber se um aluno foi removido da viagem ou está só “pendente de pagamento”.
- **Necessidades no produto:** Vista **legível** (mobile ou desktop), **atualização** perceptível, estados **pendente / quitado** (e equivalentes) **sem jargão**; opcionalmente totais ou filtros simples.

*(Helena, supervisão na agência, pode ser usada como quarta persona ou fundida em Carla se o tempo de apresentação for curto.)*

---

## 4. Modelo de tarefas — Análise Hierárquica de Tarefas (HTA)

A decomposição formal está em **[`hta-school-trip-payments.mmd`](hta-school-trip-payments.mmd)** (Mermaid), nesta pasta — é a **fonte única** do diagrama.

- **Pré-visualização:** colar o conteúdo do `.mmd` no [Mermaid Live Editor](https://mermaid.live), ou abrir o ficheiro com uma extensão Mermaid no editor.
- **Exportar PNG/SVG** (a partir de `presentation-sprint-01/`):

```bash
npx @mermaid-js/mermaid-cli -i hta-school-trip-payments.mmd -o hta-school-trip-payments.png
# ou: -o hta-school-trip-payments.svg
```

### Resumo textual dos planos (para os slides)

O diagrama HTA descreve sobretudo o **trabalho do lado da agência** (alinhado à spec atual). Uma extensão futura seria um **sub-árvore** para o **responsável da escola** (consultar lista, filtrar pendentes, contactar encarregados).

- **Tarefa 0:** Gerir o ciclo de vida operacional dos pagamentos de uma excursão escolar.
- **Plano 0:** Executar **1 → 2 → 3** conforme necessidade do momento (repetir 2 e 3 ao longo da operação).

**Subtarefas:**

1. **Preparar contexto** — Registar ou atualizar escola; criar viagem **a partir da lista de viagens da escola**; gerir passageiros (incl. contactos de encarregados, duplicados, remoção suave).
2. **Registar e manter pagamentos** — A partir da **tabela de passageiros da viagem**: criar/editar/apagar pagamentos; consultar histórico; opcionalmente marcar “pago sem informação de pagamento”.
3. **Monitorizar e decidir** — Filtrar/listar; interpretar estado (pendente/quitado/indisponível); agir (cobrar, corrigir valor esperado, restaurar passageiro removido).

*(Detalhe e ligações entre nós: ver `hta-school-trip-payments.mmd`.)*

---

## 5. Cenários de uso e exceções

### Cenário A — Feliz caminho: nova escola, viagem e primeiro passageiro

1. **Agência:** cria **escola** (opcionalmente com URL de landing para pré-preencher metadados).
2. Abre a **lista de viagens** dessa escola e cria **viagem** com valor esperado por defeito.
3. Na **lista de passageiros** da viagem, adiciona passageiro; o estado passa a **pendente** se houver valor esperado e ainda não houver pagamentos.
4. Regista um **pagamento** pela linha do passageiro; quando a soma **≥** valor efetivo esperado, estado **quitado** por pagamentos.
5. **Colaboração (visão de produto):** a agência **partilha o acesso** com a escola; a **Mariana** vê a mesma informação de estado e **contacta encarregados** conforme a lista — sem depender de capturas de ecrã ou planilhas paralelas.

### Cenário B — Pagamento parcial e novo pagamento

- Passageiro com soma **inferior** ao esperado permanece **pendente**; staff regista pagamentos adicionais até atingir o limiar (regras de escala BRL).

### Cenário C — Atalho operacional: “pago sem comprovativo detalhado”

- Staff usa a ação de **marcar como pago sem informação de pagamento**; interface mostra texto equivalente a *“Marcado manualmente como pago sem informação de pagamento”* (pt-BR); ao **limpar** a marca, o estado recalcula-se pelos pagamentos.

### Cenário D — Duplicados e validação

- **CPF** repetido na mesma viagem: **bloqueio**.
- **Nome completo** igual sem conflito de CPF: **aviso** + confirmação obrigatória.
- **CPF** inválido: **bloqueio** até corrigir ou limpar.

### Cenário E — Escola ou viagem inativada

- Deixam de aparecer nas listas por defeito; **não** é permitido criar nova viagem (escola inativa) ou novo passageiro (viagem inativa); dados existentes permanecem consultáveis no contexto.

### Cenário F — Passageiro removido (soft-remove)

- Some da vista por defeito e dos agregados por defeito; **pagamentos mantêm-se**; para novo pagamento é preciso **restaurar** o passageiro.

### Exceções / fora de âmbito (mencionar na Q&A se necessário)

- **Autenticação** completa e **integração** com a **plataforma de pagamentos** da agência: **fora do escopo** deste trabalho (pressupostos de produto futuro).
- Conflitos de edição simultânea: **sem** deteção formal de “save obsoleto” em v1.
- Exportação CSV / relatório de impressão: **fora** de v1.
- Integração automática de pagamento no recorte da **spec** atual: **fora** de v1 (registos manuais ou estados espelhados).

---

## Sugestão de divisão de slides (≈10 min)

| # | Slide | Conteúdo |
|---|--------|----------|
| 1 | Título | Nome do projeto, equipa, Sprint #1 |
| 2 | Problema & objetivo | 1 frase problema + 3 bullets objetivos |
| 3 | Suposições & âmbito | Dois papéis (agência + escola); auth/integração pagamentos fora do trabalho; resto alinhado à spec |
| 4 | Estado da arte | Tabela resumo (incl. no-code + gateway vs colaboração) |
| 5–6 | Personas | Carla e Ricardo (agência), Mariana (escola) |
| 7 | HTA | Imagem exportada do Mermaid (`.mmd` / PNG) + legenda do Plano 0 |
| 8–9 | Cenários | Feliz caminho + 1 cenário de exceção (duplicados ou inativo) |
| 10 | Síntese | Objetivos de IHC cumpridos; próximos passos (p.ex. protótipos, avaliação com utilizadores) |

---

## Ficheiros relacionados

| Ficheiro | Descrição |
|----------|-----------|
| [`../spec.md`](../spec.md) | Especificação completa e requisitos |
| `hta-school-trip-payments.mmd` | Grafo HTA (Mermaid), nesta pasta |
