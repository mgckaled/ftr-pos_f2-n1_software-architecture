# Domain-Driven Design (DDD): Uma Introdução Completa

## Índice

- [Domain-Driven Design (DDD): Uma Introdução Completa](#domain-driven-design-ddd-uma-introdução-completa)
  - [Índice](#índice)
  - [Explicações em Diferentes Níveis](#explicações-em-diferentes-níveis)
    - [Para uma criança de 5 anos](#para-uma-criança-de-5-anos)
    - [Para quem está estudando](#para-quem-está-estudando)
    - [Para profissionais experientes](#para-profissionais-experientes)
  - [Introdução Profissional a DDD](#introdução-profissional-a-ddd)
    - [Por que DDD importa?](#por-que-ddd-importa)
  - [Conceitos Fundamentais de DDD](#conceitos-fundamentais-de-ddd)
    - [1. Ubiquitous Language (Linguagem Ubíqua)](#1-ubiquitous-language-linguagem-ubíqua)
    - [2. Bounded Context](#2-bounded-context)
    - [3. Agregado](#3-agregado)
    - [4. Entity (Entidade)](#4-entity-entidade)
    - [5. Value Object](#5-value-object)
    - [6. Repository](#6-repository)
    - [7. Domain Event](#7-domain-event)
  - [Implementação Prática em TypeScript](#implementação-prática-em-typescript)
    - [Projeto de Exemplo: Sistema de E-commerce](#projeto-de-exemplo-sistema-de-e-commerce)
      - [Passo 1: Value Objects](#passo-1-value-objects)
      - [Passo 2: Entidades e Agregados](#passo-2-entidades-e-agregados)
      - [Passo 3: Domain Events](#passo-3-domain-events)
      - [Passo 4: Repository (Interface)](#passo-4-repository-interface)
      - [Passo 5: Application Service (Use Case)](#passo-5-application-service-use-case)
      - [Passo 6: Implementação do Repository](#passo-6-implementação-do-repository)
  - [Comunicação Entre Bounded Contexts](#comunicação-entre-bounded-contexts)
  - [Padrões de Projeto em DDD](#padrões-de-projeto-em-ddd)
    - [Anti-Padrões Comuns](#anti-padrões-comuns)
    - [Boas Práticas](#boas-práticas)
  - [Próximos Passos](#próximos-passos)
  - [ecursos Recomendados](#ecursos-recomendados)

## Explicações em Diferentes Níveis

### Para uma criança de 5 anos

Imagine que você está construindo uma casa com blocos de Lego. Em vez de misturar todos os blocos em uma caixa gigante, você organiza os blocos por cores e tipos: blocos vermelhos juntos, blocos azuis juntos, portas com portas, janelas com janelas.

DDD é exatamente assim! Quando criamos um programa, em vez de misturar tudo junto, separamos as coisas por "assunto" (chamado de domínio). Tudo que fala sobre clientes fica junto, tudo que fala sobre pedidos fica junto. Assim fica muito mais fácil de entender e de brincar (ou programar)!

---

### Para quem está estudando

Domain-Driven Design é uma metodologia de arquitetura de software que coloca o domínio de negócio no centro do desenvolvimento. A ideia principal é:

1. **Entender profundamente o negócio** antes de código
2. **Modelar o software** de acordo com a realidade do negócio
3. **Usar uma linguagem ubíqua** (common language) que tanto especialistas de negócio quanto desenvolvedores entendem
4. **Organizar o código** em bounded contexts, refletindo as diferentes áreas do negócio

Os benefícios incluem código mais manutenível, melhor comunicação com stakeholders, e sistemas que evoluem junto com o negócio.

---

### Para profissionais experientes

DDD fornece um framework estratégico e tático para gerenciar complexidade em sistemas corporativos. A abordagem de Strategic Design permite mapear o landscape organizacional através de Bounded Contexts, Context Maps e definir linguagem ubíqua entre subdominios.

Taticamente, implementamos através de agregados imutáveis, value objects, domain events, e repositories. O padrão de CQRS + Event Sourcing complementa DDD em cenários de alta complexidade. A real value emerge na evolução arquitetural: identificar seams, migrar monolitos em serviços autônomos, e gerenciar dependências entre contextos sem acoplamento transacional.

---

## Introdução Profissional a DDD

Domain-Driven Design é um paradigma que propõe colocar a complexidade do negócio (domínio) no centro do design de software. Desenvolvido por Eric Evans em 2003, DDD oferece uma abordagem sistemática para construir sistemas que evoluem com os requisitos do negócio.

### Por que DDD importa?

Muitos projetos fracassam porque:

- O código diverge da realidade do negócio
- Desenvolvedores e especialistas de negócio falam linguagens diferentes
- Mudanças simples no negócio causam cascatas de modificações no código
- A arquitetura não reflete a estrutura organizacional

DDD resolve isso estabelecendo uma ponte entre negócio e código através de conceitos bem definidos.

---

## Conceitos Fundamentais de DDD

### 1. Ubiquitous Language (Linguagem Ubíqua)

É o vocabulário compartilhado entre desenvolvedores, especialistas de negócio e stakeholders. Cada termo deve ter um significado único e bem definido.

**Exemplo**: Em um e-commerce:

- "Pedido" é diferente de "Carrinho"
- "Cancelamento" é diferente de "Devolução"
- "Estoque" é diferente de "Inventário"

### 2. Bounded Context

Delimita as fronteiras onde a linguagem ubíqua se aplica. Diferentes contextos podem ter diferentes interpretações do mesmo conceito.

**Exemplo**: Um "Pedido" no contexto de "Vendas" é diferente de um "Pedido" no contexto de "Estoque":

- **Vendas**: Preocupa-se com cliente, pagamento, entrega
- **Estoque**: Preocupa-se com SKU, quantidade, localização

### 3. Agregado

Um grupo de entidades e value objects que devem ser tratados como uma unidade coesa. O agregado tem uma raiz (Aggregate Root) que é o único ponto de entrada para modificar o agregado.

### 4. Entity (Entidade)

Objeto com identidade única que persiste. Duas entidades são diferentes se têm IDs diferentes, mesmo que tenham os mesmos atributos.

### 5. Value Object

Objeto que representa um valor e não tem identidade única. Dois value objects são iguais se seus atributos são iguais.

### 6. Repository

Interface que encapsula a persistência de agregados. Oferece abstração entre o domínio e a infraestrutura.

### 7. Domain Event

Acontecimento importante no domínio que deve ser registrado. Comunica mudanças entre agregados e bounded contexts.

---

## Implementação Prática em TypeScript

### Projeto de Exemplo: Sistema de E-commerce

Vamos modelar o domínio de uma loja online.

#### Passo 1: Value Objects

```typescript
// Value Object: Email
export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email {
    if (!this.isValid(value)) {
      throw new Error(`Email inválido: ${value}`);
    }
    return new Email(value);
  }

  private static isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  get(): string {
    return this.value;
  }
}

// Value Object: Preço
export class Preco {
  private readonly value: number;
  private readonly moeda: string;

  private constructor(value: number, moeda: string = 'BRL') {
    this.value = value;
    this.moeda = moeda;
  }

  static create(value: number, moeda: string = 'BRL'): Preco {
    if (value < 0) {
      throw new Error('Preço não pode ser negativo');
    }
    return new Preco(value, moeda);
  }

  equals(other: Preco): boolean {
    return this.value === other.value && this.moeda === other.moeda;
  }

  adicionar(outro: Preco): Preco {
    if (this.moeda !== outro.moeda) {
      throw new Error('Moedas diferentes');
    }
    return new Preco(this.value + outro.value, this.moeda);
  }

  get(): number {
    return this.value;
  }
}

// Value Object: ID
export class Id {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(): Id {
    return new Id(crypto.randomUUID());
  }

  static from(value: string): Id {
    return new Id(value);
  }

  equals(other: Id): boolean {
    return this.value === other.value;
  }

  get(): string {
    return this.value;
  }
}
```

#### Passo 2: Entidades e Agregados

```typescript
// Entity: Item do Pedido
export class ItemPedido {
  private readonly id: Id;
  private readonly produtoId: Id;
  private readonly quantidade: number;
  private readonly preco: Preco;

  constructor(id: Id, produtoId: Id, quantidade: number, preco: Preco) {
    this.id = id;
    this.produtoId = produtoId;
    this.quantidade = quantidade;
    this.preco = preco;
  }

  obterSubtotal(): Preco {
    const subtotal = this.preco.get() * this.quantidade;
    return Preco.create(subtotal);
  }

  getId(): Id {
    return this.id;
  }

  getProdutoId(): Id {
    return this.produtoId;
  }

  getQuantidade(): number {
    return this.quantidade;
  }

  getPreco(): Preco {
    return this.preco;
  }
}

// Aggregate Root: Pedido
export class Pedido {
  private readonly id: Id;
  private readonly clienteId: Id;
  private readonly itens: ItemPedido[] = [];
  private status: 'pendente' | 'confirmado' | 'enviado' | 'entregue' | 'cancelado';
  private readonly dataCriacao: Date;

  private constructor(id: Id, clienteId: Id, status: string, dataCriacao: Date) {
    this.id = id;
    this.clienteId = clienteId;
    this.status = status as any;
    this.dataCriacao = dataCriacao;
  }

  static criar(clienteId: Id): Pedido {
    return new Pedido(
      Id.create(),
      clienteId,
      'pendente',
      new Date()
    );
  }

  static reconstituir(dados: any): Pedido {
    const pedido = new Pedido(
      Id.from(dados.id),
      Id.from(dados.clienteId),
      dados.status,
      new Date(dados.dataCriacao)
    );

    dados.itens.forEach((item: any) => {
      pedido.itens.push(
        new ItemPedido(
          Id.from(item.id),
          Id.from(item.produtoId),
          item.quantidade,
          Preco.create(item.preco)
        )
      );
    });

    return pedido;
  }

  adicionarItem(produtoId: Id, quantidade: number, preco: Preco): void {
    if (this.status !== 'pendente') {
      throw new Error('Não é possível adicionar itens a um pedido confirmado');
    }

    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    this.itens.push(
      new ItemPedido(Id.create(), produtoId, quantidade, preco)
    );
  }

  confirmar(): void {
    if (this.itens.length === 0) {
      throw new Error('Pedido deve conter pelo menos um item');
    }

    this.status = 'confirmado';
  }

  cancelar(): void {
    if (this.status === 'enviado' || this.status === 'entregue') {
      throw new Error('Não é possível cancelar um pedido já enviado');
    }

    this.status = 'cancelado';
  }

  calcularTotal(): Preco {
    return this.itens.reduce(
      (total, item) => total.adicionar(item.obterSubtotal()),
      Preco.create(0)
    );
  }

  // Getters
  getId(): Id {
    return this.id;
  }

  getClienteId(): Id {
    return this.clienteId;
  }

  getStatus(): string {
    return this.status;
  }

  getItens(): ItemPedido[] {
    return this.itens;
  }

  getData(): Date {
    return this.dataCriacao;
  }
}
```

#### Passo 3: Domain Events

```typescript
// Domain Event
export abstract class DomainEvent {
  protected readonly ocorridoEm: Date;
  protected readonly agregadoId: Id;

  constructor(agregadoId: Id) {
    this.agregadoId = agregadoId;
    this.ocorridoEm = new Date();
  }

  getOcorridoEm(): Date {
    return this.ocorridoEm;
  }

  getAgregadoId(): Id {
    return this.agregadoId;
  }
}

// Eventos específicos
export class PedidoCriadoEvent extends DomainEvent {
  constructor(
    agregadoId: Id,
    private readonly clienteId: Id,
    private readonly total: Preco
  ) {
    super(agregadoId);
  }

  getClienteId(): Id {
    return this.clienteId;
  }

  getTotal(): Preco {
    return this.total;
  }
}

export class PedidoConfirmadoEvent extends DomainEvent {
  constructor(
    agregadoId: Id,
    private readonly total: Preco
  ) {
    super(agregadoId);
  }

  getTotal(): Preco {
    return this.total;
  }
}

export class PedidoCanceladoEvent extends DomainEvent {
  constructor(agregadoId: Id) {
    super(agregadoId);
  }
}
```

#### Passo 4: Repository (Interface)

```typescript
// Interface do Repository
export interface PedidoRepository {
  salvar(pedido: Pedido): Promise<void>;
  obterPorId(id: Id): Promise<Pedido | null>;
  obterPorClienteId(clienteId: Id): Promise<Pedido[]>;
  remover(id: Id): Promise<void>;
}
```

#### Passo 5: Application Service (Use Case)

```typescript
export class CriarPedidoService {
  constructor(private pedidoRepository: PedidoRepository) {}

  async executar(clienteId: Id, itens: Array<{ produtoId: Id; quantidade: number; preco: Preco }>): Promise<Id> {
    // Criar novo pedido (agregado)
    const pedido = Pedido.criar(clienteId);

    // Adicionar itens (lógica de negócio no agregado)
    itens.forEach(item => {
      pedido.adicionarItem(item.produtoId, item.quantidade, item.preco);
    });

    // Confirmar pedido
    pedido.confirmar();

    // Persistir
    await this.pedidoRepository.salvar(pedido);

    // Retornar ID do pedido criado
    return pedido.getId();
  }
}

export class CancelarPedidoService {
  constructor(private pedidoRepository: PedidoRepository) {}

  async executar(pedidoId: Id): Promise<void> {
    const pedido = await this.pedidoRepository.obterPorId(pedidoId);

    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    // Lógica de negócio (cancelamento)
    pedido.cancelar();

    // Persistir mudança
    await this.pedidoRepository.salvar(pedido);
  }
}
```

#### Passo 6: Implementação do Repository

```typescript
export class PedidoRepositorySQL implements PedidoRepository {
  constructor(private database: Database) {}

  async salvar(pedido: Pedido): Promise<void> {
    const dados = {
      id: pedido.getId().get(),
      clienteId: pedido.getClienteId().get(),
      status: pedido.getStatus(),
      dataCriacao: pedido.getData(),
      itens: pedido.getItens().map(item => ({
        id: item.getId().get(),
        produtoId: item.getProdutoId().get(),
        quantidade: item.getQuantidade(),
        preco: item.getPreco().get()
      }))
    };

    // Salvar no banco de dados
    await this.database.query(
      'INSERT INTO pedidos VALUES (?)',
      [JSON.stringify(dados)]
    );
  }

  async obterPorId(id: Id): Promise<Pedido | null> {
    const resultado = await this.database.query(
      'SELECT * FROM pedidos WHERE id = ?',
      [id.get()]
    );

    if (resultado.length === 0) return null;

    return Pedido.reconstituir(JSON.parse(resultado[0].dados));
  }

  async obterPorClienteId(clienteId: Id): Promise<Pedido[]> {
    const resultado = await this.database.query(
      'SELECT * FROM pedidos WHERE clienteId = ?',
      [clienteId.get()]
    );

    return resultado.map(row => Pedido.reconstituir(JSON.parse(row.dados)));
  }

  async remover(id: Id): Promise<void> {
    await this.database.query('DELETE FROM pedidos WHERE id = ?', [id.get()]);
  }
}
```

---

## Comunicação Entre Bounded Contexts

```typescript
// Context: Vendas publica um evento
export class VendasContext {
  async confirmarPedido(pedidoId: Id): Promise<void> {
    // Lógica de vendas...
    
    // Publicar evento para que Estoque saiba
    this.eventPublisher.publicar(
      new PedidoConfirmadoEvent(pedidoId, total)
    );
  }
}

// Context: Estoque se inscreve no evento
export class EstoqueContext {
  constructor(private eventSubscriber: EventSubscriber) {
    this.eventSubscriber.inscreverEm(
      PedidoConfirmadoEvent,
      this.reduzirEstoque.bind(this)
    );
  }

  private async reduzirEstoque(evento: PedidoConfirmadoEvent): Promise<void> {
    // Lógica específica do estoque
    console.log(`Reduzindo estoque para o pedido ${evento.getAgregadoId().get()}`);
  }
}
```

---

## Padrões de Projeto em DDD

### Anti-Padrões Comuns

```typescript
// ERRADO: Entidade sem regras de negócio
class PedidoErrado {
  id: string;
  clienteId: string;
  itens: any[];
  status: string;
  total: number;
}

// Fácil de violar regras de negócio:
pedidoErrado.status = 'enviado'; // Sem validação!
pedidoErrado.total = -100; // Valor inválido!
```

### Boas Práticas

```typescript
// CORRETO: Agregado com regras de negócio encapsuladas
class Pedido {
  private status: string;
  private total: Preco;

  private constructor(...) {}

  confirmar(): void {
    if (this.itens.length === 0) {
      throw new Error('Não pode confirmar pedido vazio');
    }
    this.status = 'confirmado'; // Validação dentro do agregado
  }
}

// Regras garantidas:
// - Status só muda através de métodos com lógica
// - Total é sempre válido (Preco valida)
```

---

## Próximos Passos

1. **Estratégico**: Mapear seus Bounded Contexts
2. **Tático**: Implementar Agregados, Value Objects e Repositories
3. **Evolutivo**: Usar Domain Events para comunicação entre contextos
4. **Avançado**: Considerar CQRS e Event Sourcing para contextos complexos

---

## ecursos Recomendados

- **Livro**: "Domain-Driven Design" - Eric Evans (livro azul)
- **Livro**: "Implementing Domain-Driven Design" - Vaughn Vernon
- **Padrão**: CQRS, Event Sourcing, Saga Pattern
