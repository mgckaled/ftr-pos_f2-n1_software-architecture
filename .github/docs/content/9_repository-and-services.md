# Repositórios e Serviços

> [Voltar](../../../README.md)

## Índice

- [Repositórios e Serviços](#repositórios-e-serviços)
  - [Índice](#índice)
  - [Introdução](#introdução)
  - [O que é Repository?](#o-que-é-repository)
    - [Exemplo de Repository em TypeScript](#exemplo-de-repository-em-typescript)
  - [O que é Service?](#o-que-é-service)
    - [Exemplo de Service em TypeScript](#exemplo-de-service-em-typescript)
  - [Como Repository e Service se Relacionam](#como-repository-e-service-se-relacionam)
  - [Arquitetura em Camadas com DDD](#arquitetura-em-camadas-com-ddd)
  - [Estrutura de Pastas em um Projeto Real](#estrutura-de-pastas-em-um-projeto-real)
  - [Exemplo Completo Integrado](#exemplo-completo-integrado)
  - [Benefícios dessa Abordagem](#benefícios-dessa-abordagem)
  - [Fluxo de Dados Resumido](#fluxo-de-dados-resumido)
  - [Considerações Finais](#considerações-finais)

---

## Introdução

Para entender Repository e Services, precisamos primeiro compreender que estamos construindo software baseado em conceitos de negócio reais. Domain-Driven Design (DDD) nos ensina a organizar código ao redor do domínio da aplicação, não apenas em camadas técnicas. Neste caso, trabalharemos com um sistema de gestão de documentos, um conceito que faz sentido no mundo real e nos ajuda a visualizar as responsabilidades.

## O que é Repository?

Um Repository é um padrão de design que atua como um intermediário entre sua aplicação e a fonte de dados. Imagine um repositório de documentos físicos em um arquivo: quando você precisa de um documento, você não procura diretamente nas caixas no subsolo, você vai falar com o responsável do arquivo. O Repository faz exatamente isso: ele abstrai a complexidade de buscar, armazenar e manipular dados.

A razão de usar um Repository é desacoplar sua lógica de negócio da forma como os dados são persistidos. Se hoje usamos um banco de dados relacional e amanhã decidimos usar NoSQL, o código do seu domínio não precisa mudar.

### Exemplo de Repository em TypeScript

```typescript
// Primeiro, definimos a entidade do domínio
// Esta é a classe que representa um Documento no nosso negócio
class Documento {
  private id: string;
  private titulo: string;
  private conteudo: string;
  private dataCriacao: Date;
  private versao: number;

  constructor(id: string, titulo: string, conteudo: string) {
    this.id = id;
    this.titulo = titulo;
    this.conteudo = conteudo;
    this.dataCriacao = new Date();
    this.versao = 1;
  }

  // Métodos de negócio que fazem sentido no domínio
  public atualizarConteudo(novoConteudo: string): void {
    this.conteudo = novoConteudo;
    this.versao++;
  }

  public obterTitulo(): string {
    return this.titulo;
  }

  public obterId(): string {
    return this.id;
  }

  public obterVersao(): number {
    return this.versao;
  }

  public obterConteudo(): string {
    return this.conteudo;
  }
}

// Agora definimos a interface do Repository
// Esta interface define o contrato: o que podemos fazer com documentos
interface RepositorioDocumentos {
  salvar(documento: Documento): Promise<void>;
  obterPorId(id: string): Promise<Documento | null>;
  obterTodos(): Promise<Documento[]>;
  deletar(id: string): Promise<void>;
}

// Implementação concreta usando um banco de dados (simulado)
// Na vida real, isso poderia ser PostgreSQL, MongoDB, etc
class RepositorioDocumentosSQL implements RepositorioDocumentos {
  private baseDados: Map<string, Documento> = new Map();

  async salvar(documento: Documento): Promise<void> {
    // Simulamos uma operação de banco de dados
    this.baseDados.set(documento.obterId(), documento);
    console.log(`Documento ${documento.obterId()} salvo no banco SQL`);
  }

  async obterPorId(id: string): Promise<Documento | null> {
    const documento = this.baseDados.get(id);
    return documento || null;
  }

  async obterTodos(): Promise<Documento[]> {
    return Array.from(this.baseDados.values());
  }

  async deletar(id: string): Promise<void> {
    this.baseDados.delete(id);
    console.log(`Documento ${id} deletado do banco SQL`);
  }
}

// Se decidíssemos trocar para um banco NoSQL no futuro,
// seria tão simples quanto criar uma nova implementação
class RepositorioDocumentosMongoDB implements RepositorioDocumentos {
  async salvar(documento: Documento): Promise<void> {
    // Implementação com MongoDB
    console.log(`Documento ${documento.obterId()} salvo no MongoDB`);
  }

  async obterPorId(id: string): Promise<Documento | null> {
    // Implementação com MongoDB
    return null;
  }

  async obterTodos(): Promise<Documento[]> {
    // Implementação com MongoDB
    return [];
  }

  async deletar(id: string): Promise<void> {
    // Implementação com MongoDB
    console.log(`Documento ${id} deletado do MongoDB`);
  }
}
```

## O que é Service?

Um Service é onde colocamos a lógica de negócio complexa que envolve múltiplas entidades ou operações. Se um Repository é sobre "como persistir dados", um Service é sobre "o que fazer com esses dados para resolver um problema de negócio".

Voltando ao exemplo do arquivo: se o Repository é o responsável do arquivo que encontra documentos, o Service é o gerenciador de projetos que diz "preciso de todos os documentos sobre o projeto X, atualizados, organizados e prontos para apresentação".

### Exemplo de Service em TypeScript

```typescript
// Um Service encapsula regras de negócio
// Esta classe representa as operações de negócio envolvidas na gestão de documentos

class ServicoGestaoDocumentos {
  // O Service recebe o Repository no construtor
  // Isso é chamado de "injeção de dependência"
  constructor(private repositorio: RepositorioDocumentos) {}

  // Operação de negócio: criar um novo documento
  async criarDocumento(id: string, titulo: string, conteudo: string): Promise<Documento> {
    // Validamos os dados conforme as regras de negócio
    if (!titulo || titulo.length < 3) {
      throw new Error('O título deve ter no mínimo 3 caracteres');
    }

    if (!conteudo || conteudo.length < 10) {
      throw new Error('O conteúdo deve ter no mínimo 10 caracteres');
    }

    // Criamos a entidade
    const documento = new Documento(id, titulo, conteudo);

    // Usamos o Repository para persistir
    await this.repositorio.salvar(documento);

    return documento;
  }

  // Operação de negócio: atualizar um documento existente
  async atualizarDocumento(id: string, novoConteudo: string): Promise<Documento> {
    // Primeiro obtemos o documento existente
    const documento = await this.repositorio.obterPorId(id);

    if (!documento) {
      throw new Error(`Documento com ID ${id} não encontrado`);
    }

    // Aplicamos a regra de negócio
    if (novoConteudo.length < 10) {
      throw new Error('O novo conteúdo deve ter no mínimo 10 caracteres');
    }

    // Chamamos o método de negócio da entidade
    documento.atualizarConteudo(novoConteudo);

    // Persistimos a mudança
    await this.repositorio.salvar(documento);

    return documento;
  }

  // Operação de negócio: obter relatório de documentos
  // Esta operação envolve múltiplas entidades e lógica complexa
  async gerarRelatorioDocumentos(): Promise<{ 
    totalDocumentos: number; 
    listaDocumentos: Array<{ id: string; titulo: string; versao: number }> 
  }> {
    const documentos = await this.repositorio.obterTodos();

    return {
      totalDocumentos: documentos.length,
      listaDocumentos: documentos.map(doc => ({
        id: doc.obterId(),
        titulo: doc.obterTitulo(),
        versao: doc.obterVersao()
      }))
    };
  }

  // Operação de negócio: deletar documento com validações
  async deletarDocumento(id: string): Promise<void> {
    const documento = await this.repositorio.obterPorId(id);

    if (!documento) {
      throw new Error(`Documento com ID ${id} não encontrado`);
    }

    // Aqui poderíamos adicionar mais regras, como:
    // - Verificar permissões do usuário
    // - Verificar se o documento está em uso
    // - Registrar a deleção em um log de auditoria

    await this.repositorio.deletar(id);
  }
}
```

## Como Repository e Service se Relacionam

Agora que entendemos cada conceito individualmente, precisamos ver como eles trabalham juntos. O padrão é claro: o Service usa o Repository. O Service implementa as regras de negócio, e quando precisa persistir ou recuperar dados, delega essa responsabilidade ao Repository.

```typescript
// Fluxo de operação
// 1. Alguém (como um controlador HTTP) chama o Service
// 2. O Service valida as regras de negócio
// 3. O Service usa o Repository para operações de dados
// 4. O Repository interage com o banco de dados
// 5. Os dados retornam e o Service retorna o resultado

// Demonstração prática:
async function demonstrarFluxo() {
  // Primeira decisão: qual implementação de Repository usar?
  const repositorio = new RepositorioDocumentosSQL();

  // Criamos o Service com injeção de dependência
  const servico = new ServicoGestaoDocumentos(repositorio);

  try {
    // O cliente chama o Service
    const novoDocumento = await servico.criarDocumento(
      'doc-001',
      'Relatório de Vendas',
      'Este é um relatório detalhado sobre as vendas do trimestre'
    );

    console.log('Documento criado:', novoDocumento.obterTitulo());

    // Mais tarde, atualizamos o documento
    const documentoAtualizado = await servico.atualizarDocumento(
      'doc-001',
      'Este é o relatório atualizado com novos dados de vendas'
    );

    console.log('Versão do documento:', documentoAtualizado.obterVersao());

    // Geramos um relatório
    const relatorio = await servico.gerarRelatorioDocumentos();
    console.log('Total de documentos:', relatorio.totalDocumentos);

  } catch (erro) {
    console.error('Erro:', erro.message);
  }
}
```

## Arquitetura em Camadas com DDD

Para compreender onde Repository e Service se encaixam na arquitetura geral, vamos visualizar uma arquitetura típica em DDD:

```plaintext
┌─────────────────────────────────────────────────────────┐
│                  CAMADA DE APRESENTAÇÃO                 │
│           (Controllers, APIs REST, CLI, etc)            │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  CAMADA DE APLICAÇÃO                    │
│     (Application Services, DTOs, Orquestração)          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   CAMADA DE DOMÍNIO                     │
│          (Entities, Value Objects, Domain Services)     │
│                                                         │
│  Aqui está a lógica core do negócio. As entidades       │
│  como Documento, Usuario, Projeto vivem aqui.           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  CAMADA DE INFRAESTRUTURA               │
│           (Repositories, Banco de Dados, APIs)          │
│                                                         │
│  Aqui estão as implementações concretas de Repository   │
│  e como os dados são realmente persistidos              │
└─────────────────────────────────────────────────────────┘
```

Observe que Repository está na camada de infraestrutura (implementação concreta), enquanto sua interface está na camada de domínio. O Service pode estar em ambas as camadas, dependendo da complexidade.

## Estrutura de Pastas em um Projeto Real

Para organizar melhor, vamos ver como ficaria a estrutura de diretórios:

```plaintext
src/
├── domain/                          # Camada de Domínio
│   ├── entities/
│   │   └── Documento.ts
│   ├── interfaces/
│   │   └── RepositorioDocumentos.ts  # Interface, não implementação
│   └── services/
│       └── ServicoGestaoDocumentos.ts
│
├── application/                     # Camada de Aplicação
│   └── dtos/
│       └── CriarDocumentoDTO.ts
│
├── infrastructure/                  # Camada de Infraestrutura
│   ├── repositories/
│   │   ├── RepositorioDocumentosSQL.ts
│   │   └── RepositorioDocumentosMongoDB.ts
│   └── database/
│       └── conexao.ts
│
└── presentation/                    # Camada de Apresentação
    └── controllers/
        └── ControladorDocumentos.ts
```

## Exemplo Completo Integrado

Para consolidar todo o aprendizado, aqui está um exemplo que mostra todas as camadas trabalhando juntas:

```typescript
// CAMADA DE DOMÍNIO: Entidade
class Documento {
  constructor(
    private id: string,
    private titulo: string,
    private conteudo: string,
    private dataCriacao: Date,
    private versao: number
  ) {}

  public atualizarConteudo(novoConteudo: string): void {
    if (novoConteudo.length < 10) {
      throw new Error('Conteúdo deve ter no mínimo 10 caracteres');
    }
    this.conteudo = novoConteudo;
    this.versao++;
  }

  public obterId(): string { return this.id; }
  public obterTitulo(): string { return this.titulo; }
  public obterConteudo(): string { return this.conteudo; }
  public obterVersao(): number { return this.versao; }
}

// CAMADA DE DOMÍNIO: Interface de Repository
interface RepositorioDocumentos {
  salvar(documento: Documento): Promise<void>;
  obterPorId(id: string): Promise<Documento | null>;
}

// CAMADA DE INFRAESTRUTURA: Implementação de Repository
class RepositorioDocumentosSQL implements RepositorioDocumentos {
  async salvar(documento: Documento): Promise<void> {
    console.log(`[SQL] Salvando documento: ${documento.obterId()}`);
  }

  async obterPorId(id: string): Promise<Documento | null> {
    console.log(`[SQL] Buscando documento: ${id}`);
    return null;
  }
}

// CAMADA DE DOMÍNIO: Domain Service (lógica de negócio)
class ServicoGestaoDocumentos {
  constructor(private repositorio: RepositorioDocumentos) {}

  async criarDocumento(id: string, titulo: string, conteudo: string): Promise<Documento> {
    // Validações de negócio
    if (!titulo || titulo.trim().length === 0) {
      throw new Error('Título não pode estar vazio');
    }

    const documento = new Documento(id, titulo, conteudo, new Date(), 1);
    await this.repositorio.salvar(documento);
    return documento;
  }

  async atualizarDocumento(id: string, novoConteudo: string): Promise<Documento> {
    const documento = await this.repositorio.obterPorId(id);
    
    if (!documento) {
      throw new Error(`Documento ${id} não encontrado`);
    }

    documento.atualizarConteudo(novoConteudo);
    await this.repositorio.salvar(documento);
    return documento;
  }
}

// CAMADA DE APRESENTAÇÃO: Controlador (recebe requisições HTTP, CLI, etc)
class ControladorDocumentos {
  constructor(private servico: ServicoGestaoDocumentos) {}

  async criar(id: string, titulo: string, conteudo: string) {
    try {
      const resultado = await this.servico.criarDocumento(id, titulo, conteudo);
      return { sucesso: true, dados: resultado };
    } catch (erro) {
      return { sucesso: false, erro: erro.message };
    }
  }

  async atualizar(id: string, conteudo: string) {
    try {
      const resultado = await this.servico.atualizarDocumento(id, conteudo);
      return { sucesso: true, dados: resultado };
    } catch (erro) {
      return { sucesso: false, erro: erro.message };
    }
  }
}

// USANDO O SISTEMA
async function executarAplicacao() {
  // Instanciamos a implementação concreta do Repository
  const repositorio = new RepositorioDocumentosSQL();

  // Injetamos o Repository no Service
  const servico = new ServicoGestaoDocumentos(repositorio);

  // Injetamos o Service no Controlador
  const controlador = new ControladorDocumentos(servico);

  // Agora podemos usar o sistema
  const resultado1 = await controlador.criar(
    'doc-123',
    'Contrato de Parceria',
    'Este é um contrato que estabelece a parceria entre as empresas'
  );

  console.log('Resultado 1:', resultado1);

  const resultado2 = await controlador.atualizar(
    'doc-123',
    'Este é o contrato atualizado com as novas cláusulas de renegociação'
  );

  console.log('Resultado 2:', resultado2);
}
```

## Benefícios dessa Abordagem

Existem várias razões pelas quais separamos Repository e Service dessa forma. A primeira é testabilidade: podemos criar um Repository fake para testar o Service sem tocarem um banco de dados real. A segunda é flexibilidade: precisamos trocar de banco de dados? Criamos uma nova implementação de Repository sem tocar em nada mais. A terceira é clareza: cada classe tem uma responsabilidade bem definida.

```typescript
// Exemplo de teste unitário
class RepositorioDocumentosFake implements RepositorioDocumentos {
  async salvar(documento: Documento): Promise<void> {
    // Não faz nada, apenas simula
  }

  async obterPorId(id: string): Promise<Documento | null> {
    // Retorna dados de teste
    return null;
  }
}

// Agora podemos testar o Service sem banco de dados
async function testarServico() {
  const repositorioFake = new RepositorioDocumentosFake();
  const servico = new ServicoGestaoDocumentos(repositorioFake);

  try {
    await servico.criarDocumento('test-1', 'Teste', 'Conteúdo de teste aqui');
    console.log('Teste passou!');
  } catch (erro) {
    console.error('Teste falhou:', erro.message);
  }
}
```

## Fluxo de Dados Resumido

Quando um usuário interage com seu sistema, os dados fluem desta forma:

```plaintext
Usuário/Cliente
      │
      ▼
┌─────────────────────┐
│   Controlador       │  (recebe a requisição)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Service           │  (aplica regras de negócio)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Repository        │  (persiste/recupera dados)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Banco de Dados    │  (armazena informações)
└─────────────────────┘
```

E a resposta volta pelo caminho inverso, passando pelas validações e transformações apropriadas em cada camada.

## Considerações Finais

Repository e Service são mais que padrões de código: são formas de pensar sobre estrutura. Repository nos diz "abstrai a persistência", enquanto Service nos diz "coloca a lógica de negócio em um lugar específico e testável". Juntos, dentro dos princípios de DDD, eles criam uma arquitetura que é fácil de entender, manter e evoluir conforme o negócio muda.

A chave para aplicar bem esses conceitos é lembrar que o domínio (seu conhecimento sobre o negócio) deve vir em primeiro lugar na sua arquitetura. Repository e Service são ferramentas para expressar esse domínio de forma clara no código.
