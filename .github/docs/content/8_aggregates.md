# Agregados

> [Voltar](../../../README.md)

## Índice

- [Agregados](#agregados)
  - [Índice](#índice)
  - [Introdução: O Problema da Complexidade](#introdução-o-problema-da-complexidade)
  - [Entendendo o Conceito Base](#entendendo-o-conceito-base)
  - [Visualizando a Estrutura de um Agregado](#visualizando-a-estrutura-de-um-agregado)
  - [Analogia do Mundo Real](#analogia-do-mundo-real)
  - [Implementação em TypeScript: Sistema de Manutenção de Veículos](#implementação-em-typescript-sistema-de-manutenção-de-veículos)
    - [Objetos de Valor: Componentes Imutáveis](#objetos-de-valor-componentes-imutáveis)
    - [Entidades do Agregado](#entidades-do-agregado)
    - [A Raiz do Agregado: Veículo](#a-raiz-do-agregado-veículo)
  - [Exemplo de Uso: Vendo o Agregado em Ação](#exemplo-de-uso-vendo-o-agregado-em-ação)
  - [Principais Características dos Agregados](#principais-características-dos-agregados)
    - [1. Limite de Consistência Bem Definido](#1-limite-de-consistência-bem-definido)
    - [2. Raiz de Agregado como Ponto de Entrada Único](#2-raiz-de-agregado-como-ponto-de-entrada-único)
    - [3. Invariantes de Negócio Protegidos](#3-invariantes-de-negócio-protegidos)
    - [4. Transações Atômicas](#4-transações-atômicas)
  - [Agregados vs Outras Estruturas](#agregados-vs-outras-estruturas)
  - [Regras Práticas para Design de Agregados](#regras-práticas-para-design-de-agregados)
  - [Exemplo Adicional: Agregado de Serviço de Manutenção](#exemplo-adicional-agregado-de-serviço-de-manutenção)
  - [Resumo: Os Benefícios dos Agregados](#resumo-os-benefícios-dos-agregados)

---

## Introdução: O Problema da Complexidade

Quando construímos aplicações de software complexas, frequentemente nos deparamos com entidades que se relacionam de formas intrincadas. Sem uma estrutura clara, essas relações podem se tornar caóticas, levando a código difícil de manter, inconsistências de dados e comportamentos inesperados. Os Agregados são uma solução fundamental para esse problema.

Um Agregado é um padrão arquitetural do DDD que agrupa entidades e objetos de valor em torno de uma raiz comum, criando um limite claro de responsabilidade e consistência. Pense nele como um "pacote coerente" de objetos que precisam estar sempre em um estado válido e consistente.

## Entendendo o Conceito Base

Antes de nos aprofundarmos, é importante compreender que um Agregado não é apenas uma coleção aleatória de objetos. Ele é uma estrutura com propósito definido, onde:

- Existe uma **raiz de agregado** (Aggregate Root) que é o ponto de entrada único para interações externas
- Os objetos dentro do agregado formam um **limite de consistência** bem definido
- Todos os objetos dentro dele devem estar em um estado **válido e consistente** o tempo todo
- As mudanças de estado ocorrem **atomicamente** como uma unidade

Esse conceito é crucial porque garante que os invariantes de negócio (as regras que sempre devem ser verdadeiras) sejam mantidos.

## Visualizando a Estrutura de um Agregado

```plaintext
┌─────────────────────────────────────────────────┐
│           AGREGADO - Veículo                    │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │  Raiz do Agregado: Veículo               │   │
│  │  - ID (identificador único)              │   │
│  │  - Placa                                 │   │
│  │  - Status                                │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │  Objetos de Valor: Motor                 │   │
│  │  - Cilindrada                            │   │
│  │  - Combustível                           │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │  Entidades Filhas: Pneus                 │   │
│  │  - Pneu Dianteiro Esquerdo               │   │
│  │  - Pneu Dianteiro Direito                │   │
│  │  - Pneu Traseiro Esquerdo                │   │
│  │  - Pneu Traseiro Direito                 │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
      (Limite de Consistência do Agregado)
```

## Analogia do Mundo Real

Imagine um veículo como um agregado. O carro em si é a raiz do agregado. Os pneus, o motor, a bateria e outros componentes são objetos dentro desse agregado. O importante é que você nunca interage diretamente com um pneu isolado - você interage com o carro, e o carro gerencia seus componentes internos. Se você quer trocar um pneu, você pede ao carro (à raiz do agregado) para fazer isso, não vai diretamente ao pneu.

Essa abordagem garante que o carro sempre permaneça em um estado válido. Por exemplo, o carro nunca deve estar em uma situação onde tem apenas três pneus e está circulando normalmente.

## Implementação em TypeScript: Sistema de Manutenção de Veículos

Vamos construir um exemplo prático de um sistema de manutenção de veículos usando o padrão de Agregado. Começamos com as classes básicas que representam nossos objetos de valor e entidades.

### Objetos de Valor: Componentes Imutáveis

```typescript
// Objeto de Valor: Representa uma medida de desgaste
class NivelDesgaste {
  private readonly percentual: number;

  constructor(percentual: number) {
    if (percentual < 0 || percentual > 100) {
      throw new Error('Nível de desgaste deve estar entre 0 e 100');
    }
    this.percentual = percentual;
  }

  // Objetos de valor são imutáveis, então criamos novos ao modificar
  aumentar(quantidade: number): NivelDesgaste {
    return new NivelDesgaste(this.percentual + quantidade);
  }

  obterPercentual(): number {
    return this.percentual;
  }

  estaGasto(): boolean {
    return this.percentual >= 80;
  }
}

// Objeto de Valor: Identificador único para um pneu
class IdPneu {
  constructor(private readonly valor: string) {
    if (!valor) {
      throw new Error('ID do pneu não pode ser vazio');
    }
  }

  igualA(outro: IdPneu): boolean {
    return this.valor === outro.valor;
  }

  toString(): string {
    return this.valor;
  }
}

// Objeto de Valor: Posição do veículo (onde o pneu está)
class PosicaoPneu {
  private readonly posicao: string;

  constructor(posicao: string) {
    const posicoes = ['dianteiro-esquerdo', 'dianteiro-direito', 
                       'traseiro-esquerdo', 'traseiro-direito'];
    if (!posicoes.includes(posicao)) {
      throw new Error(`Posição inválida: ${posicao}`);
    }
    this.posicao = posicao;
  }

  obter(): string {
    return this.posicao;
  }
}
```

### Entidades do Agregado

```typescript
// Entidade dentro do agregado: Representa um pneu específico
class Pneu {
  constructor(
    private readonly id: IdPneu,
    private readonly posicao: PosicaoPneu,
    private desgaste: NivelDesgaste
  ) {}

  obterID(): IdPneu {
    return this.id;
  }

  obterPosicao(): PosicaoPneu {
    return this.posicao;
  }

  obterDesgaste(): NivelDesgaste {
    return this.desgaste;
  }

  // Método que simula o desgaste ao rodar
  simularDesgaste(quilometros: number): void {
    const desgasteAproximado = (quilometros / 50000) * 10;
    this.desgaste = this.desgaste.aumentar(desgasteAproximado);
  }

  precisaTroca(): boolean {
    return this.desgaste.estaGasto();
  }
}
```

### A Raiz do Agregado: Veículo

A raiz do agregado é o ponto central de controle. Todos os acessos aos componentes internos passam por ela, garantindo que os invariantes de negócio sejam preservados.

```typescript
// Raiz do Agregado: Controla todos os pneus e garante consistência
class Veiculo {
  private pneus: Map<string, Pneu>;
  private quilometrosAtuais: number;
  private status: 'operacional' | 'manutencao' | 'inativo';

  constructor(
    private readonly id: string,
    private readonly placa: string
  ) {
    this.pneus = new Map();
    this.quilometrosAtuais = 0;
    this.status = 'operacional';
    
    // Inicializa com 4 pneus novo veículo
    this.inicializarPneus();
  }

  // Método privado: Inicializa o veículo com pneus novos
  private inicializarPneus(): void {
    const posicoes = [
      'dianteiro-esquerdo',
      'dianteiro-direito',
      'traseiro-esquerdo',
      'traseiro-direito'
    ];

    posicoes.forEach((pos, indice) => {
      const pneu = new Pneu(
        new IdPneu(`pneu-${this.id}-${indice}`),
        new PosicaoPneu(pos),
        new NivelDesgaste(0)
      );
      this.pneus.set(pos, pneu);
    });
  }

  // Invariante de Negócio: Sempre deve ter 4 pneus
  private garantirInvariante(): void {
    if (this.pneus.size !== 4) {
      throw new Error('Invariante violado: Um veículo deve ter exatamente 4 pneus');
    }
  }

  // Método público: Rodar o veículo
  rodar(quilometros: number): void {
    if (this.status !== 'operacional') {
      throw new Error(`Veículo em ${this.status} não pode rodar`);
    }

    // Verifica se tem algum pneu que precisa de troca
    const pneuGasto = Array.from(this.pneus.values()).find(p => p.precisaTroca());
    if (pneuGasto) {
      throw new Error(
        `Não é possível rodar. Pneu em ${pneuGasto.obterPosicao().obter()} precisa de troca`
      );
    }

    // Simula o desgaste em todos os pneus
    this.pneus.forEach(pneu => {
      pneu.simularDesgaste(quilometros);
    });

    this.quilometrosAtuais += quilometros;
  }

  // Método público: Trocar um pneu
  trocarPneu(posicao: string): void {
    const pneuPosition = new PosicaoPneu(posicao).obter();
    
    if (!this.pneus.has(pneuPosition)) {
      throw new Error(`Pneu na posição ${pneuPosition} não encontrado`);
    }

    const pneuAntigo = this.pneus.get(pneuPosition);
    
    // Cria um novo pneu para substituir o gasto
    const novoPneu = new Pneu(
      new IdPneu(`pneu-${this.id}-${Date.now()}`),
      new PosicaoPneu(pneuPosition),
      new NivelDesgaste(0)
    );

    this.pneus.set(pneuPosition, novoPneu);
    this.garantirInvariante();

    console.log(`Pneu em ${pneuPosition} trocado com sucesso`);
  }

  // Método público: Colocar em manutenção
  colocarEmManutencao(): void {
    if (this.status === 'manutencao') {
      throw new Error('Veículo já está em manutenção');
    }
    this.status = 'manutencao';
  }

  // Método público: Retirar da manutenção
  retornarDaManutencao(): void {
    if (this.status !== 'manutencao') {
      throw new Error('Veículo não está em manutenção');
    }
    this.status = 'operacional';
  }

  // Método de Consulta: Obter informações gerais
  obterInforacoes() {
    const statusPneus = Array.from(this.pneus.values()).map(pneu => ({
      posicao: pneu.obterPosicao().obter(),
      desgastePercentual: pneu.obterDesgaste().obterPercentual(),
      precisaTroca: pneu.precisaTroca()
    }));

    return {
      id: this.id,
      placa: this.placa,
      quilometrosAtuais: this.quilometrosAtuais,
      status: this.status,
      pneus: statusPneus
    };
  }

  // Método de Consulta: Obter um pneu específico (LEITURA apenas)
  obterPneuPara(posicao: string): Pneu | undefined {
    return this.pneus.get(new PosicaoPneu(posicao).obter());
  }
}
```

## Exemplo de Uso: Vendo o Agregado em Ação

```typescript
// Criamos um novo veículo (agregado)
const veiculo = new Veiculo('vei-001', 'ABC-1234');

console.log('Estado inicial:');
console.log(veiculo.obterInforacoes());

// O veículo roda 40 mil quilômetros
veiculo.rodar(40000);
console.log('\nApós rodar 40 mil km:');
console.log(veiculo.obterInforacoes());

// O veículo tenta rodar mais 15 mil km
// Neste ponto, algum pneu atingirá o nível crítico
veiculo.rodar(15000);
console.log('\nApós rodar 55 mil km no total:');
console.log(veiculo.obterInforacoes());

// Agora o veículo está com pneu gasto
try {
  veiculo.rodar(10000);
} catch (erro) {
  console.log('\nErro ao tentar rodar:', erro.message);
}

// Precisamos fazer manutenção
veiculo.colocarEmManutencao();
veiculo.trocarPneu('dianteiro-esquerdo');
veiculo.trocarPneu('dianteiro-direito');
veiculo.retornarDaManutencao();

console.log('\nApós manutenção:');
console.log(veiculo.obterInforacoes());

// Agora o veículo pode rodar novamente
veiculo.rodar(10000);
console.log('\nApós mais 10 mil km:');
console.log(veiculo.obterInforacoes());
```

## Principais Características dos Agregados

### 1. Limite de Consistência Bem Definido

O agregado estabelece claramente quais objetos pertencem a sua esfera de controle. No exemplo do veículo, tudo que acontece com os pneus passa pela raiz (Veículo). Isso garante que nenhum pneu seja deixado em um estado inválido.

### 2. Raiz de Agregado como Ponto de Entrada Único

A classe `Veiculo` é a raiz do agregado. Ninguém cria, modifica ou acessa os pneus diretamente. Tudo passa pela raiz. Essa restrição é fundamental para manter a integridade do agregado.

### 3. Invariantes de Negócio Protegidos

Os invariantes são regras que devem sempre ser verdadeiras. No nosso caso, "um veículo sempre deve ter exatamente 4 pneus" é um invariante. O método `garantirInvariante()` verifica isso. O agregado é responsável por nunca violá-los.

### 4. Transações Atômicas

Quando você executa uma operação no agregado, ela acontece completamente ou não acontece. Você não pode ficar em um estado intermediário inválido. Por exemplo, ao trocar um pneu, o novo pneu é colocado antes de remover o antigo, garantindo que sempre haja exatamente 4 pneus.

## Agregados vs Outras Estruturas

```plaintext
┌─────────────────────────────────────────────────────┐
│  COMPARAÇÃO DE ABORDAGENS                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SEM AGREGADO (Caótico):                            │
│  - Pneu pode ser modificado de qualquer lugar       │
│  - Veículo pode ter 0, 2 ou 5 pneus                 │
│  - Nenhuma garantia de consistência                 │
│  - Difícil rastrear onde as mudanças ocorrem        │
│                                                     │
│  COM AGREGADO (Controlado):                         │
│  - Pneu só pode ser modificado via Veículo          │
│  - Veículo sempre tem exatamente 4 pneus            │
│  - Consistência garantida                           │
│  - Tudo centralizado em um único ponto              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Regras Práticas para Design de Agregados

Ao desenhar seus agregados, considere estas orientações:

**Mantenha Agregados Pequenos**: Um agregado coeso não precisa incluir tudo. Se você está tentando colocar muitos objetos em um agregado, provavelmente deveria dividi-lo. Agregados menores são mais fáceis de entender e modificar.

**Proteja Invariantes Críticos**: Identifique as regras de negócio que DEVEM ser sempre verdadeiras. Se uma regra é essencial, ela deve estar dentro do agregado. Se é flexível, talvez deva estar fora.

**Use Apenas IDs para Referenciar Outros Agregados**: Quando um agregado precisa fazer referência a outro, nunca referencie objetos completos. Use apenas identificadores. Por exemplo, se um `ServicoDeManutencao` precisa referenciar um `Veiculo`, ele deveria manter apenas o ID do veículo, não uma referência ao objeto inteiro.

**Operações Devem Ser Completas Dentro da Raiz**: Todos os comportamentos que modificam o estado devem passar pela raiz. Não permita que objetos internos se modifiquem diretamente.

## Exemplo Adicional: Agregado de Serviço de Manutenção

Para consolidar o conceito, vamos criar um segundo agregado que interage com o primeiro apenas através de IDs:

```typescript
// Objeto de Valor: Tipo de serviço
class TipoServico {
  constructor(private readonly tipo: string) {
    const tipos = ['troca-pneu', 'revisao', 'alinhamento', 'balanceamento'];
    if (!tipos.includes(tipo)) {
      throw new Error(`Tipo de serviço inválido: ${tipo}`);
    }
  }

  obter(): string {
    return this.tipo;
  }
}

// Entidade dentro do agregado: Item do serviço
class ItemServico {
  constructor(
    private readonly tipo: TipoServico,
    private readonly dataConclusao: Date | null = null
  ) {}

  obterTipo(): TipoServico {
    return this.tipo;
  }

  estaCompleto(): boolean {
    return this.dataConclusao !== null;
  }

  marcarComoCompleto(): ItemServico {
    return new ItemServico(this.tipo, new Date());
  }
}

// Raiz do Agregado: Ordem de Manutenção
class OrdemManutencao {
  private itens: ItemServico[] = [];
  private status: 'pendente' | 'em-progresso' | 'concluida' = 'pendente';

  constructor(
    private readonly id: string,
    // Note: Apenas o ID do veículo, não a referência completa
    private readonly idVeiculo: string,
    private readonly dataCriacao: Date
  ) {}

  obterIdVeiculo(): string {
    return this.idVeiculo;
  }

  adicionarItem(tipo: TipoServico): void {
    this.itens.push(new ItemServico(tipo));
  }

  iniciar(): void {
    if (this.status !== 'pendente') {
      throw new Error('Ordem deve estar pendente para ser iniciada');
    }
    this.status = 'em-progresso';
  }

  completarItem(indice: number): void {
    if (this.status !== 'em-progresso') {
      throw new Error('Ordem deve estar em progresso');
    }
    const item = this.itens[indice];
    if (item) {
      this.itens[indice] = item.marcarComoCompleto();
    }
  }

  concluir(): void {
    const todosConcluidos = this.itens.every(i => i.estaCompleto());
    if (!todosConcluidos) {
      throw new Error('Todos os itens devem estar completos');
    }
    this.status = 'concluida';
  }

  obterInforacoes() {
    return {
      id: this.id,
      idVeiculo: this.idVeiculo,
      status: this.status,
      dataCriacao: this.dataCriacao,
      itens: this.itens.map(i => ({
        tipo: i.obterTipo().obter(),
        completo: i.estaCompleto()
      }))
    };
  }
}
```

## Resumo: Os Benefícios dos Agregados

O padrão de Agregado oferece diversos benefícios quando bem aplicado. Primeiro, ele garante que seus dados estejam sempre em um estado válido e consistente, pois as regras de negócio são codificadas dentro do agregado. Segundo, torna o código muito mais fácil de entender, pois as responsabilidades e limites ficam claros. Terceiro, facilita a manutenção porque mudanças em um agregado não afetam inadvertidamente outros. Quarto, permite que você raciocine sobre seu domínio em termos de conceitos de negócio (veículos, ordens de manutenção) em vez de apenas detalhes técnicos (tabelas de banco de dados). Por fim, torna mais fácil aplicar padrões como Event Sourcing ou CQRS, pois você tem limites claros sobre o que deve mudar junto.

Agregados são um dos pilares do Domain-Driven Design porque resolvem um problema fundamental: como agrupar dados e comportamentos de forma coerente, mantendo a integridade do sistema enquanto ele cresce em complexidade.
