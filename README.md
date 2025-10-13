<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->

<p align="center">
  <img alt="Logo - Rocketseat" src="./.github/assets/logo_ftr.png" width="225px" />
</p>

# Arquitetura de Software

## Índice

- [Arquitetura de Software](#arquitetura-de-software)
  - [Índice](#índice)
  - [Sobre](#sobre)
  - [Conteúdo](#conteúdo)
    - [Introdução](#introdução)
    - [Conceitos Fundamentais](#conceitos-fundamentais)
    - [Arquitetura de Domínio](#arquitetura-de-domínio)
      - [Isolando o Domínio com Arquitetura em Camadas](#isolando-o-domínio-com-arquitetura-em-camadas)
      - [Isolando o Domínio com Arquitetura Hexagonal](#isolando-o-domínio-com-arquitetura-hexagonal)
    - [Entidades e Objetos e Objetos de Valor](#entidades-e-objetos-e-objetos-de-valor)
    - [Agregados](#agregados)
    - [Repositório e Serviços](#repositório-e-serviços)
    - [Integração e Aplicação](#integração-e-aplicação)
    - [Conceitos Avançados](#conceitos-avançados)

## Sobre

Repositório pessoal de registro, referência e suporte para fins de aprendizado, consulta e acompanhamento do curso de **Arquitetura de Software** (Níível 2), Fase 2 (**Estratégia e Inovação**), do curso de Pós-Graduação *Tech Developer 360*, desenvolvido pela Faculdade de Tecnologia Rocketseat (FTR).

## Conteúdo

### Introdução

**Domain-Driven Design (DDD)** é uma abordagem de desenvolvimento de software proposta por Eric Evans que foca em colocar o **domínio do negócio** no centro do processo de modelagem e implementação. Em vez de priorizar apenas aspectos técnicos, o DDD busca compreender profundamente as regras, processos e linguagem do domínio para construir sistemas mais expressivos, coesos e alinhados às necessidades reais da organização. Ele promove uma colaboração constante entre desenvolvedores e especialistas do negócio, incentivando o uso de uma **linguagem ubíqua** e a divisão do sistema em **contextos delimitados (bounded contexts)**, o que facilita a manutenção, evolução e escalabilidade de soluções complexas.

- [Domain-Driven Design (DDD): Uma Introdução Completa](./.github/docs/content/1_introduction.md)

### Conceitos Fundamentais

Em **Domain-Driven Design (DDD)**, a **comunicação eficiente** é essencial para alinhar desenvolvedores e especialistas do domínio, garantindo que o modelo de software reflita com precisão a realidade do negócio. Esse alinhamento é viabilizado pela **Linguagem Ubíqua**, um vocabulário comum e rigorosamente compartilhado entre todos os envolvidos no projeto, usado tanto na conversa quanto no código, evitando ambiguidades e interpretações inconsistentes. Já o **Domínio** representa o núcleo do conhecimento e da lógica de negócio que o sistema busca resolver; compreender e modelar corretamente esse domínio é o ponto central do DDD, pois dele derivam as entidades, regras e processos que estruturam toda a aplicação.

- [Comunicação Eficiente em DDD: Um Pilar Essencial](./.github/docs/content/2_communication.md)
- [O Domínio em Domain-Driven Design: Um Aprofundamento Completo](./.github/docs/content/3_domain.md)

### Arquitetura de Domínio

#### Isolando o Domínio com Arquitetura em Camadas

A **Arquitetura em Camadas** é uma das formas mais tradicionais de estruturar aplicações para isolar o domínio. Nessa abordagem, o sistema é dividido em níveis hierárquicos, geralmente compostos por camadas como **apresentação**, **aplicação**, **domínio** e **infraestrutura**. O principal objetivo é garantir que o **coração da aplicação**, representado pela camada de domínio, permaneça independente de detalhes técnicos, frameworks ou bancos de dados. Assim, as regras de negócio são encapsuladas em entidades, agregados e serviços de domínio, enquanto as outras camadas lidam com aspectos externos, como comunicação com APIs, persistência de dados e interface do usuário. Essa separação reduz o acoplamento e facilita testes, manutenção e evolução do código ao longo do tempo.

#### Isolando o Domínio com Arquitetura Hexagonal

A **Arquitetura Hexagonal**, também conhecida como **Ports and Adapters**, expande o conceito de isolamento do domínio ao eliminar a dependência de camadas rígidas e propor um modelo baseado em **interfaces de comunicação**. O domínio torna-se o núcleo da aplicação, cercado por portas (ports) que definem como ele se comunica com o mundo externo, e adaptadores (adapters) que implementam essas interfaces para tecnologias específicas, como bancos de dados, filas de mensagens ou APIs. Essa estrutura permite que o domínio funcione de forma completamente independente de infraestrutura, possibilitando a substituição de componentes externos sem alterar a lógica central. O resultado é um sistema mais flexível, testável e resiliente a mudanças tecnológicas, mantendo o foco no comportamento e nas regras do negócio.

### Entidades e Objetos e Objetos de Valor

As **Entidades** são elementos fundamentais no **Domain-Driven Design (DDD)** e representam objetos do domínio que possuem uma **identidade única e persistente** ao longo do tempo. Essa identidade não depende de seus atributos, mas sim de um identificador exclusivo, como um ID, que permanece o mesmo mesmo que suas propriedades mudem. Por exemplo, um “Cliente” pode alterar seu endereço ou telefone, mas continua sendo o mesmo cliente para o sistema. Entidades são responsáveis por manter o estado e o comportamento relacionado a um conceito central do domínio, garantindo a integridade das regras de negócio e a coerência dos dados. Sua correta modelagem é essencial para que o domínio reflita com precisão as realidades e restrições do negócio.

Os **Objetos de Valor** (Value Objects) são componentes que representam conceitos do domínio definidos **somente por seus atributos**, sem uma identidade própria. Eles são **imutáveis** e **substituíveis por completo** quando algum de seus valores muda. Um exemplo comum é um “Endereço”, que pode ser trocado inteiramente sem que isso altere a identidade do cliente associado. Objetos de Valor ajudam a tornar o código mais expressivo e seguro, encapsulando comportamentos e validações específicos — como formatação de dados, comparações e regras de consistência — de forma coesa. Além disso, ao eliminar a necessidade de gerenciamento de identidade, esses objetos simplificam o modelo do domínio e promovem uma lógica mais clara e funcional.

### Agregados

Os **Agregados** são estruturas fundamentais no **Domain-Driven Design (DDD)** que agrupam **entidades e objetos de valor** logicamente relacionados e que precisam ser tratados como uma **única unidade de consistência**. Cada agregado possui uma **entidade raiz (Aggregate Root)**, responsável por controlar o acesso e garantir a integridade das regras de negócio dentro de seus limites. Essa organização evita inconsistências e facilita a manutenção da coerência do domínio, especialmente em sistemas complexos. Por exemplo, em um contexto de pedidos, o “Pedido” pode ser o agregado raiz que engloba itens, valores e informações de pagamento, garantindo que qualquer modificação ocorra de forma controlada e consistente. Dessa forma, os agregados contribuem para a clareza do modelo, o isolamento de responsabilidades e a simplificação das transações dentro do domínio.

### Repositório e Serviços

No **Domain-Driven Design (DDD)**, os **Repositórios** representam um mecanismo essencial para o gerenciamento e recuperação de agregados e entidades do domínio. Eles atuam como uma **camada de abstração entre o domínio e a infraestrutura de persistência**, permitindo que o código de negócio não dependa diretamente de detalhes técnicos, como consultas SQL ou APIs externas. Assim, o domínio interage com coleções de objetos em memória, sem precisar conhecer como os dados são armazenados ou recuperados. Essa separação favorece a testabilidade e a flexibilidade, pois torna possível trocar a tecnologia de persistência sem impactar a lógica do domínio. Um repositório bem projetado deve seguir o princípio da **simplicidade**, expondo apenas operações relevantes ao negócio — como salvar, buscar ou remover agregados — e mantendo o restante da lógica encapsulada no próprio domínio.

Os **Serviços de Domínio** são elementos que encapsulam **comportamentos ou operações que não pertencem naturalmente a uma entidade ou objeto de valor específico**, mas que ainda fazem parte das regras de negócio. Diferente de um serviço de aplicação, que orquestra fluxos entre camadas, o serviço de domínio concentra a lógica que envolve múltiplos agregados ou objetos e que não se encaixa de forma coerente em nenhum deles. Por exemplo, o cálculo de juros sobre diferentes tipos de transações pode ser responsabilidade de um serviço de domínio. Esses serviços devem ser **sem estado** e operar exclusivamente sobre os elementos do domínio, mantendo a coesão e evitando a dispersão da lógica de negócio. Dessa forma, contribuem para um modelo mais limpo, expressivo e alinhado com os princípios do DDD.

### Integração e Aplicação

### Conceitos Avançados
