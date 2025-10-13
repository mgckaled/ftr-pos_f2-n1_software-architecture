# Comunicação Eficiente em DDD: Um Pilar Essencial

## Índice

- [Comunicação Eficiente em DDD: Um Pilar Essencial](#comunicação-eficiente-em-ddd-um-pilar-essencial)
  - [Índice](#índice)
  - [O Que é Comunicação Eficiente em DDD?](#o-que-é-comunicação-eficiente-em-ddd)
  - [🗣️ Dimensão 1: Comunicação Humana](#️-dimensão-1-comunicação-humana)
    - [A Linguagem Ubíqua Revisitada](#a-linguagem-ubíqua-revisitada)
      - [O Problema Clássico](#o-problema-clássico)
      - [A Solução DDD](#a-solução-ddd)
    - [Construindo a Linguagem Ubíqua](#construindo-a-linguagem-ubíqua)
      - [1. Event Storming](#1-event-storming)
      - [2. Glossário de Domínio](#2-glossário-de-domínio)
      - [3. Conversas Estruturadas](#3-conversas-estruturadas)
  - [🔗 Dimensão 2: Comunicação de Sistemas](#-dimensão-2-comunicação-de-sistemas)
    - [1. Síncrono com RPC/HTTP](#1-síncrono-com-rpchttp)
    - [2. Assíncrono com Events (Melhor Padrão)](#2-assíncrono-com-events-melhor-padrão)
    - [3. Saga Pattern (Para Transações Distribuídas)](#3-saga-pattern-para-transações-distribuídas)
    - [4. Anti-Corruption Layer (ACL)](#4-anti-corruption-layer-acl)
  - [Context Mapping: Visualizando a Comunicação](#context-mapping-visualizando-a-comunicação)
  - [Padrões de Comunicação Comparados](#padrões-de-comunicação-comparados)
  - [Consistência vs Acoplamento: O Trade-off](#consistência-vs-acoplamento-o-trade-off)
  - [Testando Comunicação Entre Contextos](#testando-comunicação-entre-contextos)
  - [Armadilhas Comuns de Comunicação](#armadilhas-comuns-de-comunicação)
  - [Comunicação em Grande Escala: Organização de Times](#comunicação-em-grande-escala-organização-de-times)
  - [Padrões de Comunicação Implementados](#padrões-de-comunicação-implementados)
    - [Pattern 1: Outbox Pattern (Garantir Consistência)](#pattern-1-outbox-pattern-garantir-consistência)
    - [Pattern 2: Inbox Pattern (Idempotência)](#pattern-2-inbox-pattern-idempotência)
    - [Pattern 3: Dead Letter Queue (DLQ)](#pattern-3-dead-letter-queue-dlq)
  - [Comunicação Síncrona vs Assíncrona: Quando Usar](#comunicação-síncrona-vs-assíncrona-quando-usar)
  - [Anti-Patterns de Comunicação: O Que NÃO Fazer](#anti-patterns-de-comunicação-o-que-não-fazer)
  - [Evoluindo a Comunicação: Roadmap](#evoluindo-a-comunicação-roadmap)
  - [Checklist: Comunicação Eficiente em DDD](#checklist-comunicação-eficiente-em-ddd)
  - [Conclusão: Por Que Comunicação Importa em DDD](#conclusão-por-que-comunicação-importa-em-ddd)
  - [Referências Finais](#referências-finais)

## O Que é Comunicação Eficiente em DDD?

Comunicação eficiente em Domain-Driven Design refere-se a **duas dimensões inseparáveis**:

1. **Comunicação Humana**: Entre desenvolvedores, especialistas de negócio, arquitetos e stakeholders
2. **Comunicação de Sistemas**: Entre diferentes bounded contexts, agregados e serviços

Ambas devem estar alinhadas. A comunicação humana deficiente resulta em código que comunica-se de forma inadequada.

---

## 🗣️ Dimensão 1: Comunicação Humana

### A Linguagem Ubíqua Revisitada

A **Linguagem Ubíqua (Ubiquitous Language)** é o cimento que une pessoas com diferentes perspectivas.

#### O Problema Clássico

```plaintext
Especialista de Negócio diz:
"Quando um pedido é confirmado, precisamos reservar estoque"

Desenvolvedor "malcriado" interpreta:
"OK, vou fazer um UPDATE na tabela estoque quando a tabela pedidos mudar de status"

Resultado:
- Lógica de negócio escondida em triggers SQL
- Impossível testar
- Impossível reutilizar
- Especialista não entende o código
- Código não reflete a realidade do negócio
```

#### A Solução DDD

```typescript
// Linguagem Ubíqua materializadas no código
class Pedido {
  confirmar(): void {
    if (this.itens.length === 0) {
      throw new Error('Pedido não pode ser confirmado sem itens');
    }
    
    this.status = 'confirmado';
    this.eventos.adicionar(
      new PedidoConfirmadoEvent(this.id, this.itens)
    );
  }
}

// Quando um pedido é confirmado, o evento é publicado
class EstoqueService {
  async aoConfirmarPedido(evento: PedidoConfirmadoEvent): Promise<void> {
    // "Reservar estoque" é um conceito de negócio visível
    await this.estoque.reservar(evento.getItens());
  }
}

// Agora o especialista de negócio pode ler:
// "Quando um Pedido é Confirmado, o Estoque é Reservado"
// Isso está visível no código: PedidoConfirmadoEvent → estoque.reservar()
```

### Construindo a Linguagem Ubíqua

#### 1. Event Storming

Reunião facilitada onde especialistas de negócio e desenvolvedores mapeiam eventos do domínio.

```plaintext
Passos do Event Storming:
1. Listar eventos de negócio (passado) em ordem cronológica
2. Agrupar eventos por agregado ou fluxo
3. Identificar comandos que causam eventos
4. Nomear conceitos de forma consistente
5. Documentar regras de negócio

Exemplo (E-commerce):

Timeline:
┌─────────────────────────────────────────┐
│ Cliente Adicionou Item ao Carrinho     │
│           ↓                             │
│ Cliente Confirmou Pedido                │
│           ↓                             │
│ Pagamento Processado                    │
│           ↓                             │
│ Estoque Reservado                       │
│           ↓                             │
│ Pedido Enviado                          │
│           ↓                             │
│ Entrega Confirmada                      │
└─────────────────────────────────────────┘
```

#### 2. Glossário de Domínio

```typescript
/**
 * GLOSSÁRIO DE DOMÍNIO - E-commerce
 * 
 * Pedido: 
 *   Agregado que representa uma solicitação de compra de um cliente.
 *   Imutável após confirmação. Pode ser cancelado apenas em estado 'pendente'.
 * 
 * Carrinho:
 *   Estado transitório do cliente. NÃO é persistido como agregado.
 *   Transformado em Pedido apenas após confirmação de compra.
 *   Diferente de Pedido!
 * 
 * Estoque:
 *   Quantidade disponível de um produto em um local específico.
 *   "Reserva" = quantidade comprometida mas não efetivamente reduzida.
 *   "Redução" = quantidade efetivamente tirada do estoque (após pagamento confirmado).
 * 
 * Envio:
 *   Processo de transportar o pedido do armazém para o cliente.
 *   Separado do conceito de "Entrega" (recebimento na mão do cliente).
 * 
 * Devolução:
 *   Processo diferente de "Cancelamento".
 *   Cancelamento = antes de sair do armazém
 *   Devolução = após cliente receber
 * 
 * Nota: O termo "Cancelamento" é AMBÍGUO. Usar:
 *   - "CancelarPedido" se antes de confirmação
 *   - "CancelarPedidoConfirmado" se após confirmação (com penalidades)
 *   - "ProcessarDevolucao" se após entrega
 */
```

#### 3. Conversas Estruturadas

```typescript
// ❌ ERRADO: Conversa vaga
Developer: "Então o pedido pode ser cancelado?"
Expert: "Sim... tipo... tem situações que sim, outras não"
Developer: Fica confuso, implementa de forma inconsistente

// ✅ CORRETO: Conversa estruturada
Developer: "Vamos definir exatamente os estados pelos quais um Pedido passa?"

Expert: "Claro. Quando criado, está em 'Pendente'. Após o cliente 
confirmar e pagar, fica 'Confirmado'. Depois que sai do estoque, 
é 'Enviado'. Ao receber, 'Entregue'."

Developer: "E quanto a cancelamento?"

Expert: "Um Pedido pode ser Cancelado se estiver em 'Pendente'. 
Se estiver em 'Confirmado' ou 'Enviado', o cliente precisa fazer 
uma Devolução em vez de Cancelamento. Pedidos em 'Entregue' 
podem ter devolução solicitada."

Developer: Implementa com precisão, testa com especialista.

// Resultado: Código reflete a realidade
class Pedido {
  cancelar(): void {
    if (this.status !== 'Pendente') {
      throw new Error(
        `Não é possível cancelar pedido em estado '${this.status}'. 
         Use ProcessarDevolucao para pedidos já entregues.`
      );
    }
    this.status = 'Cancelado';
  }

  solicitarDevolucao(): void {
    if (this.status !== 'Entregue') {
      throw new Error('Devolução só é permitida para pedidos entregues');
    }
    this.status = 'DevolucaoSolicitada';
  }
}
```

---

## 🔗 Dimensão 2: Comunicação de Sistemas

Quando múltiplos bounded contexts precisam se comunicar, devemos escolher o padrão adequado.

### 1. Síncrono com RPC/HTTP

**Quando usar**: Comunicação simples, acoplamento aceitável, resposta imediata necessária.

```typescript
// Contexto: Vendas
class CriarPedidoService {
  constructor(
    private pedidoRepository: PedidoRepository,
    private estoqueService: EstoqueRemoto  // Chamada síncrona
  ) {}

  async executar(pedido: Pedido): Promise<void> {
    // Verificar se tem estoque ANTES de confirmar
    try {
      const disponivel = await this.estoqueService.verificarDisponibilidade(
        pedido.getItens()
      );

      if (!disponivel) {
        throw new Error('Estoque insuficiente');
      }

      pedido.confirmar();
      await this.pedidoRepository.salvar(pedido);

    } catch (erro) {
      // Se estoque falhar, toda a transação falha
      throw new Error(`Falha ao criar pedido: ${erro.message}`);
    }
  }
}

// Problema: Acoplamento!
// Vendas depende de Estoque estar disponível
// Se Estoque cai, Vendas cai também
// Difícil testar isoladamente
```

### 2. Assíncrono com Events (Melhor Padrão)

**Quando usar**: Contextos independentes, eventual consistency é aceitável, resiliência.

```typescript
// Contexto: Vendas
class CriarPedidoService {
  constructor(
    private pedidoRepository: PedidoRepository,
    private eventPublisher: EventPublisher
  ) {}

  async executar(pedido: Pedido): Promise<void> {
    // Confirmar sem aguardar estoque
    // Confiamos que o estoque vai processar o evento
    pedido.confirmar();
    await this.pedidoRepository.salvar(pedido);

    // Publicar evento de forma assíncrona
    this.eventPublisher.publicar(
      new PedidoConfirmadoEvent(
        pedido.getId(),
        pedido.getItens(),
        pedido.getClienteId()
      )
    );
  }
}

// Contexto: Estoque (ouve eventos)
class ReservarEstoqueConsumer {
  constructor(
    private estoqueRepository: EstoqueRepository,
    private eventPublisher: EventPublisher
  ) {
    this.inscreverEmEventos();
  }

  private inscreverEmEventos(): void {
    this.eventSubscriber.inscreverEm(
      PedidoConfirmadoEvent,
      this.aoConfirmarPedido.bind(this)
    );
  }

  private async aoConfirmarPedido(evento: PedidoConfirmadoEvent): Promise<void> {
    try {
      // Tentar reservar estoque
      const itens = evento.getItens();
      
      for (const item of itens) {
        const estoque = await this.estoqueRepository.obter(item.produtoId);
        
        if (estoque.disponivel < item.quantidade) {
          // Se falhar, publicar evento de falha
          throw new Error(`Estoque insuficiente para ${item.produtoId}`);
        }

        estoque.reservar(item.quantidade);
        await this.estoqueRepository.salvar(estoque);
      }

      // Sucesso!
      this.eventPublisher.publicar(
        new EstoqueReservadoEvent(evento.getId())
      );

    } catch (erro) {
      // Falha na reserva
      this.eventPublisher.publicar(
        new ReservaEstoqueNegadaEvent(
          evento.getId(),
          erro.message
        )
      );
    }
  }
}

// Vantagens:
// - Vendas desacoplado de Estoque
// - Se Estoque cair, Vendas continua funcionando
// - Eventualmente consistent
// - Fácil de testar cada contexto isoladamente
```

### 3. Saga Pattern (Para Transações Distribuídas)

**Quando usar**: Múltiplos contextos precisam cooperar, precisa de rollback coordenado.

```typescript
// Saga: Fluxo de criação e confirmação de pedido
export class CriarPedidoSaga {
  constructor(
    private pedidoService: CriarPedidoService,
    private estoqueService: ReservarEstoqueService,
    private pagamentoService: ProcessarPagamentoService,
    private notificacaoService: NotificarClienteService,
    private eventPublisher: EventPublisher
  ) {}

  async executar(pedidoData: CriarPedidoDTO): Promise<void> {
    const pedidoId = pedidoData.id;
    const status = new SagaStatus(pedidoId);

    try {
      // Passo 1: Criar Pedido
      console.log('1️⃣ Criando pedido...');
      await this.pedidoService.criar(pedidoData);
      status.completarCriacao();

      // Passo 2: Reservar Estoque
      console.log('2️⃣ Reservando estoque...');
      await this.estoqueService.reservar(pedidoData.itens);
      status.completarReserva();

      // Passo 3: Processar Pagamento
      console.log('3️⃣ Processando pagamento...');
      await this.pagamentoService.processar(pedidoData.pagamento);
      status.completarPagamento();

      // Passo 4: Notificar Cliente
      console.log('4️⃣ Notificando cliente...');
      await this.notificacaoService.notificar(pedidoData.clienteEmail);
      status.completarNotificacao();

      console.log('✅ Saga completada com sucesso!');
      this.eventPublisher.publicar(
        new SagaCompletadaEvent(pedidoId)
      );

    } catch (erro) {
      console.error(`❌ Erro no passo ${status.passoAtual}: ${erro.message}`);

      // ROLLBACK: Desfazer operações na ordem reversa
      await this.executarCompensacoes(status, pedidoId);

      this.eventPublisher.publicar(
        new SagaFalhouEvent(pedidoId, erro.message)
      );
    }
  }

  private async executarCompensacoes(
    status: SagaStatus,
    pedidoId: string
  ): Promise<void> {
    console.log('🔄 Iniciando compensações...');

    // Desfazer na ordem reversa de sucesso
    if (status.notificacaoCompleta) {
      try {
        await this.notificacaoService.notificarCancelamento(pedidoId);
      } catch (e) {
        console.error('Erro ao cancelar notificação:', e);
      }
    }

    if (status.pagamentoCompleto) {
      try {
        await this.pagamentoService.reverter(pedidoId);
      } catch (e) {
        console.error('Erro ao reverter pagamento:', e);
      }
    }

    if (status.reservaCompleta) {
      try {
        await this.estoqueService.liberarReserva(pedidoId);
      } catch (e) {
        console.error('Erro ao liberar reserva:', e);
      }
    }

    if (status.criacaoCompleta) {
      try {
        await this.pedidoService.cancelar(pedidoId);
      } catch (e) {
        console.error('Erro ao cancelar pedido:', e);
      }
    }

    console.log('✅ Compensações concluídas');
  }
}

// Cenário de falha:
// 1. Pedido criado ✅
// 2. Estoque reservado ✅
// 3. Pagamento falha ❌
// → Libera estoque e cancela pedido automaticamente
```

### 4. Anti-Corruption Layer (ACL)

**Quando usar**: Integrar com sistemas legados ou externos com modelos incompatíveis.

```typescript
// Contexto: Notificação (novo sistema)
// Sistema Legado: Email Service (vocabulário diferente)

// O sistema legado usa:
interface EmailLegado {
  destinatarios: string[];  // array de strings
  assunto: string;
  corpo: string;
  tipoEnvio: number;  // 1 = urgente, 2 = normal, 3 = background
}

// Nosso domínio usa:
class NotificacaoPedido {
  constructor(
    private clienteEmail: Email,
    private numeroPedido: Id,
    private prioridade: 'urgente' | 'normal' | 'background'
  ) {}
}

// ACL: Traduz entre os dois mundos
export class EmailLegadoAdapter {
  constructor(private emailServiceLegado: EmailLegadoAPI) {}

  async enviarNotificacaoPedido(
    notificacao: NotificacaoPedido
  ): Promise<void> {
    // Traduzir nosso domínio para o domínio legado
    const emailLegado: EmailLegado = {
      destinatarios: [notificacao.getClienteEmail().get()],
      assunto: `Pedido #${notificacao.getNumeroPedido().get()} Confirmado`,
      corpo: this.construirCorpoEmail(notificacao),
      tipoEnvio: this.traduzirPrioridade(notificacao.getPrioridade())
    };

    // Chamar o sistema legado através do adapter
    await this.emailServiceLegado.enviar(emailLegado);
  }

  private traduzirPrioridade(
    prioridade: 'urgente' | 'normal' | 'background'
  ): number {
    // Converter nossa linguagem para a do sistema legado
    const mapa = {
      'urgente': 1,
      'normal': 2,
      'background': 3
    };
    return mapa[prioridade];
  }

  private construirCorpoEmail(notificacao: NotificacaoPedido): string {
    return `
      Seu pedido foi confirmado!
      Número: ${notificacao.getNumeroPedido().get()}
    `;
  }
}

// Vantagem: O domínio fica limpo, isolado da sujeira do sistema legado
```

---

## Context Mapping: Visualizando a Comunicação

```plaintext
Context Map de um E-commerce:

┌─────────────────────────────────────────────────────────────────┐
│                        VENDAS (Core Domain)                     │
│  Responsável por: Criar pedidos, gerenciar carrinho            │
│  Publica: PedidoConfirmado, ClienteRegistrado                  │
│  Escuta: PagamentoProcessado, EstoqueReservado                 │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (Assíncrono)
         ┌────────────────────┴────────────────────┐
         ↓                                         ↓
    ┌─────────────┐                         ┌──────────────┐
    │  ESTOQUE    │                         │  PAGAMENTO   │
    │  (Generic)  │                         │  (Generic)   │
    └─────────────┘                         └──────────────┘
    Publica:                                Publica:
    - EstoqueReservado                      - PagamentoProcessado
    - EstoqueInsuficiente                   - PagamentoNegado
    - ProdutoAdicionado                     - ReembolsoProcessado

┌─────────────────────────────────────────────────────────────────┐
│                    NOTIFICAÇÃO (Supporting)                      │
│  Ouve eventos de outros contextos                               │
│  Independente - não afeta fluxo crítico                         │
└─────────────────────────────────────────────────────────────────┘
    ↑ (Escuta vários eventos)
    ├── PedidoConfirmado
    ├── PagamentoProcessado
    ├── EstoqueReservado
    └── EntregaConfirmada

Relacionamentos:
- VENDAS → ESTOQUE: Publicação/Subscrição
- VENDAS → PAGAMENTO: Publicação/Subscrição
- ESTOQUE → NOTIFICAÇÃO: Publicação/Subscrição (Loose coupling)
```

---

## Padrões de Comunicação Comparados

```typescript
// Padrão 1: REQUEST-REPLY (Acoplado)
// Vendas espera resposta do Estoque
interface EstoqueServiceSync {
  verificarDisponibilidade(itens: ItemPedido[]): Promise<boolean>;
}
// ❌ Problemas: Acoplamento, falha em cascata, transação distribuída

// ─────────────────────────────────────────────

// Padrão 2: PUBLISH-SUBSCRIBE (Desacoplado)
// Vendas publica evento, Estoque escuta
interface EventPublisher {
  publicar(evento: DomainEvent): Promise<void>;
}

interface EventSubscriber {
  inscreverEm(tipoEvento: Type, handler: Function): void;
}
// ✅ Vantagens: Desacoplado, resiliente, escalável
// ⚠️ Eventual consistency

// ─────────────────────────────────────────────

// Padrão 3: SAGA (Coordenação de Múltiplos Contextos)
// Orquestrador coordena fluxo entre contextos
class CriarPedidoSaga {
  async executar(pedido): Promise<void> {
    await this.criar(pedido);
    await this.reservar(pedido);
    await this.pagar(pedido);
    // Se qualquer etapa falha, todas são revertidas
  }
}
// ✅ Garante consistência entre múltiplos contextos
// ⚠️ Complexidade, timeout handling
```

---

## Consistência vs Acoplamento: O Trade-off

```typescript
// CENÁRIO: Criar pedido com estoque garantido

// ❌ Opção 1: Consistência Imediata (Acoplado)
async criarPedido(pedido: Pedido): Promise<void> {
  // Dentro da mesma transação
  await db.transaction(async () => {
    pedido.confirmar();
    await pedidoRepository.salvar(pedido);
    
    // Espera confirmação do estoque
    const disponivel = await estoqueService.reservar(pedido.getItens());
    if (!disponivel) {
      throw new Error('Estoque insuficiente');
    }
  });
}
// ✅ Garantido: Se retorna sucesso, estoque foi reservado
// ❌ Ruim: Vendas acoplado a Estoque; Falha de Estoque afeta Vendas

// ─────────────────────────────────────────────

// ✅ Opção 2: Eventual Consistency (Desacoplado) - RECOMENDADO
async criarPedido(pedido: Pedido): Promise<void> {
  pedido.confirmar();
  await pedidoRepository.salvar(pedido);
  
  // Publicar evento, não aguarda resposta
  await eventPublisher.publicar(
    new PedidoConfirmadoEvent(pedido.getId())
  );
  
  // Retorna imediatamente
}

// Em paralelo, estoque processa:
async aoConfirmarPedido(evento: PedidoConfirmadoEvent): Promise<void> {
  try {
    await estoqueRepository.reservar(evento.getItens());
    await eventPublisher.publicar(new EstoqueReservadoEvent(evento.getId()));
  } catch (erro) {
    // Se falhar, publica evento negativo
    await eventPublisher.publicar(new ReservaNegaraEvent(evento.getId()));
  }
}

// UI/Cliente verifica status do pedido:
// - Imediatamente: "Pedido criado, aguardando confirmação de estoque"
// - Após 2-5s: "Estoque reservado, pedido confirmado"
// - Ou: "Falha ao reservar estoque, pedido cancelado"

// ✅ Bom: Desacoplado, resiliente, melhor UX
// ⚠️ Trade-off: Eventual consistency
```

---

## Testando Comunicação Entre Contextos

```typescript
describe('Comunicação: Vendas → Estoque', () => {
  
  // Teste 1: Publicação de evento
  it('deve publicar PedidoConfirmadoEvent ao confirmar pedido', async () => {
    const spy = jest.spyOn(eventPublisher, 'publicar');
    
    const pedido = Pedido.criar(clienteId);
    pedido.adicionarItem(produtoId, 2, preco);
    pedido.confirmar();
    
    await service.salvar(pedido);
    
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'PedidoConfirmadoEvent',
        pedidoId: pedido.getId()
      })
    );
  });

  // Teste 2: Handler responde corretamente
  it('deve reservar estoque quando recebe PedidoConfirmadoEvent', async () => {
    const evento = new PedidoConfirmadoEvent(
      pedidoId,
      [new ItemPedido(produtoId, 2)]
    );
    
    await estoqueHandler.aoConfirmarPedido(evento);
    
    const estoque = await estoqueRepository.obter(produtoId);
    expect(estoque.getReservado()).toBe(2);
  });

  // Teste 3: Tratamento de falha
  it('deve publicar ReservaNegaraEvent se estoque insuficiente', async () => {
    const spy = jest.spyOn(eventPublisher, 'publicar');
    
    const evento = new PedidoConfirmadoEvent(
      pedidoId,
      [new ItemPedido(produtoId, 999)] // Quantidade indisponível
    );
    
    await estoqueHandler.aoConfirmarPedido(evento);
    
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ReservaNegaraEvent'
      })
    );
  });

  // Teste 4: Integração end-to-end
  it('fluxo completo: Pedido → Evento → Estoque Reservado', async () => {
    // 1. Criar e confirmar pedido
    const pedido = Pedido.criar(clienteId);
    pedido.adicionarItem(produtoId, 2, preco);
    pedido.confirmar();
    await pedidoService.salvar(pedido);

    // 2. Simular processamento de evento
    const eventos = await eventStore.obterNaoProcessados();
    for (const evento of eventos) {
      await estoqueHandler.processar(evento);
    }

    // 3. Verificar estoque foi reservado
    const estoque = await estoqueRepository.obter(produtoId);
    expect(estoque.getReservado()).toBe(2);
    expect(estoque.getDisponivel()).toBe(
      estoque.getTotal() - 2
    );
  });
});
```

---

## Armadilhas Comuns de Comunicação

```typescript
// ❌ Armadilha 1: Event Explosion
// Publicar eventos demais prejudica a legibilidade

class Pedido {
  mudarStatus(novoStatus: string): void {
    // NÃO FAÇA ISSO:
    this.eventos.publicar(new PedidoStatusMudouEvent()); // Muito genérico
    this.eventos.publicar(new ArquivoInternoBatalhaAtualizadoEvent()); // Interno
    this.eventos.publicar(new CodigoDeAuditoriaCriadoEvent()); // Técnico
  }

  // FAÇA ISTO:
  confirmar(): void {
    // Apenas eventos de negócio importantes
    this.eventos.publicar(new PedidoConfirmadoEvent());
  }
}

// ─────────────────────────────────────────────

// ❌ Armadilha 2: Eventos com Dados Desnecessários
class ClienteCriadoEvent {
  constructor(
    cliente: Cliente // NÃO: Enviar objeto inteiro
  ) {}
}

// CORRETO: Enviar apenas o essencial
class ClienteCriadoEvent {
  constructor(
    private readonly clienteId: Id,
    private readonly email: Email,
    private readonly nome: string
  ) {}
}

// ─────────────────────────────────────────────

// ❌ Armadilha 3: Circular Dependencies
// Pedido → publica PedidoConfirmado
// Notificacao → ouve PedidoConfirmado → publica NotificacaoEnviada
// Pedido → ouve NotificacaoEnviada → ??? Cacoete do design

// CORRETO: Deixar eventos fluirem em uma direção
// Pedido → PedidoConfirmado → Notificacao → NotificacaoEnviada
// (FIM - Pedido não precisa ouvir notificação)

// ─────────────────────────────────────────────

// ❌ Armadilha 4: Leaky Abstractions
class VendasContextAPI {
  async criar(pedidoData: any): Promise<any> {
    // Expõe eventos internos para o cliente HTTP
    return {
      pedidoId: pedido.getId(),
      eventos: pedido.obterEventos() // ❌ Interno vazando
    };
  }
}

// CORRETO: Eventos são internos, não expor via API
class VendasContextAPI {
  async criar(pedidoData: any): Promise<any> {
    // Apenas retorna o agregado ou ID
    return {
      pedidoId: pedido.getId(),
      status: pedido.getStatus()
    };
  }
}

// ─────────────────────────────────────────────

// ❌ Armadilha 5: Assumir entrega garantida de eventos
try {
  await eventPublisher.publicar(evento);
  // Pedido confirmado! Cliente já pode ver...
} catch (erro) {
  // E agora? Pedido foi criado mas evento não foi publicado
}

// CORRETO: Garantir entrega (com retry, DLQ, etc)
class EventPublisherRobusto implements EventPublisher {
  async publicar(evento: DomainEvent, tentativas: number = 3): Promise<void> {
    for (let i = 0; i < tentativas; i++) {
      try {
        await this.messageQueue.enviar(evento);
        return;
      } catch (erro) {
        if (i === tentativas - 1) {
          // Salvar em Dead Letter Queue para análise
          await this.deadLetterQueue.salvar(evento);
          throw new Error(`Falha ao publicar evento após ${tentativas} tentativas`);
        }
      }
    }
  }
}
```

---

## Comunicação em Grande Escala: Organização de Times

DDD também trata da comunicação entre times. A estrutura dos times deve refletir a estrutura do sistema.

```typescript
/**
 * Lei de Conway:
 * "Estruturas de sistemas refletem as estruturas de comunicação dos times
 * que as produzem."
 * 
 * Implicação: Se times não comunicam bem, o sistema fica desacoplado
 */

// ORGANIZAÇÃO RUIM: Times por tecnologia
// ─────────────────────────────────────
// Team Frontend:  Componentes React, Redux
// Team Backend:   APIs, Banco de Dados
// Team Infra:     DevOps, Kubernetes
//
// Resultado: Comunicação lenta (meetings), sistemas desacoplados,
// ninguém se responsabiliza pelo produto final

// ─────────────────────────────────────

// ORGANIZAÇÃO BOA: Times por Bounded Context (Feature Teams)
// ─────────────────────────────────────
// Team Vendas:         Pedido, Carrinho, Confirmação
//   → Backend: APIs de pedido
//   → Frontend: Interface de carrinho
//   → Infra: Deploy do contexto Vendas
//
// Team Estoque:        Produtos, Disponibilidade, Reservas
//   → Backend: APIs de estoque
//   → Frontend: Painel de estoque
//   → Infra: Deploy do contexto Estoque
//
// Team Notificação:    Emails, SMS, Push
//   → Backend: Processadores de eventos
//   → Frontend: Centro de notificações
//
// Resultado: Times autônomos, comunicação clara via eventos,
// responsabilidade clara, product teams

class TimeVendas {
  /**
   * Comunica com outros times através de:
   * - Eventos publicados: PedidoConfirmado, PedidoCancelado
   * - Eventos ouvidos: PagamentoProcessado, EstoqueReservado
   * - Sem chamadas diretas!
   */
}

class TimeEstoque {
  /**
   * Comunica com outros times através de:
   * - Eventos publicados: EstoqueReservado, EstoqueInsuficiente
   * - Eventos ouvidos: PedidoConfirmado
   * - Sem chamadas diretas!
   */
}
```

---

## Padrões de Comunicação Implementados

### Pattern 1: Outbox Pattern (Garantir Consistência)

```typescript
/**
 * Problema: Salvar agregado e publicar evento em duas operações
 * risco de falhar entre elas
 * 
 * Solução: Usar Outbox Pattern
 * 1. Salvar agregado + evento na mesma transação
 * 2. Processar Outbox de forma assíncrona
 */

export class PedidoRepository implements IPedidoRepository {
  constructor(
    private db: Database,
    private outboxRepository: OutboxRepository
  ) {}

  async salvar(pedido: Pedido): Promise<void> {
    // Tudo na mesma transação
    await this.db.transaction(async (trx) => {
      // 1. Salvar agregado
      await trx.insert('pedidos').values({
        id: pedido.getId().get(),
        clienteId: pedido.getClienteId().get(),
        status: pedido.getStatus(),
        total: pedido.calcularTotal().get()
      });

      // 2. Salvar eventos no outbox (MESMA TRANSAÇÃO)
      const eventos = pedido.obterEventosNaoPublicados();
      for (const evento of eventos) {
        await this.outboxRepository.salvar(evento, trx);
      }

      // Se chegou aqui, ambos foram salvos
      // Se falhar, ambos são revertidos
    });
  }
}

// Processador de Outbox (roda periodicamente)
export class ProcessadorOutbox {
  constructor(
    private outboxRepository: OutboxRepository,
    private eventPublisher: EventPublisher
  ) {}

  async processar(): Promise<void> {
    const eventosNaoPublicados = 
      await this.outboxRepository.obterNaoPublicados();

    for (const entrada of eventosNaoPublicados) {
      try {
        // Publicar evento
        await this.eventPublisher.publicar(entrada.evento);

        // Marcar como publicado
        await this.outboxRepository.marcarComoPublicado(entrada.id);

      } catch (erro) {
        console.error(`Erro ao publicar ${entrada.id}:`, erro);
        // Continua tentando na próxima execução
      }
    }
  }
}

// Execução periódica (a cada 5 segundos)
setInterval(
  () => processadorOutbox.processar(),
  5000
);

// Vantagem: Se evento falha, fica na outbox e é retentado
// Nunca perde eventos
```

### Pattern 2: Inbox Pattern (Idempotência)

```typescript
/**
 * Problema: Receber o mesmo evento múltiplas vezes
 * (retry automático, redelivery de fila)
 * 
 * Solução: Inbox Pattern - processar evento apenas uma vez
 */

export class ReservarEstoqueHandler {
  constructor(
    private estoqueRepository: EstoqueRepository,
    private inboxRepository: InboxRepository,
    private eventPublisher: EventPublisher
  ) {}

  async aoConfirmarPedido(evento: PedidoConfirmadoEvent): Promise<void> {
    const eventoId = evento.getId();

    // 1. Verificar se já processou este evento
    const jaProcessado = 
      await this.inboxRepository.obter(eventoId);

    if (jaProcessado) {
      console.log(`Evento ${eventoId} já foi processado, ignorando`);
      return; // Idempotência garantida
    }

    try {
      // 2. Processar evento
      const itens = evento.getItens();
      for (const item of itens) {
        const estoque = await this.estoqueRepository.obter(item.produtoId);
        estoque.reservar(item.quantidade);
        await this.estoqueRepository.salvar(estoque);
      }

      // 3. Registrar no inbox
      await this.inboxRepository.registrar(eventoId);

      // 4. Publicar evento de sucesso
      await this.eventPublisher.publicar(
        new EstoqueReservadoEvent(evento.getPedidoId())
      );

    } catch (erro) {
      console.error(`Erro ao processar ${eventoId}:`, erro);
      // Não registra no inbox, será retentado
      throw erro;
    }
  }
}

// Resultado: Mesmo que receba evento 10x, processa apenas 1x
// Sistema é resiliente a duplicatas
```

### Pattern 3: Dead Letter Queue (DLQ)

```typescript
/**
 * Problema: Evento falha sempre (ex: dado inválido, bug)
 * Fica em retry infinito, pollui logs
 * 
 * Solução: Dead Letter Queue - mover para fila de análise
 */

export class EventConsumerRobusto {
  private readonly MAX_TENTATIVAS = 3;
  private readonly TEMPO_ESPERA_MS = 5000;

  constructor(
    private handler: EventHandler,
    private dlqRepository: DLQRepository
  ) {}

  async processar(evento: DomainEvent, tentativa: number = 0): Promise<void> {
    try {
      // Tentar processar
      await this.handler.processar(evento);

    } catch (erro) {
      if (tentativa < this.MAX_TENTATIVAS) {
        // Retry com backoff exponencial
        const delayMs = this.TEMPO_ESPERA_MS * Math.pow(2, tentativa);
        console.log(
          `Tentativa ${tentativa + 1}/${this.MAX_TENTATIVAS} em ${delayMs}ms`
        );

        await this.aguardar(delayMs);
        return this.processar(evento, tentativa + 1);

      } else {
        // Máximo de tentativas atingido
        console.error(
          `Evento ${evento.getId()} falhou após ${this.MAX_TENTATIVAS} tentativas`
        );

        // Salvar na DLQ para análise manual
        await this.dlqRepository.salvar({
          evento,
          erro: erro.message,
          stackTrace: erro.stack,
          salvoEm: new Date()
        });

        // Alertar ops
        await this.notificarOps(evento, erro);
      }
    }
  }

  private aguardar(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async notificarOps(evento: DomainEvent, erro: Error): Promise<void> {
    console.error(
      `⚠️ ALERTA: Evento ${evento.getId()} movido para DLQ\n` +
      `Erro: ${erro.message}`
    );
    // Enviar para Slack, PagerDuty, etc
  }
}
```

---

## Comunicação Síncrona vs Assíncrona: Quando Usar

```typescript
// COMUNICAÇÃO SÍNCRONA (Acoplada, Imediata)
// ─────────────────────────────────────────
interface EstoqueServiceSync {
  verificarDisponibilidade(itens: ItemPedido[]): Promise<boolean>;
}

// Quando usar:
// ✅ Validações que não podem falhar (exemplo: validar email)
// ✅ Operações que precisam de resposta imediata
// ✅ Contextos altamente relacionados

// Quando EVITAR:
// ❌ Operações que podem levar tempo (foto, processamento)
// ❌ Contextos independentes (Vendas e Notificação)
// ❌ Quando falha de uma afeta a outra

async criarPedidoComSincrono(pedido: Pedido): Promise<void> {
  // Validar email do cliente - OK síncrono
  const clienteValido = await clienteService.validarEmail(pedido.email);
  
  if (!clienteValido) {
    throw new Error('Email inválido');
  }

  // ✅ Sincronismo: Vendas espera resposta de Clientes
  // Ok porque: Rápido, essencial para criar pedido
}

// ─────────────────────────────────────────────

// COMUNICAÇÃO ASSÍNCRONA (Desacoplada, Eventual)
// ─────────────────────────────────────────────
interface EventPublisher {
  publicar(evento: DomainEvent): Promise<void>;
}

// Quando usar:
// ✅ Operações que podem levar tempo
// ✅ Contextos independentes
// ✅ Quando falha não deve impedir fluxo principal

// Quando EVITAR:
// ❌ Quando precisa de resposta imediata do contexto remoto
// ❌ Quando precisa de atomicidade (2-phase commit)
// ❌ Quando não pode tolerar eventual consistency

async criarPedidoComAssíncrono(pedido: Pedido): Promise<void> {
  pedido.confirmar();
  await pedidoRepository.salvar(pedido);

  // ✅ Assincronia: Notificação é disparada mas não aguardada
  // Ok porque: Enviar email pode levar tempo, pedido já está criado
  await eventPublisher.publicar(new PedidoConfirmadoEvent(pedido));

  // Retorna imediatamente
}

// ─────────────────────────────────────────────

// COMUNICAÇÃO HÍBRIDA (O melhor dos dois mundos)
// ─────────────────────────────────────────────

async criarPedidoHíbrido(pedidoData: CriarPedidoDTO): Promise<{ pedidoId: Id }> {
  // 1. Validar sincrono (rápido, essencial)
  await this.validarCliente(pedidoData.clienteId);
  await this.validarProdutos(pedidoData.itens);

  // 2. Criar e confirmar (localmente)
  const pedido = Pedido.criar(pedidoData.clienteId);
  pedidoData.itens.forEach(item => {
    pedido.adicionarItem(item.produtoId, item.quantidade, item.preco);
  });
  pedido.confirmar();

  // 3. Salvar (transação local)
  await pedidoRepository.salvar(pedido);

  // 4. Disparar eventos (assíncrono, não aguardar)
  setImmediate(() => {
    this.eventPublisher.publicar(new PedidoConfirmadoEvent(pedido));
  });

  // 5. Retornar ao cliente
  return { pedidoId: pedido.getId() };
}

// Timeline:
// T=0ms: Cliente recebe resposta "Pedido criado"
// T=5ms: Evento é publicado para Estoque
// T=10ms: Estoque processa e reserva
// T=15ms: Evento de sucesso é publicado
// T=20ms: Notificação envia email

// Cliente nunca espera mais que alguns milissegundos
```

---

## Anti-Patterns de Comunicação: O Que NÃO Fazer

```typescript
// ❌ ANTI-PADRÃO 1: Orquestração Centralizada (Objeto Deus)

class OrquestradorGigante {
  async criarPedido(pedidoData: any): Promise<void> {
    // Conhece TUDO sobre todo contexto
    const cliente = await this.clienteService.obter(pedidoData.clienteId);
    const itens = await this.produtoService.obterDetalhes(pedidoData.itens);
    const estoque = await this.estoqueService.verificar(itens);
    const pagamento = await this.pagamentoService.processar(pedidoData.pagamento);
    const notificacao = await this.notificacaoService.enviar(cliente.email);
    // ... 20 linhas mais de lógica cruzada
  }
}

// Problemas:
// - Gigante, impossível testar
// - Se um contexto muda, quebra
// - Acoplamento total
// - Violação de SRP (Single Responsibility Principle)

// ─────────────────────────────────────────────

// ✅ CORRETO: Coreografia com Events

// Vendas publica:
class CriarPedidoService {
  async criar(pedidoData: any): Promise<void> {
    const pedido = Pedido.criar(pedidoData.clienteId);
    pedido.confirmar();
    await pedidoRepository.salvar(pedido);
    await eventPublisher.publicar(new PedidoConfirmadoEvent(pedido));
    // Pronto, responsabilidade dele termina aqui
  }
}

// Cada contexto ouve e age independentemente:
class EstoqueHandler {
  async aoConfirmarPedido(evento: PedidoConfirmadoEvent): Promise<void> {
    await estoqueService.reservar(evento.getItens());
  }
}

class NotificacaoHandler {
  async aoConfirmarPedido(evento: PedidoConfirmadoEvent): Promise<void> {
    await notificacaoService.enviarConfirmacao(evento);
  }
}

// ─────────────────────────────────────────────

// ❌ ANTI-PADRÃO 2: Compartilhar o Mesmo Banco

// Database compartilhado por todos os contextos
const db = {
  pedidos: /* tabela */,
  produtos: /* tabela */,
  estoque: /* tabela */,
  pagamentos: /* tabela */
};

// Problemas:
// - Contextos acoplados via schema
// - Mudança em uma tabela afeta todos
// - Impossível evoluir contextos independentemente
// - Alguém sempre faz query "errada"

// ─────────────────────────────────────────────

// ✅ CORRETO: Banco por Bounded Context

// Contexto Vendas
const vendas_db = {
  pedidos: /* schema de Vendas */,
  itens_pedido: /* schema de Vendas */
};

// Contexto Estoque
const estoque_db = {
  produtos: /* schema de Estoque */,
  localizacoes: /* schema de Estoque */
};

// Comunicação via eventos, não via queries compartilhadas

// ─────────────────────────────────────────────

// ❌ ANTI-PADRÃO 3: Eventos com Referências Circulares

class EventCircular {
  constructor(
    private pedido: Pedido,           // Referência bidirecional
    private cliente: Cliente,
    private itens: ItemPedido[],
    private estoque: EstoqueAgregado  // Acoplamento!
  ) {}
}

// Problemas:
// - Evento viaja pela rede com referências
// - Contexto remoto não consegue deserializar
// - Tudo fica acoplado

// ─────────────────────────────────────────────

// ✅ CORRETO: Eventos apenas com IDs e dados essenciais

class PedidoConfirmadoEvent extends DomainEvent {
  constructor(
    private readonly pedidoId: Id,
    private readonly clienteId: Id,
    private readonly itens: Array<{ produtoId: Id; quantidade: number }>
  ) {
    super(pedidoId);
  }

  // Apenas dados primitivos e IDs, não referências
}

// ─────────────────────────────────────────────

// ❌ ANTI-PADRÃO 4: Ignorar Falhas

async processar(evento: DomainEvent): Promise<void> {
  try {
    await handler.processar(evento);
  } catch (erro) {
    // Silenciosamente falha!
    console.log('erro, pulando evento...');
    // Evento perdido para sempre
  }
}

// ─────────────────────────────────────────────

// ✅ CORRETO: Tratar falhas explicitamente

async processar(evento: DomainEvent, tentativa: number = 0): Promise<void> {
  try {
    await handler.processar(evento);
  } catch (erro) {
    if (tentativa < MAX_TENTATIVAS) {
      // Retentar com backoff
      await this.retry(evento, tentativa + 1);
    } else {
      // Mover para DLQ
      await this.dlq.salvar({ evento, erro });
    }
  }
}
```

---

## Evoluindo a Comunicação: Roadmap

```plaintext
Fase 1: Monolito Inicial (Comunicação Acoplada)
├─ Tudo em um banco
├─ Chamadas diretas de função
├─ Fácil de começo, difícil depois
└─ Ok enquanto time é pequeno

↓

Fase 2: Monolito Modular (Eventos Internos)
├─ Separar logicamente em bounded contexts
├─ Usar pub/sub interno (em-memória)
├─ Ainda um processo, um banco
├─ Primeira experiência com DDD
└─ Comunicação mais desacoplada

↓

Fase 3: Monolito com Múltiplos Bancos
├─ Um banco por bounded context
├─ Eventos pub/sub (ainda em-memória)
├─ Transações locais (não distribuídas)
├─ Eventual consistency aceitável
└─ Pronto para microsserviços

↓

Fase 4: Microsserviços com Message Queue
├─ Cada contexto = serviço independente
├─ Fila de mensagens (RabbitMQ, Kafka)
├─ Eventos persistidos
├─ Idempotência crítica
├─ Dead Letter Queues para falhas
└─ Escalabilidade e resiliência

↓

Fase 5: Arquitetura Distribuída Avançada
├─ CQRS para read/write separation
├─ Event Sourcing para auditoria
├─ Saga Pattern para transações
├─ Circuit Breakers para resiliência
└─ Observabilidade e tracing distribuído
```

---

## Checklist: Comunicação Eficiente em DDD

```typescript
// Antes de comunicar entre contextos, pergunte-se:

const ComunicacaoEficienteChecklist = {
  linguagemUbiqua: {
    pergunta: "Existe linguagem ubíqua clara entre os times?",
    verificar: [
      "□ Glossário documentado",
      "□ Termos consistentes em código",
      "□ Especialista de negócio entende o código",
      "□ Desenvolvedores entendem o negócio"
    ]
  },

  contextosBemDefinidos: {
    pergunta: "Bounded contexts estão bem definidos?",
    verificar: [
      "□ Cada contexto tem responsabilidade clara",
      "□ Não há sobreposição de responsabilidades",
      "□ Interfaces entre contextos são explícitas",
      "□ Context Map documentado"
    ]
  },

  eventosDominios: {
    pergunta: "Eventos representam fatos de negócio?",
    verificar: [
      "□ Nomes em verbo passado (PedidoConfirmado, não ConfirmarPedido)",
      "□ Imutáveis após criação",
      "□ Contêm apenas dados essenciais",
      "□ Sem referências circulares"
    ]
  },

  acoplamento: {
    pergunta: "O acoplamento entre contextos é mínimo?",
    verificar: [
      "□ Contextos não compartilham bancos",
      "□ Comunicação via eventos, não RPC direto",
      "□ Sem transações distribuídas críticas",
      "□ Um contexto pode falhar sem derrubar outro"
    ]
  },

  resiliencia: {
    pergunta: "Sistema é resiliente a falhas?",
    verificar: [
      "□ Eventos têm retry logic",
      "□ Existe Dead Letter Queue",
      "□ Idempotência garantida",
      "□ Logging e alertas em lugar"
    ]
  },

  testabilidade: {
    pergunta: "Comunicação é testável?",
    verificar: [
      "□ Cada contexto pode ser testado isoladamente",
      "□ Mocks de eventos funcionam",
      "□ Testes de integração com evento real",
      "□ Cenários de falha são testados"
    ]
  },

  monitoramento: {
    pergunta: "Existe visibilidade na comunicação?",
    verificar: [
      "□ Tracing distribuído ativo",
      "□ Métricas de latência de eventos",
      "□ Alertas para eventos não processados",
      "□ Dashboard de fluxo de eventos"
    ]
  }
};

// Passar em todos? Comunicação eficiente! 🎉
```

---

## Conclusão: Por Que Comunicação Importa em DDD

Comunicação eficiente em DDD não é apenas sobre tecnologia. É sobre:

1. **Alinhamento**: Desenvolvedores e negócio falando a mesma língua
2. **Evoluibilidade**: Sistema cresce sem quebra constante
3. **Autonomia**: Times podem trabalhar independentemente
4. **Resiliência**: Falha em um contexto não derruba tudo
5. **Clareza**: Código reflete intenção de negócio

Uma arquitetura bem comunicada é uma arquitetura que prospera.

---

## Referências Finais

- **Livro**: "Building Microservices" - Sam Newman (comunicação entre serviços)
- **Padrão**: Event Sourcing + CQRS (comunicação com histórico)
- **Padrão**: Saga Pattern (transações distribuídas)
- **Ferramenta**: Apache Kafka (event streaming robusto)
- **Ferramenta**: RabbitMQ (message broker confiável)
