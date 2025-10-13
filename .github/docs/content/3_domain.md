# O Domínio em Domain-Driven Design: Um Aprofundamento Completo

## Índice

- [O Domínio em Domain-Driven Design: Um Aprofundamento Completo](#o-domínio-em-domain-driven-design-um-aprofundamento-completo)
  - [Índice](#índice)
  - [O Que é "Domínio" Afinal?](#o-que-é-domínio-afinal)
  - [Nível 1: Definição Simples](#nível-1-definição-simples)
  - [Nível 2: Anatomia do Domínio](#nível-2-anatomia-do-domínio)
    - [Camada 1: Conceitos de Negócio](#camada-1-conceitos-de-negócio)
    - [Camada 2: Regras de Negócio](#camada-2-regras-de-negócio)
    - [Camada 3: Conhecimento Tácito](#camada-3-conhecimento-tácito)
  - [Nível 3: Estrutura de um Domínio Complexo](#nível-3-estrutura-de-um-domínio-complexo)
    - [Subdomínios também têm Classificação](#subdomínios-também-têm-classificação)
  - [🧠 Nível 4: Por Que o Domínio é Crítico em DDD](#-nível-4-por-que-o-domínio-é-crítico-em-ddd)
    - [O Problema: Código Desacoplado do Domínio](#o-problema-código-desacoplado-do-domínio)
    - [A Solução: Código Que É O Domínio](#a-solução-código-que-é-o-domínio)
  - [🔍 Nível 5: Domínio vs Tecnologia](#-nível-5-domínio-vs-tecnologia)
    - [O Grande Erro: Confundir Domínio com Tecnologia](#o-grande-erro-confundir-domínio-com-tecnologia)
  - [🎬 Nível 6: Descoberta do Domínio](#-nível-6-descoberta-do-domínio)
    - [Técnica 1: Event Storming](#técnica-1-event-storming)
    - [Técnica 2: Mapeamento de Linguagem Ubíqua](#técnica-2-mapeamento-de-linguagem-ubíqua)
  - [Nível 7: Dinâmica do Domínio](#nível-7-dinâmica-do-domínio)
    - [Fase 1: Ignorância](#fase-1-ignorância)
    - [Fase 2: Descoberta](#fase-2-descoberta)
    - [Fase 3: Maturidade](#fase-3-maturidade)
  - [🌊 Nível 8: Camadas de Compreensão do Domínio](#-nível-8-camadas-de-compreensão-do-domínio)
  - [Nível 9: Erros Comuns na Interpretação do Domínio](#nível-9-erros-comuns-na-interpretação-do-domínio)
    - [Erro 1: Confundir Domínio com Requisitos Técnicos](#erro-1-confundir-domínio-com-requisitos-técnicos)
    - [Erro 2: Copiar Domínio de Outro Projeto](#erro-2-copiar-domínio-de-outro-projeto)
    - [Erro 3: Criar Domínio Fictício](#erro-3-criar-domínio-fictício)
    - [Erro 4: Domínio Muito Genérico](#erro-4-domínio-muito-genérico)
  - [Nível 10: Validando se Você Entendeu o Domínio](#nível-10-validando-se-você-entendeu-o-domínio)
    - [Teste 1: O Teste do Especialista](#teste-1-o-teste-do-especialista)
    - [Teste 2: O Teste do Requisito Novo](#teste-2-o-teste-do-requisito-novo)
    - [Teste 3: O Teste da Linguagem](#teste-3-o-teste-da-linguagem)
  - [Nível 11: Visualizando Domínios Complexos](#nível-11-visualizando-domínios-complexos)
  - [Nível 12: Relacionamentos Entre Subdomínios](#nível-12-relacionamentos-entre-subdomínios)
  - [Nível 13: Domínio em Diferentes Contextos da Organização](#nível-13-domínio-em-diferentes-contextos-da-organização)
  - [Nível 14: Expressando o Domínio Através da Arquitetura](#nível-14-expressando-o-domínio-através-da-arquitetura)
    - [Arquitetura Tradicional (Sem Foco em Domínio)](#arquitetura-tradicional-sem-foco-em-domínio)
    - [Arquitetura DDD (Organizada por Domínio)](#arquitetura-ddd-organizada-por-domínio)
  - [Nível 15: Implementação Concreta de um Domínio](#nível-15-implementação-concreta-de-um-domínio)
    - [Domínio: Sistema de Reserva de Salas](#domínio-sistema-de-reserva-de-salas)
  - [Conclusão: Recapitulando o Porquê](#conclusão-recapitulando-o-porquê)
  - [Próximos Passos para Dominar o Domínio](#próximos-passos-para-dominar-o-domínio)
  - [Recursos Finais](#recursos-finais)
  - [✨ Últimas Reflexões](#-últimas-reflexões)

## O Que é "Domínio" Afinal?

Antes de tudo, uma pergunta fundamental: **O que você entende por "domínio" no contexto de software?**

Deixe-me guiar você através de uma exploração progressiva.

---

## Nível 1: Definição Simples

**Domínio** é o **problema que você está tentando resolver**. É a realidade do negócio, as regras, os processos e o conhecimento que existe independentemente do software.

```plaintext
┌─────────────────────────────────────┐
│         O MUNDO REAL                │
│                                     │
│  E-commerce:                        │
│  - Clientes fazem pedidos           │
│  - Produtos têm preços              │
│  - Estoque se reduz                 │
│  - Pagamentos são processados       │
│  - Entregas são feitas              │
│                                     │
│  Tudo isso EXISTE antes do código! │
└─────────────────────────────────────┘
         ↓
    Modelamos isso
    em Software
         ↓
┌─────────────────────────────────────┐
│    CÓDIGO QUE REFLETE O DOMÍNIO    │
│                                     │
│  class Pedido { ... }               │
│  class Estoque { ... }              │
│  class Pagamento { ... }            │
└─────────────────────────────────────┘
```

---

## Nível 2: Anatomia do Domínio

Um domínio é composto por várias camadas de conhecimento:

### Camada 1: Conceitos de Negócio

```typescript
/**
 * DOMÍNIO: E-commerce
 * 
 * Conceitos que especialistas de negócio entendem:
 * 
 * - PEDIDO: Uma solicitação de compra
 * - CLIENTE: Pessoa que compra
 * - PRODUTO: Item à venda
 * - ESTOQUE: Quantidade disponível
 * - PAGAMENTO: Transferência de valor
 * - ENTREGA: Transporte até cliente
 * 
 * Estes conceitos existem na linguagem natural do negócio,
 * não são "conceitos de programador"
 */
```

### Camada 2: Regras de Negócio

```typescript
/**
 * Regras que governam o domínio:
 * 
 * Regra 1: Um pedido não pode ser confirmado sem itens
 * Regra 2: Estoque não pode ser negativo
 * Regra 3: Pagamento deve ser processado antes de enviar
 * Regra 4: Cliente não pode ter dois pedidos simultâneos
 * Regra 5: Entrega deve incluir todos os itens confirmados
 * 
 * Estas regras são RESTRIÇÕES DO NEGÓCIO, não da tecnologia
 */
```

### Camada 3: Conhecimento Tácito

```typescript
/**
 * Conhecimento que não está escrito em lugar nenhum:
 * 
 * "Quando falamos em 'cancelar pedido', referimo-nos apenas
 * a pedidos que ainda não saíram do armazém. Se já foi
 * enviado, o cliente precisa fazer uma 'devolução'."
 * 
 * "Um cliente pode ter múltiplas faturas, mas apenas uma
 * pode estar 'em aberto' por vez."
 * 
 * "Desconto por volume se aplica apenas a produtos da
 * mesma categoria."
 * 
 * Este conhecimento está na CABEÇA dos especialistas,
 * e DDD força extrair isso para o código.
 */
```

---

## Nível 3: Estrutura de um Domínio Complexo

Grandes domínios não são monolíticos. Eles são compostos por **Sub-Domínios** (Subdomains).

```plaintext
┌─────────────────────────────────────────────────────────────┐
│              DOMÍNIO: E-COMMERCE                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─ Subdomain: VENDAS
                              │  ├─ Criar pedidos
                              │  ├─ Gerenciar carrinho
                              │  ├─ Aplicar descontos
                              │  └─ Confirmar compra
                              │
                              ├─ Subdomain: ESTOQUE
                              │  ├─ Gerenciar produtos
                              │  ├─ Controlar quantidade
                              │  ├─ Gerenciar localizações
                              │  └─ Avisar sobre falta
                              │
                              ├─ Subdomain: PAGAMENTO
                              │  ├─ Processar cartões
                              │  ├─ Gerar boletos
                              │  ├─ Reverter transações
                              │  └─ Gerenciar fraude
                              │
                              ├─ Subdomain: LOGÍSTICA
                              │  ├─ Agendar entregas
                              │  ├─ Rastrear pacotes
                              │  ├─ Gerenciar roteiros
                              │  └─ Confirmar entrega
                              │
                              └─ Subdomain: NOTIFICAÇÃO
                                 ├─ Enviar emails
                                 ├─ Enviar SMS
                                 ├─ Push notifications
                                 └─ Relatórios
```

### Subdomínios também têm Classificação

```typescript
/**
 * CORE DOMAIN (Domínio Principal)
 * ─────────────────────────────────
 * 
 * O que diferencia sua empresa da concorrência.
 * Em um e-commerce: VENDAS
 * 
 * Características:
 * - Complexo, repleto de regras de negócio
 * - Exige melhor arquitetura, testes, documentação
 * - Equipes sênior trabalham aqui
 * - Mudanças frequentes conforme aprende-se sobre negócio
 * 
 * Investimento: MÁXIMO
 */

/**
 * SUPPORTING DOMAIN (Domínio de Suporte)
 * ────────────────────────────────────────
 * 
 * Importante para o negócio, mas não diferencia.
 * Em um e-commerce: NOTIFICAÇÃO, LOGÍSTICA
 * 
 * Características:
 * - Regras de negócio menos complexas
 * - Pode ser terceirizado parcialmente
 * - Mudanças menos frequentes
 * 
 * Investimento: MÉDIO
 */

/**
 * GENERIC DOMAIN (Domínio Genérico)
 * ──────────────────────────────────
 * 
 * Problema genérico, solução genérica.
 * Em um e-commerce: AUTENTICAÇÃO, PERMISSÕES
 * 
 * Características:
 * - Problema resolvido muitas vezes antes
 * - Melhor comprar/usar open source que construir
 * - Regras são conhecidas, não há segredos
 * 
 * Investimento: MÍNIMO (ou zero, use biblioteca)
 */
```

---

## 🧠 Nível 4: Por Que o Domínio é Crítico em DDD

### O Problema: Código Desacoplado do Domínio

```typescript
// ❌ ERRADO: Código que não reflete o domínio

class PedidoController {
  async criar(req: any): Promise<any> {
    // SQL direto, lógica espalhada
    const resultado = await db.query(`
      INSERT INTO pedidos (cliente_id, status, total)
      VALUES (${req.body.clienteId}, 'pendente', ${req.body.total})
    `);

    // Regra de negócio? Que regra?
    // Poderia estar vazio? Ninguém sabe.
    // Poderia ter status inválido? Talvez.
    // Há limite de pedidos por cliente? Não sei.

    return { id: resultado.insertId };
  }
}

// Problemas:
// - Especialista de negócio não entende o código
// - Lógica de negócio espalhada entre arquivos
// - Impossível testar isoladamente
// - Mudanças no negócio = refatoração no código inteiro
```

### A Solução: Código Que É O Domínio

```typescript
// ✅ CORRETO: Código que É o domínio

/**
 * DOMÍNIO: Um Pedido representa uma solicitação de compra.
 * 
 * Regras:
 * - Não pode ter zero itens
 * - Status progride em sequência
 * - Pode ser cancelado apenas se pendente
 */
class Pedido {
  private readonly id: Id;
  private readonly clienteId: Id;
  private readonly itens: ItemPedido[] = [];
  private status: 'Pendente' | 'Confirmado' | 'Enviado' | 'Entregue' | 'Cancelado';
  private readonly dataCriacao: Date;

  static criar(clienteId: Id): Pedido {
    return new Pedido(Id.create(), clienteId, 'Pendente', new Date());
  }

  adicionarItem(produtoId: Id, quantidade: number, preco: Preco): void {
    // REGRA: Não pode adicionar itens a pedido confirmado
    if (this.status !== 'Pendente') {
      throw new Error(
        `Não é possível adicionar itens a um pedido ${this.status}`
      );
    }

    // REGRA: Quantidade deve ser positiva
    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    this.itens.push(new ItemPedido(Id.create(), produtoId, quantidade, preco));
  }

  confirmar(): void {
    // REGRA: Pedido precisa ter itens
    if (this.itens.length === 0) {
      throw new Error('Não é possível confirmar pedido sem itens');
    }

    // REGRA: Status progride de forma válida
    if (this.status !== 'Pendente') {
      throw new Error(`Pedido já foi ${this.status}`);
    }

    this.status = 'Confirmado';
  }

  cancelar(): void {
    // REGRA: Cancelamento só é permitido se pendente
    if (this.status !== 'Pendente') {
      throw new Error(
        `Pedido ${this.status} não pode ser cancelado. ` +
        `Considere uma devolução em vez disso.`
      );
    }

    this.status = 'Cancelado';
  }

  // Getters (sem setters diretos!)
  getId(): Id { return this.id; }
  getClienteId(): Id { return this.clienteId; }
  getStatus(): string { return this.status; }
  getItens(): ItemPedido[] { return this.itens; }
}

// Agora:
// - Especialista pode ler e ENTENDER o código
// - Regras de negócio estão encapsuladas
// - Impossível violar regras (construtores privados)
// - Fácil testar cada regra isoladamente
```

---

## 🔍 Nível 5: Domínio vs Tecnologia

Esta é uma distinção CRÍTICA que separa DDD de desenvolvimento comum.

### O Grande Erro: Confundir Domínio com Tecnologia

```typescript
// ❌ ERRADO: Pensar em "camadas tecnológicas" como domínio

// Estrutura comum (MVC, Camadas)
/
projeto/
├── controllers/        ← Tecnologia (Express, não domínio)
├── services/           ← Tecnologia (abstração técnica)
├── repositories/       ← Tecnologia (acesso a dados)
├── models/             ← Confuso: é domínio ou DB?
└── utils/              ← Lixeira de tudo que não cabe

// Especialista de negócio vê essa estrutura:
// "Que é um 'controller'? Que é um 'repository'?
//  Onde está a lógica de PEDIDO?"

// ─────────────────────────────────────────────────

// ✅ CORRETO: Estrutura que reflete o domínio

projeto/
├── vendas/                    ← DOMÍNIO
│   ├── entidades/
│   │   ├── Pedido.ts
│   │   ├── ItemPedido.ts
│   │   └── Cliente.ts
│   ├── valueObjects/
│   │   ├── Preco.ts
│   │   └── Endereco.ts
│   ├── servicos/              ← Casos de uso do domínio
│   │   ├── CriarPedidoService.ts
│   │   ├── ConfirmarPedidoService.ts
│   │   └── CancelarPedidoService.ts
│   ├── eventos/               ← Eventos de negócio
│   │   ├── PedidoCriadoEvent.ts
│   │   ├── PedidoConfirmadoEvent.ts
│   │   └── PedidoCanceladoEvent.ts
│   └── repositorio/           ← Contrato (interface)
│       └── PedidoRepository.ts
│
├── estoque/                   ← DOMÍNIO (outro)
│   ├── entidades/
│   │   └── Estoque.ts
│   └── ... (similar)
│
└── infra/                     ← TECNOLOGIA
    ├── persistencia/
    │   ├── PedidoRepositorySQL.ts     ← Implementação tecnológica
    │   └── EstoqueRepositorySQL.ts    ← Implementação tecnológica
    ├── eventos/
    │   └── EventPublisherKafka.ts     ← Implementação tecnológica
    └── http/
        ├── PedidoController.ts        ← Implementação tecnológica
        └── routes/

// Agora:
// - Domínio está ISOLADO do HTTP, Database, etc
// - Trocas de tecnologia não afetam domínio
// - Especialista de negócio entende a estrutura
```

---

## 🎬 Nível 6: Descoberta do Domínio

Como você **descobre** o domínio real? O domínio não é entregue em documento. Deve ser **explorado**.

### Técnica 1: Event Storming

Uma reunião onde você cria uma timeline de eventos importantes no negócio.

```plaintext
Passos:

1. Convidar: Especialista de negócio + Devs + Product

2. Escrever eventos (em sequência):

   [Cliente Criou Conta]
         ↓
   [Cliente Adicionou Item ao Carrinho]
         ↓
   [Cliente Confirmou Compra]
         ↓
   [Pagamento Foi Processado]
         ↓
   [Estoque Foi Reduzido]
         ↓
   [Pedido Foi Enviado]
         ↓
   [Cliente Recebeu Pedido]
         ↓
   [Cliente Solicitou Devolução]

3. Agrupar eventos por agregado:

   CLIENTE: Criou Conta, Login, Atualizou Endereço
   CARRINHO: Adicionou Item, Removeu Item, Limpou
   PEDIDO: Confirmou Compra, Cancelou, Solicitou Devolução
   ESTOQUE: Foi Reduzido, Foi Reposto
   ENTREGA: Foi Enviado, Foi Entregue

4. Identificar comandos (causas):

   Comando: AdicionarItemAoCarrinho → Evento: ItemAdicionado
   Comando: ConfirmarCompra → Evento: CompraConfirmada
   Comando: ProcessarPagamento → Evento: PagamentoProcessado

5. Descobrir regras implícitas:

   "Espera, quando confirmamos a compra, o que valida se tem estoque?"
   "Qual o tempo máximo para o cliente confirmar o pagamento?"
   "Pode ter duas compras simultâneas do mesmo cliente?"
```

### Técnica 2: Mapeamento de Linguagem Ubíqua

```typescript
/**
 * GLOSSÁRIO DESCOBERTO ATRAVÉS DE CONVERSAS
 * 
 * Q (Dev): "Quando o cliente cancela um pedido, o que acontece?"
 * A (Expert): "Ah, depende. Se ainda não foi enviado, apenas cancela.
 *              Se foi enviado mas não entregue, fazemos uma devolução.
 *              Se foi entregue, também é devolução, mas com 30 dias."
 * 
 * DESCOBERTA: "Cancelamento" é ambíguo! Precisa de 2 conceitos:
 * - CancelarPedido (antes de envio)
 * - SolicitarDevolucao (após envio)
 * 
 * ─────────────────────────────────────
 * 
 * Q (Dev): "Um cliente pode ter dois pedidos ao mesmo tempo?"
 * A (Expert): "Tecnicamente sim, mas... o sistema antigo não permitia.
 *              Na verdade, acho que deveria permitir mesmo."
 * 
 * DESCOBERTA: Regra nunca foi questionada! Precisa decisão:
 * - Permitir múltiplos pedidos simultâneos
 * - Ou: Limitar a um por status (pendente/confirmado)
 * 
 * ─────────────────────────────────────
 * 
 * Q (Dev): "O que é 'Estoque'? É a quantidade física?"
 * A (Expert): "Bem... temos quantidade física (no armazém),
 *              e também 'reservada' (pedidos confirmados mas não
 *              ainda não enviados). E tem quantidade 'danificada'
 *              que não pode vender."
 * 
 * DESCOBERTA: Estoque tem 3 dimensões!
 * - Disponível (física - danificada)
 * - Reservada (comprometida)
 * - Total = Disponível + Reservada
 */
```

---

## Nível 7: Dinâmica do Domínio

Domínio não é estático. Evolui conforme aprende-se sobre o negócio.

### Fase 1: Ignorância

```plaintext
Dev: "OK, vou fazer um sistema de e-commerce"
Dev: "Criar tabelas: clientes, produtos, pedidos, pagamentos"
Dev: "Pronto em 2 semanas"
```

Resultado: Sistema quebra em produção. Regras de negócio não estão implementadas.

### Fase 2: Descoberta

```plaintext
Após lançamento, especialista começa a questionar:

Expert: "Por que fulano conseguiu fazer devolução de um produto 
         depois de 90 dias? Devia ser 30."
Dev: "Ah... não implementei limite de tempo"

Expert: "Por que pedido de sicrano não tem nota fiscal?"
Dev: "Que é nota fiscal? Não aparecia no requisito..."

Expert: "Por que sobrou tanto estoque no armazém 2?"
Dev: "Ué? Tem vários armazéns? Não sabia..."
```

### Fase 3: Maturidade

```plaintext
Após muitas conversas, o domínio fica claro:

Expert: "Um Pedido pode estar em 5 estados. Cada um tem regras:
         - Pendente: pode adicionar itens, cancelar
         - Confirmado: processando pagamento, pode cancelar se não pagou
         - Enviado: não pode cancelar, pode devolver
         - Entregue: devolução até 30 dias
         - Cancelado: final (salvo devolução de entrega)"

Dev: "Perfeito, vou modelar isso"

```

---

## 🌊 Nível 8: Camadas de Compreensão do Domínio

```plaintext
┌────────────────────────────────────────────────────┐
│  ESPECIALISTA DE NEGÓCIO                           │
│  "Pedido, Cliente, Produto, Estoque, Envio..."    │
│  (Fala em conceitos de negócio)                   │
└──────────────┬─────────────────────────────────────┘
               │
        Linguagem Ubíqua
        (ponte conceitual)
               │
┌──────────────▼─────────────────────────────────────┐
│  ARQUITETO / DDD EXPERT                            │
│  "Agregados, Value Objects, Eventos, Repositórios"│
│  (Fala em padrões tácticos DDD)                   │
└──────────────┬─────────────────────────────────────┘
               │
        Mapeamento Mental
               │
┌──────────────▼─────────────────────────────────────┐
│  DESENVOLVEDOR                                     │
│  "Classes, Interfaces, Métodos, Testes"          │
│  (Fala em TypeScript/OOP)                        │
└──────────────┬─────────────────────────────────────┘
               │
        Compilação/Execução
               │
┌──────────────▼─────────────────────────────────────┐
│  MÁQUINA                                           │
│  "Bytes, CPU, Memória"                            │
│  (0s e 1s)                                        │
└────────────────────────────────────────────────────┘

Todo esse caminho deve estar ALINHADO.
Se não está, o domínio foi mal compreendido.
```

---

## Nível 9: Erros Comuns na Interpretação do Domínio

### Erro 1: Confundir Domínio com Requisitos Técnicos

```typescript
// ❌ ERRADO

Dev: "Projeto em Node com Express, MongoDB, React"
Specialista: "Ué? Eu queria um e-commerce..."
Dev: "Sim, um e-commerce em Node com Express..."

// O "domínio" foi reduzido a "stack tecnológico"
// Ninguém entende o PROBLEMA a resolver
```

### Erro 2: Copiar Domínio de Outro Projeto

```typescript
// ❌ ERRADO

Dev: "Vou pegar a arquitetura do projeto X"
Dev: "Vou copiar entidades: Pedido, Cliente, Produto..."
Dev: (Copia sem questionar)

Especialista: "Por que o Pedido tem 'codigoLegado'?"
Dev: "Ué... tinha no projeto original"

// Domínio específico → Genérico → Inútil
```

### Erro 3: Criar Domínio Fictício

```typescript
// ❌ ERRADO

Dev: "Vou criar agregado 'ProcessadorPedidos'"
Dev: "Vou criar agregado 'GerenciadorClientes'"
Dev: "Vou criar agregado 'ControladorEstoque'"

// Ninguém do negócio fala assim!
// "Processador"? "Gerenciador"? "Controlador"?
// São nomes técnicos, não de domínio
```

### Erro 4: Domínio Muito Genérico

```typescript
// ❌ ERRADO

class Entidade {
  id: string;
  dados: any;
  metadata: any;
}

class Servico {
  async criar(entidade: Entidade): Promise<void> { }
  async obter(id: string): Promise<Entidade> { }
  async atualizar(entidade: Entidade): Promise<void> { }
}

// Tão genérico que não diz NADA sobre o domínio
// Poderia ser e-commerce, banco, hospital...
// Inútil para especialista entender

// ─────────────────────────────────────────

// ✅ CORRETO: Domínio específico

class Pedido {
  private id: Id;
  private clienteId: Id;
  private itens: ItemPedido[];
  private status: PedidoStatus;
  private total: Preco;
}

class PedidoService {
  async criarPedido(cliente: Id, itens: ItemPedido[]): Promise<Pedido> { }
  async confirmarPedido(pedidoId: Id): Promise<void> { }
  async cancelarPedido(pedidoId: Id): Promise<void> { }
}

// Claro, específico, alinhado com negócio
```

---

## Nível 10: Validando se Você Entendeu o Domínio

### Teste 1: O Teste do Especialista

```plaintext
Mostre seu código para o especialista de negócio.

Se ele disser:
✅ "Sim, é exatamente assim que funciona" → Domínio bem modelado
✅ "Quase... mas faltou isso" → Domínio correto com pequenos ajustes
❌ "Que é isso? Nunca ouvi falar" → Domínio mal interpretado
❌ "Eu entendo, mas não é assim no negócio real" → Modelo divorciado da realidade
```

### Teste 2: O Teste do Requisito Novo

```plaintext
Recebeu novo requisito de negócio.

Se você conseguir:
✅ Adicionar a funcionalidade em poucos arquivos → Domínio bem estruturado
✅ Modificar sem quebrbar código existente → Domínio resiliente
❌ Refatorar 30 arquivos para 1 mudança → Domínio mal desacoplado
❌ Achar "onde coloco essa lógica?" → Domínio confuso
```

### Teste 3: O Teste da Linguagem

```plaintext
Olhe para seu código:

Se você conseguir:
✅ Explicar a função de cada classe em linguagem de negócio
✅ Especialista entender os nomes das classes
✅ Métodos refletem ações do negócio ("confirmarPedido", não "update")
❌ Nomes técnicos ("EntityManager", "ServiceLocator")
❌ Métodos CRUD genéricos ("create", "read", "update")
❌ Lógica espalhada em "Utils" ou "Helpers"

→ Domínio bem expresso
```

---

## Nível 11: Visualizando Domínios Complexos

```plaintext
┌─────────────────────────────────────────────────────────────┐
│          DOMÍNIO: SISTEMA BANCÁRIO                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   CONTAS         │  │  TRANSAÇÕES      │  │   EMPRÉSTIMOS    │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ Criar Conta      │  │ Debitar          │  │ Solicitar        │
│ Fechar Conta     │  │ Creditar         │  │ Aprovar          │
│ Bloquear         │  │ Validar Saldo    │  │ Calcular Juros   │
│ Consultar Saldo  │  │ Transferir       │  │ Cobrar Parcela   │
│ Atualizar Dados  │  │ Agendar          │  │ Liquidar         │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         ↑                     ↑                      ↑
         │                     │                      │
    Entidade              Entidade                Entidade
    (Raiz Agregado)      (Raiz Agregado)       (Raiz Agregado)
         │                     │                      │
         │ Eventos             │ Eventos              │ Eventos
         ├→ ContaCriada        ├→ DebitoProcesado     ├→ EmprestimoAprovado
         ├→ ContaFechada       ├→ CreditoProcesado    ├→ ParcelaAnticipada
         └→ SaldoAlterado      └→ TransferenciaFalhou └→ EmprestimoPago

Cada entidade:
- Tem SUAS PRÓPRIAS regras
- Produz SEUS PRÓPRIOS eventos
- Não conhece as outras diretamente
- Comunica via eventos
```

---

## Nível 12: Relacionamentos Entre Subdomínios

``` plaintext
Quando subdomínios precisam se comunicar, há padrões:

1. PARTNERSHIP (Parceria)
   ┌──────────────┐         ┌──────────────┐
   │   VENDAS     │ ←────→  │   ESTOQUE    │
   │ (Conhecem    │ Ambos   │ (Conhecem    │
   │  conceitos   │ precisam │  conceitos   │
   │  iguais)     │ de sinc. │  iguais)     │
   └──────────────┘         └──────────────┘
   Problema: Acoplamento forte, difícil de evoluir separadamente

2. CUSTOMER-SUPPLIER (Cliente-Fornecedor)
   ┌──────────────┐         ┌──────────────┐
   │   VENDAS     │ ─────→  │   ESTOQUE    │
   │ (Consumidor  │ Define  │ (Fornecedor  │
   │  de serviço) │ contrato │  de serviço) │
   └──────────────┘         └──────────────┘
   Benefício: ESTOQUE controla sua interface, VENDAS se adapta

3. SHARED KERNEL (Núcleo Compartilhado)
   ┌──────────────┐     ┌──────────────┐
   │   VENDAS     │ ←──→│ SHARED CODE  │
   │              │     │ (Value       │
   │   ESTOQUE    │ ←──→│  Objects     │
   │              │     │  Comuns)     │
   └──────────────┘     └──────────────┘
   Risco: Mudança no código compartilhado afeta todos

4. ANTI-CORRUPTION LAYER (ACL - Camada Anti-Corrupção)
   ┌──────────────┐     ┌────────────┐     ┌──────────────┐
   │ NOVO DOMÍNIO │ ←──→│    ACL     │ ←──→│ SISTEMA      │
   │ (Nosso       │     │(Tradução)  │     │ LEGADO       │
   │ domínio puro)│     │            │     │ (Domínio     │
   └──────────────┘     └────────────┘     │ confuso)     │
                                           └──────────────┘
   Benefício: Domínio novo protegido de "sujeira" legada
```

---

## Nível 13: Domínio em Diferentes Contextos da Organização

``` plaintext
╔════════════════════════════════════════════════════════════════╗
║                  A MESMA PALAVRA, DIFERENTES SIGNIFICADOS      ║
╚════════════════════════════════════════════════════════════════╝

Palavra: "PEDIDO"

CONTEXTO 1: VENDAS
├─ O que é: Solicitação de compra de um cliente
├─ Ciclo: Pendente → Confirmado → Enviado → Entregue
├─ Responsabilidades: Itens, preço, cliente
└─ Preocupação: O cliente quer isso, consegue pagar?

CONTEXTO 2: ESTOQUE
├─ O que é: Compromisso de remessa de produtos
├─ Ciclo: Reservado → Separado → Enviado → Confirmado
├─ Responsabilidades: Quantidades, localizações
└─ Preocupação: Temos isso? Onde está?

CONTEXTO 3: FINANCEIRO
├─ O que é: Documento de cobrança
├─ Ciclo: Faturado → Pago → Reconhecido
├─ Responsabilidades: Valores, datas, status fiscal
└─ Preocupação: Quanto entrará, quando entrará?

CONTEXTO 4: SUPORTE
├─ O que é: Registro de atendimento
├─ Ciclo: Aberto → Investigando → Resolvido → Fechado
├─ Responsabilidades: Reclamações, devoluções, trocas
└─ Preocupação: Cliente está satisfeito?

CONCLUSÃO:
A palavra "Pedido" significa coisas diferentes em cada contexto.
DDD reconhece isso → Cada contexto tem seu próprio modelo.
Sem isso, confusão total (qual banco de dados vai guardar "status"?)
```

---

## Nível 14: Expressando o Domínio Através da Arquitetura

### Arquitetura Tradicional (Sem Foco em Domínio)

```plaintext
projeto/
├── controllers/          ← Tecnologia HTTP
│   └── PedidoController.ts
├── services/             ← Ambiguo
│   └── PedidoService.ts
├── repositories/         ← Tecnologia DB
│   └── PedidoRepository.ts
├── models/               ← Tecnologia ORM
│   └── Pedido.ts
├── middleware/           ← Tecnologia HTTP
└── utils/                ← ???
    └── validators.ts

Problema: Onde está o DOMÍNIO?
Resposta: Espalhado por tudo
```

### Arquitetura DDD (Organizada por Domínio)

```plaintext
projeto/
│
├── dominio/              ← TUDO que é negócio
│   │
│   ├── vendas/           ← Subdomain
│   │   ├── agregados/
│   │   │   ├── Pedido.ts (Raiz de agregado)
│   │   │   ├── ItemPedido.ts (Entidade)
│   │   │   └── PedidoStatus.ts (Value Object)
│   │   │
│   │   ├── servicos/     ← Casos de uso
│   │   │   ├── CriarPedidoService.ts
│   │   │   ├── ConfirmarPedidoService.ts
│   │   │   └── CancelarPedidoService.ts
│   │   │
│   │   ├── eventos/      ← Eventos do negócio
│   │   │   ├── PedidoCriadoEvent.ts
│   │   │   ├── PedidoConfirmadoEvent.ts
│   │   │   └── PedidoCanceladoEvent.ts
│   │   │
│   │   ├── especificacoes/ ← Lógica complexa
│   │   │   └── PedidoPoderSerCanceladoSpec.ts
│   │   │
│   │   └── repositorio/  ← Contrato (interface)
│   │       └── IPedidoRepository.ts
│   │
│   ├── estoque/          ← Outro Subdomain (similar)
│   │   └── ...
│   │
│   └── compartilhado/    ← Value Objects compartilhados
│       ├── Id.ts
│       ├── Email.ts
│       ├── Preco.ts
│       └── Endereco.ts
│
├── aplicacao/            ← Application Layer
│   ├── pedidos/
│   │   ├── CriarPedidoDTO.ts
│   │   └── PedidoApplicationService.ts
│   └── estoque/
│       └── ...
│
├── infra/                ← TUDO que é tecnologia
│   │
│   ├── persistencia/
│   │   ├── pedidos/
│   │   │   └── PedidoRepositorySQL.ts (Implementação)
│   │   └── estoque/
│   │       └── EstoqueRepositorySQL.ts (Implementação)
│   │
│   ├── eventos/
│   │   ├── EventPublisherKafka.ts
│   │   └── EventSubscriberKafka.ts
│   │
│   ├── http/
│   │   ├── PedidoController.ts
│   │   └── routes/
│   │       └── pedidos.routes.ts
│   │
│   └── config/
│       └── database.ts
│
└── tests/
    ├── unitarios/
    │   └── dominio/vendas/Pedido.test.ts
    ├── integracao/
    │   └── repositorio/PedidoRepositorySQL.test.ts
    └── e2e/
        └── pedidos.e2e.test.ts

Benefício: Alguém novo vê estrutura e ENTENDE o domínio
```

---

## Nível 15: Implementação Concreta de um Domínio

### Domínio: Sistema de Reserva de Salas

```typescript
/**
 * CONTEXTO: Sala de Reuniões
 * 
 * Especialista diz:
 * "Uma sala pode ser reservada por períodos de tempo.
 *  Não pode ter reservas sobrepostas.
 *  Alguns clientes têm desconto.
 *  Cancela com até 24h de antecedência sem multa."
 */

// Value Object: Período de Tempo
export class Periodo {
  private readonly inicio: Date;
  private readonly fim: Date;

  private constructor(inicio: Date, fim: Date) {
    // REGRA: Fim deve ser após início
    if (fim <= inicio) {
      throw new Error('Fim deve ser após início');
    }
    // REGRA: Duração máxima 8 horas
    const duracao = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60);
    if (duracao > 8) {
      throw new Error('Reserva não pode exceder 8 horas');
    }
    this.inicio = inicio;
    this.fim = fim;
  }

  static criar(inicio: Date, fim: Date): Periodo {
    return new Periodo(inicio, fim);
  }

  sobrepoe(outro: Periodo): boolean {
    return this.inicio < outro.fim && this.fim > outro.inicio;
  }

  getDuracao(): number {
    return (this.fim.getTime() - this.inicio.getTime()) / (1000 * 60 * 60);
  }

  equals(outro: Periodo): boolean {
    return this.inicio.getTime() === outro.inicio.getTime() &&
           this.fim.getTime() === outro.fim.getTime();
  }
}

// Value Object: Tarifa
export class Tarifa {
  private readonly valor: number;
  private readonly percentualDesconto: number;

  private constructor(valor: number, percentualDesconto: number) {
    if (valor < 0) throw new Error('Valor não pode ser negativo');
    if (percentualDesconto < 0 || percentualDesconto > 100) {
      throw new Error('Desconto deve estar entre 0 e 100');
    }
    this.valor = valor;
    this.percentualDesconto = percentualDesconto;
  }

  static criar(valor: number, desconto: number = 0): Tarifa {
    return new Tarifa(valor, desconto);
  }

  calcular(duracao: number): number {
    const valorBruto = this.valor * duracao;
    const desconto = valorBruto * (this.percentualDesconto / 100);
    return valorBruto - desconto;
  }
}

// Entidade: Reserva
export class Reserva {
  private readonly id: Id;
  private readonly salaId: Id;
  private readonly clienteId: Id;
  private readonly periodo: Periodo;
  private readonly tarifa: Tarifa;
  private status: 'Ativa' | 'Cancelada' | 'Concluida';
  private readonly dataCriacao: Date;
  private dataCancelamento?: Date;

  private constructor(
    id: Id,
    salaId: Id,
    clienteId: Id,
    periodo: Periodo,
    tarifa: Tarifa,
    dataCriacao: Date
  ) {
    this.id = id;
    this.salaId = salaId;
    this.clienteId = clienteId;
    this.periodo = periodo;
    this.tarifa = tarifa;
    this.status = 'Ativa';
    this.dataCriacao = dataCriacao;
  }

  static criar(
    salaId: Id,
    clienteId: Id,
    periodo: Periodo,
    tarifa: Tarifa
  ): Reserva {
    return new Reserva(
      Id.create(),
      salaId,
      clienteId,
      periodo,
      tarifa,
      new Date()
    );
  }

  cancelar(): void {
    // REGRA: Só pode cancelar com 24h de antecedência
    const agora = new Date();
    const tempoAteSala = this.periodo.getInicio().getTime() - agora.getTime();
    const horasAte = tempoAteSala / (1000 * 60 * 60);

    if (horasAte < 24) {
      throw new Error('Cancelamento requer 24h de antecedência');
    }

    if (this.status !== 'Ativa') {
      throw new Error(`Não pode cancelar reserva em status ${this.status}`);
    }

    this.status = 'Cancelada';
    this.dataCancelamento = new Date();
  }

  concluir(): void {
    // REGRA: Só conclui se passou a hora de fim
    const agora = new Date();
    if (agora < this.periodo.getFim()) {
      throw new Error('Reserva ainda não pode ser concluída');
    }

    this.status = 'Concluida';
  }

  // Verificações
  estaAtivaEm(momento: Date): boolean {
    return this.status === 'Ativa' && 
           this.periodo.contem(momento);
  }

  podeSerCanceladaSemMulta(): boolean {
    const agora = new Date();
    const tempoAte = this.periodo.getInicio().getTime() - agora.getTime();
    return tempoAte >= 24 * 60 * 60 * 1000; // 24h em ms
  }

  // Cálculos
  calcularCusto(): number {
    return this.tarifa.calcular(this.periodo.getDuracao());
  }

  // Getters
  getId(): Id { return this.id; }
  getSalaId(): Id { return this.salaId; }
  getClienteId(): Id { return this.clienteId; }
  getStatus(): string { return this.status; }
  getPeriodo(): Periodo { return this.periodo; }
}

// Agregado: Sala
export class Sala {
  private readonly id: Id;
  private readonly nome: string;
  private readonly capacidade: number;
  private readonly reservas: Reserva[] = [];
  private tarifa: Tarifa;

  private constructor(
    id: Id,
    nome: string,
    capacidade: number,
    tarifa: Tarifa
  ) {
    if (capacidade <= 0) {
      throw new Error('Capacidade deve ser positiva');
    }
    this.id = id;
    this.nome = nome;
    this.capacidade = capacidade;
    this.tarifa = tarifa;
  }

  static criar(nome: string, capacidade: number, tarifa: Tarifa): Sala {
    return new Sala(Id.create(), nome, capacidade, tarifa);
  }

  reservar(clienteId: Id, periodo: Periodo): Reserva {
    // REGRA: Não pode ter sobreposições
    const existeSobreposicao = this.reservas.some(
      r => r.getStatus() === 'Ativa' && r.getPeriodo().sobrepoe(periodo)
    );

    if (existeSobreposicao) {
      throw new Error('Período já possui reserva');
    }

    const reserva = Reserva.criar(
      this.id,
      clienteId,
      periodo,
      this.tarifa
    );

    this.reservas.push(reserva);
    return reserva;
  }

  obterDisponibilidade(periodo: Periodo): boolean {
    return !this.reservas.some(
      r => r.getStatus() === 'Ativa' && r.getPeriodo().sobrepoe(periodo)
    );
  }

  // Getters
  getId(): Id { return this.id; }
  getNome(): string { return this.nome; }
  getCapacidade(): number { return this.capacidade; }
  getReservas(): Reserva[] { return this.reservas; }
}

// Domain Service: Política de Cancelamento
export class PoliticaCancelamento {
  calcularMulta(reserva: Reserva): number {
    const agora = new Date();
    const tempoAte = reserva.getPeriodo().getInicio().getTime() - agora.getTime();
    const horasAte = tempoAte / (1000 * 60 * 60);

    // REGRA DE NEGÓCIO: Escala de multa
    if (horasAte >= 24) {
      return 0; // Sem multa
    } else if (horasAte >= 12) {
      return reserva.calcularCusto() * 0.25; // 25%
    } else if (horasAte >= 0) {
      return reserva.calcularCusto() * 0.50; // 50%
    } else {
      return reserva.calcularCusto() * 1.0; // 100% (multa total)
    }
  }
}

// Repositório (Interface - Contrato)
export interface SalaRepository {
  salvar(sala: Sala): Promise<void>;
  obterPorId(id: Id): Promise<Sala | null>;
  obterTodas(): Promise<Sala[]>;
}

// Eventos de Domínio
export class ReservaFeitaEvent extends DomainEvent {
  constructor(
    private readonly salaId: Id,
    private readonly clienteId: Id,
    private readonly periodo: Periodo,
    private readonly custo: number
  ) {
    super(salaId);
  }

  getSalaId(): Id { return this.salaId; }
  getClienteId(): Id { return this.clienteId; }
  getPerido(): Periodo { return this.periodo; }
  getCusto(): number { return this.custo; }
}

export class ReservaCanceladaEvent extends DomainEvent {
  constructor(
    private readonly salaId: Id,
    private readonly reservaId: Id,
    private readonly multa: number
  ) {
    super(salaId);
  }

  getReservaId(): Id { return this.reservaId; }
  getMulta(): number { return this.multa; }
}

// Application Service
export class FazerReservaService {
  constructor(
    private salaRepository: SalaRepository,
    private eventPublisher: EventPublisher
  ) {}

  async executar(
    salaId: Id,
    clienteId: Id,
    dataInicio: Date,
    dataFim: Date,
    desconto: number = 0
  ): Promise<Reserva> {
    // 1. Obter sala
    const sala = await this.salaRepository.obterPorId(salaId);
    if (!sala) throw new Error('Sala não encontrada');

    // 2. Validar período
    const periodo = Periodo.criar(dataInicio, dataFim);

    // 3. Tentar reservar (regra no agregado)
    const tarifa = Tarifa.criar(100, desconto);
    const reserva = sala.reservar(clienteId, periodo);

    // 4. Persistir
    await this.salaRepository.salvar(sala);

    // 5. Publicar evento
    this.eventPublisher.publicar(
      new ReservaFeitaEvent(
        salaId,
        clienteId,
        periodo,
        reserva.calcularCusto()
      )
    );

    return reserva;
  }
}

// Testes (como o domínio é verificável!)
describe('Domínio: Sala de Reuniões', () => {
  it('não permite período com fim antes do início', () => {
    const agora = new Date();
    const depois = new Date(agora.getTime() + 60000);

    expect(() => Periodo.criar(depois, agora)).toThrow(
      'Fim deve ser após início'
    );
  });

  it('não permite sobreposição de reservas', () => {
    const sala = Sala.criar('Sala A', 10, Tarifa.criar(100));
    const clienteId = Id.create();

    const agora = new Date();
    const periodo1 = Periodo.criar(agora, new Date(agora.getTime() + 3600000));
    const periodo2 = Periodo.criar(
      new Date(agora.getTime() + 1800000),
      new Date(agora.getTime() + 5400000)
    );

    sala.reservar(clienteId, periodo1);

    expect(() => sala.reservar(clienteId, periodo2))
      .toThrow('Período já possui reserva');
  });

  it('aplica desconto corretamente', () => {
    const tarifa = Tarifa.criar(100, 10); // 100/hora com 10% desc
    const duracao = 2; // 2 horas
    const esperado = 100 * 2 * 0.9; // 180

    expect(tarifa.calcular(duracao)).toBe(esperado);
  });

  it('calcula multa progressiva por cancelamento', () => {
    const politica = new PoliticaCancelamento();
    const reserva = criarReservaParaBrevementeNoFuturo(); // 6h antes

    const multa = politica.calcularMulta(reserva);

    expect(multa).toBe(reserva.calcularCusto() * 0.50); // 50% de multa
  });
});
```

---

## Conclusão: Recapitulando o Porquê

```plaintext
┌─────────────────────────────────────────────────────────────┐
│     POR QUE O DOMÍNIO É O PILAR CENTRAL DE DDD             │
└─────────────────────────────────────────────────────────────┘

1. COMUNICAÇÃO
   └─ Domínio bem definido = linguagem comum
      = Especialista e Dev falam a mesma língua

2. MANUTENIBILIDADE
   └─ Domínio no código = fácil encontrar lógica
      = Novos devs entendem sem 10 horas de doc

3. QUALIDADE
   └─ Domínio explícito = regras testáveis
      = Bugs encontrados logo, antes de produção

4. ADAPTABILIDADE
   └─ Domínio isolado = mudanças localizadas
      = Requisito novo não quebra tudo

5. EVOLUIBILIDADE
   └─ Domínio bem estruturado = fácil separar em serviços
      = Monolito pode virar microsserviços naturalmente

6. VALOR DE NEGÓCIO
   └─ Domínio claro = produto reflete realidade
      = Menos retrabalho, mais satisfação

════════════════════════════════════════════════════════════════

SEM DOMÍNIO BEM DEFINIDO:
├─ Código é spaghetti
├─ Ninguém entende
├─ Mudanças quebram tudo
├─ Bugs recorrentes
├─ Dev waste (reescrever coisas)
└─ Resultado: Projeto fracassa

COM DOMÍNIO BEM DEFINIDO:
├─ Código é claro
├─ Todos entendem
├─ Mudanças são localizadas
├─ Bugs são raros
├─ Dev productivity (reutilizar conceitos)
└─ Resultado: Projeto prospera

════════════════════════════════════════════════════════════════

O Domínio é a RAIZ de tudo em DDD.
Tudo mais (eventos, agregados, bounded contexts)
é consequência de um domínio bem compreendido.

Invista tempo em descobrir o domínio ANTES de código.
Esse investimento se paga 100 vezes.
```

---

## Próximos Passos para Dominar o Domínio

```typescript
HOJE (Compreensão)
├─ Ler este documento
├─ Dialogar com especialista de negócio
└─ Fazer Event Storming

SEMANA 1 (Exploração)
├─ Criar glossário de domínio
├─ Desenhar agregados no quadro
├─ Questionar cada regra de negócio
└─ Documentar exceções e edge cases

SEMANA 2-4 (Modelagem)
├─ Criar value objects
├─ Implementar agregados
├─ Escrever testes de domínio
└─ Validar com especialista

MÊS 2+ (Refinamento)
├─ Aprender com uso real
├─ Evoluir modelo conforme apren-se
├─ Refatorar sem medo (testes cobrem)
└─ Documentar descobertas

PERMANENTE (Evangelismo)
├─ Ensinar novo desenvolvedor sobre domínio
├─ Discutir mudanças com especialista
├─ Manter código alinhado com negócio
└─ Questionar "Por quê?" frequentemente
```

---

## Recursos Finais

- **Livro**: "Domain-Driven Design" - Eric Evans (especialmente capítulos 1-3 sobre domínio)
- **Técnica**: Event Storming - Alberto Brandolini
- **Padrão**: Bounded Contexts - Core do DDD
- **Método**: Knowledge Crunching (aprender junto com especialistas)
- **Ferramenta**: Miro/Mural para visualizar domínio visualmente

---

## ✨ Últimas Reflexões

>[!note]
> "O código é a manifestação física do seu conhecimento sobre o domínio.
> Se o domínio está confuso, o código será confuso.
> Se o domínio é claro, o código será claro."
>
> "Um desenvolvedor que não entende o domínio é como um arquiteto
> que não entende as necessidades do cliente.
> Pode construir um belo prédio que ninguém quer."
>
> "Em DDD, você não está apenas escrevendo software.
> Está capturando a essência do negócio em código.
> Isso é responsabilidade sagrada."

O domínio é rei em DDD. Tudo mais é detalhe.
