# Isolando o Domínio com Arquitetura em Camadas

> [Voltar](../../../README.md)

## Índice

- [Isolando o Domínio com Arquitetura em Camadas](#isolando-o-domínio-com-arquitetura-em-camadas)
  - [Índice](#índice)
  - [Visão Geral: Arquitetura em Camadas](#visão-geral-arquitetura-em-camadas)
    - [✅ Vantagens](#-vantagens)
    - [⚠️ Desvantagens](#️-desvantagens)
  - [Estrutura de Diretórios](#estrutura-de-diretórios)
  - [Exemplos de Código - Camada por Camada](#exemplos-de-código---camada-por-camada)
    - [Camada 1: DOMÍNIO (O Coração) 💎](#camada-1-domínio-o-coração-)
    - [Camada 2: APLICAÇÃO (Orquestração) 🔧](#camada-2-aplicação-orquestração-)
    - [Camada 3: APRESENTAÇÃO (HTTP) 🌐](#camada-3-apresentação-http-)
    - [Camada 4: INFRAESTRUTURA (Persistência) ⚙️](#camada-4-infraestrutura-persistência-️)
  - [Fluxo Completo de uma Requisição](#fluxo-completo-de-uma-requisição)
  - [Testando o Domínio (Isolado!)](#testando-o-domínio-isolado)
  - [Princípios da Arquitetura em Camadas](#princípios-da-arquitetura-em-camadas)
  - [Comparação com Outras Arquiteturas](#comparação-com-outras-arquiteturas)
  - [Quando Usar Arquitetura em Camadas](#quando-usar-arquitetura-em-camadas)
  - [Resumo](#resumo)

## Visão Geral: Arquitetura em Camadas

A **Arquitetura em Camadas** (Layered Architecture) organiza o sistema em camadas horizontais, cada uma com uma responsabilidade específica. O domínio fica isolado em sua própria camada, protegido de dependências externas.

``` plaintext
┌─────────────────────────────────────────────────────┐
│              APRESENTAÇÃO (UI/Controllers)          │ ← HTTP, CLI, etc
├─────────────────────────────────────────────────────┤
│              APLICAÇÃO (Use Cases)                  │ ← Orquestração
├─────────────────────────────────────────────────────┤
│              DOMÍNIO (Regras de Negócio)            │ ← 🔒 ISOLADO
├─────────────────────────────────────────────────────┤
│              INFRAESTRUTURA (Persistência)          │ ← BD, APIs, etc
└─────────────────────────────────────────────────────┘
```

### ✅ Vantagens

- **Estrutura clara e organizada** - Fácil para novos devs entenderem
- **Domínio independente** - Pode ser testado sem dependências
- **Evolução gradual** - Pode sair do monolito para microsserviços

### ⚠️ Desvantagens

- **Dependências circulares** - Risco de camadas se acoplarem
- **Mudanças atravessam camadas** - Um novo requisito pode afetar todas as 4
- **Menos flexível que Hexagonal** - Plugins não são naturais

---

## Estrutura de Diretórios

```plaintext
projeto/
│
├── src/
│   │
│   ├── 1-presentation/           ← 🌐 CAMADA DE APRESENTAÇÃO
│   │   ├── http/
│   │   │   ├── controllers/
│   │   │   │   ├── PedidoController.ts
│   │   │   │   └── ClienteController.ts
│   │   │   ├── routes/
│   │   │   │   └── pedidos.routes.ts
│   │   │   └── middleware/
│   │   │       └── errorHandler.middleware.ts
│   │   ├── dto/
│   │   │   ├── CriarPedidoDTO.ts
│   │   │   └── ResponseDTO.ts
│   │   └── serializers/
│   │       └── PedidoSerializer.ts
│   │
│   ├── 2-application/            ← 🔧 CAMADA DE APLICAÇÃO
│   │   ├── services/
│   │   │   ├── CriarPedidoService.ts
│   │   │   ├── ConfirmarPedidoService.ts
│   │   │   └── CancelarPedidoService.ts
│   │   ├── assemblers/
│   │   │   └── PedidoAssembler.ts
│   │   └── facades/
│   │       └── PedidoFacade.ts
│   │
│   ├── 3-domain/                 ← 💎 CAMADA DE DOMÍNIO
│   │   ├── entities/
│   │   │   ├── Pedido.ts
│   │   │   ├── Cliente.ts
│   │   │   └── ItemPedido.ts
│   │   ├── value-objects/
│   │   │   ├── Email.ts
│   │   │   ├── Preco.ts
│   │   │   └── Periodo.ts
│   │   ├── events/
│   │   │   ├── PedidoCriadoEvent.ts
│   │   │   ├── PedidoConfirmadoEvent.ts
│   │   │   └── DomainEvent.ts
│   │   ├── repositories/
│   │   │   ├── IPedidoRepository.ts
│   │   │   ├── IClienteRepository.ts
│   │   │   └── IEventPublisher.ts
│   │   └── specifications/
│   │       └── PedidoPoderSerCanceladoSpec.ts
│   │
│   └── 4-infrastructure/         ← ⚙️ CAMADA DE INFRAESTRUTURA
│       ├── persistence/
│       │   ├── database/
│       │   │   ├── PedidoRepositorySQL.ts
│       │   │   ├── ClienteRepositorySQL.ts
│       │   │   └── DatabaseConnection.ts
│       │   └── migrations/
│       │       └── 001-create-pedidos-table.sql
│       ├── external/
│       │   ├── PaymentGateway.ts
│       │   └── EmailService.ts
│       ├── messaging/
│       │   ├── EventPublisherKafka.ts
│       │   └── EventSubscriberKafka.ts
│       └── config/
│           └── app.config.ts
│
└── tests/
    ├── unit/
    │   └── domain/
    │       ├── Pedido.test.ts
    │       └── Email.test.ts
    ├── integration/
    │   └── application/
    │       └── CriarPedidoService.test.ts
    └── e2e/
        └── pedidos.e2e.test.ts
```

---

## Exemplos de Código - Camada por Camada

### Camada 1: DOMÍNIO (O Coração) 💎

```typescript
// src/3-domain/value-objects/Email.ts
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

// src/3-domain/value-objects/Preco.ts
export class Preco {
  private readonly valor: number;
  private readonly moeda: string;

  private constructor(valor: number, moeda: string = 'BRL') {
    this.valor = valor;
    this.moeda = moeda;
  }

  static create(valor: number, moeda: string = 'BRL'): Preco {
    // REGRA DE NEGÓCIO: Preço não pode ser negativo
    if (valor < 0) {
      throw new Error('Preço não pode ser negativo');
    }
    return new Preco(valor, moeda);
  }

  adicionar(outro: Preco): Preco {
    if (this.moeda !== outro.moeda) {
      throw new Error('Moedas diferentes');
    }
    return new Preco(this.valor + outro.valor, this.moeda);
  }

  multiplicar(quantidade: number): Preco {
    return new Preco(this.valor * quantidade, this.moeda);
  }

  equals(other: Preco): boolean {
    return this.valor === other.valor && this.moeda === other.moeda;
  }

  get(): number {
    return this.valor;
  }
}

// src/3-domain/entities/Pedido.ts
export class Pedido {
  private readonly id: string;
  private readonly clienteId: string;
  private readonly itens: ItemPedido[] = [];
  private status: 'Pendente' | 'Confirmado' | 'Enviado' | 'Entregue' | 'Cancelado';
  private readonly dataCriacao: Date;
  private eventos: DomainEvent[] = [];

  private constructor(
    id: string,
    clienteId: string,
    status: string,
    dataCriacao: Date
  ) {
    this.id = id;
    this.clienteId = clienteId;
    this.status = status as any;
    this.dataCriacao = dataCriacao;
  }

  // Factory Method
  static criar(clienteId: string): Pedido {
    const pedido = new Pedido(
      this.gerarId(),
      clienteId,
      'Pendente',
      new Date()
    );

    pedido.adicionarEvento(
      new PedidoCriadoEvent(pedido.id, clienteId)
    );

    return pedido;
  }

  // REGRA: Não pode adicionar itens a pedido confirmado
  adicionarItem(produtoId: string, quantidade: number, preco: Preco): void {
    if (this.status !== 'Pendente') {
      throw new Error(
        `Não é possível adicionar itens a um pedido ${this.status}`
      );
    }

    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    this.itens.push(
      new ItemPedido(this.gerarId(), produtoId, quantidade, preco)
    );
  }

  // REGRA: Pedido precisa ter itens para confirmar
  confirmar(): void {
    if (this.itens.length === 0) {
      throw new Error('Não é possível confirmar pedido sem itens');
    }

    if (this.status !== 'Pendente') {
      throw new Error(`Pedido já foi ${this.status}`);
    }

    this.status = 'Confirmado';

    this.adicionarEvento(
      new PedidoConfirmadoEvent(this.id, this.calcularTotal())
    );
  }

  // REGRA: Cancelamento com restrições
  cancelar(): void {
    if (this.status !== 'Pendente') {
      throw new Error(
        `Pedido ${this.status} não pode ser cancelado. ` +
        `Considere uma devolução em vez disso.`
      );
    }

    this.status = 'Cancelado';

    this.adicionarEvento(
      new PedidoCanceladoEvent(this.id)
    );
  }

  // Cálculos
  calcularTotal(): Preco {
    return this.itens.reduce(
      (total, item) => total.adicionar(item.calcularSubtotal()),
      Preco.create(0)
    );
  }

  // Getters
  getId(): string { return this.id; }
  getClienteId(): string { return this.clienteId; }
  getStatus(): string { return this.status; }
  getItens(): ItemPedido[] { return this.itens; }
  getEventos(): DomainEvent[] { return this.eventos; }

  private adicionarEvento(evento: DomainEvent): void {
    this.eventos.push(evento);
  }

  private static gerarId(): string {
    return crypto.randomUUID();
  }
}

// src/3-domain/repositories/IPedidoRepository.ts
export interface IPedidoRepository {
  salvar(pedido: Pedido): Promise<void>;
  obterPorId(id: string): Promise<Pedido | null>;
  obterPorClienteId(clienteId: string): Promise<Pedido[]>;
}
```

### Camada 2: APLICAÇÃO (Orquestração) 🔧

```typescript
// src/2-application/services/CriarPedidoService.ts
export class CriarPedidoService {
  constructor(
    private pedidoRepository: IPedidoRepository,
    private clienteRepository: IClienteRepository,
    private eventPublisher: IEventPublisher
  ) {}

  async executar(comando: CriarPedidoComando): Promise<string> {
    // 1. Validar se cliente existe (não é regra de domínio, é integração)
    const cliente = await this.clienteRepository.obterPorId(
      comando.clienteId
    );

    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    // 2. Criar agregado (toda lógica de negócio aqui)
    const pedido = Pedido.criar(comando.clienteId);

    // 3. Adicionar itens ao pedido
    for (const item of comando.itens) {
      const preco = Preco.create(item.preco);
      pedido.adicionarItem(item.produtoId, item.quantidade, preco);
    }

    // 4. Confirmar o pedido
    pedido.confirmar();

    // 5. Persistir (infraestrutura)
    await this.pedidoRepository.salvar(pedido);

    // 6. Publicar eventos de domínio (infraestrutura)
    for (const evento of pedido.getEventos()) {
      await this.eventPublisher.publicar(evento);
    }

    // 7. Retornar resultado
    return pedido.getId();
  }
}

// src/2-application/dto/CriarPedidoDTO.ts
export class CriarPedidoDTO {
  constructor(
    readonly clienteId: string,
    readonly itens: Array<{
      produtoId: string;
      quantidade: number;
      preco: number;
    }>
  ) {}
}

// src/2-application/facades/PedidoFacade.ts
/**
 * Facade simplifica a interface de múltiplos services
 * É o "portão de entrada" para a aplicação
 */
export class PedidoFacade {
  constructor(
    private criarPedidoService: CriarPedidoService,
    private confirmarPedidoService: ConfirmarPedidoService,
    private cancelarPedidoService: CancelarPedidoService
  ) {}

  async criar(dto: CriarPedidoDTO): Promise<string> {
    return this.criarPedidoService.executar(dto);
  }

  async confirmar(pedidoId: string): Promise<void> {
    return this.confirmarPedidoService.executar(pedidoId);
  }

  async cancelar(pedidoId: string): Promise<void> {
    return this.cancelarPedidoService.executar(pedidoId);
  }
}
```

### Camada 3: APRESENTAÇÃO (HTTP) 🌐

```typescript
// src/1-presentation/http/controllers/PedidoController.ts
import { Request, Response } from 'express';

export class PedidoController {
  constructor(private pedidoFacade: PedidoFacade) {}

  async criar(req: Request, res: Response): Promise<void> {
    try {
      // 1. Validar entrada HTTP
      const { clienteId, itens } = req.body;

      if (!clienteId || !Array.isArray(itens)) {
        res.status(400).json({ erro: 'Dados inválidos' });
        return;
      }

      // 2. Criar DTO (contrato entre apresentação e aplicação)
      const dto = new CriarPedidoDTO(clienteId, itens);

      // 3. Chamar aplicação (que chama domínio)
      const pedidoId = await this.pedidoFacade.criar(dto);

      // 4. Retornar resposta HTTP
      res.status(201).json({
        sucesso: true,
        pedidoId,
        mensagem: 'Pedido criado com sucesso'
      });

    } catch (erro) {
      // Tratamento de erro da apresentação
      res.status(500).json({
        sucesso: false,
        erro: erro.message
      });
    }
  }

  async confirmar(req: Request, res: Response): Promise<void> {
    try {
      const { pedidoId } = req.params;

      await this.pedidoFacade.confirmar(pedidoId);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Pedido confirmado com sucesso'
      });

    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        erro: erro.message
      });
    }
  }
}

// src/1-presentation/http/routes/pedidos.routes.ts
import { Router } from 'express';

export function createPedidosRouter(pedidoController: PedidoController): Router {
  const router = Router();

  router.post('/', (req, res) => pedidoController.criar(req, res));
  router.put('/:pedidoId/confirmar', (req, res) =>
    pedidoController.confirmar(req, res)
  );

  return router;
}
```

### Camada 4: INFRAESTRUTURA (Persistência) ⚙️

```typescript
// src/4-infrastructure/persistence/database/PedidoRepositorySQL.ts
export class PedidoRepositorySQL implements IPedidoRepository {
  constructor(private database: Database) {}

  async salvar(pedido: Pedido): Promise<void> {
    // Serializar agregado para formato de banco
    const dados = {
      id: pedido.getId(),
      cliente_id: pedido.getClienteId(),
      status: pedido.getStatus(),
      data_criacao: pedido.getData(),
      itens: pedido.getItens().map(item => ({
        id: item.getId(),
        produto_id: item.getProdutoId(),
        quantidade: item.getQuantidade(),
        preco: item.getPreco().get()
      }))
    };

    // Executar query (infraestrutura pura)
    await this.database.query(
      `INSERT INTO pedidos (id, cliente_id, status, data_criacao, itens)
       VALUES (?, ?, ?, ?, ?)`,
      [
        dados.id,
        dados.cliente_id,
        dados.status,
        dados.data_criacao,
        JSON.stringify(dados.itens)
      ]
    );
  }

  async obterPorId(id: string): Promise<Pedido | null> {
    const resultado = await this.database.query(
      'SELECT * FROM pedidos WHERE id = ?',
      [id]
    );

    if (resultado.length === 0) return null;

    // Desserializar para agregado
    return this.mapearParaPedido(resultado[0]);
  }

  private mapearParaPedido(row: any): Pedido {
    // Reconstruir agregado a partir dos dados do banco
    const pedido = Pedido.reconstituir(
      row.id,
      row.cliente_id,
      row.status,
      new Date(row.data_criacao)
    );

    // Adicionar itens
    const itens = JSON.parse(row.itens);
    itens.forEach((item: any) => {
      pedido.adicionarItem(
        item.produto_id,
        item.quantidade,
        Preco.create(item.preco)
      );
    });

    return pedido;
  }
}

// src/4-infrastructure/external/EmailService.ts
export class EmailService {
  constructor(private httpClient: HttpClient) {}

  async enviarConfirmacao(email: Email, pedidoId: string): Promise<void> {
    // Chamada externa a serviço de email
    await this.httpClient.post('https://sendgrid.com/api/mail/send', {
      to: email.get(),
      subject: `Pedido ${pedidoId} Confirmado`,
      body: 'Seu pedido foi confirmado com sucesso!'
    });
  }
}
```

---

## Fluxo Completo de uma Requisição

```plaintext
┌─────────────────────────────────────────────────────────────────┐
│ 1. APRESENTAÇÃO: Requisição HTTP POST /pedidos                  │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. PedidoController valida e cria DTO                           │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. APLICAÇÃO: PedidoFacade → CriarPedidoService                 │
│    - Valida cliente                                             │
│    - Orquestra chamadas                                         │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. DOMÍNIO: Pedido.criar() e confirmar()                        │
│    - 🔒 Executa regras de negócio                               │
│    - 🔒 Valida estados                                          │
│    - 🔒 Gera eventos                                            │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. INFRAESTRUTURA: PedidoRepositorySQL.salvar()                 │
│    - Serializa para BD                                          │
│    - Executa INSERT SQL                                         │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. INFRAESTRUTURA: EventPublisherKafka.publicar()               │
│    - Publica eventos para fila de mensagens                     │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. APRESENTAÇÃO: Retorna resposta JSON                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Testando o Domínio (Isolado!)

```typescript
// tests/unit/domain/Pedido.test.ts

describe('Domínio: Pedido', () => {
  
  // ✅ Teste unitário puro - SEM dependências externas
  it('deve confirmar pedido com itens', () => {
    // Arrange
    const pedido = Pedido.criar('cliente-123');
    pedido.adicionarItem('prod-1', 2, Preco.create(100));

    // Act
    pedido.confirmar();

    // Assert
    expect(pedido.getStatus()).toBe('Confirmado');
  });

  it('deve rejeitar confirmação sem itens', () => {
    // Arrange
    const pedido = Pedido.criar('cliente-123');

    // Act & Assert
    expect(() => pedido.confirmar()).toThrow(
      'Não é possível confirmar pedido sem itens'
    );
  });

  it('deve rejeitar cancelamento após confirmação', () => {
    // Arrange
    const pedido = Pedido.criar('cliente-123');
    pedido.adicionarItem('prod-1', 2, Preco.create(100));
    pedido.confirmar();

    // Act & Assert
    expect(() => pedido.cancelar()).toThrow(
      'Pedido Confirmado não pode ser cancelado'
    );
  });

  it('deve calcular total corretamente', () => {
    // Arrange
    const pedido = Pedido.criar('cliente-123');
    pedido.adicionarItem('prod-1', 2, Preco.create(50));  // 2 × 50 = 100
    pedido.adicionarItem('prod-2', 3, Preco.create(30));  // 3 × 30 = 90

    // Act
    const total = pedido.calcularTotal();

    // Assert
    expect(total.get()).toBe(190);
  });
});

// tests/integration/application/CriarPedidoService.test.ts

describe('Aplicação: CriarPedidoService', () => {
  
  let service: CriarPedidoService;
  let mockPedidoRepository: jest.Mocked<IPedidoRepository>;
  let mockClienteRepository: jest.Mocked<IClienteRepository>;
  let mockEventPublisher: jest.Mocked<IEventPublisher>;

  beforeEach(() => {
    // Setup mocks
    mockPedidoRepository = jest.genMockFromModule('IPedidoRepository');
    mockClienteRepository = jest.genMockFromModule('IClienteRepository');
    mockEventPublisher = jest.genMockFromModule('IEventPublisher');

    service = new CriarPedidoService(
      mockPedidoRepository,
      mockClienteRepository,
      mockEventPublisher
    );
  });

  it('deve criar e persistir pedido', async () => {
    // Arrange
    mockClienteRepository.obterPorId.mockResolvedValue(
      new Cliente('cliente-123', 'João')
    );

    const comando = new CriarPedidoComando('cliente-123', [
      { produtoId: 'prod-1', quantidade: 2, preco: 100 }
    ]);

    // Act
    const pedidoId = await service.executar(comando);

    // Assert
    expect(mockPedidoRepository.salvar).toHaveBeenCalled();
    expect(mockEventPublisher.publicar).toHaveBeenCalled();
    expect(pedidoId).toBeDefined();
  });
});
```

---

## Princípios da Arquitetura em Camadas

| Princípio                  | Explicação                                  |
| -------------------------- | ------------------------------------------- |
| **Isolamento**             | Cada camada depende apenas da camada abaixo |
| **Responsabilidade Única** | Cada camada tem uma responsabilidade clara  |
| **Testabilidade**          | Domínio é testável sem infraestrutura       |
| **Manutenibilidade**       | Código organizado e fácil de encontrar      |
| **Reusabilidade**          | Regras de negócio podem ser reutilizadas    |

---

## Comparação com Outras Arquiteturas

| Aspecto                | Camadas | Hexagonal  | Microsserviços |
| ---------------------- | ------- | ---------- | -------------- |
| **Simplicidade**       | ⭐⭐⭐⭐    | ⭐⭐⭐        | ⭐⭐             |
| **Isolamento Domínio** | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐      | ⭐⭐⭐⭐⭐          |
| **Escalabilidade**     | ⭐⭐      | ⭐⭐⭐        | ⭐⭐⭐⭐⭐          |
| **Complexidade**       | Média   | Média-Alta | Muito Alta     |

---

## Quando Usar Arquitetura em Camadas

✅ **USE quando:**

- Projeto é pequeno a médio
- Equipe é pequena (1-3 devs)
- Não há requisitos de alta escalabilidade
- Quer simplicidade e organização

❌ **EVITE quando:**

- Sistema tem múltiplos contextos independentes
- Precisa escalabilidade por domínio
- Quer permitir plugins/extensões
- Planeja usar microsserviços

---

## Resumo

A **Arquitetura em Camadas** é a escolha perfeita para **isolar o domínio** em projetos monolíticos de tamanho pequeno a médio. Oferece clareza, organização e facilita testes do domínio sem dependências externas.

A chave é **respeitar os limites de camada**: nunca deixe a apresentação falar diretamente com a infraestrutura, sempre passe pela aplicação. Assim o domínio fica 🔒 protegido.
