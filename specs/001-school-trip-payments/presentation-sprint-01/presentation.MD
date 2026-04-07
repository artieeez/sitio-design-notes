----
page 0

# Controle de Pagamentos para Agências de Turismo Pedagógico

[LOGO UFRGS]

Artur Webber
Elano Tavares

----
page 1

# Controle de Pagamentos para Agências de Turismo Pedagógico

Contexto: Muitas agências de turismo de médio e pequeno porte possuem uma página de vendas em alguma plataforma no code com alguma integração de pagamento, mas sem um ambiente que também seja acessível por terceiros, mais especificamente a organização da escola para o controle em tempo real dos pagamentos.

----
page 2

# Controle de Pagamentos para Agências de Turismo Pedagógico

A proposta inicial é um sistema onde uma agência de turismo possa:
- Gerir Escolas, Viagens e listas de passageiros; acompanhar pagamentos **sincronizados** com a plataforma de pagamentos em uso.
- Compartilhar o acesso às informações da viagem e aos estados de pagamento com a organização da escola.

----
page 3

# Modelo de Usuário

## Marcos

Responsável pela agência de turismo

- 50 anos
- Utiliza a plataforma várias vezes ao longo da semana para cadastros, conferência e exceções — **não** para digitar cada pagamento a mão: os valores **entram automaticamente** via **integração** com a plataforma de pagamentos já usada na venda.
- Experiência com contabilidade e gestão; espera **reconciliar** lista do sistema com o extrato quando precisar e tratar casos fora do fluxo online (dinheiro na loja, acertos manuais).
- Pouco tempo disponível; prioriza visão consolidada por viagem e **menos retrabalho** entre a **plataforma de pagamentos** e as planilhas.

----
page 4

# Modelo de Usuário

## Márcia

Coordenadora da escola

- 58 anos
- Faz a interface entre a agência de turismo e os pais dos alunos
- Cliente da Agência de Turismo
- Pouca afinidade com tecnologia
- Anota suas senhas num bloco de notas físico
- Interage com a plataforma apenas em dois momentos ao longo do ano

----
page 5

# HTA do responsável pela Agência

[deixar em branco, vou adicionar a imagem depois]

----
page 6

# HTA da organização da escola

[deixar em branco, vou adicionar a imagem depois]

----
page 7

# Análise do Estado-da-Arte

## ERP Empresarial

ERPs empresariais podem ser considerados "bala de canhão" para a demanda de empresas menores. Um sistema personalizado pode oferecer um menor custo operacional, tanto em curva de aprendizado quanto em gasto recorrente com licença e cloud.

## Um simples export na plataforma de pagamento

Mesmo agências pequenas podem facilmente receber centenas de pagamentos na semana e exportar, filtrar e enviar essas listas para as escolas pode ser um processo custoso.

----
page 8

# Cenários

## Caminho principal (agência + escola)

1. **Marcos** cadastra a escola, cria a viagem e inclui os passageiros com valor esperado.
2. Os **pagamentos confirmados na plataforma de pagamentos** são **importados automaticamente** (integração); a lista de cada aluno **atualiza** e, quando o total cobre o esperado, o status fica **quitado**. **Marcos** acompanha e, se precisar, **complementa** com lançamentos manuais (ex.: pagamento em dinheiro na agência).
3. **Marcos** gera o **link** e envia para **Márcia** (e-mail, WhatsApp etc.).
4. **Márcia** abre o link, vê a lista **alinhada** com o que a plataforma já registrou e cobra os responsáveis que ainda estão **pendentes**.

## Variações e exceções (resumo)

- **Fora do fluxo online:** pagamento só presencial ou exceção → **Marcos** registra manualmente ou usa marcação **“pago sem detalhe”**, conforme a interface, para não depender só do gateway.

