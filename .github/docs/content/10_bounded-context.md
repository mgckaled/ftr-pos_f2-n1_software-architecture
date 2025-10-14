# Contexto Delimitado (Bounded Context)

> [Voltar](../../../README.md)

## Índice

- [Contexto Delimitado (Bounded Context)](#contexto-delimitado-bounded-context)
  - [Índice](#índice)
  - [Introdução: O Problema que Bounded Context Resolve](#introdução-o-problema-que-bounded-context-resolve)
  - [Definição: O Que É Um Bounded Context?](#definição-o-que-é-um-bounded-context)
  - [A Linguagem Ubíqua: O Coração do Bounded Context](#a-linguagem-ubíqua-o-coração-do-bounded-context)
  - [Estrutura de um Bounded Context: Anatomia Completa](#estrutura-de-um-bounded-context-anatomia-completa)
  - [Exemplo Prático em TypeScript: Sistema de RH com Múltiplos Bounded Contexts](#exemplo-prático-em-typescript-sistema-de-rh-com-múltiplos-bounded-contexts)
  - [Integração Entre Bounded Contexts: Anti-Corrupção e Eventos](#integração-entre-bounded-contexts-anti-corrupção-e-eventos)
    - [O Padrão de Camada Anti-Corrupção (Anti-Corruption Layer)](#o-padrão-de-camada-anti-corrupção-anti-corruption-layer)
    - [Comunicação via Eventos de Domínio](#comunicação-via-eventos-de-domínio)
  - [Benefícios de Usar Bounded Contexts](#benefícios-de-usar-bounded-contexts)
  - [Desafios e Armadilhas Comuns](#desafios-e-armadilhas-comuns)
  - [Mapeando Bounded Contexts: Context Mapping](#mapeando-bounded-contexts-context-mapping)
  - [Padrões de Relacionamento Entre Bounded Contexts](#padrões-de-relacionamento-entre-bounded-contexts)
    - [1. Partnership (Parceria)](#1-partnership-parceria)
    - [2. Shared Kernel (Núcleo Compartilhado)](#2-shared-kernel-núcleo-compartilhado)
    - [3. Customer-Supplier (Cliente-Fornecedor)](#3-customer-supplier-cliente-fornecedor)
    - [4. Conformist (Conformista)](#4-conformist-conformista)
  - [Estratégias Avançadas: Orquestração vs Coreografia](#estratégias-avançadas-orquestração-vs-coreografia)
    - [Orquestração: Controlador Central](#orquestração-controlador-central)
    - [Coreografia: Comunicação Baseada em Eventos](#coreografia-comunicação-baseada-em-eventos)
  - [Implementando Bounded Contexts na Prática: Estrutura de Projeto](#implementando-bounded-contexts-na-prática-estrutura-de-projeto)
  - [Testando Bounded Contexts](#testando-bounded-contexts)
  - [Monitorando a Saúde de Seus Bounded Contexts](#monitorando-a-saúde-de-seus-bounded-contexts)
  - [Conclusão: Pensando em Bounded Contexts](#conclusão-pensando-em-bounded-contexts)

---

## Introdução: O Problema que Bounded Context Resolve

Imagine uma grande empresa de gestão de recursos humanos. Quando falamos sobre um "Colaborador", o significado dessa palavra pode variar drasticamente dependendo de quem está falando. Para o departamento de Folha de Pagamento, um colaborador é essencialmente um conjunto de dados relacionados a salário, descontos e benefícios. Para o departamento de Recrutamento, um colaborador é alguém com habilidades específicas, histórico de desempenho e planos de carreira. Para o departamento de Segurança, um colaborador é uma entidade com permissões de acesso e histórico de eventos de segurança.

Se tentarmos criar uma única entidade "Colaborador" que satisfaça a todos esses contextos, terminamos com uma classe gigante, confusa e impossível de manter. É aqui que entra o conceito fundamental de Bounded Context.

## Definição: O Que É Um Bounded Context?

Um Bounded Context é um limite explícito dentro de um domínio de negócio onde um modelo de domínio específico é válido e consistente. Pense nele como um mini-aplicativo dentro de um sistema maior, cada um com sua própria linguagem ubíqua, entidades, regras de negócio e até mesmo banco de dados.

A palavra "bounded" é essencial aqui. Isso significa que dentro desse limite, as regras são bem definidas e o modelo é coeso. Fora desse limite, diferentes regras podem aplicar-se, mesmo para conceitos que compartilham nomes similares.

```plaintext
┌───────────────────────────────────────────────────────────────────┐
│  SISTEMA DE GESTÃO DE RECURSOS HUMANOS                            │
│                                                                   │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ FOLHA DE PAGAMENTO│ │ RECRUTAMENTO     │  │ GESTÃO DE ACESSO │ │
│  │ Bounded Context  │  │ Bounded Context  │  │ Bounded Context  │ │
│  │                  │  │                  │  │                  │ │
│  │ Colaborador:     │  │ Candidato:       │  │ Usuário:         │ │ 
│  │ - Salário        │  │ - Habilidades    │  │ - Permissões     │ │
│  │ - Descontos      │  │ - Experiência    │  │ - Roles          │ │
│  │ - Benefícios     │  │ - Referências    │  │ - Auditoria      │ │ 
│  │                  │  │                  │  │                  │ │ 
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│           ↓                    ↓                      ↓           │
│      Sua Lógica          Sua Lógica            Sua Lógica         │
│      Suas Regras         Suas Regras           Suas Regras        │
│      Seu BD              Seu BD                Seu BD             │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## A Linguagem Ubíqua: O Coração do Bounded Context

Dentro de cada Bounded Context existe uma Linguagem Ubíqua, que é o vocabulário compartilhado entre desenvolvedores e especialistas de domínio. Essa linguagem é específica do contexto e deve ser usada consistentemente em toda a comunicação, código e documentação.

Por exemplo, no contexto de Folha de Pagamento, quando falamos sobre "Colaborador", sempre nos referimos aos atributos relacionados a compensação. Se precisarmos discutir um "Usuário" no contexto de Gestão de Acesso, é uma entidade completamente diferente, com significado e propriedades distintas.

## Estrutura de um Bounded Context: Anatomia Completa

Para ilustrar como um Bounded Context é estruturado, vamos examinar um exemplo concreto: o contexto de Folha de Pagamento em um sistema de RH.

```plaintext
FOLHA DE PAGAMENTO BOUNDED CONTEXT
│
├── Domain Model (Modelo de Domínio)
│   ├── Entities (Entidades)
│   │   └── Colaborador, Período de Folha, Lançamento
│   ├── Value Objects (Objetos de Valor)
│   │   └── Salário, CPF, DataAdmissão
│   └── Aggregates (Agregados)
│       └── FolhaDeColaborador
│
├── Application Services (Serviços de Aplicação)
│   └── ProcessarFolhaService
│
├── Domain Services (Serviços de Domínio)
│   └── CalculadoraDeFolha
│
├── Repositories (Repositórios)
│   └── RepositórioFolhaDeColaborador
│
└── Events (Eventos de Domínio)
    └── FolhaProcessadaEvent
```

## Exemplo Prático em TypeScript: Sistema de RH com Múltiplos Bounded Contexts

Agora vamos ver como implementar diferentes Bounded Contexts em um sistema real. Observe como o mesmo conceito "Colaborador" é representado de forma completamente diferente em cada contexto.

```typescript
// ============================================================================
// CONTEXTO 1: FOLHA DE PAGAMENTO
// ============================================================================

// Neste contexto, Colaborador é definido pelos seus dados salariais e deduções
namespace FolhaDePagamento {
  // Value Object: Representa um valor imutável de salário
  export class Salario {
    private readonly valor: number;

    constructor(valor: number) {
      if (valor < 0) {
        throw new Error("Salário não pode ser negativo");
      }
      this.valor = valor;
    }

    public obterValor(): number {
      return this.valor;
    }

    public aplicarAumento(percentual: number): Salario {
      const novoValor = this.valor * (1 + percentual / 100);
      return new Salario(novoValor);
    }
  }

  // Entity: Representa uma entidade com identidade única no contexto
  export class ColaboradorFolha {
    private readonly colaboradorId: string;
    private salario: Salario;
    private dependentes: number;
    private banco: string;
    private contaBancaria: string;

    constructor(
      colaboradorId: string,
      salario: Salario,
      dependentes: number,
      banco: string,
      contaBancaria: string
    ) {
      this.colaboradorId = colaboradorId;
      this.salario = salario;
      this.dependentes = dependentes;
      this.banco = banco;
      this.contaBancaria = contaBancaria;
    }

    public obterSalario(): Salario {
      return this.salario;
    }

    public obterDependentes(): number {
      return this.dependentes;
    }

    public atualizarSalario(novoSalario: Salario): void {
      this.salario = novoSalario;
    }
  }

  // Domain Service: Contém lógica de negócio que não pertence a uma entidade específica
  export class CalculadoraDeDescontos {
    public calcularIRRF(salario: Salario, dependentes: number): number {
      // Regra de negócio: IRRF = 15% do salário - 100 por dependente
      const aliquota = 0.15;
      const deducaoPorDependente = 100;
      return Math.max(
        0,
        salario.obterValor() * aliquota - dependentes * deducaoPorDependente
      );
    }

    public calcularINSS(salario: Salario): number {
      // Regra de negócio: INSS = 8% do salário
      return salario.obterValor() * 0.08;
    }
  }

  // Application Service: Orquestra a lógica de aplicação
  export class ProcessarFolhaService {
    constructor(
      private calculadora: CalculadoraDeDescontos,
      private repositorio: RepositorioColaboradorFolha
    ) {}

    public processar(colaboradorId: string): FolhaProcessada {
      const colaborador = this.repositorio.obter(colaboradorId);
      
      const irrf = this.calculadora.calcularIRRF(
        colaborador.obterSalario(),
        colaborador.obterDependentes()
      );
      const inss = this.calculadora.calcularINSS(colaborador.obterSalario());
      const liquido =
        colaborador.obterSalario().obterValor() - irrf - inss;

      return new FolhaProcessada(colaboradorId, liquido, irrf, inss);
    }
  }

  // DTO: Transfer Object para comunicação com outros contextos
  export interface FolhaProcessada {
    colaboradorId: string;
    salarioLiquido: number;
    irrf: number;
    inss: number;
  }

  // Repository Interface: Define o contrato para persistência
  export interface RepositorioColaboradorFolha {
    obter(id: string): ColaboradorFolha;
    salvar(colaborador: ColaboradorFolha): void;
  }
}

// ============================================================================
// CONTEXTO 2: RECRUTAMENTO
// ============================================================================

// Neste contexto, Candidato é totalmente diferente. Aqui nos importamos
// com suas habilidades, experiência e avaliação técnica

namespace Recrutamento {
  // Value Object: Representa uma habilidade
  export class Habilidade {
    private readonly nome: string;
    private readonly nivelProficiencia: "Básico" | "Intermediário" | "Avançado";

    constructor(nome: string, nivelProficiencia: string) {
      this.nome = nome;
      this.nivelProficiencia = nivelProficiencia as any;
    }

    public obterNome(): string {
      return this.nome;
    }

    public obterNivel(): string {
      return this.nivelProficiencia;
    }
  }

  // Entity: Um candidato no processo de recrutamento
  export class Candidato {
    private readonly candidatoId: string;
    private nome: string;
    private email: string;
    private habilidades: Habilidade[];
    private anosExperiencia: number;
    private status: "Triado" | "Em Entrevista" | "Oferta" | "Rejeitado";

    constructor(
      candidatoId: string,
      nome: string,
      email: string,
      anosExperiencia: number
    ) {
      this.candidatoId = candidatoId;
      this.nome = nome;
      this.email = email;
      this.anosExperiencia = anosExperiencia;
      this.habilidades = [];
      this.status = "Triado";
    }

    public adicionarHabilidade(habilidade: Habilidade): void {
      this.habilidades.push(habilidade);
    }

    public obterHabilidades(): Habilidade[] {
      return this.habilidades;
    }

    public avancarParaEntrevista(): void {
      if (this.status !== "Triado") {
        throw new Error("Candidato deve estar no status 'Triado'");
      }
      this.status = "Em Entrevista";
    }

    public fazer Oferta(): void {
      if (this.status !== "Em Entrevista") {
        throw new Error("Candidato deve estar em entrevista");
      }
      this.status = "Oferta";
    }

    public rejeitar(): void {
      this.status = "Rejeitado";
    }

    public obterStatus(): string {
      return this.status;
    }
  }

  // Domain Service: Avalia a aderência do candidato à vaga
  export class AvaliacaoDeCandidato {
    public calcularScore(candidato: Candidato, vagaRequerida: VagaRequerida): number {
      // Lógica de pontuação baseada em habilidades e experiência
      let score = 0;

      // +10 pontos por ano de experiência (máximo 50)
      score += Math.min(candidato["anosExperiencia"] * 10, 50);

      // +20 pontos por cada habilidade que corresponde aos requisitos
      const habilidadesCandidato = candidato.obterHabilidades();
      const habilidadesRequeridas = vagaRequerida.obterHabilidadesRequeridas();
      
      habilidadesCandidato.forEach((h) => {
        if (
          habilidadesRequeridas.some((hr) => hr.obterNome() === h.obterNome())
        ) {
          score += 20;
        }
      });

      return Math.min(score, 100);
    }
  }

  // Value Object: Define uma vaga
  export class VagaRequerida {
    private habilidadesRequeridas: Habilidade[];
    private anosExperienciaMinima: number;

    constructor(anosExperienciaMinima: number, habilidades: Habilidade[]) {
      this.anosExperienciaMinima = anosExperienciaMinima;
      this.habilidadesRequeridas = habilidades;
    }

    public obterHabilidadesRequeridas(): Habilidade[] {
      return this.habilidadesRequeridas;
    }

    public obterAnosExperienciaMinima(): number {
      return this.anosExperienciaMinima;
    }
  }

  // Application Service
  export class AnalisarCandidatoService {
    constructor(
      private avaliador: AvaliacaoDeCandidato,
      private repositorio: RepositorioCandidato
    ) {}

    public analisar(candidatoId: string, vaga: VagaRequerida): AnaliseResultado {
      const candidato = this.repositorio.obter(candidatoId);
      const score = this.avaliador.calcularScore(candidato, vaga);

      return new AnaliseResultado(
        candidatoId,
        score,
        score >= 70 ? "Recomendado" : "Não Recomendado"
      );
    }
  }

  export interface AnaliseResultado {
    candidatoId: string;
    scoreAvaliacao: number;
    recomendacao: string;
  }

  export interface RepositorioCandidato {
    obter(id: string): Candidato;
    salvar(candidato: Candidato): void;
  }
}

// ============================================================================
// CONTEXTO 3: GESTÃO DE ACESSO (IAM - Identity and Access Management)
// ============================================================================

// Neste contexto, nos importamos com permissões, roles e auditoria

namespace GestaoDeAcesso {
  // Value Object: Representa uma permissão específica
  export class Permissao {
    private readonly recurso: string;
    private readonly acao: string;

    constructor(recurso: string, acao: string) {
      this.recurso = recurso;
      this.acao = acao;
    }

    public obterRecurso(): string {
      return this.recurso;
    }

    public obterAcao(): string {
      return this.acao;
    }

    public igualar(outra: Permissao): boolean {
      return this.recurso === outra.recurso && this.acao === outra.acao;
    }
  }

  // Value Object: Representa um papel (role)
  export class Papel {
    private readonly nome: string;
    private readonly permissoes: Permissao[];

    constructor(nome: string, permissoes: Permissao[]) {
      this.nome = nome;
      this.permissoes = permissoes;
    }

    public obterNome(): string {
      return this.nome;
    }

    public obterPermissoes(): Permissao[] {
      return this.permissoes;
    }

    public temPermissao(permissao: Permissao): boolean {
      return this.permissoes.some((p) => p.igualar(permissao));
    }
  }

  // Entity: Um usuário no contexto de acesso
  export class Usuario {
    private readonly usuarioId: string;
    private login: string;
    private papeis: Papel[];
    private ativo: boolean;
    private ultimoAcesso: Date | null;

    constructor(usuarioId: string, login: string) {
      this.usuarioId = usuarioId;
      this.login = login;
      this.papeis = [];
      this.ativo = true;
      this.ultimoAcesso = null;
    }

    public adicionarPapel(papel: Papel): void {
      if (!this.papeis.some((p) => p.obterNome() === papel.obterNome())) {
        this.papeis.push(papel);
      }
    }

    public removerPapel(nomePapel: string): void {
      this.papeis = this.papeis.filter((p) => p.obterNome() !== nomePapel);
    }

    public verificarPermissao(permissao: Permissao): boolean {
      if (!this.ativo) {
        return false;
      }
      return this.papeis.some((papel) => papel.temPermissao(permissao));
    }

    public obterPapeis(): Papel[] {
      return this.papeis;
    }

    public desativar(): void {
      this.ativo = false;
    }

    public ativar(): void {
      this.ativo = true;
    }

    public registrarAcesso(): void {
      this.ultimoAcesso = new Date();
    }
  }

  // Domain Service: Gerencia as políticas de acesso
  export class PoliticaDeAcesso {
    public podeAcessar(usuario: Usuario, permissao: Permissao): boolean {
      // Lógica complexa de segurança
      if (!usuario.verificarPermissao(permissao)) {
        return false;
      }

      // Exemplo: Alguns recursos requerem autenticação adicional
      if (permissao.obterRecurso() === "Dados Sensíveis") {
        return false; // Requer MFA
      }

      return true;
    }
  }

  // Application Service
  export class VerificarAcessoService {
    constructor(
      private politica: PoliticaDeAcesso,
      private repositorio: RepositorioUsuario,
      private logger: LoggerAuditoria
    ) {}

    public verificar(usuarioId: string, permissao: Permissao): boolean {
      const usuario = this.repositorio.obter(usuarioId);
      const temAcesso = this.politica.podeAcessar(usuario, permissao);

      // Log de auditoria
      this.logger.registrar({
        usuarioId,
        permissao: permissao.obterRecurso(),
        acao: permissao.obterAcao(),
        resultado: temAcesso ? "Concedido" : "Negado",
        timestamp: new Date(),
      });

      if (temAcesso) {
        usuario.registrarAcesso();
        this.repositorio.salvar(usuario);
      }

      return temAcesso;
    }
  }

  export interface RepositorioUsuario {
    obter(id: string): Usuario;
    salvar(usuario: Usuario): void;
  }

  export interface LoggerAuditoria {
    registrar(evento: any): void;
  }
}
```

## Integração Entre Bounded Contexts: Anti-Corrupção e Eventos

A grande questão que surge é: como esses contextos se comunicam? A resposta está em dois padrões fundamentais do DDD.

### O Padrão de Camada Anti-Corrupção (Anti-Corruption Layer)

Quando um contexto precisa consumir dados de outro, não devemos permitir que o modelo de um contexto "contamine" o outro. Usamos uma Camada Anti-Corrupção para traduzir dados.

```typescript
// ============================================================================
// CAMADA ANTI-CORRUPÇÃO: Traduzindo entre Contextos
// ============================================================================

// Quando Recrutamento precisa informar Folha de Pagamento sobre uma contratação

namespace Integracao {
  // Este é um adapter que traduz dados de um contexto para outro
  export class AdaptadorRecrutamentoParaFolha {
    public traduzirCandidatoParaColaborador(
      candidato: Recrutamento.Candidato,
      salarioOfertado: number
    ): FolhaDePagamento.ColaboradorFolha {
      // Tradução: O candidato aprovado vira um colaborador na folha
      // Note: Usamos apenas os dados relevantes para o novo contexto
      
      const salario = new FolhaDePagamento.Salario(salarioOfertado);
      const colaboradorId = `COL-${candidato["candidatoId"]}`;
      
      // Criamos uma nova entidade no contexto de Folha
      return new FolhaDePagamento.ColaboradorFolha(
        colaboradorId,
        salario,
        0, // dependentes (não vem do recrutamento)
        "", // banco (será preenchido depois)
        "" // conta (será preenchida depois)
      );
    }
  }

  // Quando Folha de Pagamento precisa informar ao Acesso que um novo colaborador foi contratado

  export class AdaptadorFolhaParaAcesso {
    public criarUsuarioParaColaborador(
      colaborador: FolhaDePagamento.ColaboradorFolha,
      nomeColaborador: string
    ): GestaoDeAcesso.Usuario {
      // O colaborador da folha vira um usuário no sistema de acesso
      const login = nomeColaborador.toLowerCase().replace(/\s/g, ".");
      const usuario = new GestaoDeAcesso.Usuario(
        `USER-${colaborador["colaboradorId"]}`,
        login
      );

      // Atribui um papel básico por padrão
      const papelPadrao = new GestaoDeAcesso.Papel("Colaborador", [
        new GestaoDeAcesso.Permissao("RH", "Visualizar Dados Pessoais"),
      ]);

      usuario.adicionarPapel(papelPadrao);
      return usuario;
    }
  }
}
```

### Comunicação via Eventos de Domínio

Uma abordagem mais elegante é usar eventos de domínio. Quando algo importante acontece em um contexto, esse contexto publica um evento que outros contextos podem consumir.

```typescript
// ============================================================================
// EVENTOS DE DOMÍNIO: Comunicação Assíncrona Entre Contextos
// ============================================================================

namespace EventosDeDominio {
  // Evento publicado pelo contexto de Recrutamento
  export interface CandidatoContratadoEvent {
    tipo: "CandidatoContratado";
    candidatoId: string;
    nomeCandidato: string;
    salarioOfertado: number;
    dataContratacao: Date;
  }

  // Evento publicado pelo contexto de Folha de Pagamento
  export interface ColaboradorProcessadoEvent {
    tipo: "ColaboradorProcessado";
    colaboradorId: string;
    salarioLiquido: number;
    dataProcessamento: Date;
  }

  // Event Bus: Responsável por publicar e consumir eventos
  export class EventBus {
    private subscribers: Map<
      string,
      Array<(evento: any) => Promise<void>>
    > = new Map();

    public subscribe(
      tipoEvento: string,
      handler: (evento: any) => Promise<void>
    ): void {
      if (!this.subscribers.has(tipoEvento)) {
        this.subscribers.set(tipoEvento, []);
      }
      this.subscribers.get(tipoEvento)!.push(handler);
    }

    public async publish(evento: any): Promise<void> {
      const handlers = this.subscribers.get(evento.tipo) || [];
      
      // Executar todos os handlers de forma assíncrona
      await Promise.all(handlers.map((h) => h(evento)));
    }
  }

  // Quando Recrutamento contrata alguém, publica um evento
  export class ContrataColaboradorService {
    constructor(private eventBus: EventBus) {}

    public contratarCandidato(candidatoId: string, salario: number): void {
      // ... lógica de contratação ...

      // Publica evento
      this.eventBus.publish({
        tipo: "CandidatoContratado",
        candidatoId,
        nomeCandidato: "João Silva",
        salarioOfertado: salario,
        dataContratacao: new Date(),
      });
    }
  }

  // Folha de Pagamento se inscreve neste evento
  export class ManipuladorCandidatoContratado {
    constructor(
      private folhaService: FolhaDePagamento.ProcessarFolhaService
    ) {}

    public async manipular(evento: CandidatoContratadoEvent): Promise<void> {
      // Quando um candidato é contratado, criamos um colaborador na folha
      console.log(`Criando colaborador para ${evento.nomeCandidato}`);
      // ... lógica para criar colaborador ...
    }
  }
}
```

## Benefícios de Usar Bounded Contexts

Compreender os benefícios de Bounded Contexts nos ajuda a entender por que devemos utilizá-los:

**Coesão Aumentada**: Cada contexto é focado em um aspecto específico do negócio. O código dentro de um contexto é altamente coeso, com alta coesão de responsabilidades e baixo acoplamento com outros contextos.

**Facilita Mudanças**: Se as regras de cálculo de IRRF mudarem, precisamos modificar apenas o contexto de Folha de Pagamento. O contexto de Recrutamento não é afetado.

**Escalabilidade Organizacional**: Diferentes equipes podem trabalhar em diferentes contextos sem interferir uma na outra. A equipe de Recrutamento trabalha no seu contexto, enquanto a equipe de Segurança trabalha no seu.

**Evolução Independente**: Cada contexto pode evoluir independentemente, usando diferentes padrões de arquitetura, bancos de dados ou mesmo linguagens de programação se necessário.

**Testes Mais Simples**: Como cada contexto é independente, é muito mais fácil escrever testes unitários focados e significativos.

## Desafios e Armadilhas Comuns

**Definir Limites Incorretos**: O maior desafio é determinar onde os limites devem estar. Isso requer compreensão profunda do domínio de negócio. Comece conversando com especialistas de domínio.

**Comunicação Excessiva Entre Contextos**: Se seus contextos precisam se comunicar constantemente, seus limites provavelmente estão errados. Contextos bem definidos devem ser relativamente autônomos.

**Duplicação de Código**: Às vezes, é melhor duplicar um pequeno trecho de código em dois contextos do que criar uma dependência entre eles. A independência vale o custo.

**Falta de Ubiquidade de Linguagem**: Se a equipe não usa a mesma linguagem ubíqua no contexto, o código se torna confuso. Sempre alinhe com especialistas de domínio.

## Mapeando Bounded Contexts: Context Mapping

Para entender como seus múltiplos contextos interagem, use diagramas de Context Map:

```plaintext
                    ┌─────────────────────────────────────────┐
                    │      FOLHA DE PAGAMENTO                 │
                    │                                         │
                    │  - Processar Folhas                     │
                    │  - Calcular Deduções                    │
                    └────────────────┬────────────────────────┘
                                     │
                        (Event: ColaboradorProcessado)
                                     │
                                     ▼
    ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
    │  RECRUTAMENTO       │  │ GESTÃO DE ACESSO    │  │  CONTABILIDADE      │
    │                     │  │                     │  │                     │
    │ - Avaliar Candidatos│  │ - Gerenciar Acesso  │  │ - Registrar Gastos  │
    │ - Fazer Ofertas     │  │ - Auditoria         │  │ - Gerar Relatórios  │
    │ - Contratar         │  │                     │  │                     │
    └────────┬────────────┘  └────────┬────────────┘  └─────────────────────┘
             │                        │
      (Event: CandidatoContratado)    │
             │                   (Consumer)
             │                        │
             └────────────┬───────────┘
                          │
            (Anti-Corruption Layer)
                          │
                    Tradução de DTOs

```

## Padrões de Relacionamento Entre Bounded Contexts

Quando múltiplos Bounded Contexts existem em um mesmo sistema, é crucial entender como eles se relacionam. Eric Evans definiu vários padrões que descrevem essas relações:

### 1. Partnership (Parceria)

Dois contextos trabalham juntos como parceiros iguais, frequentemente compartilhando objetivos em comum.

```typescript
// Exemplo: Recrutamento e Folha de Pagamento trabalham juntos
// para processar uma contratação

namespace RecrutamentoFolhaPartnership {
  export class ProcessarContrataçãoConjunta {
    constructor(
      private recrutamentoService: Recrutamento.AnalisarCandidatoService,
      private folhaService: FolhaDePagamento.ProcessarFolhaService,
      private eventBus: EventosDeDominio.EventBus
    ) {}

    public processar(candidatoId: string, salarioOfertado: number): void {
      // Ambos os contextos trabalham juntos
      const candidato = /* busca candidato */;
      
      // Recrutamento faz sua parte
      candidato.fazer Oferta();
      
      // Folha de Pagamento faz sua parte
      const salario = new FolhaDePagamento.Salario(salarioOfertado);
      const colaborador = new FolhaDePagamento.ColaboradorFolha(
        `COL-${candidatoId}`,
        salario,
        0,
        "",
        ""
      );
      
      // Ambos coordenam através de eventos
      this.eventBus.publish({
        tipo: "ContrataçãoProcessada",
        candidatoId,
        colaboradorId: colaborador["colaboradorId"],
      });
    }
  }
}
```

### 2. Shared Kernel (Núcleo Compartilhado)

Dois contextos compartilham um pequeno núcleo de código comum, geralmente para evitar duplicação crítica.

```typescript
// Código compartilhado entre Folha e Gestão de Acesso
namespace NucleoCompartilhado {
  // Ambos os contextos usam esta definição
  export class DocumentoIdentidade {
    private readonly cpf: string;

    constructor(cpf: string) {
      if (!this.validarCPF(cpf)) {
        throw new Error("CPF inválido");
      }
      this.cpf = cpf;
    }

    public obterCPF(): string {
      return this.cpf;
    }

    private validarCPF(cpf: string): boolean {
      // Validação real de CPF
      return cpf.length === 11 && /^\d+$/.test(cpf);
    }
  }

  // Folha de Pagamento utiliza
  export class ColaboradorComDocumento {
    private documento: DocumentoIdentidade;

    constructor(cpf: string) {
      this.documento = new DocumentoIdentidade(cpf);
    }
  }

  // Gestão de Acesso também utiliza
  export class UsuarioComDocumento {
    private documento: DocumentoIdentidade;

    constructor(cpf: string) {
      this.documento = new DocumentoIdentidade(cpf);
    }
  }
}
```

### 3. Customer-Supplier (Cliente-Fornecedor)

Um contexto é consumidor (cliente) de outro contexto que fornece funcionalidades. Geralmente implementado com APIs ou eventos.

```typescript
// Gestão de Acesso (Fornecedor) oferece serviços para Folha de Pagamento (Cliente)

namespace CustomerSupplierPattern {
  // Fornecedor: Gestão de Acesso expõe uma API
  export interface VerificadorDePermissoes {
    podeProcessarFolha(usuarioId: string): boolean;
  }

  export class VerificadorDePermissoesImpl implements VerificadorDePermissoes {
    constructor(private acessoService: GestaoDeAcesso.VerificarAcessoService) {}

    public podeProcessarFolha(usuarioId: string): boolean {
      const permissao = new GestaoDeAcesso.Permissao(
        "Folha de Pagamento",
        "Processar"
      );
      return this.acessoService.verificar(usuarioId, permissao);
    }
  }

  // Cliente: Folha de Pagamento usa o serviço
  export class ProcessarFolhaComSegurança {
    constructor(
      private folhaService: FolhaDePagamento.ProcessarFolhaService,
      private verificador: VerificadorDePermissoes
    ) {}

    public processar(usuarioId: string, colaboradorId: string): FolhaDePagamento.FolhaProcessada {
      // Verifica permissão no contexto fornecedor
      if (!this.verificador.podeProcessarFolha(usuarioId)) {
        throw new Error("Usuário não tem permissão para processar folha");
      }

      // Se autorizado, processa
      return this.folhaService.processar(colaboradorId);
    }
  }
}
```

### 4. Conformist (Conformista)

Um contexto adota o modelo do outro contexto sem proteção, aceitando o modelo como está.

```typescript
// Recrutamento adota o modelo de Folha de Pagamento sem tradução

namespace ConformistPattern {
  // Em vez de criar seu próprio Salário, Recrutamento usa o de Folha
  export class VagaDeEmprego {
    private salarioOfertado: FolhaDePagamento.Salario;

    constructor(salario: FolhaDePagamento.Salario) {
      this.salarioOfertado = salario;
    }

    public obterSalario(): FolhaDePagamento.Salario {
      return this.salarioOfertado;
    }
  }

  // PROBLEMA: Recrutamento agora depende de Folha de Pagamento
  // Se Folha mudar, Recrutamento quebra
  // Isso geralmente NÃO é recomendado
}
```

## Estratégias Avançadas: Orquestração vs Coreografia

### Orquestração: Controlador Central

Um serviço central coordena a comunicação entre contextos.

```typescript
namespace OrquestraçãoDeBoundedContexts {
  // Orquestrador central coordena todo o fluxo
  export class OrquestradorDeContratação {
    constructor(
      private recrutamentoService: Recrutamento.AnalisarCandidatoService,
      private folhaService: FolhaDePagamento.ProcessarFolhaService,
      private acessoService: GestaoDeAcesso.VerificarAcessoService,
      private contabilidadeService: any
    ) {}

    public executarContrataçãoCompleta(
      candidatoId: string,
      salarioOfertado: number
    ): ContrataçãoResultado {
      try {
        // Passo 1: Recrutamento
        console.log("Etapa 1: Processando candidato...");
        // validações do recrutamento

        // Passo 2: Folha de Pagamento
        console.log("Etapa 2: Criando colaborador na folha...");
        const salario = new FolhaDePagamento.Salario(salarioOfertado);
        // criar colaborador

        // Passo 3: Gestão de Acesso
        console.log("Etapa 3: Criando usuário no sistema...");
        // criar usuário

        // Passo 4: Contabilidade
        console.log("Etapa 4: Registrando gasto...");
        // registrar despesa

        return new ContrataçãoResultado(true, "Contratação bem-sucedida");
      } catch (erro) {
        // Compensação: reverter tudo em caso de erro
        console.error("Erro na contratação, revertendo...");
        return new ContrataçãoResultado(false, erro.message);
      }
    }
  }

  export interface ContrataçãoResultado {
    sucesso: boolean;
    mensagem: string;
  }
}
```

### Coreografia: Comunicação Baseada em Eventos

Os contextos reagem a eventos uns dos outros sem um controlador central.

```typescript
namespace CoreografiaDeBoundedContexts {
  // Cada contexto se inscreve nos eventos que o interessam
  
  export class ConfiguracaoDeCoreografia {
    constructor(
      private eventBus: EventosDeDominio.EventBus,
      private recrutamento: any,
      private folha: any,
      private acesso: any,
      private contabilidade: any
    ) {}

    public configurar(): void {
      // Recrutamento publica quando contrata
      this.eventBus.subscribe("CandidatoContratado", async (evento) => {
        console.log("Folha recebeu: candidato contratado");
        // Folha cria colaborador
      });

      // Folha publica quando processa
      this.eventBus.subscribe("ColaboradorCriado", async (evento) => {
        console.log("Acesso recebeu: colaborador criado");
        // Acesso cria usuário
      });

      // Acesso publica quando cria usuário
      this.eventBus.subscribe("UsuarioCriado", async (evento) => {
        console.log("Contabilidade recebeu: usuário criado");
        // Contabilidade registra despesa
      });

      // Se algo der errado, publica evento de compensação
      this.eventBus.subscribe("ContrataçãoFalhou", async (evento) => {
        console.log("Revertendo tudo...");
        // Todos os contextos reagem revertendo suas mudanças
      });
    }
  }

  // VANTAGEM: Desacoplamento total
  // DESVANTAGEM: Fluxo menos claro, mais complexidade operacional
}
```

## Implementando Bounded Contexts na Prática: Estrutura de Projeto

```plaintext
sistema-rh/
├── src/
│   ├── folha-de-pagamento/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── ColaboradorFolha.ts
│   │   │   │   └── PeríodoDeFolha.ts
│   │   │   ├── value-objects/
│   │   │   │   └── Salario.ts
│   │   │   ├── services/
│   │   │   │   └── CalculadoraDeDescontos.ts
│   │   │   ├── repositories/
│   │   │   │   └── RepositorioColaboradorFolha.ts
│   │   │   └── events/
│   │   │       └── FolhaProcessadaEvent.ts
│   │   │
│   │   ├── application/
│   │   │   ├── services/
│   │   │   │   └── ProcessarFolhaService.ts
│   │   │   └── dtos/
│   │   │       └── ProcessarFolhaDTO.ts
│   │   │
│   │   └── infrastructure/
│   │       ├── persistence/
│   │       │   └── RepositorioColaboradorFolhaSQL.ts
│   │       └── http/
│   │           └── FolhaController.ts
│   │
│   ├── recrutamento/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── Candidato.ts
│   │   │   ├── value-objects/
│   │   │   │   └── Habilidade.ts
│   │   │   ├── services/
│   │   │   │   └── AvaliacaoDeCandidato.ts
│   │   │   └── events/
│   │   │       └── CandidatoContratadoEvent.ts
│   │   │
│   │   ├── application/
│   │   │   └── services/
│   │   │       └── ContrataColaboradorService.ts
│   │   │
│   │   └── infrastructure/
│   │       └── persistence/
│   │           └── RepositorioCandidatoSQL.ts
│   │
│   ├── gestao-de-acesso/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── Usuario.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── Permissao.ts
│   │   │   │   └── Papel.ts
│   │   │   └── services/
│   │   │       └── PoliticaDeAcesso.ts
│   │   │
│   │   ├── application/
│   │   │   └── services/
│   │   │       └── VerificarAcessoService.ts
│   │   │
│   │   └── infrastructure/
│   │       └── persistence/
│   │           └── RepositorioUsuarioSQL.ts
│   │
│   └── shared/
│       ├── domain/
│       │   └── events/
│       │       └── DomainEvent.ts
│       │
│       ├── application/
│       │   └── EventBus.ts
│       │
│       └── integration/
│           ├── adapters/
│           │   ├── AdaptadorRecrutamentoParaFolha.ts
│           │   └── AdaptadorFolhaParaAcesso.ts
│           │
│           └── anti-corruption/
│               ├── RecrutamentoACL.ts
│               └── FolhaACL.ts
```

## Testando Bounded Contexts

Cada contexto deve ser testável isoladamente:

```typescript
// Teste do contexto de Folha de Pagamento
namespace TestsFolhaDePagamento {
  describe("Processar Folha de Pagamento", () => {
    let processarFolhaService: FolhaDePagamento.ProcessarFolhaService;
    let repositorioMock: FolhaDePagamento.RepositorioColaboradorFolha;
    let calculadora: FolhaDePagamento.CalculadoraDeDescontos;

    beforeEach(() => {
      // Setup do teste
      calculadora = new FolhaDePagamento.CalculadoraDeDescontos();
      
      repositorioMock = {
        obter: (id: string) => {
          const salario = new FolhaDePagamento.Salario(5000);
          return new FolhaDePagamento.ColaboradorFolha(
            id,
            salario,
            2,
            "Bradesco",
            "1234567890"
          );
        },
        salvar: () => {}
      };

      processarFolhaService = new FolhaDePagamento.ProcessarFolhaService(
        calculadora,
        repositorioMock
      );
    });

    test("Deve processar folha com descontos corretos", () => {
      const resultado = processarFolhaService.processar("COL-001");

      expect(resultado.salarioLiquido).toBeCloseTo(4450, 2);
      expect(resultado.irrf).toBeCloseTo(350, 2);
      expect(resultado.inss).toBeCloseTo(400, 2);
    });

    test("Deve calcular IRRF com dependentes corretamente", () => {
      const irrf = calculadora.calcularIRRF(
        new FolhaDePagamento.Salario(5000),
        3
      );
      
      // IRRF = 15% de 5000 - 100 * 3 = 750 - 300 = 450
      expect(irrf).toBe(450);
    });
  });
}
```

## Monitorando a Saúde de Seus Bounded Contexts

Para manter seus contextos saudáveis:

**Métricas de Acoplamento**: Meça quantas dependências cada contexto tem com outros. Um contexto com muitas dependências externas provavelmente tem limites mal definidos.

**Análise de Mudanças**: Quando uma mudança em um contexto requer mudanças em vários outros, isso sinaliza um problema de limites.

**Taxa de Comunicação**: Se dois contextos trocam muitos eventos ou chamadas, eles talvez devessem ser um único contexto.

```typescript
// Exemplo: Ferramenta para análise de saúde
namespace MonitoramentoDeSaude {
  export interface MetricasBoundedContext {
    nome: string;
    dependenciasExternas: number;
    metodosPublicos: number;
    eventosPublicados: number;
    eventosConsumidos: number;
    taxaAcoplamento: number;
  }

  export class AnalisadorSaudeBoundedContexts {
    public analisar(...contextos: MetricasBoundedContext[]): void {
      contextos.forEach((ctx) => {
        const acoplamento = (
          (ctx.dependenciasExternas + ctx.eventosConsumidos) /
          (ctx.metodosPublicos + ctx.eventosPublicados)
        ).toFixed(2);

        console.log(`Contexto: ${ctx.nome}`);
        console.log(`  Dependências Externas: ${ctx.dependenciasExternas}`);
        console.log(`  Taxa de Acoplamento: ${acoplamento}`);

        if (Number(acoplamento) > 0.5) {
          console.warn("  AVISO: Acoplamento muito alto!");
        }
      });
    }
  }
}
```

## Conclusão: Pensando em Bounded Contexts

Bounded Context é mais do que um padrão técnico; é uma forma de pensar sobre software que alinha modelo de negócio com modelo de software. Quando bem implementado, permite que organizações escalem seu software à medida que crescem, com múltiplas equipes trabalhando de forma independente mas coordenada.

A chave é lembrar que um Bounded Context não é apenas uma delimitação técnica no código. É um reflexo de um domínio de negócio bem definido, com seus próprios conceitos, linguagem, regras e responsabilidades. Quando você pensa nestes termos, torna-se muito mais claro onde desenhar as linhas.

Os princípios fundamentais para sucesso:

**Converse com especialistas de domínio**: Eles entendem onde estão as verdadeiras divisões no negócio. Os limites tecnológicos devem seguir os limites de negócio.

**Mantenha contextos coesos**: Todos os conceitos dentro de um contexto devem estar altamente relacionados. Se você se vir criando múltiplas subdivisões, talvez esteja misturando domínios.

**Minimize acoplamento entre contextos**: Use anti-corruption layers, eventos de domínio e DTOs para manter contextos independentes. Quanto menos um contexto sabe sobre outro, melhor.

**Evolua conforme você aprende**: Seus limites de contexto não precisam ser perfeitos no dia um. À medida que aprende mais sobre o domínio, está bem fazer ajustes. DDD é iterativo.

Bounded Context é o alicerce sobre o qual todos os outros padrões de DDD são construídos. Dominá-lo abrirá caminho para uma arquitetura de software verdadeiramente robusta, mantível e escalável.
