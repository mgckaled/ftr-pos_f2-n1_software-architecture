<!-- markdownlint-disable MD024 -->

# Guia de Arquitetura DDD e Hexagonal (Sistemas de Pagamento)

> [Voltar](../../../README.md)

## Índice

- [Guia de Arquitetura DDD e Hexagonal (Sistemas de Pagamento)](#guia-de-arquitetura-ddd-e-hexagonal-sistemas-de-pagamento)
  - [Índice](#índice)
  - [1. ENTITIES (Entidades)](#1-entities-entidades)
    - [Para uma criança de 5 anos](#para-uma-criança-de-5-anos)
    - [Para um estudante](#para-um-estudante)
    - [Para um programador profissional](#para-um-programador-profissional)
    - [Exemplo em TypeScript: Entidade Transaction (Transação)](#exemplo-em-typescript-entidade-transaction-transação)
  - [2. VALUE OBJECTS (Objetos de Valor)](#2-value-objects-objetos-de-valor)
    - [Para uma criança de 5 anos](#para-uma-criança-de-5-anos-1)
    - [Para um estudante](#para-um-estudante-1)
    - [Para um programador profissional](#para-um-programador-profissional-1)
    - [Exemplo em TypeScript: Value Objects para Sistema de Pagamento](#exemplo-em-typescript-value-objects-para-sistema-de-pagamento)
  - [3. AGREGADOS (Aggregates)](#3-agregados-aggregates)
    - [Para uma criança de 5 anos](#para-uma-criança-de-5-anos-2)
    - [Para um estudante](#para-um-estudante-2)
    - [Para um programador profissional](#para-um-programador-profissional-2)
    - [Exemplo em TypeScript: Agregado Payment (Pagamento)](#exemplo-em-typescript-agregado-payment-pagamento)
  - [4. REPOSITORY](#4-repository)
    - [Para uma criança de 5 anos 🧒](#para-uma-criança-de-5-anos-)
    - [Para um estudante 🎓](#para-um-estudante-)
    - [Para um programador profissional 👨‍💼](#para-um-programador-profissional-)
    - [Exemplo em TypeScript: Payment Repository](#exemplo-em-typescript-payment-repository)
  - [5. USE CASES (Casos de Uso)](#5-use-cases-casos-de-uso)
    - [Para uma criança de 5 anos 🧒](#para-uma-criança-de-5-anos--1)
    - [Para um estudante 🎓](#para-um-estudante--1)
    - [Para um programador profissional 👨‍💼](#para-um-programador-profissional--1)
    - [Exemplo em TypeScript: Create Payment Use Case](#exemplo-em-typescript-create-payment-use-case)
  - [6. SERVICES (Serviços de Domínio)](#6-services-serviços-de-domínio)
    - [Para uma criança de 5 anos 🧒](#para-uma-criança-de-5-anos--2)
    - [Para um estudante 🎓](#para-um-estudante--2)
    - [Para um programador profissional 👨‍💼](#para-um-programador-profissional--2)
    - [Exemplo em TypeScript: Domain Services](#exemplo-em-typescript-domain-services)
  - [7. CONTROLLERS](#7-controllers)
    - [Para uma criança de 5 anos 🧒](#para-uma-criança-de-5-anos--3)
    - [Para um estudante 🎓](#para-um-estudante--3)
    - [Para um programador profissional 👨‍💼](#para-um-programador-profissional--3)
    - [Exemplo em TypeScript: Controllers para Pagamentos](#exemplo-em-typescript-controllers-para-pagamentos)
  - [8. ADAPTERS (Adaptadores)](#8-adapters-adaptadores)
    - [Para uma criança de 5 anos 🧒](#para-uma-criança-de-5-anos--4)
    - [Para um estudante 🎓](#para-um-estudante--4)
    - [Para um programador profissional 👨‍💼](#para-um-programador-profissional--4)
    - [Exemplo em TypeScript: Adapters de Entrada e Saída](#exemplo-em-typescript-adapters-de-entrada-e-saída)
  - [9. INTERFACES (Contratos)](#9-interfaces-contratos)
    - [Para uma criança de 5 anos 🧒](#para-uma-criança-de-5-anos--5)
    - [Para um estudante 🎓](#para-um-estudante--5)
    - [Para um programador profissional 👨‍💼](#para-um-programador-profissional--5)
    - [Exemplo em TypeScript: Interfaces e Contratos](#exemplo-em-typescript-interfaces-e-contratos)
  - [📊 DIAGRAMA GERAL: ARQUITETURA HEXAGONAL COM DDD](#-diagrama-geral-arquitetura-hexagonal-com-ddd)
  - [FLUXO DE UMA REQUISIÇÃO](#fluxo-de-uma-requisição)
  - [ESTRUTURA DE PASTAS RECOMENDADA](#estrutura-de-pastas-recomendada)
  - [EXEMPLO COMPLETO: CRIAR E PROCESSAR PAGAMENTO](#exemplo-completo-criar-e-processar-pagamento)
  - [🧪 TESTES UNITÁRIOS COM MOCKS](#-testes-unitários-com-mocks)
  - [RESUMO: COMO OS CONCEITOS TRABALHAM JUNTOS](#resumo-como-os-conceitos-trabalham-juntos)
  - [BENEFÍCIOS DESSA ARQUITETURA](#benefícios-dessa-arquitetura)
  - [📚 REFERÊNCIAS E PRÓXIMOS PASSOS](#-referências-e-próximos-passos)
    - [Conceitos avançados a explorar](#conceitos-avançados-a-explorar)
    - [Padrões complementares](#padrões-complementares)
  - [CONCLUSÃO](#conclusão)

---

## 1. ENTITIES (Entidades)

### Para uma criança de 5 anos

Uma entidade é como um personagem em um livro de histórias. Cada personagem tem um nome especial que nunca muda (mesmo que fique mais velho), e essa é sua identidade. O personagem pode mudar de roupa, ficar mais alto, mas continua sendo a mesma pessoa. Uma entidade é assim: tem um identificador único (como seu nome) e pode mudar de outras formas, mas continua sendo ela mesma.

### Para um estudante

Uma entidade é um objeto do domínio que possui identidade única e contínuidade ao longo de seu ciclo de vida. Diferentemente de um Value Object, a entidade é identificada por um identificador único (ID) e não pela igualdade de seus atributos. Duas entidades com os mesmos atributos continuam sendo entidades diferentes se tiverem IDs diferentes. Entidades encapsulam comportamento e estado relacionados a um conceito importante do negócio.

### Para um programador profissional

Uma Entidade em DDD é um objeto fundamental do modelo de domínio caracterizado pela identidade única e pela continuidade de sua vida útil. Entidades possuem um identificador que as diferencia de outras instâncias, independentemente de seus atributos. Elas encapsulam tanto estado quanto comportamento, permitindo que regras de negócio importantes sejam expressas através de métodos. A igualdade entre entidades é baseada em identidade, não em valor, distinguindo-as fundamentalmente de Value Objects.

### Exemplo em TypeScript: Entidade Transaction (Transação)

```typescript
// Domínio - Transaction é uma Entidade
export class Transaction {
  // Identificador único - define a identidade
  private readonly _id: TransactionId;
  
  // Estado mutável
  private _amount: Money;
  private _status: TransactionStatus;
  private _createdAt: Date;
  private _updatedAt: Date;
  
  constructor(
    id: TransactionId,
    amount: Money,
    status: TransactionStatus,
  ) {
    this._id = id;
    this._amount = amount;
    this._status = status;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }
  
  // Getter para o identificador único
  get id(): TransactionId {
    return this._id;
  }
  
  get amount(): Money {
    return this._amount;
  }
  
  get status(): TransactionStatus {
    return this._status;
  }
  
  // Comportamento de negócio
  approve(): void {
    if (this._status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can be approved');
    }
    this._status = TransactionStatus.APPROVED;
    this._updatedAt = new Date();
  }
  
  reject(reason: string): void {
    if (this._status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can be rejected');
    }
    this._status = TransactionStatus.REJECTED;
    this._updatedAt = new Date();
  }
  
  // Igualdade baseada em identidade, não em valor
  equals(other: Transaction): boolean {
    return this._id.equals(other._id);
  }
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}
```

---

## 2. VALUE OBJECTS (Objetos de Valor)

### Para uma criança de 5 anos

Um Value Object é como uma moeda. Se você tem duas moedas de R$10, elas são iguais, não importa qual você pegar. O que importa é o valor da moeda, não qual moeda específica você tem. Se uma moeda for diferente em qualquer coisa, aí não é mais igual.

### Para um estudante

Um Value Object é um objeto imutável do domínio cuja igualdade é baseada no valor de todos os seus atributos, não em uma identidade única. Diferentemente das Entidades, dois Value Objects com os mesmos atributos são considerados iguais. Value Objects não possuem um identificador único e, uma vez criados, não podem ser modificados. Eles são usados para expressar conceitos simples mas importantes do negócio de forma segura e clara.

### Para um programador profissional

Um Value Object em DDD é um objeto imutável cujos atributos definem completamente sua identidade. Objetos de valor não possuem identidade única; sua igualdade é determinada pela igualdade de seus atributos. Devem ser imutáveis para garantir que mudanças no estado levem à criação de novas instâncias. Value Objects são especialmente úteis para encapsular conceitos de negócio simples (como dinheiro, endereço, email) e para validação de invariantes.

### Exemplo em TypeScript: Value Objects para Sistema de Pagamento

```typescript
// Money é um Value Object - representa quantidade de moeda
export class Money {
  private readonly _amount: number;
  private readonly _currency: string;
  
  constructor(amount: number, currency: string = 'BRL') {
    // Validação de invariante
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a valid 3-letter code');
    }
    this._amount = amount;
    this._currency = currency;
  }
  
  get amount(): number {
    return this._amount;
  }
  
  get currency(): string {
    return this._currency;
  }
  
  // Operações retornam novos Value Objects (imutabilidade)
  add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this._amount + other._amount, this._currency);
  }
  
  subtract(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot subtract different currencies');
    }
    return new Money(this._amount - other._amount, this._currency);
  }
  
  // Igualdade por valor
  equals(other: Money): boolean {
    return (
      this._amount === other._amount &&
      this._currency === other._currency
    );
  }
  
  isGreaterThan(other: Money): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this._amount > other._amount;
  }
}

// Email é um Value Object
export class Email {
  private readonly _value: string;
  
  constructor(value: string) {
    // Validação com regex simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format');
    }
    this._value = value.toLowerCase();
  }
  
  get value(): string {
    return this._value;
  }
  
  equals(other: Email): boolean {
    return this._value === other._value;
  }
}

// TransactionId é um Value Object que encapsula o identificador
export class TransactionId {
  private readonly _value: string;
  
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('TransactionId cannot be empty');
    }
    this._value = value;
  }
  
  get value(): string {
    return this._value;
  }
  
  equals(other: TransactionId): boolean {
    return this._value === other._value;
  }
}
```

---

## 3. AGREGADOS (Aggregates)

### Para uma criança de 5 anos

Um agregado é como uma caixa com vários brinquedos dentro. Há um brinquedo especial que é o "chefe" da caixa (a raiz do agregado). Se você quer mexer com os brinquedos, você só fala com o chefe. O chefe cuida de todos os outros brinquedos e garante que tudo fica bem organizado.

### Para um estudante

Um Agregado é um cluster de objetos de domínio (Entidades e Value Objects) que devem ser tratados como uma unidade única. Existe uma Entidade raiz (Aggregate Root) que controla o acesso aos outros objetos do agregado. Invariantes de negócio são garantidas apenas no nível do agregado. Comunicação entre agregados acontece apenas através das raízes de agregados, mantendo consistência transacional e facilitando a compreensão do modelo.

### Para um programador profissional

Um Agregado em DDD é um padrão de design que agrupa Entidades e Value Objects em torno de uma Aggregate Root. A raiz é a única entidade do agregado acessível do exterior; acesso aos outros objetos acontece apenas através dela. Agregados estabelece limites de consistência: invariantes de negócio são mantidas atomicamente no nível do agregado. Transações devem afetam apenas um agregado por vez, facilitando escalabilidade e clareza semântica. Agregados comunicam-se através de identidades, não referências diretas.

### Exemplo em TypeScript: Agregado Payment (Pagamento)

```typescript
// Aggregate Root - Payment controla todo o agregado
export class Payment {
  private readonly _id: PaymentId;
  private readonly _accountId: AccountId;
  private _amount: Money;
  private _status: PaymentStatus;
  private readonly _transactions: Transaction[] = [];
  private _createdAt: Date;
  private _updatedAt: Date;
  
  constructor(
    id: PaymentId,
    accountId: AccountId,
    amount: Money,
  ) {
    // Validação de invariantes do agregado
    if (amount.amount <= 0) {
      throw new Error('Payment amount must be positive');
    }
    
    this._id = id;
    this._accountId = accountId;
    this._amount = amount;
    this._status = PaymentStatus.PENDING;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }
  
  get id(): PaymentId {
    return this._id;
  }
  
  get accountId(): AccountId {
    return this._accountId;
  }
  
  get amount(): Money {
    return this._amount;
  }
  
  get status(): PaymentStatus {
    return this._status;
  }
  
  // Acesso read-only às transações
  get transactions(): ReadonlyArray<Transaction> {
    return Object.freeze([...this._transactions]);
  }
  
  // Operação do agregado: adicionar transação
  addTransaction(transaction: Transaction): void {
    // Invariante: só pode adicionar transações a pagamentos pendentes
    if (this._status !== PaymentStatus.PENDING) {
      throw new Error('Cannot add transactions to non-pending payments');
    }
    
    // Invariante: transação não pode estar duplicada
    if (this._transactions.some(t => t.equals(transaction))) {
      throw new Error('Transaction already added to this payment');
    }
    
    this._transactions.push(transaction);
    this._updatedAt = new Date();
  }
  
  // Operação do agregado: processar pagamento
  process(): void {
    if (this._transactions.length === 0) {
      throw new Error('Cannot process payment without transactions');
    }
    
    if (this._status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payments can be processed');
    }
    
    this._status = PaymentStatus.PROCESSING;
    this._updatedAt = new Date();
  }
  
  // Operação do agregado: confirmar pagamento
  confirm(): void {
    if (this._status !== PaymentStatus.PROCESSING) {
      throw new Error('Only processing payments can be confirmed');
    }
    
    // Invariante: todas as transações devem estar aprovadas
    const allApproved = this._transactions.every(
      t => t.status === TransactionStatus.APPROVED
    );
    
    if (!allApproved) {
      throw new Error('Not all transactions are approved');
    }
    
    this._status = PaymentStatus.COMPLETED;
    this._updatedAt = new Date();
  }
  
  // Operação do agregado: rejeitar pagamento
  reject(reason: string): void {
    if (this._status === PaymentStatus.COMPLETED || 
        this._status === PaymentStatus.REJECTED) {
      throw new Error('Cannot reject a completed or already rejected payment');
    }
    
    this._status = PaymentStatus.REJECTED;
    this._updatedAt = new Date();
  }
  
  equals(other: Payment): boolean {
    return this._id.equals(other._id);
  }
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

// Tipos de identificadores para os agregados
export class PaymentId {
  constructor(private readonly value: string) {
    if (!value) throw new Error('PaymentId cannot be empty');
  }
  
  equals(other: PaymentId): boolean {
    return this.value === other.value;
  }
}

export class AccountId {
  constructor(private readonly value: string) {
    if (!value) throw new Error('AccountId cannot be empty');
  }
  
  equals(other: AccountId): boolean {
    return this.value === other.value;
  }
}
```

---

## 4. REPOSITORY

### Para uma criança de 5 anos 🧒

Um Repository é como a biblioteca da sua escola. Quando você quer um livro, vai até a bibliotecária e pede. Você não precisa saber onde exatamente o livro está guardado, só diz o nome e ela acha para você. O Repository funciona assim: você pede dados e ele traz, sem você precisar saber se estão num arquivo, num banco de dados ou em outro lugar qualquer.

### Para um estudante 🎓

Um Repository é um padrão que abstrai a persistência de agregados. Atua como uma coleção em memória simulada, fornecendo métodos para adicionar, remover e recuperar agregados. O Repository encapsula toda a lógica de acesso ao banco de dados, permitindo que o domínio não tenha dependência com detalhes de infraestrutura. Do ponto de vista do domínio, trabalha-se com agregados, não com tabelas ou consultas SQL.

### Para um programador profissional 👨‍💼

Um Repository em DDD implementa o padrão Repository, servindo como um intermediário entre a camada de domínio e a camada de infraestrutura. Encapsula a lógica de persistência de agregados, oferecendo uma abstração que apresenta agregados como uma coleção em memória. Implementações específicas (SQL, NoSQL, etc.) ficam isoladas, permitindo testes e mudanças sem afetar o domínio. Repositories trabalham com agregados inteiros, não com entidades individuais, garantindo consistência.

### Exemplo em TypeScript: Payment Repository

```typescript
// Contrato do Repository - definido no domínio
export interface IPaymentRepository {
  save(payment: Payment): Promise<void>;
  findById(id: PaymentId): Promise<Payment | null>;
  delete(id: PaymentId): Promise<void>;
}

// Implementação em infraestrutura - com banco de dados
export class PaymentRepositorySQL implements IPaymentRepository {
  constructor(private readonly database: DatabaseConnection) {}
  
  async save(payment: Payment): Promise<void> {
    // Converter agregado para estrutura de dados persistível
    const paymentData = {
      id: payment.id.value,
      accountId: payment.accountId.value,
      amount: payment.amount.amount,
      currency: payment.amount.currency,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
    
    // Salvar no banco de dados
    await this.database.query(
      `INSERT INTO payments (id, account_id, amount, currency, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       status = ?, updated_at = ?`,
      [
        paymentData.id,
        paymentData.accountId,
        paymentData.amount,
        paymentData.currency,
        paymentData.status,
        paymentData.createdAt,
        paymentData.updatedAt,
        paymentData.status,
        paymentData.updatedAt,
      ]
    );
    
    // Salvar transações associadas
    for (const transaction of payment.transactions) {
      await this.database.query(
        `INSERT INTO transactions (id, payment_id, amount, currency, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          transaction.id.value,
          payment.id.value,
          transaction.amount.amount,
          transaction.amount.currency,
          transaction.status,
          transaction.createdAt,
        ]
      );
    }
  }
  
  async findById(id: PaymentId): Promise<Payment | null> {
    // Buscar pagamento no banco
    const paymentRow = await this.database.queryOne(
      'SELECT * FROM payments WHERE id = ?',
      [id.value]
    );
    
    if (!paymentRow) {
      return null;
    }
    
    // Buscar transações associadas
    const transactionRows = await this.database.query(
      'SELECT * FROM transactions WHERE payment_id = ?',
      [id.value]
    );
    
    // Reconstruir o agregado a partir dos dados
    const payment = new Payment(
      new PaymentId(paymentRow.id),
      new AccountId(paymentRow.account_id),
      new Money(paymentRow.amount, paymentRow.currency)
    );
    
    // Restaurar estado do pagamento
    (payment as any)._status = paymentRow.status;
    (payment as any)._createdAt = paymentRow.created_at;
    (payment as any)._updatedAt = paymentRow.updated_at;
    
    // Restaurar transações
    for (const txRow of transactionRows) {
      const transaction = new Transaction(
        new TransactionId(txRow.id),
        new Money(txRow.amount, txRow.currency),
        txRow.status
      );
      payment.addTransaction(transaction);
    }
    
    return payment;
  }
  
  async delete(id: PaymentId): Promise<void> {
    await this.database.query(
      'DELETE FROM payments WHERE id = ?',
      [id.value]
    );
  }
}

// Implementação com armazenamento em memória para testes
export class PaymentRepositoryMemory implements IPaymentRepository {
  private payments: Map<string, Payment> = new Map();
  
  async save(payment: Payment): Promise<void> {
    this.payments.set(payment.id.value, payment);
  }
  
  async findById(id: PaymentId): Promise<Payment | null> {
    return this.payments.get(id.value) || null;
  }
  
  async delete(id: PaymentId): Promise<void> {
    this.payments.delete(id.value);
  }
}
```

---

## 5. USE CASES (Casos de Uso)

### Para uma criança de 5 anos 🧒

Um Use Case é como um passo-a-passo de como fazer algo. Se você quer brincar no escorregador, o Use Case é: 1) chegar ao parque, 2) subir na escada, 3) sentar e escorregar, 4) correr e fazer de novo. Um Use Case no software é assim: uma sequência de passos que o usuário segue para fazer algo importante no sistema.

### Para um estudante 🎓

Um Use Case é um componente da lógica de aplicação que coordena a interação entre o usuário, o domínio e a infraestrutura. Ele representa um fluxo específico de negócio, orquestrando as operações necessárias para completar uma ação do usuário. Use Cases recebem input, utilizam repositórios para acessar agregados, executam operações de domínio e persistem mudanças. Cada Use Case é responsável por um único cenário de negócio bem definido.

### Para um programador profissional 👨‍💼

Um Use Case em arquitetura limpa é um orchestrador de lógica de aplicação que coordena interações entre camadas. Recebe input padronizado (request), executa operações de domínio utilizando repositories e services, e retorna output padronizado (response). Use Cases implementam fluxos de negócio específicos, mantendo-se independentes de detalhes de UI ou persistência. São testáveis, reutilizáveis e expressam a intenção do negócio de forma clara.

### Exemplo em TypeScript: Create Payment Use Case

```typescript
// Input do Use Case (Data Transfer Object)
export interface CreatePaymentInput {
  accountId: string;
  amount: number;
  currency: string;
}

// Output do Use Case
export interface CreatePaymentOutput {
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
}

// Use Case - coordena domínio e infraestrutura
export class CreatePaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentService: PaymentService,
    private readonly logger: Logger,
  ) {}
  
  async execute(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    try {
      // Validação de entrada
      if (!input.accountId || input.amount <= 0) {
        throw new Error('Invalid input: accountId and positive amount required');
      }
      
      this.logger.info('Creating payment', { accountId: input.accountId, amount: input.amount });
      
      // Criar agregado usando Value Objects
      const paymentId = new PaymentId(this.generateId());
      const accountId = new AccountId(input.accountId);
      const amount = new Money(input.amount, input.currency);
      
      // Criar agregado no domínio
      const payment = new Payment(paymentId, accountId, amount);
      
      // Usar serviço de domínio se necessário
      // (exemplo: validar limite de conta, aplicar regras de negócio complexas)
      await this.paymentService.validatePaymentLimits(accountId, amount);
      
      // Persistir agregado
      await this.paymentRepository.save(payment);
      
      this.logger.info('Payment created successfully', { paymentId: paymentId.value });
      
      // Retornar resultado em formato de apresentação
      return {
        paymentId: payment.id.value,
        status: payment.status,
        amount: payment.amount.amount,
        currency: payment.amount.currency,
      };
      
    } catch (error) {
      this.logger.error('Error creating payment', error);
      throw error;
    }
  }
  
  private generateId(): string {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Outro exemplo: Process Payment Use Case
export interface ProcessPaymentInput {
  paymentId: string;
}

export interface ProcessPaymentOutput {
  paymentId: string;
  status: string;
  message: string;
}

export class ProcessPaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly transactionService: TransactionService,
    private readonly logger: Logger,
  ) {}
  
  async execute(input: ProcessPaymentInput): Promise<ProcessPaymentOutput> {
    // Recuperar agregado do repositório
    const payment = await this.paymentRepository.findById(
      new PaymentId(input.paymentId)
    );
    
    if (!payment) {
      throw new Error(`Payment not found: ${input.paymentId}`);
    }
    
    // Criar transação no serviço de transações
    const transaction = await this.transactionService.createTransaction(
      payment.id.value,
      payment.amount
    );
    
    // Adicionar transação ao agregado
    payment.addTransaction(transaction);
    
    // Processar pagamento (comportamento de domínio)
    payment.process();
    
    // Persistir estado atualizado
    await this.paymentRepository.save(payment);
    
    // Retornar resultado
    return {
      paymentId: payment.id.value,
      status: payment.status,
      message: 'Payment processed successfully',
    };
  }
}
```

---

## 6. SERVICES (Serviços de Domínio)

### Para uma criança de 5 anos 🧒

Um Service é como um professor de matemática. Ele não é um aluno (não é uma entidade), mas ajuda os alunos a resolver problemas complexos. Se dois alunos precisam trabalhar juntos, o professor fica no meio ajudando. Um Service no software é assim: não é um objeto de negócio, mas ajuda a coordenar e resolver problemas complexos.

### Para um estudante 🎓

Um Service de Domínio encapsula lógica de negócio que não pertence naturalmente a uma única Entidade ou Value Object. Quando uma operação envolve múltiplos agregados ou conceitos do domínio, um Service coordena essa lógica. Services são stateless, recebem objetos de domínio como parâmetros e realizam operações. São diferentes de Application Services que coordenam fluxos; Domain Services expressam conceitos importantes do negócio.

### Para um programador profissional 👨‍💼

Domain Services em DDD encapsulam lógica de negócio que não se encaixa naturalmente no modelo de agregados. Quando uma operação envolve múltiplos agregados ou quando a lógica é complexa demais para uma única entidade, um Domain Service fornece a abstração apropriada. Services são stateless, imutáveis, e geralmente injetados como dependências. Application Services, por outro lado, orquestram a aplicação usando Domain Services, Repositories e Use Cases.

### Exemplo em TypeScript: Domain Services

```typescript
// Domain Service - lógica de negócio complexa
export class PaymentService {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly logger: Logger,
  ) {}
  
  // Valida se a conta pode fazer um pagamento deste valor
  async validatePaymentLimits(accountId: AccountId, amount: Money): Promise<void> {
    const account = await this.accountRepository.findById(accountId);
    
    if (!account) {
      throw new Error(`Account not found: ${accountId}`);
    }
    
    // Regra de negócio: verificar saldo
    if (account.balance.isGreaterThan(amount)) {
      throw new Error('Insufficient balance for this payment');
    }
    
    // Regra de negócio: verificar limite diário
    const dailyTotal = await this.calculateDailyPaymentTotal(accountId);
    const newTotal = dailyTotal.add(amount);
    
    const dailyLimit = new Money(50000, amount.currency);
    if (newTotal.isGreaterThan(dailyLimit)) {
      throw new Error('Daily payment limit exceeded');
    }
    
    this.logger.info('Payment validation passed', { accountId: accountId.value });
  }
  
  private async calculateDailyPaymentTotal(accountId: AccountId): Promise<Money> {
    // Buscar todos os pagamentos de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // (implementação dependeria de query ao repositório)
    return new Money(0, 'BRL');
  }
}

// Application Service - diferente de Domain Service
// Orquestra os casos de uso
export class PaymentApplicationService {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentService: PaymentService,
    private readonly transactionService: TransactionService,
    private readonly notificationService: INotificationService,
  ) {}
  
  async completePaymentWorkflow(payment: Payment): Promise<void> {
    try {
      // Usar Domain Service para validações complexas
      await this.paymentService.validatePaymentLimits(
        payment.accountId,
        payment.amount
      );
      
      // Coordenar múltiplos agregados
      const transaction = await this.transactionService.createTransaction(
        payment.id.value,
        payment.amount
      );
      
      // Aplicar regras de domínio
      payment.addTransaction(transaction);
      payment.process();
      
      // Persistir
      await this.paymentRepository.save(payment);
      
      // Notificar externos (infraestrutura)
      await this.notificationService.sendPaymentConfirmation(
        payment.accountId.value,
        payment.amount
      );
      
    } catch (error) {
      this.notificationService.sendPaymentFailure(
        payment.accountId.value,
        error.message
      );
      throw error;
    }
  }
}
```

---

## 7. CONTROLLERS

### Para uma criança de 5 anos 🧒

Um Controller é como um recepcionista de um consultório. Quando você chega, o recepcionista recebe você, anota seus dados, marca o médico certo e depois manda você para a sala certa. O Controller funciona assim: recebe o pedido do usuário, passa para a pessoa certa (Use Case), e manda a resposta de volta.

### Para um estudante 🎓

Um Controller é o ponto de entrada da aplicação que recebe requisições HTTP (ou de outra interface). Sua responsabilidade é converter dados de entrada em objetos de domínio, chamar o Use Case apropriado, e converter a resposta para um formato que o cliente entenda. Controllers não contêm lógica de negócio; apenas coordenam entrada, processamento e saída. Devem ser simples e focados em protocolo HTTP.

### Para um programador profissional 👨‍💼

Controllers em arquitetura hexagonal atuam como adaptadores da camada de aplicação, traduzindo requisições HTTP em chamadas de Use Cases. Responsáveis por deserializar dados de entrada, validação básica de entrada (formato), invocação do Use Case, tratamento de exceções e serialização da resposta. Controllers mantêm-se agnósticos a detalhes de implementação de domínio ou persistência, funcionando como bridges entre o mundo externo (HTTP) e o núcleo da aplicação (domínio).

### Exemplo em TypeScript: Controllers para Pagamentos

```typescript
// Controller - recebe requisições HTTP
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly logger: Logger,
  ) {}
  
  // Criar um novo pagamento
  async create(request: Request, response: Response): Promise<void> {
    try {
      // Validação básica de entrada
      const { accountId, amount, currency } = request.body;
      
      if (!accountId || !amount || !currency) {
        response.status(400).json({
          error: 'Missing required fields: accountId, amount, currency',
        });
        return;
      }
      
      // Chamar Use Case
      const result = await this.createPaymentUseCase.execute({
        accountId,
        amount: parseFloat(amount),
        currency,
      });
      
      // Retornar resposta formatada
      response.status(201).json({
        success: true,
        data: result,
      });
      
    } catch (error) {
      this.logger.error('Error in PaymentController.create', error);
      response.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  // Processar um pagamento existente
  async process(request: Request, response: Response): Promise<void> {
    try {
      const { paymentId } = request.params;
      
      if (!paymentId) {
        response.status(400).json({ error: 'Missing paymentId' });
        return;
      }
      
      // Chamar Use Case
      const result = await this.processPaymentUseCase.execute({ paymentId });
      
      // Retornar resposta
      response.status(200).json({
        success: true,
        data: result,
      });
      
    } catch (error) {
      this.logger.error('Error in PaymentController.process', error);
      response.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

// Middleware para logging
export const loggingMiddleware = (req: Request, res: Response, next: Function) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

// Exemplo de rota Express
export function setupPaymentRoutes(
  app: any,
  paymentController: PaymentController
) {
  app.post('/api/payments', (req: Request, res: Response) => 
    paymentController.create(req, res)
  );
  
  app.post('/api/payments/:paymentId/process', (req: Request, res: Response) =>
    paymentController.process(req, res)
  );
}
```

---

## 8. ADAPTERS (Adaptadores)

### Para uma criança de 5 anos 🧒

Um Adapter é como um transformador de corrente elétrica. Seu celular precisa de uma corrente específica, mas a tomada da casa fornece outra. O adaptador transforma uma em outra, permitindo que tudo funcione. Um Adapter no software faz isso: transforma dados de um formato em outro, permitindo que partes diferentes do sistema trabalhem juntas.

### Para um estudante 🎓

Um Adapter é um padrão de design que permite que objetos com interfaces incompatíveis trabalhem juntos. Na arquitetura hexagonal, adapters convertem entre o mundo externo (HTTP, bancos de dados, APIs externas) e o domínio. Existem adapters de entrada (ex: Controllers, que convertem HTTP em Use Cases) e de saída (ex: Repositories, que convertem dados de domínio em estruturas de BD). Adapters isolam o domínio de tecnologias específicas.

### Para um programador profissional 👨‍💼

Adapters em arquitetura hexagonal implementam o padrão Adapter, servindo como tradutores entre a camada de aplicação e tecnologias externas. Adapters de entrada transformam requisições externas em chamadas de Use Cases; adapters de saída transformam operações de domínio em interações com infraestrutura (BD, cache, APIs). Permitem que o domínio permaneça independente de detalhes técnicos, facilitando testes, substituição de tecnologias e evolução arquitetural sem impacto no modelo de negócio.

### Exemplo em TypeScript: Adapters de Entrada e Saída

```typescript
// ======== ADAPTERS DE ENTRADA (Input Adapters) ========

// Adapter HTTP para usar Cases de Pagamento
export class HttpPaymentAdapter {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
  ) {}
  
  // Converte requisição HTTP em entrada de Use Case
  async handleCreatePayment(httpRequest: any): Promise<any> {
    // Extrair dados da requisição HTTP
    const { body } = httpRequest;
    
    // Chamar Use Case
    const result = await this.createPaymentUseCase.execute({
      accountId: body.accountId,
      amount: body.amount,
      currency: body.currency,
    });
    
    // Converter resultado em resposta HTTP
    return {
      statusCode: 201,
      body: JSON.stringify(result),
      headers: { 'Content-Type': 'application/json' },
    };
  }
}

// Adapter CLI para usar Cases de Pagamento
export class CliPaymentAdapter {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
  ) {}
  
  async handleCreatePayment(args: string[]): Promise<void> {
    try {
      // Parse argumentos de CLI
      const accountId = args[0];
      const amount = parseFloat(args[1]);
      const currency = args[2] || 'BRL';
      
      // Chamar Use Case
      const result = await this.createPaymentUseCase.execute({
        accountId,
        amount,
        currency,
      });
      
      // Output para terminal
      console.log('Payment created:');
      console.log(JSON.stringify(result, null, 2));
      
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
    }
  }
}

// ======== ADAPTERS DE SAÍDA (Output Adapters) ========

// Adapter para notificações via Email
export interface INotificationAdapter {
  sendPaymentConfirmation(accountId: string, amount: Money): Promise<void>;
  sendPaymentFailure(accountId: string, reason: string): Promise<void>;
}

export class EmailNotificationAdapter implements INotificationAdapter {
  constructor(private readonly emailService: any) {}
  
  async sendPaymentConfirmation(accountId: string, amount: Money): Promise<void> {
    // Converter dados de domínio para formato de email
    const emailContent = {
      to: accountId, // Em produção seria um email real
      subject: 'Payment Confirmation',
      body: `Your payment of ${amount.amount} ${amount.currency} has been confirmed.`,
    };
    
    // Chamar serviço de email
    await this.emailService.send(emailContent);
  }
  
  async sendPaymentFailure(accountId: string, reason: string): Promise<void> {
    const emailContent = {
      to: accountId,
      subject: 'Payment Failed',
      body: `Your payment failed: ${reason}`,
    };
    
    await this.emailService.send(emailContent);
  }
}

// Adapter para notificações via SMS
export class SmsNotificationAdapter implements INotificationAdapter {
  constructor(private readonly smsService: any) {}
  
  async sendPaymentConfirmation(accountId: string, amount: Money): Promise<void> {
    const message = `Pagamento confirmado: ${amount.amount} ${amount.currency}`;
    await this.smsService.send(accountId, message);
  }
  
  async sendPaymentFailure(accountId: string, reason: string): Promise<void> {
    const message = `Pagamento falhou: ${reason}`;
    await this.smsService.send(accountId, message);
  }
}

// Adapter para cache Redis
export class RedisCacheAdapter {
  constructor(private readonly redis: any) {}
  
  async getPayment(paymentId: string): Promise<Payment | null> {
    const cached = await this.redis.get(`payment:${paymentId}`);
    
    if (!cached) {
      return null;
    }
    
    // Converter dados em cache de volta para agregado
    const data = JSON.parse(cached);
    return this.reconstructPayment(data);
  }
  
  async setPayment(payment: Payment): Promise<void> {
    // Converter agregado em dados que podem ser cacheados
    const data = {
      id: payment.id.value,
      accountId: payment.accountId.value,
      amount: payment.amount.amount,
      currency: payment.amount.currency,
      status: payment.status,
    };
    
    // Armazenar em cache com TTL de 1 hora
    await this.redis.set(
      `payment:${payment.id.value}`,
      JSON.stringify(data),
      'EX',
      3600
    );
  }
  
  private reconstructPayment(data: any): Payment {
    return new Payment(
      new PaymentId(data.id),
      new AccountId(data.accountId),
      new Money(data.amount, data.currency)
    );
  }
}

// Adapter para persistência em diferentes bancos
export class MongoPaymentAdapter implements IPaymentRepository {
  constructor(private readonly mongoDb: any) {}
  
  async save(payment: Payment): Promise<void> {
    const document = {
      _id: payment.id.value,
      accountId: payment.accountId.value,
      amount: payment.amount.amount,
      currency: payment.amount.currency,
      status: payment.status,
      transactions: payment.transactions.map(t => ({
        id: t.id.value,
        amount: t.amount.amount,
        currency: t.amount.currency,
        status: t.status,
      })),
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
    
    await this.mongoDb.collection('payments').updateOne(
      { _id: payment.id.value },
      { $set: document },
      { upsert: true }
    );
  }
  
  async findById(id: PaymentId): Promise<Payment | null> {
    const document = await this.mongoDb
      .collection('payments')
      .findOne({ _id: id.value });
    
    if (!document) return null;
    
    // Reconstruir agregado a partir do documento
    return this.reconstructPayment(document);
  }
  
  async delete(id: PaymentId): Promise<void> {
    await this.mongoDb.collection('payments').deleteOne({ _id: id.value });
  }
  
  private reconstructPayment(doc: any): Payment {
    const payment = new Payment(
      new PaymentId(doc._id),
      new AccountId(doc.accountId),
      new Money(doc.amount, doc.currency)
    );
    
    // Restaurar transações
    for (const txDoc of (doc.transactions || [])) {
      const transaction = new Transaction(
        new TransactionId(txDoc.id),
        new Money(txDoc.amount, txDoc.currency),
        txDoc.status
      );
      payment.addTransaction(transaction);
    }
    
    return payment;
  }
}
```

---

## 9. INTERFACES (Contratos)

### Para uma criança de 5 anos 🧒

Uma Interface é como uma receita de bolo. A receita diz quais ingredientes você precisa e os passos, mas não diz exatamente qual marca de farinha usar. Qualquer farinha serve, desde que seja farinha. Uma Interface no software é assim: define quais métodos um objeto deve ter, mas cada um pode implementar de um jeito diferente.

### Para um estudante 🎓

Uma Interface define um contrato que especifica quais métodos um objeto deve ter, sem definir como implementá-los. Interfaces permitem que diferentes implementações satisfaçam o mesmo contrato. Em TypeScript, são declaradas com a palavra-chave `interface`. Usar interfaces promove desacoplamento: código depende de abstrações (interfaces) em vez de implementações concretas, facilitando testes (com mocks) e mudanças de implementação.

### Para um programador profissional 👨‍💼

Interfaces em TypeScript definem contratos explícitos que classes devem satisfazer, promovendo design orientado a contratos. Fundamentais para Injeção de Dependência e padrões de design como Adapter, Strategy e Factory. Permitem que camadas externas dependam de abstrações em vez de implementações, habilitando múltiplas implementações (ex: Repository para SQL, NoSQL, In-Memory) sem afetar consumidores. Essenciais para testabilidade e manutenibilidade em arquitetura hexagonal.

### Exemplo em TypeScript: Interfaces e Contratos

```typescript
// ======== INTERFACES DE REPOSITÓRIO ========

// Contrato para persistência de pagamentos
export interface IPaymentRepository {
  save(payment: Payment): Promise<void>;
  findById(id: PaymentId): Promise<Payment | null>;
  delete(id: PaymentId): Promise<void>;
  findByAccountId(accountId: AccountId): Promise<Payment[]>;
}

// Contrato para persistência de contas
export interface IAccountRepository {
  save(account: Account): Promise<void>;
  findById(id: AccountId): Promise<Account | null>;
  findByEmail(email: Email): Promise<Account | null>;
}

// ======== INTERFACES DE SERVIÇOS ========

// Contrato para serviço de notificações
export interface INotificationService {
  sendPaymentConfirmation(accountId: string, amount: Money): Promise<void>;
  sendPaymentFailure(accountId: string, reason: string): Promise<void>;
}

// Contrato para serviço de transações
export interface ITransactionService {
  createTransaction(paymentId: string, amount: Money): Promise<Transaction>;
  verifyTransaction(transactionId: string): Promise<boolean>;
}

// Contrato para serviço de cache
export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

// ======== INTERFACES DE LOGGER ========

export interface ILogger {
  info(message: string, meta?: any): void;
  error(message: string, error?: any): void;
  warn(message: string, meta?: any): void;
}

// ======== INTERFACES DE IDENTIFICADORES ========

export interface IIdentifier {
  value: string;
  equals(other: IIdentifier): boolean;
}

// ======== EXEMPLO: USE CASE COM INJEÇÃO VIA INTERFACES ========

export class CreatePaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository, // Depende da interface
    private readonly transactionService: ITransactionService,
    private readonly cacheService: ICacheService,
    private readonly logger: ILogger,
  ) {}
  
  async execute(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    try {
      // Qualquer implementação de IPaymentRepository funciona aqui
      // Pode ser SQL, MongoDB, ou In-Memory para testes
      
      const paymentId = new PaymentId(this.generateId());
      const payment = new Payment(
        paymentId,
        new AccountId(input.accountId),
        new Money(input.amount, input.currency)
      );
      
      // Usar a interface abstrata
      await this.paymentRepository.save(payment);
      
      // Invalidar cache (qualquer implementação serve)
      await this.cacheService.delete(`payments:${input.accountId}`);
      
      return {
        paymentId: payment.id.value,
        status: payment.status,
        amount: payment.amount.amount,
        currency: payment.amount.currency,
      };
      
    } catch (error) {
      this.logger.error('Error creating payment', error);
      throw error;
    }
  }
  
  private generateId(): string {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ======== EXEMPLO: TESTES COM MOCKS ========

// Implementação mock para testes
class MockPaymentRepository implements IPaymentRepository {
  private payments: Map<string, Payment> = new Map();
  
  async save(payment: Payment): Promise<void> {
    this.payments.set(payment.id.value, payment);
  }
  
  async findById(id: PaymentId): Promise<Payment | null> {
    return this.payments.get(id.value) || null;
  }
  
  async delete(id: PaymentId): Promise<void> {
    this.payments.delete(id.value);
  }
  
  async findByAccountId(accountId: AccountId): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(p => p.accountId.equals(accountId));
  }
}

class MockCacheService implements ICacheService {
  private cache: Map<string, any> = new Map();
  
  async get<T>(key: string): Promise<T | null> {
    return this.cache.get(key) || null;
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    this.cache.set(key, value);
  }
  
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
}

// Teste usando mocks
async function testCreatePayment() {
  const mockRepository = new MockPaymentRepository();
  const mockCache = new MockCacheService();
  const mockLogger = { info: console.log, error: console.error, warn: console.warn };
  const mockTransaction = { createTransaction: async () => ({ /* ... */ }) };
  
  const useCase = new CreatePaymentUseCase(
    mockRepository,
    mockTransaction as any,
    mockCache,
    mockLogger as any
  );
  
  const result = await useCase.execute({
    accountId: 'ACC-123',
    amount: 100,
    currency: 'BRL',
  });
  
  console.log('Test passed:', result);
}
```

---

## 📊 DIAGRAMA GERAL: ARQUITETURA HEXAGONAL COM DDD

```plaintext
┌─────────────────────────────────────────────────────────────────┐
│                     CAMADA DE APRESENTAÇÃO                      │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  HTTP REST  │  │     CLI      │  │   GraphQL    │            │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘            │
└─────────┼──────────────────┼────────────────┼───────────────────┘
          │                  │                │
          └──────────────────┼────────────────┘
                             │
          ┌──────────────────▼───────────────────┐
          │    ADAPTERS DE ENTRADA (Input)       │
          │    Controllers / CLI Adapters        │
          └──────────────────┬───────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────┐
│           CAMADA DE APLICAÇÃO (Application Layer)              │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              USE CASES / Application Services            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │ CreatePayment│  │ProcessPayment│  │ CancelPayment│    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                  │
│                    Orquestra e coordena                        │
│                                                                │
└────────────────────────────▼──────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────┐
│              CAMADA DE DOMÍNIO (Domain Layer)                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    AGREGADOS                             │  │
│  │                                                           │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │           Payment Aggregate                      │   │  │
│  │  │                                                   │   │  │
│  │  │  ┌─────────────────────────────────────────────┐ │   │  │
│  │  │  │ Payment (Aggregate Root / Entity)           │ │   │  │
│  │  │  │ • _id: PaymentId (Value Object)             │ │   │  │
│  │  │  │ • _amount: Money (Value Object)             │ │   │  │
│  │  │  │ • _status: TransactionStatus (Value Object) │ │   │  │
│  │  │  │ • _transactions: Transaction[] (Entities)   │ │   │  │
│  │  │  └─────────────────────────────────────────────┘ │   │  │
│  │  │                                                   │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │          Transaction (Entity)                    │   │  │
│  │  │ • _id: TransactionId (Value Object)             │   │  │
│  │  │ • _amount: Money (Value Object)                 │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              SERVIÇOS DE DOMÍNIO                          │  │
│  │  ┌──────────────────┐  ┌──────────────────┐             │  │
│  │  │  PaymentService  │  │  AccountService  │             │  │
│  │  └──────────────────┘  └──────────────────┘             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              INTERFACES / CONTRATOS                       │  │
│  │  IPaymentRepository  │  INotificationService             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────▼──────────────────────────────────┘
                             │
          ┌──────────────────┼────────────────┐
          │                  │                │
┌─────────▼────────┐ ┌──────▼────────┐ ┌─────▼────────────┐
│  ADAPTERS DE      │ │   ADAPTERS    │ │  ADAPTERS        │
│  SAÍDA            │ │   DE          │ │  EXTERNOS        │
│  (Output)         │ │   PERSISTÊNCIA │ │                 │
│                   │ │                │ │                 │
│ • Notification    │ │ • SQL Database │ │ • Email Service │
│   (Email/SMS)     │ │ • MongoDB      │ │ • Payment API   │
│ • Logger          │ │ • Cache Redis  │ │ • Message Queue │
└───────────────────┘ └────────────────┘ └─────────────────┘
```

---

## FLUXO DE UMA REQUISIÇÃO

```plaintext
1. CLIENTE faz requisição HTTP
   POST /api/payments
   { "accountId": "ACC-123", "amount": 100, "currency": "BRL" }
   │
   ▼
2. CONTROLLER recebe requisição
   PaymentController.create(request)
   │
   ├─ Validação básica (formato HTTP)
   ├─ Extrai dados: accountId, amount, currency
   │
   ▼
3. USA CASE é executado
   CreatePaymentUseCase.execute({...})
   │
   ├─ Cria Value Objects: Money, PaymentId, AccountId
   ├─ Instancia Agregado: Payment
   ├─ Usa DOMAIN SERVICE para validações complexas
   │  (ex: PaymentService.validatePaymentLimits)
   ├─ Persiste usando REPOSITORY
   │  PaymentRepository.save(payment)
   │
   ▼
4. REPOSITORY (Adapter de Saída) persiste
   PaymentRepositorySQL.save(payment)
   │
   ├─ Converte agregado para estrutura de dados
   ├─ Executa queries SQL
   ├─ Insere em banco de dados
   │
   ▼
5. SERVIÇOS DE INFRAESTRUTURA são chamados
   NotificationAdapter.sendConfirmation(...)
   │
   ├─ Converte dados de domínio para formato externo
   ├─ Envia email/SMS/notificação
   │
   ▼
6. RESPOSTA retorna ao CONTROLLER
   CreatePaymentOutput {paymentId, status, amount, currency}
   │
   ├─ Controller serializa para JSON
   ├─ Retorna HTTP 201
   │
   ▼
7. CLIENTE recebe resposta
   { "paymentId": "PAY-...", "status": "PENDING", ... }
```

---

## ESTRUTURA DE PASTAS RECOMENDADA

```plaintext
projeto-pagamentos/
│
├── src/
│   │
│   ├── domain/                           ← NÚCLEO DO NEGÓCIO
│   │   ├── entities/
│   │   │   ├── Payment.ts
│   │   │   ├── Transaction.ts
│   │   │   └── Account.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── Money.ts
│   │   │   ├── Email.ts
│   │   │   ├── PaymentId.ts
│   │   │   └── AccountId.ts
│   │   │
│   │   ├── aggregates/
│   │   │   └── PaymentAggregate.ts
│   │   │
│   │   ├── services/
│   │   │   ├── PaymentService.ts
│   │   │   └── AccountService.ts
│   │   │
│   │   ├── interfaces/
│   │   │   ├── IPaymentRepository.ts
│   │   │   ├── INotificationService.ts
│   │   │   └── ICacheService.ts
│   │   │
│   │   └── events/
│   │       ├── PaymentCreatedEvent.ts
│   │       └── PaymentCompletedEvent.ts
│   │
│   ├── application/                      ← COORDENAÇÃO
│   │   ├── use-cases/
│   │   │   ├── CreatePaymentUseCase.ts
│   │   │   ├── ProcessPaymentUseCase.ts
│   │   │   └── CancelPaymentUseCase.ts
│   │   │
│   │   ├── dtos/
│   │   │   ├── CreatePaymentInput.ts
│   │   │   └── CreatePaymentOutput.ts
│   │   │
│   │   └── services/
│   │       └── PaymentApplicationService.ts
│   │
│   ├── adapters/                         ← INTERFACES EXTERNAS
│   │   │
│   │   ├── http/
│   │   │   ├── PaymentController.ts
│   │   │   └── routes.ts
│   │   │
│   │   ├── persistence/
│   │   │   ├── PaymentRepositorySQL.ts
│   │   │   ├── PaymentRepositoryMongo.ts
│   │   │   └── PaymentRepositoryMemory.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── EmailNotificationAdapter.ts
│   │   │   └── SmsNotificationAdapter.ts
│   │   │
│   │   ├── cache/
│   │   │   ├── RedisCacheAdapter.ts
│   │   │   └── InMemoryCacheAdapter.ts
│   │   │
│   │   ├── cli/
│   │   │   └── PaymentCliAdapter.ts
│   │   │
│   │   └── external-services/
│   │       ├── PaymentGatewayAdapter.ts
│   │       └── BankingApiAdapter.ts
│   │
│   ├── infrastructure/                   ← IMPLEMENTAÇÕES
│   │   ├── database/
│   │   │   ├── connection.ts
│   │   │   └── migrations/
│   │   │
│   │   ├── cache/
│   │   │   └── redisClient.ts
│   │   │
│   │   ├── logger/
│   │   │   └── Logger.ts
│   │   │
│   │   └── di/
│   │       └── container.ts               ← Injeção de Dependência
│   │
│   ├── config/
│   │   ├── env.ts
│   │   └── database.ts
│   │
│   └── main.ts                           ← Entrada da aplicação
│
├── tests/
│   ├── unit/
│   │   ├── domain/
│   │   │   ├── Payment.spec.ts
│   │   │   ├── Money.spec.ts
│   │   │   └── PaymentService.spec.ts
│   │   │
│   │   ├── application/
│   │   │   ├── CreatePaymentUseCase.spec.ts
│   │   │   └── ProcessPaymentUseCase.spec.ts
│   │   │
│   │   └── adapters/
│   │       └── PaymentController.spec.ts
│   │
│   ├── integration/
│   │   └── payment-workflow.spec.ts
│   │
│   └── fixtures/
│       ├── payment.fixture.ts
│       └── mock-repositories.ts
│
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

## EXEMPLO COMPLETO: CRIAR E PROCESSAR PAGAMENTO

```typescript
// ========================================
// 1. DOMÍNIO - Definição dos agregados
// ========================================

// domain/value-objects/Money.ts
export class Money {
  constructor(
    private readonly _amount: number,
    private readonly _currency: string = 'BRL'
  ) {
    if (_amount < 0) throw new Error('Amount cannot be negative');
  }
  
  get amount(): number { return this._amount; }
  get currency(): string { return this._currency; }
  
  add(other: Money): Money {
    if (this._currency !== other._currency) 
      throw new Error('Cannot add different currencies');
    return new Money(this._amount + other._amount, this._currency);
  }
  
  equals(other: Money): boolean {
    return this._amount === other._amount && 
           this._currency === other._currency;
  }
}

// domain/value-objects/PaymentId.ts
export class PaymentId {
  constructor(private readonly _value: string) {
    if (!_value) throw new Error('PaymentId required');
  }
  
  get value(): string { return this._value; }
  
  equals(other: PaymentId): boolean {
    return this._value === other._value;
  }
}

// domain/entities/Transaction.ts
export class Transaction {
  private _status: TransactionStatus = TransactionStatus.PENDING;
  
  constructor(
    private readonly _id: TransactionId,
    private readonly _amount: Money
  ) {}
  
  get id(): TransactionId { return this._id; }
  get amount(): Money { return this._amount; }
  get status(): TransactionStatus { return this._status; }
  
  approve(): void {
    if (this._status !== TransactionStatus.PENDING)
      throw new Error('Only pending transactions can be approved');
    this._status = TransactionStatus.APPROVED;
  }
  
  equals(other: Transaction): boolean {
    return this._id.equals(other._id);
  }
}

// domain/entities/Payment.ts (Aggregate Root)
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export class Payment {
  private _status: PaymentStatus = PaymentStatus.PENDING;
  private readonly _transactions: Transaction[] = [];
  
  constructor(
    private readonly _id: PaymentId,
    private readonly _accountId: string,
    private readonly _amount: Money
  ) {}
  
  get id(): PaymentId { return this._id; }
  get accountId(): string { return this._accountId; }
  get amount(): Money { return this._amount; }
  get status(): PaymentStatus { return this._status; }
  get transactions(): ReadonlyArray<Transaction> { 
    return Object.freeze([...this._transactions]); 
  }
  
  addTransaction(transaction: Transaction): void {
    if (this._status !== PaymentStatus.PENDING)
      throw new Error('Cannot add transaction to non-pending payment');
    if (this._transactions.some(t => t.equals(transaction)))
      throw new Error('Transaction already exists');
    this._transactions.push(transaction);
  }
  
  process(): void {
    if (this._transactions.length === 0)
      throw new Error('Cannot process without transactions');
    this._status = PaymentStatus.PROCESSING;
  }
  
  complete(): void {
    const allApproved = this._transactions.every(
      t => t.status === TransactionStatus.APPROVED
    );
    if (!allApproved)
      throw new Error('Not all transactions approved');
    this._status = PaymentStatus.COMPLETED;
  }
  
  reject(): void {
    if (this._status === PaymentStatus.COMPLETED ||
        this._status === PaymentStatus.REJECTED)
      throw new Error('Cannot reject completed or rejected payment');
    this._status = PaymentStatus.REJECTED;
  }
  
  equals(other: Payment): boolean {
    return this._id.equals(other._id);
  }
}

// ========================================
// 2. DOMÍNIO - Interfaces de contrato
// ========================================

// domain/interfaces/IPaymentRepository.ts
export interface IPaymentRepository {
  save(payment: Payment): Promise<void>;
  findById(id: PaymentId): Promise<Payment | null>;
}

// domain/interfaces/ITransactionService.ts
export interface ITransactionService {
  createTransaction(amount: Money): Promise<Transaction>;
}

// domain/interfaces/INotificationService.ts
export interface INotificationService {
  sendPaymentCreated(accountId: string, paymentId: string): Promise<void>;
  sendPaymentCompleted(accountId: string, amount: Money): Promise<void>;
}

// ========================================
// 3. DOMÍNIO - Serviços de domínio
// ========================================

// domain/services/PaymentService.ts
export class PaymentService {
  constructor(private readonly accountService: any) {}
  
  async validatePaymentLimits(accountId: string, amount: Money): Promise<void> {
    const account = await this.accountService.getAccount(accountId);
    
    if (!account) throw new Error('Account not found');
    if (amount.amount > account.balance)
      throw new Error('Insufficient balance');
      
    // Validar limite diário
    const dailyTotal = await this.accountService.getDailyTotal(accountId);
    const limit = new Money(50000, amount.currency);
    
    if (dailyTotal.add(amount).amount > limit.amount)
      throw new Error('Daily limit exceeded');
  }
}

// ========================================
// 4. APLICAÇÃO - Use Cases
// ========================================

// application/use-cases/CreatePaymentUseCase.ts
export interface CreatePaymentInput {
  accountId: string;
  amount: number;
  currency: string;
}

export interface CreatePaymentOutput {
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
}

export class CreatePaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentService: PaymentService,
    private readonly notificationService: INotificationService
  ) {}
  
  async execute(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    // Validação básica
    if (!input.accountId || input.amount <= 0)
      throw new Error('Invalid input');
    
    // Criar Value Objects
    const paymentId = new PaymentId(this.generateId());
    const amount = new Money(input.amount, input.currency);
    
    // Validar regras de negócio
    await this.paymentService.validatePaymentLimits(input.accountId, amount);
    
    // Criar agregado
    const payment = new Payment(paymentId, input.accountId, amount);
    
    // Persistir
    await this.paymentRepository.save(payment);
    
    // Notificar
    await this.notificationService.sendPaymentCreated(
      input.accountId,
      paymentId.value
    );
    
    return {
      paymentId: payment.id.value,
      status: payment.status,
      amount: payment.amount.amount,
      currency: payment.amount.currency
    };
  }
  
  private generateId(): string {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// application/use-cases/ProcessPaymentUseCase.ts
export interface ProcessPaymentInput {
  paymentId: string;
}

export interface ProcessPaymentOutput {
  paymentId: string;
  status: string;
  message: string;
}

export class ProcessPaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly transactionService: ITransactionService,
    private readonly notificationService: INotificationService
  ) {}
  
  async execute(input: ProcessPaymentInput): Promise<ProcessPaymentOutput> {
    // Recuperar agregado
    const payment = await this.paymentRepository.findById(
      new PaymentId(input.paymentId)
    );
    
    if (!payment) throw new Error('Payment not found');
    
    // Criar transação
    const transaction = await this.transactionService.createTransaction(
      payment.amount
    );
    
    // Adicionar ao agregado
    payment.addTransaction(transaction);
    
    // Processar (comportamento de domínio)
    payment.process();
    
    // Simular processamento externo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Aprovar transação
    transaction.approve();
    
    // Completar pagamento
    payment.complete();
    
    // Persistir
    await this.paymentRepository.save(payment);
    
    // Notificar
    await this.notificationService.sendPaymentCompleted(
      payment.accountId,
      payment.amount
    );
    
    return {
      paymentId: payment.id.value,
      status: payment.status,
      message: 'Payment processed successfully'
    };
  }
}

// ========================================
// 5. ADAPTADORES - Controllers HTTP
// ========================================

// adapters/http/PaymentController.ts
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly processPaymentUseCase: ProcessPaymentUseCase
  ) {}
  
  async create(request: Request, response: Response): Promise<void> {
    try {
      const { accountId, amount, currency } = request.body;
      
      const result = await this.createPaymentUseCase.execute({
        accountId,
        amount: parseFloat(amount),
        currency
      });
      
      response.status(201).json({
        success: true,
        data: result
      });
      
    } catch (error) {
      response.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  async process(request: Request, response: Response): Promise<void> {
    try {
      const { paymentId } = request.params;
      
      const result = await this.processPaymentUseCase.execute({ paymentId });
      
      response.status(200).json({
        success: true,
        data: result
      });
      
    } catch (error) {
      response.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

// ========================================
// 6. ADAPTADORES - Repositórios
// ========================================

// adapters/persistence/PaymentRepositoryMemory.ts
export class PaymentRepositoryMemory implements IPaymentRepository {
  private payments: Map<string, Payment> = new Map();
  
  async save(payment: Payment): Promise<void> {
    this.payments.set(payment.id.value, payment);
  }
  
  async findById(id: PaymentId): Promise<Payment | null> {
    return this.payments.get(id.value) || null;
  }
}

// adapters/notifications/ConsoleNotificationAdapter.ts
export class ConsoleNotificationAdapter implements INotificationService {
  async sendPaymentCreated(accountId: string, paymentId: string): Promise<void> {
    console.log(`✅ Payment created for account ${accountId}: ${paymentId}`);
  }
  
  async sendPaymentCompleted(accountId: string, amount: Money): Promise<void> {
    console.log(
      `✅ Payment completed for account ${accountId}: ${amount.amount} ${amount.currency}`
    );
  }
}

// ========================================
// 7. INJEÇÃO DE DEPENDÊNCIA
// ========================================

// infrastructure/di/container.ts
export class Container {
  static createPaymentUseCases() {
    // Criar adapters e repositórios
    const paymentRepository = new PaymentRepositoryMemory();
    const notificationService = new ConsoleNotificationAdapter();
    const transactionService = new SimpleTransactionService();
    const accountService = new SimpleAccountService();
    
    // Criar serviços de domínio
    const paymentService = new PaymentService(accountService);
    
    // Criar use cases
    const createPaymentUseCase = new CreatePaymentUseCase(
      paymentRepository,
      paymentService,
      notificationService
    );
    
    const processPaymentUseCase = new ProcessPaymentUseCase(
      paymentRepository,
      transactionService,
      notificationService
    );
    
    return { createPaymentUseCase, processPaymentUseCase };
  }
  
  static createController() {
    const { createPaymentUseCase, processPaymentUseCase } = 
      this.createPaymentUseCases();
    
    return new PaymentController(createPaymentUseCase, processPaymentUseCase);
  }
}

// ========================================
// 8. EXECUTANDO O FLUXO COMPLETO
// ========================================

async function demonstrateFlow() {
  console.log('=== Payment Processing Flow ===\n');
  
  const { createPaymentUseCase, processPaymentUseCase } = 
    Container.createPaymentUseCases();
  
  // 1. Criar pagamento
  console.log('1️⃣ Creating payment...');
  const createResult = await createPaymentUseCase.execute({
    accountId: 'ACC-001',
    amount: 100.00,
    currency: 'BRL'
  });
  console.log('Result:', createResult);
  
  // 2. Processar pagamento
  console.log('\n2️⃣ Processing payment...');
  const processResult = await processPaymentUseCase.execute({
    paymentId: createResult.paymentId
  });
  console.log('Result:', processResult);
  
  console.log('\n✅ Flow completed successfully!');
}

// Executar
demonstrateFlow().catch(console.error);
```

---

## 🧪 TESTES UNITÁRIOS COM MOCKS

```typescript
// tests/unit/application/CreatePaymentUseCase.spec.ts

describe('CreatePaymentUseCase', () => {
  let useCase: CreatePaymentUseCase;
  let mockRepository: MockPaymentRepository;
  let mockPaymentService: MockPaymentService;
  let mockNotificationService: MockNotificationService;
  
  beforeEach(() => {
    mockRepository = new MockPaymentRepository();
    mockPaymentService = new MockPaymentService();
    mockNotificationService = new MockNotificationService();
    
    useCase = new CreatePaymentUseCase(
      mockRepository,
      mockPaymentService,
      mockNotificationService
    );
  });
  
  it('should create a payment successfully', async () => {
    const input: CreatePaymentInput = {
      accountId: 'ACC-001',
      amount: 100,
      currency: 'BRL'
    };
    
    const result = await useCase.execute(input);
    
    expect(result.paymentId).toBeDefined();
    expect(result.status).toBe('PENDING');
    expect(result.amount).toBe(100);
    
    // Verificar que foi persistido
    const saved = await mockRepository.findById(new PaymentId(result.paymentId));
    expect(saved).not.toBeNull();
  });
  
  it('should throw error for invalid amount', async () => {
    const input: CreatePaymentInput = {
      accountId: 'ACC-001',
      amount: -100,
      currency: 'BRL'
    };
    
    await expect(useCase.execute(input)).rejects.toThrow();
  });
  
  it('should validate payment limits', async () => {
    mockPaymentService.shouldThrow = true;
    
    const input: CreatePaymentInput = {
      accountId: 'ACC-001',
      amount: 100000,
      currency: 'BRL'
    };
    
    await expect(useCase.execute(input)).rejects.toThrow();
  });
  
  it('should send notification on creation', async () => {
    const input: CreatePaymentInput = {
      accountId: 'ACC-001',
      amount: 100,
      currency: 'BRL'
    };
    
    await useCase.execute(input);
    
    expect(mockNotificationService.notificationsSent).toBe(1);
  });
});

// Mock implementations
class MockPaymentRepository implements IPaymentRepository {
  private payments = new Map<string, Payment>();
  
  async save(payment: Payment): Promise<void> {
    this.payments.set(payment.id.value, payment);
  }
  
  async findById(id: PaymentId): Promise<Payment | null> {
    return this.payments.get(id.value) || null;
  }
}

class MockPaymentService {
  shouldThrow = false;
  
  async validatePaymentLimits(accountId: string, amount: Money): Promise<void> {
    if (this.shouldThrow) {
      throw new Error('Validation failed');
    }
  }
}

class MockNotificationService implements INotificationService {
  notificationsSent = 0;
  
  async sendPaymentCreated(accountId: string, paymentId: string): Promise<void> {
    this.notificationsSent++;
  }
  
  async sendPaymentCompleted(accountId: string, amount: Money): Promise<void> {
    this.notificationsSent++;
  }
}
```

---

## RESUMO: COMO OS CONCEITOS TRABALHAM JUNTOS

| Conceito           | Responsabilidade                 | Exemplos                                       |
| ------------------ | -------------------------------- | ---------------------------------------------- |
| **Entity**         | Identidade única e comportamento | Payment, Transaction, Account                  |
| **Value Object**   | Imutabilidade e validação        | Money, Email, PaymentId                        |
| **Aggregate**      | Consistência transacional        | PaymentAggregate contém Payment + Transactions |
| **Repository**     | Abstração de persistência        | IPaymentRepository, SQLRepository              |
| **Use Case**       | Orquestração de fluxo            | CreatePayment, ProcessPayment                  |
| **Domain Service** | Lógica complexa multi-agregado   | PaymentService.validateLimits                  |
| **Controller**     | Interface HTTP                   | PaymentController.create()                     |
| **Adapter**        | Tradução de tecnologias          | SQLAdapter, EmailAdapter, RedisAdapter         |
| **Interface**      | Contrato e desacoplamento        | IRepository, IService, IAdapter                |

---

## BENEFÍCIOS DESSA ARQUITETURA

```plaintext
DDD + Arquitetura Hexagonal
    │
    ├─ ✅ Domínio independente de tecnologia
    │   └─ Fácil trocar banco de dados, frameworks, etc.
    │
    ├─ ✅ Testabilidade
    │   └─ Use mocks, testes isolados, sem dependências externas
    │
    ├─ ✅ Manutenibilidade
    │   └─ Código organizado, responsabilidades claras
    │
    ├─ ✅ Evolução
    │   └─ Adicionar features sem quebrar existentes
    │
    ├─ ✅ Escalabilidade
    │   └─ Estrutura suporta crescimento do projeto
    │
    ├─ ✅ Comunicação com negócio
    │   └─ Linguagem ubíqua, código reflete regras de negócio
    │
    └─ ✅ Reusabilidade
        └─ Use Cases reutilizáveis em diferentes interfaces
```

---

## 📚 REFERÊNCIAS E PRÓXIMOS PASSOS

### Conceitos avançados a explorar

- **Event Sourcing**: Armazenar eventos do domínio em vez de estado
- **CQRS**: Separar commands (escrita) de queries (leitura)
- **Domain Events**: Eventos criados pelo agregado para notificar mudanças
- **Bounded Contexts**: Separar múltiplos modelos de domínio
- **Anti-Corruption Layer**: Traduzir entre diferentes bounded contexts

### Padrões complementares

- **Factory Pattern**: Criar agregados complexos
- **Strategy Pattern**: Diferentes implementações de serviços
- **Observer Pattern**: Reagir a eventos de domínio
- **Decorator Pattern**: Adicionar comportamentos a objetos

---

## CONCLUSÃO

A arquitetura DDD com Hexagonal proporciona uma forma estruturada e escalável de construir aplicações. Os conceitos trabalham em harmonia:

1. **Value Objects e Entities** formam o vocabulário do domínio
2. **Agregados** garantem consistência
3. **Repositories** abstraem persistência
4. **Use Cases** orquestram fluxos
5. **Domain Services** encapsulam lógica complexa
6. **Controllers** recebem requisições
7. **Adapters** traduzem tecnologias
8. **Interfaces** permitem desacoplamento

Esse design torna sua aplicação **robusta**, **testável** e **pronta para evoluir**!
