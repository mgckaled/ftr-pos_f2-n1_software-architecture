<!-- markdownlint-disable MD024 -->

# Entidades e Objetos de Valor

> [Voltar](../../../README.md)

## Índice

- [Entidades e Objetos de Valor](#entidades-e-objetos-de-valor)
  - [Índice](#índice)
  - [Introdução: Por Que Isso Importa?](#introdução-por-que-isso-importa)
  - [O Conceito de Identity (Identidade)](#o-conceito-de-identity-identidade)
    - [O que é Identidade?](#o-que-é-identidade)
  - [Entities: Objetos com Identidade](#entities-objetos-com-identidade)
    - [Definição](#definição)
    - [Características Principais](#características-principais)
    - [Exemplo 1: Paciente (Entity)](#exemplo-1-paciente-entity)
    - [Exemplo 2: Consulta (Entity)](#exemplo-2-consulta-entity)
    - [Quando Usar Entities?](#quando-usar-entities)
  - [Value Objects: Objetos sem Identidade (mas com Significado!)](#value-objects-objetos-sem-identidade-mas-com-significado)
    - [Definição](#definição-1)
    - [Características Principais](#características-principais-1)
    - [Visualizando a Diferença](#visualizando-a-diferença)
    - [Exemplo 1: Horário (Value Object)](#exemplo-1-horário-value-object)
    - [Exemplo 2: Endereço (Value Object)](#exemplo-2-endereço-value-object)
    - [Exemplo 3: Duração de Consulta (Value Object)](#exemplo-3-duração-de-consulta-value-object)
    - [Quando Usar Value Objects?](#quando-usar-value-objects)
  - [IDs como Value Objects (Padrão Importante)](#ids-como-value-objects-padrão-importante)
  - [Relacionamento entre Entities e Value Objects](#relacionamento-entre-entities-e-value-objects)
    - [Como Trabalham Juntos](#como-trabalham-juntos)
  - [Exemplo Completo: Sistema de Agendamento](#exemplo-completo-sistema-de-agendamento)
  - [Comparação Visual: Entities vs Value Objects](#comparação-visual-entities-vs-value-objects)
  - [Benefícios de Usar Entities e Value Objects Corretamente](#benefícios-de-usar-entities-e-value-objects-corretamente)
    - [Clareza do Domínio](#clareza-do-domínio)
    - [Segurança de Tipo](#segurança-de-tipo)
    - [Encapsulamento de Lógica](#encapsulamento-de-lógica)
    - [Facilita Testes](#facilita-testes)
  - [Relacionamentos Entre Entities e Value Objects](#relacionamentos-entre-entities-e-value-objects)
    - [Composição e Agregação](#composição-e-agregação)
    - [Agregados em DDD](#agregados-em-ddd)
  - [Decisão: Quando Usar Entity vs Value Object?](#decisão-quando-usar-entity-vs-value-object)
    - [Matriz de Decisão](#matriz-de-decisão)
  - [Padrões Avançados](#padrões-avançados)
    - [1. Value Object: Email Validado](#1-value-object-email-validado)
    - [2. Value Object: Telefone com Formatação](#2-value-object-telefone-com-formatação)
    - [3. Entity com Comportamento de Domínio](#3-entity-com-comportamento-de-domínio)
  - [Fluxo Completo: Do Domínio ao Código](#fluxo-completo-do-domínio-ao-código)
  - [Exemplo de Uso Integrado](#exemplo-de-uso-integrado)
  - [Resumo das Diferenças](#resumo-das-diferenças)
  - [Checklist: Implementando Corretamente](#checklist-implementando-corretamente)
    - [Para Entities](#para-entities)
    - [Para Value Objects](#para-value-objects)
  - [Próximos Passos](#próximos-passos)
  - [Conclusão](#conclusão)

---

## Introdução: Por Que Isso Importa?

Quando desenvolvemos software usando Domain-Driven Design (DDD), uma das primeiras decisões que precisamos tomar é: "O que é importante rastrear neste domínio?"

Imagine você trabalhando em um hospital. Alguns objetos precisam ser identificados e rastreados individualmente ao longo do tempo (como um paciente ou uma consulta agendada), enquanto outros são apenas características descritivas que importam apenas enquanto descrevem algo (como um horário ou uma duração).

A distinção entre **Entities** e **Value Objects** responde exatamente a essa pergunta: qual é a natureza do objeto que estamos criando?

---

## O Conceito de Identity (Identidade)

Antes de entender Entities e Value Objects, precisamos compreender o conceito de identidade no DDD.

### O que é Identidade?

A identidade é uma característica que permite distinguir um objeto de outro ao longo do tempo. Duas pessoas podem ter o mesmo nome e sobrenome, mas elas são pessoas diferentes porque têm identidades únicas.

```plaintext
┌─────────────────────────────────────────┐
│           Dois Pacientes                │
├─────────────────────────────────────────┤
│ Paciente A                 │ Paciente B │
│ ID: 001                    │ ID: 002    │
│ Nome: João Silva           │ Nome: João │
│ Idade: 40                  │ Idade: 45  │
│                            │            │
│ → SÃO DIFERENTES           │            │
│   (identidades distintas)  │            │
└─────────────────────────────────────────┘
```

A identidade é **permanente** e **única** para cada objeto durante toda sua existência no sistema.

---

## Entities: Objetos com Identidade

### Definição

Uma **Entity** (Entidade) é um objeto que possui identidade única dentro do domínio. Ela é rastreável e mutável ao longo do tempo. A identidade de uma Entity permanece a mesma mesmo que todos os seus atributos mudem.

### Características Principais

Uma Entity possui essas características fundamentais:

**Continuidade de Identidade**: A identidade não muda, mesmo se tudo mais mudar. Se você mudar de endereço, continua sendo você.

**Mutabilidade**: Os atributos de uma Entity podem ser modificados. Um paciente pode mudar de telefone, endereço ou marcar uma consulta.

**Ciclo de Vida**: Uma Entity nasce, vive no sistema e pode ser removida. Ela têm uma história.

**Responsabilidade de Rastreamento**: O sistema precisa rastrear especificamente esta Entity durante toda a sua existência.

### Exemplo 1: Paciente (Entity)

No contexto de agendamento de consultas médicas, um **Paciente** é claramente uma Entity:

```typescript
// Uma Entity deve ter uma identidade única
class Paciente {
  // Este é o identificador único que nunca muda
  private readonly pacienteId: PacienteId;
  
  // Estes atributos podem mudar ao longo do tempo
  private nome: string;
  private email: string;
  private telefone: string;
  private dataNascimento: Date;
  private endereco: Endereco;
  
  // Histórico de consultas: rastreamos cada consulta deste paciente
  private consultasAgendadas: Consulta[] = [];
  
  constructor(
    pacienteId: PacienteId,
    nome: string,
    email: string,
    telefone: string,
    dataNascimento: Date,
    endereco: Endereco
  ) {
    this.pacienteId = pacienteId;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.dataNascimento = dataNascimento;
    this.endereco = endereco;
  }
  
  // Métodos que mudam o estado da Entity
  public atualizarTelefone(novoTelefone: string): void {
    this.telefone = novoTelefone;
    // O paciente continua sendo o mesmo, apenas um atributo mudou
  }
  
  public mudarEndereco(novoEndereco: Endereco): void {
    this.endereco = novoEndereco;
    // Novamente: a identidade persiste, apenas dados mudam
  }
  
  public agendar(consulta: Consulta): void {
    this.consultasAgendadas.push(consulta);
  }
  
  // Getter para a identidade
  public getId(): PacienteId {
    return this.pacienteId;
  }
  
  public getConsultasAgendadas(): Consulta[] {
    return [...this.consultasAgendadas];
  }
}
```

### Exemplo 2: Consulta (Entity)

Uma **Consulta** também é uma Entity porque precisa ser rastreada individualmente:

```typescript
class Consulta {
  // Cada consulta tem um ID único
  private readonly consultaId: ConsultaId;
  
  // Referências a outras Entities
  private pacienteId: PacienteId;
  private medicoId: MedicoId;
  
  // Dados mutáveis
  private dataHora: Date;
  private status: StatusConsulta; // AGENDADA, CONFIRMADA, CANCELADA, REALIZADA
  private observacoes: string;
  private dataConfirmacao?: Date;
  private dataCancelamento?: Date;
  
  constructor(
    consultaId: ConsultaId,
    pacienteId: PacienteId,
    medicoId: MedicoId,
    dataHora: Date
  ) {
    this.consultaId = consultaId;
    this.pacienteId = pacienteId;
    this.medicoId = medicoId;
    this.dataHora = dataHora;
    this.status = StatusConsulta.AGENDADA;
    this.observacoes = "";
  }
  
  // Métodos que representam comportamentos do domínio
  public confirmar(): void {
    if (this.status !== StatusConsulta.AGENDADA) {
      throw new Error("Apenas consultas agendadas podem ser confirmadas");
    }
    this.status = StatusConsulta.CONFIRMADA;
    this.dataConfirmacao = new Date();
  }
  
  public cancelar(motivo: string): void {
    if (this.status === StatusConsulta.REALIZADA) {
      throw new Error("Não é possível cancelar uma consulta já realizada");
    }
    this.status = StatusConsulta.CANCELADA;
    this.dataCancelamento = new Date();
    this.observacoes = motivo;
  }
  
  public getId(): ConsultaId {
    return this.consultaId;
  }
  
  public getStatus(): StatusConsulta {
    return this.status;
  }
}

enum StatusConsulta {
  AGENDADA = "AGENDADA",
  CONFIRMADA = "CONFIRMADA",
  CANCELADA = "CANCELADA",
  REALIZADA = "REALIZADA"
}
```

### Quando Usar Entities?

Use uma Entity quando:

- O objeto precisa ser **unicamente identificado** no domínio
- O objeto **muda ao longo do tempo** e você precisa rastrear essas mudanças
- Você precisa **referenciar o mesmo objeto** em múltiplos lugares do código
- A **continuidade de identidade importa** mais do que os valores dos atributos

No nosso sistema de agendamento: Paciente, Consulta e Médico são Entities.

---

## Value Objects: Objetos sem Identidade (mas com Significado!)

### Definição

Um **Value Object** (Objeto de Valor) é um objeto que não possui identidade única. Dois Value Objects são considerados iguais se todos os seus atributos são iguais. O que importa é o **valor**, não quem é.

### Características Principais

**Sem Identidade**: Não há um ID que o diferencie. A igualdade é baseada nos valores.

**Imutabilidade**: Uma vez criado, um Value Object não muda. Se você precisa de um valor diferente, cria um novo Value Object.

**Substituibilidade**: Se dois Value Objects têm os mesmos valores, podem ser usados de forma intercambiável.

**Sem Ciclo de Vida Complexo**: Não precisamos rastrear "aquele" Value Object específico.

### Visualizando a Diferença

```plaintext
┌────────────────────────────────────────┐
│     ENTITY vs VALUE OBJECT             │
├────────────────────────────────────────┤
│                                        │
│  ENTITY (Paciente)                     │
│  ID: 001                               │
│  Nome: "João Silva"                    │
│                                        │
│  Paciente A ≠ Paciente B              │
│  mesmo que ambos se chamem João Silva │
│  (a identidade diferencia)             │
│                                        │
├────────────────────────────────────────┤
│                                        │
│  VALUE OBJECT (Horário)                │
│  14:30                                 │
│                                        │
│  Horário A = Horário B                │
│  se ambos forem 14:30                  │
│  (o valor define a igualdade)          │
│                                        │
└────────────────────────────────────────┘
```

### Exemplo 1: Horário (Value Object)

Um **Horário** é um Value Object perfeito. Dois horários são iguais se têm as mesmas horas e minutos:

```typescript
// Um Value Object que representa um horário de funcionamento
class Horario {
  private readonly horas: number;
  private readonly minutos: number;
  
  constructor(horas: number, minutos: number) {
    // Validações garantem que o objeto seja sempre válido
    if (horas < 0 || horas > 23) {
      throw new Error("Horas devem estar entre 0 e 23");
    }
    if (minutos < 0 || minutos > 59) {
      throw new Error("Minutos devem estar entre 0 e 59");
    }
    
    this.horas = horas;
    this.minutos = minutos;
  }
  
  // Value Objects implementam igualdade baseada em valores
  public equals(outro: Horario): boolean {
    return this.horas === outro.horas && this.minutos === outro.minutos;
  }
  
  // Value Objects são imutáveis. Se você quer outro horário, cria um novo
  public somarMinutos(minutos: number): Horario {
    let novasHoras = this.horas;
    let novosMinutos = this.minutos + minutos;
    
    while (novosMinutos >= 60) {
      novosMinutos -= 60;
      novasHoras += 1;
    }
    
    return new Horario(novasHoras, novosMinutos);
  }
  
  // Método para representação em string
  public toString(): string {
    return `${String(this.horas).padStart(2, '0')}:${String(this.minutos).padStart(2, '0')}`;
  }
  
  public getHoras(): number {
    return this.horas;
  }
  
  public getMinutos(): number {
    return this.minutos;
  }
}

// Exemplos de uso:
const horario1 = new Horario(14, 30);
const horario2 = new Horario(14, 30);
const horario3 = new Horario(15, 00);

console.log(horario1.equals(horario2)); // true - mesmos valores
console.log(horario1.equals(horario3)); // false - valores diferentes

// Para "mudar" o horário, criamos um novo:
const horarioAjustado = horario1.somarMinutos(15); // novo objeto: 14:45
console.log(horario1.toString()); // ainda é 14:30 (imutável)
```

### Exemplo 2: Endereço (Value Object)

Um **Endereço** é outro excelente exemplo de Value Object. Dois endereços são "iguais" se têm exatamente os mesmos componentes:

```typescript
// Um Value Object que representa um endereço completo
class Endereco {
  private readonly rua: string;
  private readonly numero: string;
  private readonly complemento: string;
  private readonly cidade: string;
  private readonly estado: string;
  private readonly cep: string;
  
  constructor(
    rua: string,
    numero: string,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  ) {
    // Validações garantem consistência
    if (!this.validarCEP(cep)) {
      throw new Error("CEP inválido");
    }
    
    this.rua = rua;
    this.numero = numero;
    this.complemento = complemento;
    this.cidade = cidade;
    this.estado = estado;
    this.cep = cep;
  }
  
  private validarCEP(cep: string): boolean {
    const regex = /^\d{5}-?\d{3}$/;
    return regex.test(cep);
  }
  
  // Igualdade baseada em todos os atributos
  public equals(outro: Endereco): boolean {
    return (
      this.rua === outro.rua &&
      this.numero === outro.numero &&
      this.complemento === outro.complemento &&
      this.cidade === outro.cidade &&
      this.estado === outro.estado &&
      this.cep === outro.cep
    );
  }
  
  // Value Objects são imutáveis - para "mudar", cria-se um novo
  public mudarComplemento(novoComplemento: string): Endereco {
    return new Endereco(
      this.rua,
      this.numero,
      novoComplemento,
      this.cidade,
      this.estado,
      this.cep
    );
  }
  
  public toString(): string {
    return `${this.rua}, ${this.numero}, ${this.complemento} - ${this.cidade}, ${this.estado} ${this.cep}`;
  }
  
  // Getters imutáveis
  public getRua(): string { return this.rua; }
  public getNumero(): string { return this.numero; }
  public getComplemento(): string { return this.complemento; }
  public getCidade(): string { return this.cidade; }
  public getEstado(): string { return this.estado; }
  public getCEP(): string { return this.cep; }
}
```

### Exemplo 3: Duração de Consulta (Value Object)

Um **Duração** também é um Value Object - representa apenas um conceito de tempo:

```typescript
// Um Value Object que representa duração em minutos
class Duracao {
  private readonly minutos: number;
  
  constructor(minutos: number) {
    if (minutos <= 0) {
      throw new Error("Duração deve ser maior que zero");
    }
    this.minutos = minutos;
  }
  
  public equals(outro: Duracao): boolean {
    return this.minutos === outro.minutos;
  }
  
  // Operações que retornam novos Value Objects
  public dobrar(): Duracao {
    return new Duracao(this.minutos * 2);
  }
  
  public somar(outra: Duracao): Duracao {
    return new Duracao(this.minutos + outra.minutos);
  }
  
  public getMinutos(): number {
    return this.minutos;
  }
  
  public toString(): string {
    const horas = Math.floor(this.minutos / 60);
    const mins = this.minutos % 60;
    return horas > 0 ? `${horas}h ${mins}m` : `${mins}m`;
  }
}

// Exemplos:
const duracao1 = new Duracao(30);
const duracao2 = new Duracao(30);

console.log(duracao1.equals(duracao2)); // true

const duracaoMaior = duracao1.somar(new Duracao(15)); // 45 minutos
console.log(duracaoMaior.toString()); // "45m"
```

### Quando Usar Value Objects?

Use um Value Object quando:

- O objeto **não precisa de identidade única**
- **Dois objetos com os mesmos valores são intercambiáveis**
- O objeto é **imutável** (ou deve ser tratado como tal)
- Você quer **encapsular validações** e lógica relacionada aos valores
- O objeto **descreve uma característica ou conceito** dentro do domínio

No nosso sistema: Horário, Endereço, Duração, Status são Value Objects.

---

## IDs como Value Objects (Padrão Importante)

Há um padrão especial em DDD: os **IDs das Entities também devem ser Value Objects**. Isso traz benefícios significativos:

```typescript
// Em vez de usar string ou number diretamente:
class PacienteId {
  private readonly valor: string;
  
  constructor(valor: string) {
    if (!valor || valor.trim() === "") {
      throw new Error("PacienteId não pode ser vazio");
    }
    this.valor = valor;
  }
  
  public equals(outro: PacienteId): boolean {
    return this.valor === outro.valor;
  }
  
  public toString(): string {
    return this.valor;
  }
  
  public getValor(): string {
    return this.valor;
  }
}

class ConsultaId {
  private readonly valor: string;
  
  constructor(valor: string) {
    if (!valor || valor.trim() === "") {
      throw new Error("ConsultaId não pode ser vazio");
    }
    this.valor = valor;
  }
  
  public equals(outro: ConsultaId): boolean {
    return this.valor === outro.valor;
  }
  
  public toString(): string {
    return this.valor;
  }
}

// Isso traz type-safety:
// pacienteId: PacienteId vs pacienteId: string
// O compilador previne confundirmos IDs de diferentes tipos!
```

---

## Relacionamento entre Entities e Value Objects

### Como Trabalham Juntos

```plaintext
┌─────────────────────────────────────────────────┐
│              CONSULTA (Entity)                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  consultaId: ConsultaId (Value Object ID)       │
│  pacienteId: PacienteId (referência)            │
│  medicoId: MedicoId (referência)                │
│  dataHora: Date (Value Object)                  │
│  status: StatusConsulta (Value Object enum)     │
│  duracao: Duracao (Value Object)                │
│  observacoes: string                            │
│                                                 │
│  Métodos que modificam estado (mutáveis)        │
│  - confirmar()                                  │
│  - cancelar()                                   │
│  - reagendar()                                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

Uma Entity **contém e organiza** Value Objects. A Entity é o objeto mutable que coordena o comportamento, enquanto Value Objects descrevem características específicas de forma imutável.

---

## Exemplo Completo: Sistema de Agendamento

Aqui está como esses conceitos trabalham juntos em um cenário real:

```typescript
// ============ VALUE OBJECTS ============

class PacienteId {
  private readonly valor: string;
  
  constructor(valor: string) {
    if (!valor) throw new Error("ID inválido");
    this.valor = valor;
  }
  
  public equals(outro: PacienteId): boolean {
    return this.valor === outro.valor;
  }
  
  public toString(): string {
    return this.valor;
  }
}

class MedicoId {
  private readonly valor: string;
  
  constructor(valor: string) {
    if (!valor) throw new Error("ID inválido");
    this.valor = valor;
  }
  
  public equals(outro: MedicoId): boolean {
    return this.valor === outro.valor;
  }
  
  public toString(): string {
    return this.valor;
  }
}

class ConsultaId {
  private readonly valor: string;
  
  constructor(valor: string) {
    if (!valor) throw new Error("ID inválido");
    this.valor = valor;
  }
  
  public equals(outro: ConsultaId): boolean {
    return this.valor === outro.valor;
  }
  
  public toString(): string {
    return this.valor;
  }
}

class Endereco {
  constructor(
    private readonly rua: string,
    private readonly numero: string,
    private readonly cidade: string,
    private readonly estado: string,
    private readonly cep: string
  ) {}
  
  public equals(outro: Endereco): boolean {
    return (
      this.rua === outro.rua &&
      this.numero === outro.numero &&
      this.cidade === outro.cidade &&
      this.estado === outro.estado &&
      this.cep === outro.cep
    );
  }
  
  public toString(): string {
    return `${this.rua}, ${this.numero} - ${this.cidade}, ${this.estado} ${this.cep}`;
  }
}

class Duracao {
  constructor(private readonly minutos: number) {
    if (minutos <= 0) throw new Error("Duração inválida");
  }
  
  public equals(outro: Duracao): boolean {
    return this.minutos === outro.minutos;
  }
  
  public getMinutos(): number {
    return this.minutos;
  }
  
  public toString(): string {
    return `${this.minutos}m`;
  }
}

// ============ ENTITIES ============

class Paciente {
  constructor(
    private readonly pacienteId: PacienteId,
    private nome: string,
    private email: string,
    private telefone: string,
    private endereco: Endereco,
    private dataCadastro: Date = new Date()
  ) {}
  
  // O ID nunca muda
  public getId(): PacienteId {
    return this.pacienteId;
  }
  
  // Dados podem ser atualizados
  public atualizarContato(email: string, telefone: string): void {
    this.email = email;
    this.telefone = telefone;
  }
  
  public atualizarEndereco(novoEndereco: Endereco): void {
    this.endereco = novoEndereco;
  }
  
  public getNome(): string {
    return this.nome;
  }
  
  public getEmail(): string {
    return this.email;
  }
  
  public getEndereco(): Endereco {
    return this.endereco;
  }
}

class Medico {
  constructor(
    private readonly medicoId: MedicoId,
    private nome: string,
    private especialidade: string,
    private duracaoConsultaPadrao: Duracao
  ) {}
  
  public getId(): MedicoId {
    return this.medicoId;
  }
  
  public getNome(): string {
    return this.nome;
  }
  
  public getEspecialidade(): string {
    return this.especialidade;
  }
  
  public getDuracaoConsultaPadrao(): Duracao {
    return this.duracaoConsultaPadrao;
  }
}

enum StatusConsulta {
  AGENDADA = "AGENDADA",
  CONFIRMADA = "CONFIRMADA",
  CANCELADA = "CANCELADA",
  REALIZADA = "REALIZADA"
}

class Consulta {
  private status: StatusConsulta = StatusConsulta.AGENDADA;
  private dataConfirmacao?: Date;
  private dataCancelamento?: Date;
  private observacoes: string = "";
  
  constructor(
    private readonly consultaId: ConsultaId,
    private readonly pacienteId: PacienteId,
    private readonly medicoId: MedicoId,
    private dataHora: Date,
    private duracao: Duracao,
    private readonly dataCriacao: Date = new Date()
  ) {}
  
  // ID nunca muda
  public getId(): ConsultaId {
    return this.consultaId;
  }
  
  // Referências aos pacientes e médicos (IDs de outras Entities)
  public getPacienteId(): PacienteId {
    return this.pacienteId;
  }
  
  public getMedicoId(): MedicoId {
    return this.medicoId;
  }
  
  // Estado muta através de métodos de domínio
  public confirmar(): void {
    if (this.status !== StatusConsulta.AGENDADA) {
      throw new Error("Apenas consultas agendadas podem ser confirmadas");
    }
    this.status = StatusConsulta.CONFIRMADA;
    this.dataConfirmacao = new Date();
  }
  
  public cancelar(motivo: string): void {
    if (this.status === StatusConsulta.REALIZADA) {
      throw new Error("Não é possível cancelar uma consulta realizada");
    }
    this.status = StatusConsulta.CANCELADA;
    this.dataCancelamento = new Date();
    this.observacoes = motivo;
  }
  
  public marcarComoRealizada(): void {
    if (this.status !== StatusConsulta.CONFIRMADA) {
      throw new Error("Apenas consultas confirmadas podem ser marcadas como realizadas");
    }
    this.status = StatusConsulta.REALIZADA;
  }
  
  public reagendar(novaDataHora: Date): void {
    if (this.status === StatusConsulta.REALIZADA || this.status === StatusConsulta.CANCELADA) {
      throw new Error("Não é possível reagendar uma consulta já realizada ou cancelada");
    }
    this.dataHora = novaDataHora;
    this.status = StatusConsulta.AGENDADA;
    this.dataConfirmacao = undefined;
  }
  
  // Getters de Value Objects
  public getDataHora(): Date {
    return this.dataHora;
  }
  
  public getDuracao(): Duracao {
    return this.duracao;
  }
  
  public getStatus(): StatusConsulta {
    return this.status;
  }
  
  public getObservacoes(): string {
    return this.observacoes;
  }
}

// ============ USO NA PRÁTICA ============

// Criando Value Objects (imutáveis)
const enderecoPaciente = new Endereco(
  "Rua das Flores",
  "123",
  "São Paulo",
  "SP",
  "01234-567"
);

const duracaoConsulta = new Duracao(30);

// Criando Entities (com IDs únicos)
const pacienteId = new PacienteId("pac-001");
const paciente = new Paciente(
  pacienteId,
  "João Silva",
  "joao@email.com",
  "11-98765-4321",
  enderecoPaciente
);

const medicoId = new MedicoId("med-001");
const medico = new Medico(
  medicoId,
  "Dr. Pedro",
  "Cardiologia",
  duracaoConsulta
);

// Criando uma consulta (Entity)
const consultaId = new ConsultaId("cons-001");
const dataAgendamento = new Date("2025-10-20T14:30:00");

const consulta = new Consulta(
  consultaId,
  paciente.getId(),
  medico.getId(),
  dataAgendamento,
  duracaoConsulta
);

// Usando as Entities
console.log(`Paciente: ${paciente.getNome()}`);
console.log(`Endereço: ${enderecoPaciente.toString()}`);
console.log(`Consulta agendada com ${medico.getNome()}`);
console.log(`Status: ${consulta.getStatus()}`);

// Modificando Estado
consulta.confirmar();
console.log(`Após confirmação: ${consulta.getStatus()}`);

// Se você quiser "mudar" um Value Object, cria um novo
const novoEndereco = new Endereco(
  "Avenida Brasil",
  "456",
  "São Paulo",
  "SP",
  "02345-678"
);
paciente.atualizarEndereco(novoEndereco);
```

---

## Comparação Visual: Entities vs Value Objects

```plaintext
┌──────────────────────────────────────────────────────────────┐
│           ENTITIES vs VALUE OBJECTS                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ASPECTO              │ ENTITY              │ VALUE OBJECT    │
│ ─────────────────────┼─────────────────────┼─────────────────│
│ Identidade           │ SIM (ID único)      │ NÃO             │
│ Igualdade            │ Por ID              │ Por valores     │
│ Mutabilidade         │ Muta ao longo tempo │ Imutável        │
│ Ciclo de Vida        │ Nasce, muda, morre  │ Sem ciclo       │
│ Rastreamento         │ Precisa ser         │ Não precisa     │
│                      │ rastreado           │                 │
│ Exemplo              │ Paciente, Consulta  │ Horário,        │
│                      │ Médico              │ Endereço        │
│                      │                     │ Duração         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Benefícios de Usar Entities e Value Objects Corretamente

### Clareza do Domínio

Quando você nomeia algo como Entity ou Value Object, comunicar intenção sobre qual é a natureza daquele conceito no domínio:

```typescript
// Claro: é um objeto com identidade que precisa ser rastreado
class Consulta implements Entity { }

// Claro: é um valor imutável
class Horario implements ValueObject { }
```

### Segurança de Tipo

Ao usar Value Objects específicos como IDs, o TypeScript nos protege de erros:

```typescript
// ❌ PERIGO: Confundindo diferentes IDs
function agendar(pacienteId: string, medicoId: string, consultaId: string) {
  // Fácil trocar os parâmetros e gerar um bug!
}

// ✅ SEGURO: Value Objects com tipos distintos
function agendar(pacienteId: PacienteId, medicoId: MedicoId, consultaId: ConsultaId) {
  // Impossível passar um ID do tipo errado
}

// O compilador vai reclama se tentarmos:
const pacId = new PacienteId("pac-001");
const medId = new MedicoId("med-001");

agendar(medId, pacId, medId); // ❌ ERRO DE COMPILAÇÃO!
```

### Encapsulamento de Lógica

Value Objects encapsulam validações e comportamentos relacionados:

```typescript
// ❌ SEM Value Object: Lógica espalhada
class Consulta {
  private horarioInicio: number;
  private horarioFim: number;
  
  public agendarAs(h: number, m: number): void {
    if (h < 8 || h > 18) throw new Error("Horário fora do expediente");
    if (m !== 0 && m !== 15 && m !== 30 && m !== 45) throw new Error("Minutos inválidos");
    this.horarioInicio = h * 60 + m;
  }
  
  public validarHorario(): boolean {
    return this.horarioInicio >= 8 * 60 && this.horarioInicio <= 18 * 60;
  }
}

// ✅ COM Value Object: Lógica centralizada
class Horario {
  private readonly horas: number;
  private readonly minutos: number;
  
  constructor(horas: number, minutos: number) {
    if (horas < 8 || horas > 18) throw new Error("Horário fora do expediente");
    if (![0, 15, 30, 45].includes(minutos)) throw new Error("Minutos inválidos");
    
    this.horas = horas;
    this.minutos = minutos;
  }
}

class Consulta {
  private horario: Horario;
  
  public agendarAs(horario: Horario): void {
    // Validação já aconteceu na criação do Horario
    this.horario = horario;
  }
}
```

### Facilita Testes

Value Objects são mais fáceis de testar porque são imutáveis e não têm dependências externas:

```typescript
// ✅ Teste simples e direto para Value Object
describe("Horario", () => {
  it("deve criar um horário válido", () => {
    const horario = new Horario(14, 30);
    expect(horario.toString()).toBe("14:30");
  });
  
  it("deve rejeitar horário fora do expediente", () => {
    expect(() => new Horario(22, 0)).toThrow();
  });
  
  it("dois horários com mesmos valores devem ser iguais", () => {
    const h1 = new Horario(14, 30);
    const h2 = new Horario(14, 30);
    expect(h1.equals(h2)).toBe(true);
  });
});

// ✅ Teste para Entity é mais complexo (depende de persistência, etc)
describe("Consulta", () => {
  let consulta: Consulta;
  let mockRepository: ConsultaRepository;
  
  beforeEach(() => {
    mockRepository = createMockRepository();
    consulta = new Consulta(
      new ConsultaId("cons-001"),
      new PacienteId("pac-001"),
      new MedicoId("med-001"),
      new Date(),
      new Duracao(30)
    );
  });
  
  it("deve confirmar uma consulta agendada", async () => {
    consulta.confirmar();
    await mockRepository.save(consulta);
    
    const consultaSalva = await mockRepository.findById(consulta.getId());
    expect(consultaSalva.getStatus()).toBe(StatusConsulta.CONFIRMADA);
  });
});
```

---

## Relacionamentos Entre Entities e Value Objects

### Composição e Agregação

```plaintext
┌─────────────────────────────────────────────────────┐
│              PACIENTE (Entity)                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  pacienteId: PacienteId (Value Object)              │
│  ├─ ID único, imutável                              │
│                                                     │
│  nome: string                                       │
│  email: string                                      │
│  telefone: string                                   │
│                                                     │
│  endereco: Endereco (Value Object)                  │
│  ├─ Composto de rua, número, cidade, etc            │
│  ├─ Imutável - para "mudar" cria novo               │
│                                                     │
│  dataCadastro: Date                                 │
│                                                     │
│  consultasAgendadas: ConsultaId[] (referências)     │
│  ├─ IDs de outras Entities                          │
│  ├─ NÃO guardamos o objeto Consulta completo        │
│  ├─ (responsabilidade do Repository)                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Agregados em DDD

Um padrão importante em DDD é o **Agregado**: um grupo de Entities e Value Objects que funcionam juntos e possuem uma "raiz" (uma Entity principal).

```typescript
// ============ AGREGADO: AGENDAMENTO DE CONSULTA ============

// A Consulta é a raiz do agregado
class Consulta {
  private readonly consultaId: ConsultaId;
  private readonly pacienteId: PacienteId;
  private readonly medicoId: MedicoId;
  
  // Value Objects que fazem parte deste agregado
  private dataHora: Date;
  private duracao: Duracao;
  private status: StatusConsulta;
  
  // Observações também é um Value Object (string validada)
  private observacoes: Observacoes;
  
  // ✅ DENTRO DO AGREGADO: guardamos o valor de Value Objects
  // ✅ FORA DO AGREGADO: guardamos apenas IDs de outras Entities
  
  public reagendar(novaDataHora: Date, duracao: Duracao): void {
    this.validarPossibilidadeDeReagendamento();
    this.dataHora = novaDataHora;
    this.duracao = duracao;
    this.status = StatusConsulta.AGENDADA;
  }
  
  private validarPossibilidadeDeReagendamento(): void {
    if (this.status === StatusConsulta.REALIZADA) {
      throw new Error("Não pode reagendar uma consulta realizada");
    }
  }
}

// Value Object para observações
class Observacoes {
  private readonly texto: string;
  
  constructor(texto: string) {
    if (texto.length > 500) {
      throw new Error("Observações não podem ter mais de 500 caracteres");
    }
    this.texto = texto;
  }
  
  public equals(outro: Observacoes): boolean {
    return this.texto === outro.texto;
  }
  
  public toString(): string {
    return this.texto;
  }
}
```

---

## Decisão: Quando Usar Entity vs Value Object?

Aqui está uma árvore de decisão prática:

```plaintext
O objeto precisa de identidade única?
│
├─ SIM → É uma ENTITY
│        ├─ Precisa ser rastreado individualmente?
│        ├─ Muda ao longo do tempo?
│        ├─ Exemplos: Paciente, Consulta, Médico
│        └─ Use com ID único
│
└─ NÃO → É um VALUE OBJECT
         ├─ Dois objetos com mesmos valores são iguais?
         ├─ É essencialmente imutável?
         ├─ Exemplos: Horário, Endereço, Duração
         └─ Implemente equals() baseado em valores
```

### Matriz de Decisão

```plaintext
CONCEITO           │ IDENTIDADE? │ MUTA? │ TIPO
───────────────────┼─────────────┼───────┼──────────────
Paciente           │ SIM (CPF)   │ SIM   │ ENTITY
Médico             │ SIM (CRM)   │ SIM   │ ENTITY
Consulta           │ SIM (ID)    │ SIM   │ ENTITY
Horário            │ NÃO         │ NÃO   │ VALUE OBJ
Endereço           │ NÃO         │ NÃO   │ VALUE OBJ
Duração            │ NÃO         │ NÃO   │ VALUE OBJ
Status Consulta    │ NÃO         │ NÃO   │ VALUE OBJ (enum)
Telefone           │ NÃO         │ NÃO   │ VALUE OBJ
Email              │ NÃO         │ NÃO   │ VALUE OBJ
```

---

## Padrões Avançados

### 1. Value Object: Email Validado

```typescript
class Email {
  private readonly endereco: string;
  
  constructor(endereco: string) {
    if (!this.validar(endereco)) {
      throw new Error("Email inválido");
    }
    this.endereco = endereco.toLowerCase();
  }
  
  private validar(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  public equals(outro: Email): boolean {
    return this.endereco === outro.endereco;
  }
  
  public toString(): string {
    return this.endereco;
  }
  
  public getEndereco(): string {
    return this.endereco;
  }
}

// Uso
const email = new Email("paciente@hospital.com");
// new Email("invalido") → Erro! Validação encapsulada
```

### 2. Value Object: Telefone com Formatação

```typescript
class Telefone {
  private readonly numero: string;
  
  constructor(numero: string) {
    const limpo = numero.replace(/\D/g, "");
    if (limpo.length < 10 || limpo.length > 11) {
      throw new Error("Telefone deve ter 10 ou 11 dígitos");
    }
    this.numero = limpo;
  }
  
  public equals(outro: Telefone): boolean {
    return this.numero === outro.numero;
  }
  
  public toString(): string {
    if (this.numero.length === 11) {
      return `(${this.numero.slice(0, 2)}) ${this.numero.slice(2, 7)}-${this.numero.slice(7)}`;
    }
    return `(${this.numero.slice(0, 2)}) ${this.numero.slice(2, 6)}-${this.numero.slice(6)}`;
  }
  
  public getNumero(): string {
    return this.numero;
  }
}

// Uso
const tel = new Telefone("11987654321");
console.log(tel.toString()); // (11) 98765-4321
```

### 3. Entity com Comportamento de Domínio

```typescript
class AgendadorDeConsultas {
  private pacientes: Map<string, Paciente> = new Map();
  private medicos: Map<string, Medico> = new Map();
  private consultas: Map<string, Consulta> = new Map();
  
  // Método que implementa uma regra de negócio complexa
  public agendar(
    paciente: Paciente,
    medico: Medico,
    dataHora: Date,
    duracao: Duracao
  ): Consulta {
    // Validações de regra de negócio
    this.validarHorarioDisponivel(medico, dataHora, duracao);
    this.validarPacienteAtivo(paciente);
    this.validarMedicoAtuante(medico);
    
    // Criação da consulta
    const consultaId = this.gerarConsultaId();
    const consulta = new Consulta(
      consultaId,
      paciente.getId(),
      medico.getId(),
      dataHora,
      duracao
    );
    
    // Persistência
    this.consultas.set(consultaId.toString(), consulta);
    
    // Retorno
    return consulta;
  }
  
  private validarHorarioDisponivel(
    medico: Medico,
    dataHora: Date,
    duracao: Duracao
  ): void {
    // Verifica se o médico não tem conflito de horário
    const consultasDoMedico = Array.from(this.consultas.values())
      .filter(c => c.getMedicoId().equals(medico.getId()))
      .filter(c => c.getStatus() !== StatusConsulta.CANCELADA);
    
    for (const consulta of consultasDoMedico) {
      if (this.hasConflito(dataHora, duracao, consulta)) {
        throw new Error("Médico indisponível neste horário");
      }
    }
  }
  
  private hasConflito(
    dataHora: Date,
    duracao: Duracao,
    consultaExistente: Consulta
  ): boolean {
    const fimNova = new Date(dataHora.getTime() + duracao.getMinutos() * 60000);
    const inicioExistente = consultaExistente.getDataHora();
    const fimExistente = new Date(
      inicioExistente.getTime() + 
      consultaExistente.getDuracao().getMinutos() * 60000
    );
    
    return dataHora < fimExistente && fimNova > inicioExistente;
  }
  
  private validarPacienteAtivo(paciente: Paciente): void {
    // Você implementaria lógica para verificar se paciente está ativo
  }
  
  private validarMedicoAtuante(medico: Medico): void {
    // Você implementaria lógica para verificar se médico está ativo
  }
  
  private gerarConsultaId(): ConsultaId {
    // Gera um ID único (em produção, usaria UUID ou banco de dados)
    return new ConsultaId(`cons-${Date.now()}`);
  }
}
```

---

## Fluxo Completo: Do Domínio ao Código

Aqui está como organizar tudo em um projeto real:

```plaintext
projeto/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── Paciente.ts
│   │   │   ├── Medico.ts
│   │   │   ├── Consulta.ts
│   │   │   └── AgendadorDeConsultas.ts
│   │   ├── valueObjects/
│   │   │   ├── PacienteId.ts
│   │   │   ├── MedicoId.ts
│   │   │   ├── ConsultaId.ts
│   │   │   ├── Endereco.ts
│   │   │   ├── Telefone.ts
│   │   │   ├── Email.ts
│   │   │   ├── Horario.ts
│   │   │   ├── Duracao.ts
│   │   │   └── StatusConsulta.ts
│   │   └── repositories/
│   │       ├── IPacienteRepository.ts
│   │       ├── IMedicoRepository.ts
│   │       └── IConsultaRepository.ts
│   ├── application/
│   │   ├── services/
│   │   │   ├── AgendarConsultaService.ts
│   │   │   ├── ConfirmarConsultaService.ts
│   │   │   └── CancelarConsultaService.ts
│   │   └── dtos/
│   │       ├── AgendarConsultaDto.ts
│   │       └── ConsultaResponseDto.ts
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   ├── PacienteRepository.ts
│   │   │   ├── MedicoRepository.ts
│   │   │   └── ConsultaRepository.ts
│   │   └── database/
│   │       └── connection.ts
│   └── interfaces/
│       └── controllers/
│           └── ConsultaController.ts
└── package.json
```

---

## Exemplo de Uso Integrado

```typescript
// ============ SERVIÇO DE APLICAÇÃO ============
class AgendarConsultaService {
  constructor(
    private pacienteRepository: IPacienteRepository,
    private medicoRepository: IMedicoRepository,
    private consultaRepository: IConsultaRepository,
    private agendador: AgendadorDeConsultas
  ) {}
  
  async executar(dto: AgendarConsultaDto): Promise<ConsultaResponseDto> {
    // 1. Buscar Entities
    const paciente = await this.pacienteRepository.buscarPorId(
      new PacienteId(dto.pacienteId)
    );
    
    if (!paciente) {
      throw new Error("Paciente não encontrado");
    }
    
    const medico = await this.medicoRepository.buscarPorId(
      new MedicoId(dto.medicoId)
    );
    
    if (!medico) {
      throw new Error("Médico não encontrado");
    }
    
    // 2. Criar Value Objects
    const horario = new Horario(dto.hora, dto.minuto);
    const duracao = new Duracao(dto.duracaoMinutos);
    const dataHora = new Date(dto.data);
    
    // 3. Usar o Agendador (que contém a lógica de negócio)
    const consulta = this.agendador.agendar(
      paciente,
      medico,
      dataHora,
      duracao
    );
    
    // 4. Persistir
    await this.consultaRepository.salvar(consulta);
    
    // 5. Retornar DTO (não retornar Entity diretamente)
    return new ConsultaResponseDto(
      consulta.getId().toString(),
      paciente.getNome(),
      medico.getNome(),
      horario.toString(),
      duracao.toString(),
      consulta.getStatus()
    );
  }
}

// ============ DTO ============
class AgendarConsultaDto {
  constructor(
    public pacienteId: string,
    public medicoId: string,
    public data: string,
    public hora: number,
    public minuto: number,
    public duracaoMinutos: number
  ) {}
}

class ConsultaResponseDto {
  constructor(
    public consultaId: string,
    public nomePaciente: string,
    public nomeMedico: string,
    public horario: string,
    public duracao: string,
    public status: StatusConsulta
  ) {}
}

// ============ CONTROLLER ============
class ConsultaController {
  constructor(private agendarConsultaService: AgendarConsultaService) {}
  
  async agendar(req: any, res: any): Promise<void> {
    try {
      const dto = new AgendarConsultaDto(
        req.body.pacienteId,
        req.body.medicoId,
        req.body.data,
        req.body.hora,
        req.body.minuto,
        req.body.duracaoMinutos
      );
      
      const resultado = await this.agendarConsultaService.executar(dto);
      
      res.status(201).json(resultado);
    } catch (erro) {
      res.status(400).json({ erro: erro.message });
    }
  }
}
```

---

## Resumo das Diferenças

```plaintext
╔════════════════════════════════════════════════════════════════╗
║                  ENTITIES vs VALUE OBJECTS                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║ ENTITIES                                                       ║
║ ─────────────────────────────────────────────────────────────  ║
║ • Têm identidade única e imutável                              ║
║ • São rastreáveis ao longo do tempo                            ║
║ • Podem mudar estado (são mutáveis)                            ║
║ • Têm ciclo de vida: nascem, mudam, morrem                     ║
║ • Igualdade comparada por ID, não por valores                  ║
║ • Exemplos: Paciente, Consulta, Médico, Usuário                ║
║                                                                ║
║ VALUE OBJECTS                                                  ║
║ ─────────────────────────────────────────────────────────────  ║
║ • Não têm identidade única                                     ║
║ • Dois objetos com mesmos valores são "iguais"                 ║
║ • São imutáveis (ou devem ser tratados assim)                  ║
║ • Sem ciclo de vida complexo                                   ║
║ • Igualdade comparada por valores                              ║
║ • Exemplos: Horário, Endereço, Duração, Email                  ║
║                                                                ║
║ COMO TRABALHAM JUNTOS                                          ║
║ ─────────────────────────────────────────────────────────────  ║
║ • Entities contêm e organizam Value Objects                    ║
║ • Entities referenciam outras Entities via IDs (Value Objs)    ║
║ • Value Objects encapsulam validações e comportamento          ║
║ • Juntos formam Agregados (grupos coesos)                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Checklist: Implementando Corretamente

Quando você estiver criando uma classe no seu DDD:

### Para Entities

- [ ] Tem um identificador único (ID)?
- [ ] Esse ID nunca muda durante a vida do objeto?
- [ ] Preciso rastrear esse objeto específico ao longo do tempo?
- [ ] Este objeto pode mudar seu estado?
- [ ] Implementei um construtor que recebe o ID?
- [ ] Implementei um método `getId()`?
- [ ] Encapsulei as mudanças em métodos de domínio?

### Para Value Objects

- [ ] Este objeto precisa de identidade única?
- [ ] Dois objetos com os mesmos valores são intercambiáveis?
- [ ] Este objeto é (ou deve ser) imutável?
- [ ] Implementei um método `equals()` que compara valores?
- [ ] Não tenho um ID único?
- [ ] Implementei validações no construtor?
- [ ] Implementei um método `toString()` útil?

---

## Próximos Passos

Agora que você entende Entities e Value Objects, você pode estudar:

1. **Agregados**: Como agrupar Entities e Value Objects de forma coesa
2. **Repositories**: Como persistir Entities sem expor detalhes técnicos
3. **Domain Events**: Como comunicar mudanças importantes no domínio
4. **Services de Domínio**: Quando a lógica não cabe em uma Entity ou Value Object
5. **Especificações**: Padrão para validações complexas e consultas

Cada um desses conceitos constrói sobre a compreensão sólida de Entities e Value Objects que você agora possui!

---

## Conclusão

**Entities** e **Value Objects** são os blocos de construção fundamentais do Domain-Driven Design. Compreender quando usar cada um transforma a qualidade do seu código:

- Use **Entities** para conceitos que precisam de identidade e rastreamento
- Use **Value Objects** para conceitos que são apenas valores

Essa distinção simples, mas poderosa, torna seu código mais seguro, testável e mantível. Mais importante: torna seu código uma representação fiel do domínio que você está modelando.

Parabéns! Você agora domina um dos conceitos mais importantes do DDD!
