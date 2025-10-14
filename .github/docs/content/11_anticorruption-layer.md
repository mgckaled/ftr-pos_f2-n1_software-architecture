# Camada Anticorrupção - Anticorruption Layer (ACL)

> [Voltar](../../../README.md)

## Índice

- [Camada Anticorrupção - Anticorruption Layer (ACL)](#camada-anticorrupção---anticorruption-layer-acl)
  - [Índice](#índice)
  - [Introdução Conceitual](#introdução-conceitual)
  - [Por que o Anticorruption Layer é Importante?](#por-que-o-anticorruption-layer-é-importante)
  - [Arquitetura Conceitual](#arquitetura-conceitual)
  - [Componentes do Anticorruption Layer](#componentes-do-anticorruption-layer)
    - [1. Adapter (Adaptador)](#1-adapter-adaptador)
    - [2. Translator (Tradutor)](#2-translator-tradutor)
    - [3. Mapper (Mapeador)](#3-mapper-mapeador)
  - [Exemplo Prático: Sistema de Supermercado](#exemplo-prático-sistema-de-supermercado)
    - [Definindo o Domínio](#definindo-o-domínio)
    - [O Sistema Externo (Fornecedor)](#o-sistema-externo-fornecedor)
    - [Construindo o Anticorruption Layer](#construindo-o-anticorruption-layer)
  - [Fluxo de Dados no Anticorruption Layer](#fluxo-de-dados-no-anticorruption-layer)
  - [Utilizando o Anticorruption Layer em seu Aplicativo](#utilizando-o-anticorruption-layer-em-seu-aplicativo)
  - [Benefícios do Anticorruption Layer](#benefícios-do-anticorruption-layer)
  - [Estrutura de Diretórios Recomendada](#estrutura-de-diretórios-recomendada)
  - [Comparação: Com vs Sem Anticorruption Layer](#comparação-com-vs-sem-anticorruption-layer)
  - [Padrões Avançados](#padrões-avançados)
    - [Utilizando Strategy para Múltiplos Fornecedores](#utilizando-strategy-para-múltiplos-fornecedores)
    - [Tratamento de Erros e Fallback](#tratamento-de-erros-e-fallback)
  - [Cache e Otimização](#cache-e-otimização)
  - [Monitoramento e Observabilidade](#monitoramento-e-observabilidade)
  - [Testes do Anticorruption Layer](#testes-do-anticorruption-layer)
  - [Padrões Relacionados e Complementares](#padrões-relacionados-e-complementares)
  - [Conclusão](#conclusão)

---

## Introdução Conceitual

O Anticorruption Layer (ACL), ou Camada Anticorrupção, é um padrão arquitetural que protege seu domínio de negócio da "contaminação" causada por sistemas legados, APIs externas ou integrações inadequadas. Imagine que você construiu uma arquitetura bem estruturada segundo os princípios de Domain-Driven Design (DDD), com seus Agregados bem definidos e sua Linguagem Ubíqua clara. De repente, precisa integrar-se com um sistema de pagamento externo que usa convenções completamente diferentes, ou com um banco de dados legado que persiste dados em formatos incompatíveis com sua modelagem. O Anticorruption Layer é o guardião que impede essa "sujeira" de entrar em seu domínio puro.

## Por que o Anticorruption Layer é Importante?

Antes de mergulharmos nos detalhes técnicos, é essencial compreender o problema que este padrão resolve. Quando você tenta integrar seu domínio bem estruturado diretamente com sistemas externos, você enfrenta um conflito fundamental: seu código de negócio passa a depender de abstrações que não refletem seu modelo de domínio. Isso leva a um acoplamento nocivo, tornando seu sistema frágil e difícil de manter.

Considere um exemplo: seu sistema de supermercado tem um conceito claro chamado "Produto" que compreende o preço em unidades monetárias apropriadas, categorias de domínio, e informações de estoque gerenciadas segundo suas regras de negócio. Ao mesmo tempo, você precisa consumir dados de um fornecedor externo que envia informações em um formato XML legado, com campos nomeados de forma enigmática e conversões de unidades estranhas. Sem o Anticorruption Layer, você seria forçado a trabalhar com esse XML malformado dentro de suas Entidades e Value Objects, corrompendo a pureza do seu domínio.

## Arquitetura Conceitual

```plaintext
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA EXTERNO                          │
│         (API legada, Base de dados, Serviço terceiro)       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ (Protocolo/Formato Externo)
                       ▼
┌──────────────────────────────────────────────────────────────┐
│           ANTICORRUPTION LAYER                               │
│  ┌──────────────┐     ┌──────────────┐    ┌─────────────┐    │
│  │   Adapter    │────▶│   Translator │───▶│  Mapper     │    │
│  │   (Externo)  │     │  (Conversão) │    │  (Domínio)  │    │
│  └──────────────┘     └──────────────┘    └─────────────┘    │
│                                                  │           │
│         "Limpeza" e Normalização               │             │
└──────────────────────────────────────────────────┼───────────┘
                                                  │
                                                  ▼
┌──────────────────────────────────────────────────────────────┐
│              DOMÍNIO PURO (DDD)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Entidades  │  │ Value Objects│  │   Agregados  │        │
│  │   (Produto)  │  │   (Moeda)    │  │ (Carrinho)   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                              │
│         Linguagem Ubíqua - Regras de Negócio Puras           │
└──────────────────────────────────────────────────────────────┘
```

## Componentes do Anticorruption Layer

O Anticorruption Layer é composto por três responsabilidades principais que trabalham em conjunto para "descontaminar" os dados externos.

### 1. Adapter (Adaptador)

O Adapter é responsável por se comunicar com o sistema externo usando seu protocolo, formato e convenções nativas. Ele não tenta traduzir nada ainda, apenas faz a chamada ao sistema externo e coleta os dados brutos.

### 2. Translator (Tradutor)

O Translator recebe os dados brutos do sistema externo e os "traduz" para conceitos que fazem sentido dentro de seu domínio. Aqui é onde ocorre a lógica de transformação, validação e normalização dos dados.

### 3. Mapper (Mapeador)

O Mapper é responsável por converter os dados já traduzidos em instâncias de suas Entidades, Value Objects e Agregados de domínio. Ele garante que os dados resultantes respeitam as invariantes e regras de negócio definidas em seu modelo.

## Exemplo Prático: Sistema de Supermercado

Vamos construir um cenário realista onde seu sistema de supermercado precisa integrar-se com um fornecedor externo de produtos. O fornecedor disponibiliza uma API legada que retorna dados em um formato incompatível com sua modelagem.

### Definindo o Domínio

Primeiro, vamos definir como o domínio do supermercado representa um Produto:

```typescript
// domain/value-objects/Moeda.ts
export class Moeda {
  private constructor(private readonly valor: number) {
    if (valor < 0) {
      throw new Error('Moeda não pode ser negativa');
    }
  }

  static criar(valor: number): Moeda {
    return new Moeda(valor);
  }

  obterValor(): number {
    return this.valor;
  }

  // Método para comparação entre moedas
  somar(outra: Moeda): Moeda {
    return Moeda.criar(this.valor + outra.obterValor());
  }

  igual(outra: Moeda): boolean {
    return this.valor === outra.obterValor();
  }
}

// domain/value-objects/Estoque.ts
export class Estoque {
  private constructor(private readonly quantidade: number) {
    if (quantidade < 0 || !Number.isInteger(quantidade)) {
      throw new Error('Estoque deve ser um número inteiro não negativo');
    }
  }

  static criar(quantidade: number): Estoque {
    return new Estoque(quantidade);
  }

  obterQuantidade(): number {
    return this.quantidade;
  }

  reduzir(quantidade: number): Estoque {
    const novaQuantidade = this.quantidade - quantidade;
    if (novaQuantidade < 0) {
      throw new Error('Estoque não pode ficar negativo');
    }
    return Estoque.criar(novaQuantidade);
  }

  aumentar(quantidade: number): Estoque {
    return Estoque.criar(this.quantidade + quantidade);
  }
}

// domain/value-objects/CodigoProduto.ts
export class CodigoProduto {
  private constructor(private readonly codigo: string) {
    if (!codigo || codigo.trim().length === 0) {
      throw new Error('Código do produto não pode estar vazio');
    }
  }

  static criar(codigo: string): CodigoProduto {
    return new CodigoProduto(codigo.trim());
  }

  obterCodigo(): string {
    return this.codigo;
  }

  igual(outro: CodigoProduto): boolean {
    return this.codigo === outro.obterCodigo();
  }
}

// domain/entities/Produto.ts
export class Produto {
  private constructor(
    private readonly id: string,
    private readonly codigo: CodigoProduto,
    private readonly nome: string,
    private readonly descricao: string,
    private readonly preco: Moeda,
    private estoque: Estoque,
    private readonly categoria: string
  ) {
    // Invariantes do domínio
    if (!nome || nome.trim().length === 0) {
      throw new Error('Produto deve ter um nome');
    }
    if (!categoria || categoria.trim().length === 0) {
      throw new Error('Produto deve ter uma categoria');
    }
  }

  static criar(
    id: string,
    codigo: CodigoProduto,
    nome: string,
    descricao: string,
    preco: Moeda,
    estoque: Estoque,
    categoria: string
  ): Produto {
    return new Produto(id, codigo, nome, descricao, preco, estoque, categoria);
  }

  obterCodigo(): CodigoProduto {
    return this.codigo;
  }

  obterNome(): string {
    return this.nome;
  }

  obterDescricao(): string {
    return this.descricao;
  }

  obterPreco(): Moeda {
    return this.preco;
  }

  obterEstoque(): Estoque {
    return this.estoque;
  }

  obterCategoria(): string {
    return this.categoria;
  }

  // Operação de domínio: reduzir estoque
  reduzirEstoque(quantidade: number): void {
    this.estoque = this.estoque.reduzir(quantidade);
  }

  // Operação de domínio: aumentar estoque
  aumentarEstoque(quantidade: number): void {
    this.estoque = this.estoque.aumentar(quantidade);
  }

  obterID(): string {
    return this.id;
  }
}
```

### O Sistema Externo (Fornecedor)

Agora, vamos simular o sistema externo que nosso supermercado precisa consumir. Observe como este sistema tem suas próprias convenções que não alinham com nosso domínio:

```typescript
// external/fornecedor-api-tipos.ts
// Este arquivo representa os tipos que vêm do sistema externo
// Note as convenções estranhas: nomes em camelCase inconsistentes,
// preços como strings, etc.

export interface ProdutoExternoDTO {
  productId: string;
  sku: string;
  productName: string;
  description: string | null;
  price: string; // Preço como string!
  priceInCents: number; // Preço duplicado em centavos
  quantity: string; // Quantidade como string!
  dept: string; // Departamento, não categoria
  supplierCode: string;
  lastUpdate: string; // ISO string de data
}

export interface RespostaProdutosExternoDTO {
  success: boolean;
  code: number;
  data: ProdutoExternoDTO[];
  timestamp: number;
}

// Simulação do client externo
export class FornecedorAPIClient {
  async buscarProdutos(): Promise<RespostaProdutosExternoDTO> {
    // Simula uma chamada HTTP ao fornecedor
    return {
      success: true,
      code: 200,
      data: [
        {
          productId: 'ext-001',
          sku: 'SKU-12345',
          productName: 'Arroz Integral 5kg',
          description: 'Arroz integral de alta qualidade',
          price: '25.50',
          priceInCents: 2550,
          quantity: '100',
          dept: 'alimentos',
          supplierCode: 'SUPP-A001',
          lastUpdate: new Date().toISOString()
        },
        {
          productId: 'ext-002',
          sku: 'SKU-67890',
          productName: null as any, // Campo ausente!
          description: null,
          price: '5.00',
          priceInCents: 500,
          quantity: '0', // Estoque zero
          dept: 'bebidas',
          supplierCode: 'SUPP-B002',
          lastUpdate: new Date().toISOString()
        }
      ],
      timestamp: Date.now()
    };
  }
}
```

### Construindo o Anticorruption Layer

Agora vem a parte crucial: o Anticorruption Layer que protege nosso domínio dessa "sujeira" externa.

```typescript
// anticorruption/adapter/FornecedorAdapter.ts
// O Adapter é responsável apenas por se comunicar com o sistema externo
import { FornecedorAPIClient, RespostaProdutosExternoDTO } from '../../external/fornecedor-api-tipos';

export class FornecedorAdapter {
  private readonly apiClient: FornecedorAPIClient;

  constructor() {
    this.apiClient = new FornecedorAPIClient();
  }

  // Responsabilidade única: comunicar com o sistema externo e retornar dados brutos
  async buscarProdutosDoFornecedor(): Promise<RespostaProdutosExternoDTO> {
    const resposta = await this.apiClient.buscarProdutos();
    
    // Validação básica da resposta
    if (!resposta.success) {
      throw new Error(`Erro ao buscar produtos do fornecedor: código ${resposta.code}`);
    }

    return resposta;
  }
}

// anticorruption/translator/ProdutoExternoTranslator.ts
// O Translator converte dados brutos em objetos que fazem sentido em nosso contexto
import { ProdutoExternoDTO } from '../../external/fornecedor-api-tipos';

export interface ProdutoTraduzido {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  precoEmReais: number;
  quantidade: number;
  categoria: string;
}

export class ProdutoExternoTranslator {
  traduzir(produtoExterno: ProdutoExternoDTO): ProdutoTraduzido {
    // Aqui convertemos os dados estranhos do sistema externo
    // em dados que fazem sentido para nosso negócio

    // Validação: O produto deve ter um nome
    const nome = produtoExterno.productName?.trim();
    if (!nome) {
      throw new Error(
        `Produto externo ${produtoExterno.productId} não possui nome válido`
      );
    }

    // Conversão de preço: pode vir como string ou centavos
    const precoEmReais = this.converterPreco(
      produtoExterno.price,
      produtoExterno.priceInCents
    );

    // Conversão de quantidade: vem como string, precisa ser número
    const quantidade = this.converterQuantidade(produtoExterno.quantity);

    // Mapeamento de departamento externo para nossa categoria
    const categoria = this.mapeiarDepartamentoParaCategoria(produtoExterno.dept);

    return {
      id: produtoExterno.productId,
      codigo: produtoExterno.sku,
      nome: nome,
      descricao: produtoExterno.description || 'Sem descrição disponível',
      precoEmReais: precoEmReais,
      quantidade: quantidade,
      categoria: categoria
    };
  }

  private converterPreco(precoString: string, precoEmCentavos: number): number {
    // Lógica robusta de conversão que lida com múltiplos formatos
    try {
      // Se temos centavos explícitos, usamos
      if (precoEmCentavos > 0) {
        return Math.round(precoEmCentavos) / 100;
      }

      // Caso contrário, tentamos converter a string
      const preco = parseFloat(precoString.replace(',', '.'));
      if (isNaN(preco) || preco < 0) {
        throw new Error(`Preço inválido: ${precoString}`);
      }
      return preco;
    } catch (erro) {
      throw new Error(`Falha ao converter preço ${precoString}: ${erro}`);
    }
  }

  private converterQuantidade(quantidadeString: string): number {
    const quantidade = parseInt(quantidadeString, 10);
    if (isNaN(quantidade) || quantidade < 0) {
      throw new Error(`Quantidade inválida: ${quantidadeString}`);
    }
    return quantidade;
  }

  private mapeiarDepartamentoParaCategoria(departamento: string): string {
    // Mapeia os departamentos externos para nossas categorias de domínio
    const mapeamento: { [key: string]: string } = {
      'alimentos': 'Alimentos',
      'bebidas': 'Bebidas',
      'higiene': 'Higiene Pessoal',
      'limpeza': 'Produtos de Limpeza',
      'default': 'Outros'
    };

    return mapeamento[departamento.toLowerCase()] || mapeamento['default'];
  }
}

// anticorruption/mapper/ProdutoMapper.ts
// O Mapper transforma dados traduzidos em instâncias de Entidades de domínio
import { Produto } from '../../domain/entities/Produto';
import { CodigoProduto } from '../../domain/value-objects/CodigoProduto';
import { Moeda } from '../../domain/value-objects/Moeda';
import { Estoque } from '../../domain/value-objects/Estoque';
import { ProdutoTraduzido } from './ProdutoExternoTranslator';
import { v4 as uuidv4 } from 'uuid';

export class ProdutoMapper {
  mapearParaEntidade(produtoTraduzido: ProdutoTraduzido): Produto {
    // Criamos os Value Objects com validação
    const codigoProduto = CodigoProduto.criar(produtoTraduzido.codigo);
    const preco = Moeda.criar(produtoTraduzido.precoEmReais);
    const estoque = Estoque.criar(produtoTraduzido.quantidade);

    // Geramos um ID único para nosso domínio (não usamos o ID externo)
    const idDominio = uuidv4();

    // Criamos a Entidade com todas as validações de domínio
    const produto = Produto.criar(
      idDominio,
      codigoProduto,
      produtoTraduzido.nome,
      produtoTraduzido.descricao,
      preco,
      estoque,
      produtoTraduzido.categoria
    );

    return produto;
  }
}

// anticorruption/ProdutoAnticorruptionLayer.ts
// Orquestra todo o processo do Anticorruption Layer
import { FornecedorAdapter } from './adapter/FornecedorAdapter';
import { ProdutoExternoTranslator } from './translator/ProdutoExternoTranslator';
import { ProdutoMapper } from './mapper/ProdutoMapper';
import { Produto } from '../domain/entities/Produto';

export class ProdutoAnticorruptionLayer {
  private readonly adapter: FornecedorAdapter;
  private readonly translator: ProdutoExternoTranslator;
  private readonly mapper: ProdutoMapper;

  constructor() {
    this.adapter = new FornecedorAdapter();
    this.translator = new ProdutoExternoTranslator();
    this.mapper = new ProdutoMapper();
  }

  async importarProdutosDoFornecedor(): Promise<Produto[]> {
    // Etapa 1: Adapter busca dados brutos do sistema externo
    const resposta = await this.adapter.buscarProdutosDoFornecedor();

    // Etapa 2: Translator converte para formato intermediário
    const produtosTraduzidos = resposta.data
      .map(produtoExterno => {
        try {
          return this.translator.traduzir(produtoExterno);
        } catch (erro) {
          // Registrar erro mas continuar com próximos produtos
          console.error(`Erro ao traduzir produto: ${erro}`);
          return null;
        }
      })
      .filter((p): p is ProdutoTraduzido => p !== null);

    // Etapa 3: Mapper cria Entidades de domínio puro
    const produtosDominio = produtosTraduzidos.map(traduzido =>
      this.mapper.mapearParaEntidade(traduzido)
    );

    return produtosDominio;
  }
}
```

## Fluxo de Dados no Anticorruption Layer

```plaintext
SISTEMA EXTERNO
    │
    │ (ProdutoExternoDTO)
    │ { productId, sku, productName, price: "25.50", quantity: "100", ... }
    ▼
┌─────────────────────────────────────────┐
│ FornecedorAdapter                       │
│ └─ Busca dados brutos do fornecedor     │
└─────────────────────────────────────────┘
    │
    │ (Resposta bruta)
    ▼
┌─────────────────────────────────────────┐
│ ProdutoExternoTranslator                │
│ └─ Converte:                            │
│    • "25.50" → 25.50 (número)           │
│    • "100" → 100 (quantidade)           │
│    • "alimentos" → "Alimentos"          │
│    • Valida dados                       │
└─────────────────────────────────────────┘
    │
    │ (ProdutoTraduzido - ainda não é domínio)
    │ { id, codigo, nome, precoEmReais: 25.50, quantidade: 100, ... }
    ▼
┌─────────────────────────────────────────┐
│ ProdutoMapper                           │
│ └─ Cria instâncias de domínio:          │
│    • CodigoProduto.criar()              │
│    • Moeda.criar()                      │
│    • Estoque.criar()                    │
│    • Produto.criar()                    │
└─────────────────────────────────────────┘
    │
    │ (Entidade de Domínio Pura)
    ▼
DOMÍNIO DDD
  Produto {
    id: string,
    codigo: CodigoProduto,
    nome: string,
    descricao: string,
    preco: Moeda,
    estoque: Estoque,
    categoria: string
  }
```

## Utilizando o Anticorruption Layer em seu Aplicativo

```typescript
// application/services/ImportarProdutosService.ts
import { ProdutoAnticorruptionLayer } from '../../anticorruption/ProdutoAnticorruptionLayer';
import { ProdutoRepository } from '../../infrastructure/persistence/ProdutoRepository';

export class ImportarProdutosService {
  constructor(
    private readonly anticorruptionLayer: ProdutoAnticorruptionLayer,
    private readonly produtoRepository: ProdutoRepository
  ) {}

  async executar(): Promise<void> {
    try {
      // O Anticorruption Layer garante que recebemos Entidades puras de domínio
      const produtosImportados = 
        await this.anticorruptionLayer.importarProdutosDoFornecedor();

      // Agora trabalhamos apenas com conceitos de domínio
      for (const produto of produtosImportados) {
        // Aqui estamos no domínio puro, sem "contaminação" externa
        console.log(`Salvando produto: ${produto.obterNome()}`);
        console.log(`Preço: R$ ${produto.obterPreco().obterValor()}`);
        console.log(`Estoque: ${produto.obterEstoque().obterQuantidade()} unidades`);
        console.log(`Categoria: ${produto.obterCategoria()}`);

        // Salvamos no repositório usando conceitos de domínio
        await this.produtoRepository.salvar(produto);
      }

      console.log(`${produtosImportados.length} produtos importados com sucesso`);
    } catch (erro) {
      console.error(`Erro ao importar produtos: ${erro}`);
      throw erro;
    }
  }
}

// main.ts - Exemplo de uso
async function executarImportacao() {
  const anticorruptionLayer = new ProdutoAnticorruptionLayer();
  const produtoRepository = new ProdutoRepository();

  const servico = new ImportarProdutosService(
    anticorruptionLayer,
    produtoRepository
  );

  await servico.executar();
}

executarImportacao().catch(console.error);
```

## Benefícios do Anticorruption Layer

Ao implementar o Anticorruption Layer, você obtém múltiplos benefícios arquiteturais que transcendem a simples integração:

O primeiro benefício é o isolamento do domínio. Seu código de negócio permanece puro, desacoplado das eccentricidades de sistemas externos. Se o fornecedor mudar seu formato de dados, você apenas atualiza o Anticorruption Layer, não todo o seu domínio.

O segundo é a testabilidade. Você pode testar o Adapter, Translator e Mapper independentemente. Seus testes de domínio não precisam se preocupar com chamadas HTTP ou transformações de dados estranhas.

O terceiro é a manutenibilidade. Quando você precisa mudar como integra-se com um sistema externo, você sabe exatamente onde fazer essa mudança. Não há efeitos colaterais surpresos em outras partes da aplicação.

O quarto é a flexibilidade. Se precisar integrar-se com um novo fornecedor ou trocar de fornecedor, você cria um novo Anticorruption Layer sem tocar em seu domínio ou aplicação.

## Estrutura de Diretórios Recomendada

```plaintext
projeto/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Produto.ts
│   │   ├── value-objects/
│   │   │   ├── Moeda.ts
│   │   │   ├── Estoque.ts
│   │   │   └── CodigoProduto.ts
│   │   └── repositories/
│   │       └── IProdutoRepository.ts
│   │
│   ├── application/
│   │   └── services/
│   │       └── ImportarProdutosService.ts
│   │
│   ├── anticorruption/
│   │   ├── adapter/
│   │   │   └── FornecedorAdapter.ts
│   │   ├── translator/
│   │   │   └── ProdutoExternoTranslator.ts
│   │   ├── mapper/
│   │   │   └── ProdutoMapper.ts
│   │   └── ProdutoAnticorruptionLayer.ts
│   │
│   ├── infrastructure/
│   │   └── persistence/
│   │       └── ProdutoRepository.ts
│   │
│   └── external/
│       └── fornecedor-api-tipos.ts
```

## Comparação: Com vs Sem Anticorruption Layer

Para solidificar sua compreensão, vamos comparar dois cenários:

CENÁRIO SEM ANTICORRUPTION LAYER (INCORRETO):

```typescript
// Seu domínio fica contaminado!
export class Produto {
  constructor(
    public productId: string,          // ID externo!
    public sku: string,                // Nomenclatura externa!
    public productName: string,        // Nomenclatura externa!
    public price: string,              // Tipo incorreto!
    public quantity: string,           // Tipo incorreto!
    public dept: string                // Conceito externo!
  ) {}

  calcularPreco() {
    // Preciso tratar string aqui!
    const valor = parseFloat(this.price.replace(',', '.'));
    // ... mais confusão
  }

  reduzirEstoque() {
    // Preciso converter string para número
    const qtd = parseInt(this.quantity);
    // ... mais confusão
  }
}

// Seu Service conhece detalhes externos
export class ImportarProdutosService {
  async executar() {
    const resposta = await fetch('http://fornecedor-api.com/produtos');
    const dados = await resposta.json();

    // Transformações espalhadas por toda a aplicação
    for (const item of dados) {
      const produto = new Produto(
        item.productId,
        item.sku,
        item.productName,
        item.price,
        item.quantity,
        item.dept
      );
      // ...
    }
  }
}
```

**CENÁRIO COM ANTICORRUPTION LAYER (CORRETO)**:

```typescript
// Seu domínio permanece puro
export class Produto {
  constructor(
    private readonly id: string,
    private readonly codigo: CodigoProduto,    // Conceito de domínio
    private readonly nome: string,
    private descricao: string,
    private readonly preco: Moeda,             // Conceito de domínio
    private estoque: Estoque,                  // Conceito de domínio
    private readonly categoria: string
  ) {}

  // Operações de domínio bem definidas
  reduzirEstoque(quantidade: number): void {
    this.estoque = this.estoque.reduzir(quantidade);
  }
}

// Seu Service não conhece detalhes externos
export class ImportarProdutosService {
  constructor(
    private readonly anticorruptionLayer: ProdutoAnticorruptionLayer,
    private readonly produtoRepository: ProdutoRepository
  ) {}

  async executar() {
    // Anticorruption Layer cuida de tudo
    const produtos = await this.anticorruptionLayer.importarProdutosDoFornecedor();

    // Aqui temos Entidades puras de domínio
    for (const produto of produtos) {
      await this.produtoRepository.salvar(produto);
    }
  }
}
```

## Padrões Avançados

### Utilizando Strategy para Múltiplos Fornecedores

Se seu supermercado precisar integrar-se com vários fornecedores diferentes, você pode usar o padrão Strategy dentro do seu Anticorruption Layer:

```typescript
// anticorruption/strategies/IFornecedorStrategy.ts
export interface IFornecedorStrategy {
  buscarProdutos(): Promise<Produto[]>;
}

// anticorruption/strategies/FornecedorAStrategy.ts
export class FornecedorAStrategy implements IFornecedorStrategy {
  async buscarProdutos(): Promise<Produto[]> {
    // Implementação específica para Fornecedor A
    const adapter = new FornecedorAAdapter();
    const translator = new FornecedorATranslator();
    const mapper = new ProdutoMapper();

    const dados = await adapter.buscarDados();
    const traduzidos = dados.map(d => translator.traduzir(d));
    return traduzidos.map(t => mapper.mapearParaEntidade(t));
  }
}

// anticorruption/strategies/FornecedorBStrategy.ts
export class FornecedorBStrategy implements IFornecedorStrategy {
  async buscarProdutos(): Promise<Produto[]> {
    // Implementação específica para Fornecedor B com formato diferente
    const adapter = new FornecedorBAdapter();
    const translator = new FornecedorBTranslator();
    const mapper = new ProdutoMapper();

    const dados = await adapter.buscarDados();
    const traduzidos = dados.map(d => translator.traduzir(d));
    return traduzidos.map(t => mapper.mapearParaEntidade(t));
  }
}

// anticorruption/FornecedorAnticorruptionLayerFactory.ts
export class FornecedorAnticorruptionLayerFactory {
  static criar(tipofornecedor: 'A' | 'B'): IFornecedorStrategy {
    switch (tipofornecedor) {
      case 'A':
        return new FornecedorAStrategy();
      case 'B':
        return new FornecedorBStrategy();
      default:
        throw new Error(`Fornecedor desconhecido: ${tipofornecedor}`);
    }
  }
}

// Uso:
const estrategiaFornecedorA = FornecedorAnticorruptionLayerFactory.criar('A');
const produtos = await estrategiaFornecedorA.buscarProdutos();
```

### Tratamento de Erros e Fallback

Um Anticorruption Layer robusto deve lidar elegantemente com erros do sistema externo:

```typescript
// anticorruption/exceptions/FornecedorException.ts
export class FornecedorException extends Error {
  constructor(
    public readonly codigoFornecedor: string,
    public readonly mensagemOriginal: string,
    public readonly tentativaReconexao: boolean = false
  ) {
    super(`Erro ao comunicar com fornecedor ${codigoFornecedor}: ${mensagemOriginal}`);
    this.name = 'FornecedorException';
  }
}

// anticorruption/adapter/FornecedorAdapterComRetry.ts
export class FornecedorAdapterComRetry {
  private readonly maxTentativas = 3;
  private readonly delayMsBaseado = 1000;

  async buscarProdutosComRetry(): Promise<RespostaProdutosExternoDTO> {
    let ultimoErro: Error | null = null;

    for (let tentativa = 1; tentativa <= this.maxTentativas; tentativa++) {
      try {
        const adapter = new FornecedorAdapter();
        return await adapter.buscarProdutosDoFornecedor();
      } catch (erro) {
        ultimoErro = erro as Error;

        if (tentativa < this.maxTentativas) {
          const delay = this.delayMsBaseado * Math.pow(2, tentativa - 1);
          console.warn(
            `Tentativa ${tentativa} falhou. Aguardando ${delay}ms antes de retry...`
          );
          await this.aguardar(delay);
        }
      }
    }

    throw new FornecedorException(
      'FORNECEDOR-01',
      `Falha após ${this.maxTentativas} tentativas: ${ultimoErro?.message}`,
      true
    );
  }

  private aguardar(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// anticorruption/ProdutoAnticorruptionLayerComTratamento.ts
export class ProdutoAnticorruptionLayerComTratamento {
  private readonly adapter: FornecedorAdapterComRetry;
  private readonly translator: ProdutoExternoTranslator;
  private readonly mapper: ProdutoMapper;

  constructor() {
    this.adapter = new FornecedorAdapterComRetry();
    this.translator = new ProdutoExternoTranslator();
    this.mapper = new ProdutoMapper();
  }

  async importarProdutosDoFornecedor(): Promise<Produto[]> {
    try {
      const resposta = await this.adapter.buscarProdutosComRetry();

      const produtosTraduzidos: ProdutoTraduzido[] = [];
      const erros: string[] = [];

      for (const produtoExterno of resposta.data) {
        try {
          const traduzido = this.translator.traduzir(produtoExterno);
          produtosTraduzidos.push(traduzido);
        } catch (erro) {
          const mensagem = `Produto ${produtoExterno.productId}: ${erro}`;
          erros.push(mensagem);
          console.error(mensagem);
          // Continuar processando outros produtos
        }
      }

      if (produtosTraduzidos.length === 0) {
        throw new Error('Nenhum produto válido foi importado do fornecedor');
      }

      // Log de sucesso parcial
      if (erros.length > 0) {
        console.warn(
          `Importação parcial: ${produtosTraduzidos.length} produtos importados, ${erros.length} erros`
        );
      }

      return produtosTraduzidos.map(t => this.mapper.mapearParaEntidade(t));
    } catch (erro) {
      if (erro instanceof FornecedorException) {
        throw erro;
      }
      throw new FornecedorException(
        'FORNECEDOR-DESCONHECIDO',
        erro instanceof Error ? erro.message : String(erro)
      );
    }
  }
}
```

## Cache e Otimização

Para sistemas de alto desempenho, o Anticorruption Layer pode incluir estratégias de cache:

```typescript
// anticorruption/cache/ProdutosCacheManager.ts
export interface CacheEntry<T> {
  dados: T;
  timestamp: number;
  ttlMs: number;
}

export class ProdutosCacheManager {
  private cache: Map<string, CacheEntry<Produto[]>> = new Map();
  private readonly DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutos

  armazenarEmCache(chave: string, produtos: Produto[], ttlMs?: number): void {
    this.cache.set(chave, {
      dados: produtos,
      timestamp: Date.now(),
      ttlMs: ttlMs ?? this.DEFAULT_TTL_MS
    });
  }

  obterDoCache(chave: string): Produto[] | null {
    const entrada = this.cache.get(chave);

    if (!entrada) {
      return null;
    }

    const idadeMs = Date.now() - entrada.timestamp;
    if (idadeMs > entrada.ttlMs) {
      this.cache.delete(chave);
      return null;
    }

    return entrada.dados;
  }

  limparCache(): void {
    this.cache.clear();
  }
}

// anticorruption/ProdutoAnticorruptionLayerComCache.ts
export class ProdutoAnticorruptionLayerComCache {
  private readonly anticorruptionLayer: ProdutoAnticorruptionLayerComTratamento;
  private readonly cacheManager: ProdutosCacheManager;
  private readonly chaveCache = 'produtos-fornecedor-principal';

  constructor() {
    this.anticorruptionLayer = new ProdutoAnticorruptionLayerComTratamento();
    this.cacheManager = new ProdutosCacheManager();
  }

  async importarProdutosDoFornecedor(
    forcarRecarga: boolean = false
  ): Promise<Produto[]> {
    // Se não forçar recarga, tenta obter do cache
    if (!forcarRecarga) {
      const produtosEmCache = this.cacheManager.obterDoCache(this.chaveCache);
      if (produtosEmCache) {
        console.log('Retornando produtos do cache');
        return produtosEmCache;
      }
    }

    // Se não havia no cache ou foi forçada recarga
    console.log('Buscando produtos do fornecedor...');
    const produtos = await this.anticorruptionLayer.importarProdutosDoFornecedor();

    // Armazena em cache
    this.cacheManager.armazenarEmCache(this.chaveCache, produtos);

    return produtos;
  }
}
```

## Monitoramento e Observabilidade

Um Anticorruption Layer profissional deve ser monitorável:

```typescript
// anticorruption/monitoring/ImportacaoMetrics.ts
export interface MetricasImportacao {
  totalProdutosProcessados: number;
  produtosComSucesso: number;
  produtosComErro: number;
  tempoDecorrido: number;
  velocidadeMedia: number; // produtos por segundo
}

export class ImportacaoMetrics {
  private inicioMs: number = 0;
  private totalProcessados: number = 0;
  private sucessos: number = 0;
  private erros: number = 0;

  iniciar(): void {
    this.inicioMs = Date.now();
    this.totalProcessados = 0;
    this.sucessos = 0;
    this.erros = 0;
  }

  registrarSucesso(): void {
    this.sucessos++;
    this.totalProcessados++;
  }

  registrarErro(): void {
    this.erros++;
    this.totalProcessados++;
  }

  obterMetricas(): MetricasImportacao {
    const tempoDecorrido = Date.now() - this.inicioMs;
    const velocidadeMedia = this.totalProcessados / (tempoDecorrido / 1000);

    return {
      totalProdutosProcessados: this.totalProcessados,
      produtosComSucesso: this.sucessos,
      produtosComErro: this.erros,
      tempoDecorrido,
      velocidadeMedia
    };
  }
}

// anticorruption/ProdutoAnticorruptionLayerComMonitoramento.ts
export class ProdutoAnticorruptionLayerComMonitoramento {
  private readonly anticorruptionLayer: ProdutoAnticorruptionLayerComCache;
  private readonly metrics: ImportacaoMetrics;

  constructor() {
    this.anticorruptionLayer = new ProdutoAnticorruptionLayerComCache();
    this.metrics = new ImportacaoMetrics();
  }

  async importarProdutosDoFornecedor(): Promise<Produto[]> {
    this.metrics.iniciar();

    try {
      const produtos = await this.anticorruptionLayer.importarProdutosDoFornecedor();

      for (const produto of produtos) {
        this.metrics.registrarSucesso();
      }

      const metricas = this.metrics.obterMetricas();
      console.log(`
        === MÉTRICAS DE IMPORTAÇÃO ===
        Total processado: ${metricas.totalProdutosProcessados}
        Sucessos: ${metricas.produtosComSucesso}
        Erros: ${metricas.produtosComErro}
        Tempo: ${metricas.tempoDecorrido}ms
        Velocidade: ${metricas.velocidadeMedia.toFixed(2)} produtos/s
      `);

      return produtos;
    } catch (erro) {
      this.metrics.registrarErro();
      throw erro;
    }
  }
}
```

## Testes do Anticorruption Layer

Um bom Anticorruption Layer é altamente testável. Vamos ver exemplos de testes:

```typescript
// tests/anticorruption/ProdutoExternoTranslator.test.ts
import { ProdutoExternoTranslator, ProdutoTraduzido } from '../../src/anticorruption/translator/ProdutoExternoTranslator';
import { ProdutoExternoDTO } from '../../src/external/fornecedor-api-tipos';

describe('ProdutoExternoTranslator', () => {
  let translator: ProdutoExternoTranslator;

  beforeEach(() => {
    translator = new ProdutoExternoTranslator();
  });

  describe('traduzir', () => {
    it('deve traduzir um produto válido corretamente', () => {
      // Arrange
      const produtoExterno: ProdutoExternoDTO = {
        productId: 'ext-001',
        sku: 'SKU-12345',
        productName: 'Arroz Integral 5kg',
        description: 'Arroz integral de alta qualidade',
        price: '25.50',
        priceInCents: 2550,
        quantity: '100',
        dept: 'alimentos',
        supplierCode: 'SUPP-A001',
        lastUpdate: new Date().toISOString()
      };

      // Act
      const traduzido = translator.traduzir(produtoExterno);

      // Assert
      expect(traduzido.codigo).toBe('SKU-12345');
      expect(traduzido.nome).toBe('Arroz Integral 5kg');
      expect(traduzido.precoEmReais).toBe(25.50);
      expect(traduzido.quantidade).toBe(100);
      expect(traduzido.categoria).toBe('Alimentos');
    });

    it('deve preferir priceInCents quando disponível', () => {
      const produtoExterno: ProdutoExternoDTO = {
        productId: 'ext-002',
        sku: 'SKU-99999',
        productName: 'Produto Teste',
        description: 'Teste',
        price: '10.00', // Valor conflitante
        priceInCents: 2550, // Valor correto: 25.50
        quantity: '50',
        dept: 'bebidas',
        supplierCode: 'SUPP-B001',
        lastUpdate: new Date().toISOString()
      };

      const traduzido = translator.traduzir(produtoExterno);

      expect(traduzido.precoEmReais).toBe(25.50);
    });

    it('deve lançar erro quando nome é vazio', () => {
      const produtoExterno: ProdutoExternoDTO = {
        productId: 'ext-003',
        sku: 'SKU-00000',
        productName: '', // Nome vazio
        description: 'Teste',
        price: '10.00',
        priceInCents: 1000,
        quantity: '50',
        dept: 'alimentos',
        supplierCode: 'SUPP-C001',
        lastUpdate: new Date().toISOString()
      };

      expect(() => translator.traduzir(produtoExterno)).toThrow(
        /não possui nome válido/
      );
    });

    it('deve lançar erro quando quantidade é negativa', () => {
      const produtoExterno: ProdutoExternoDTO = {
        productId: 'ext-004',
        sku: 'SKU-11111',
        productName: 'Produto Teste',
        description: 'Teste',
        price: '10.00',
        priceInCents: 1000,
        quantity: '-5', // Quantidade negativa
        dept: 'alimentos',
        supplierCode: 'SUPP-D001',
        lastUpdate: new Date().toISOString()
      };

      expect(() => translator.traduzir(produtoExterno)).toThrow(
        /Quantidade inválida/
      );
    });

    it('deve mapear departamentos desconhecidos para "Outros"', () => {
      const produtoExterno: ProdutoExternoDTO = {
        productId: 'ext-005',
        sku: 'SKU-22222',
        productName: 'Produto Exótico',
        description: 'Teste',
        price: '15.00',
        priceInCents: 1500,
        quantity: '30',
        dept: 'departamento-inexistente', // Departamento desconhecido
        supplierCode: 'SUPP-E001',
        lastUpdate: new Date().toISOString()
      };

      const traduzido = translator.traduzir(produtoExterno);

      expect(traduzido.categoria).toBe('Outros');
    });
  });
});

// tests/anticorruption/ProdutoMapper.test.ts
import { ProdutoMapper } from '../../src/anticorruption/mapper/ProdutoMapper';
import { ProdutoTraduzido } from '../../src/anticorruption/translator/ProdutoExternoTranslator';

describe('ProdutoMapper', () => {
  let mapper: ProdutoMapper;

  beforeEach(() => {
    mapper = new ProdutoMapper();
  });

  it('deve mapear dados traduzidos para Entidade de domínio', () => {
    // Arrange
    const produtoTraduzido: ProdutoTraduzido = {
      id: 'ext-001',
      codigo: 'SKU-12345',
      nome: 'Arroz Integral 5kg',
      descricao: 'Arroz integral de alta qualidade',
      precoEmReais: 25.50,
      quantidade: 100,
      categoria: 'Alimentos'
    };

    // Act
    const produto = mapper.mapearParaEntidade(produtoTraduzido);

    // Assert
    expect(produto.obterNome()).toBe('Arroz Integral 5kg');
    expect(produto.obterPreco().obterValor()).toBe(25.50);
    expect(produto.obterEstoque().obterQuantidade()).toBe(100);
    expect(produto.obterCategoria()).toBe('Alimentos');
    expect(produto.obterCodigo().obterCodigo()).toBe('SKU-12345');
  });

  it('deve gerar ID único de domínio diferente do ID externo', () => {
    const produtoTraduzido: ProdutoTraduzido = {
      id: 'ext-001',
      codigo: 'SKU-12345',
      nome: 'Produto Teste',
      descricao: 'Teste',
      precoEmReais: 10.00,
      quantidade: 50,
      categoria: 'Alimentos'
    };

    const produto1 = mapper.mapearParaEntidade(produtoTraduzido);
    const produto2 = mapper.mapearParaEntidade(produtoTraduzido);

    // IDs de domínio devem ser diferentes
    expect(produto1.obterID()).not.toBe(produto2.obterID());
    // Mas os dados traduzidos originais eram os mesmos
    expect(produto1.obterNome()).toBe(produto2.obterNome());
  });

  it('deve respeitar invariantes de domínio na criação', () => {
    const produtoTraduzido: ProdutoTraduzido = {
      id: 'ext-002',
      codigo: 'SKU-00000',
      nome: 'Produto Inválido',
      descricao: 'Teste',
      precoEmReais: -5.00, // Preço negativo
      quantidade: 50,
      categoria: 'Alimentos'
    };

    // Deve lançar erro ao tentar criar Moeda com valor negativo
    expect(() => mapper.mapearParaEntidade(produtoTraduzido)).toThrow();
  });
});

// tests/anticorruption/integration.test.ts
describe('ProdutoAnticorruptionLayer - Integração', () => {
  it('deve importar produtos do fornecedor transformando-os em Entidades de domínio', async () => {
    // Arrange
    const anticorruptionLayer = new ProdutoAnticorruptionLayer();

    // Act
    const produtos = await anticorruptionLayer.importarProdutosDoFornecedor();

    // Assert
    expect(produtos.length).toBeGreaterThan(0);

    // Verifica que todos os produtos são Entidades válidas de domínio
    for (const produto of produtos) {
      expect(produto.obterID()).toBeDefined();
      expect(produto.obterNome()).toBeDefined();
      expect(produto.obterPreco().obterValor()).toBeGreaterThanOrEqual(0);
      expect(produto.obterEstoque().obterQuantidade()).toBeGreaterThanOrEqual(0);
      expect(produto.obterCategoria()).toBeDefined();
    }
  });
});
```

## Padrões Relacionados e Complementares

O Anticorruption Layer frequentemente trabalha em conjunto com outros padrões DDD:

**Facade Pattern**: O ACL funciona como uma Facade que simplifica a complexidade do sistema externo, apresentando uma interface limpa para o domínio.

**Adapter Pattern**: O componente Adapter do ACL implementa o padrão Adapter, convertendo interfaces incompatíveis.

**Repository Pattern**: O ACL pode usar Repositories para persistir dados transformados do domínio.

**Service Layer**: Application Services frequentemente coordenam o ACL com outras operações de domínio.

## Conclusão

O Anticorruption Layer é uma ferramenta essencial na construção de arquiteturas empresariais robustas segundo os princípios de Domain-Driven Design. Ele estabelece um limite claro entre seu domínio de negócio puro e as eccentricidades dos sistemas externos, garantindo que sua lógica de negócio permaneça coesa, testável e independente de implementações externas.

Ao implementar um ACL, você não apenas integra sistemas — você os integra de forma responsável, mantendo a integridade arquitetural de sua aplicação. A "contaminação" externa fica contida em uma camada específica, facilitando manutenção, evolução e testes futuros do sistema como um todo.
