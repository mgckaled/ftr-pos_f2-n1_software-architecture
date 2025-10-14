<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->

<p align="center">
  <img alt="Logo - Rocketseat" src="./.github/assets/logo/logo_ftr.png" width="200px" />
</p>

# Arquitetura de Software

## Índice

- [Arquitetura de Software](#arquitetura-de-software)
  - [Índice](#índice)
  - [Sobre](#sobre)
  - [Introdução](#introdução)
  - [Conceitos Fundamentais](#conceitos-fundamentais)
  - [Arquitetura de Domínio](#arquitetura-de-domínio)
    - [Isolando o Domínio com Arquitetura em Camadas](#isolando-o-domínio-com-arquitetura-em-camadas)
    - [Isolando o Domínio com Arquitetura Hexagonal](#isolando-o-domínio-com-arquitetura-hexagonal)
    - [Isolando o Domínio com Arquitetura de Microsserviços](#isolando-o-domínio-com-arquitetura-de-microsserviços)
  - [Entidades e Objetos de Valor](#entidades-e-objetos-de-valor)
  - [Agregados](#agregados)
  - [Repositório e Serviços](#repositório-e-serviços)
  - [Integração e Aplicação](#integração-e-aplicação)
  - [Conceitos Avançados](#conceitos-avançados)
    - [Bounded Context](#bounded-context)
    - [Anticorruption Layer](#anticorruption-layer)

## Sobre

Repositório pessoal de registro, referência e suporte para fins de aprendizado, consulta e acompanhamento da disciplina de **Arquitetura de Software** (Níível 2), Fase 2 (**Estratégia e Inovação**), do curso de Pós-Graduação *Tech Developer 360*, desenvolvido pela Faculdade de Tecnologia Rocketseat (FTR).

>[!NOTE]
> [Questionário Avaliativo](./.github/docs/assessments/q.md)
>
> [Código fonte: Esquemas Visuais para estudos (DDD)](./project/)

## Introdução

**Domain-Driven Design (DDD)** é uma abordagem de desenvolvimento de software proposta por Eric Evans que foca em colocar o **domínio do negócio** no centro do processo de modelagem e implementação. Em vez de priorizar apenas aspectos técnicos, o DDD busca compreender profundamente as regras, processos e linguagem do domínio para construir sistemas mais expressivos, coesos e alinhados às necessidades reais da organização. Ele promove uma colaboração constante entre desenvolvedores e especialistas do negócio, incentivando o uso de uma **linguagem ubíqua** e a divisão do sistema em **contextos delimitados (bounded contexts)**, o que facilita a manutenção, evolução e escalabilidade de soluções complexas.

- [Domain-Driven Design (DDD): Uma Introdução Completa](./.github/docs/content/1_introduction.md)
- [Artigo para leitura: DDD — Domain-Driven Design](https://flaviorl.medium.com/ddd-domain-driven-design-295abc44a9a0)

---

## Conceitos Fundamentais

Em **Domain-Driven Design (DDD)**, a **comunicação eficiente** é essencial para alinhar desenvolvedores e especialistas do domínio, garantindo que o modelo de software reflita com precisão a realidade do negócio. Esse alinhamento é viabilizado pela **Linguagem Ubíqua**, um vocabulário comum e rigorosamente compartilhado entre todos os envolvidos no projeto, usado tanto na conversa quanto no código, evitando ambiguidades e interpretações inconsistentes. Já o **Domínio** representa o núcleo do conhecimento e da lógica de negócio que o sistema busca resolver; compreender e modelar corretamente esse domínio é o ponto central do DDD, pois dele derivam as entidades, regras e processos que estruturam toda a aplicação.

- [Comunicação Eficiente em DDD: Um Pilar Essencial](./.github/docs/content/2_communication.md)
- [O Domínio em Domain-Driven Design: Um Aprofundamento Completo](./.github/docs/content/3_domain.md)

---

## Arquitetura de Domínio

### Isolando o Domínio com Arquitetura em Camadas

A **Arquitetura em Camadas** é uma das formas mais tradicionais de estruturar aplicações para isolar o domínio. Nessa abordagem, o sistema é dividido em níveis hierárquicos, geralmente compostos por camadas como **apresentação**, **aplicação**, **domínio** e **infraestrutura**. O principal objetivo é garantir que o **coração da aplicação**, representado pela camada de domínio, permaneça independente de detalhes técnicos, frameworks ou bancos de dados. Assim, as regras de negócio são encapsuladas em entidades, agregados e serviços de domínio, enquanto as outras camadas lidam com aspectos externos, como comunicação com APIs, persistência de dados e interface do usuário. Essa separação reduz o acoplamento e facilita testes, manutenção e evolução do código ao longo do tempo.

- [Isolando o Domínio com Arquitetura em Camadas](./.github/docs/content/4_layers-architecture.md)

### Isolando o Domínio com Arquitetura Hexagonal

A **Arquitetura Hexagonal**, também conhecida como **Ports and Adapters**, expande o conceito de isolamento do domínio ao eliminar a dependência de camadas rígidas e propor um modelo baseado em **interfaces de comunicação**. O domínio torna-se o núcleo da aplicação, cercado por portas (ports) que definem como ele se comunica com o mundo externo, e adaptadores (adapters) que implementam essas interfaces para tecnologias específicas, como bancos de dados, filas de mensagens ou APIs. Essa estrutura permite que o domínio funcione de forma completamente independente de infraestrutura, possibilitando a substituição de componentes externos sem alterar a lógica central. O resultado é um sistema mais flexível, testável e resiliente a mudanças tecnológicas, mantendo o foco no comportamento e nas regras do negócio.

- [Isolando o Domínio com Arquitetura Hexagonal](./.github/docs/content/5_hexagonal-architecture.md)

### Isolando o Domínio com Arquitetura de Microsserviços

Dentro do contexto do Domain-Driven Design (DDD), isolar o domínio por meio de uma arquitetura de microsserviços permite que cada serviço represente de forma autônoma um **contexto delimitado** (Bounded Context), preservando as regras de negócio e a lógica específica de cada subdomínio. Essa separação evita o acoplamento excessivo entre módulos e facilita a evolução independente dos serviços, já que cada um possui seu próprio modelo de domínio, banco de dados e ciclo de implantação. Dessa forma, alterações em um serviço não impactam diretamente os demais, favorecendo a escalabilidade, a manutenção e a clareza conceitual do sistema. O isolamento do domínio, portanto, garante que o design de cada microsserviço permaneça fiel à linguagem ubíqua e aos princípios do DDD, reforçando a coesão interna e a integridade das regras de negócio.

- [Isolando o Domínio com Arquitetura Microsserviços](./.github/docs/content/6_microsservices-architecture.md)

---

## Entidades e Objetos de Valor

As **Entidades** são elementos fundamentais no **Domain-Driven Design (DDD)** e representam objetos do domínio que possuem uma **identidade única e persistente** ao longo do tempo. Essa identidade não depende de seus atributos, mas sim de um identificador exclusivo, como um ID, que permanece o mesmo mesmo que suas propriedades mudem. Por exemplo, um “Cliente” pode alterar seu endereço ou telefone, mas continua sendo o mesmo cliente para o sistema. Entidades são responsáveis por manter o estado e o comportamento relacionado a um conceito central do domínio, garantindo a integridade das regras de negócio e a coerência dos dados. Sua correta modelagem é essencial para que o domínio reflita com precisão as realidades e restrições do negócio.

Os **Objetos de Valor** (Value Objects) são componentes que representam conceitos do domínio definidos **somente por seus atributos**, sem uma identidade própria. Eles são **imutáveis** e **substituíveis por completo** quando algum de seus valores muda. Um exemplo comum é um “Endereço”, que pode ser trocado inteiramente sem que isso altere a identidade do cliente associado. Objetos de Valor ajudam a tornar o código mais expressivo e seguro, encapsulando comportamentos e validações específicos — como formatação de dados, comparações e regras de consistência — de forma coesa. Além disso, ao eliminar a necessidade de gerenciamento de identidade, esses objetos simplificam o modelo do domínio e promovem uma lógica mais clara e funcional.

- [Entidades e Objetos de Valor](./.github/docs/content/7_entities-and-value-objects.md)

---

## Agregados

Os **Agregados** são estruturas fundamentais no **Domain-Driven Design (DDD)** que agrupam **entidades e objetos de valor** logicamente relacionados e que precisam ser tratados como uma **única unidade de consistência**. Cada agregado possui uma **entidade raiz (Aggregate Root)**, responsável por controlar o acesso e garantir a integridade das regras de negócio dentro de seus limites. Essa organização evita inconsistências e facilita a manutenção da coerência do domínio, especialmente em sistemas complexos. Por exemplo, em um contexto de pedidos, o “Pedido” pode ser o agregado raiz que engloba itens, valores e informações de pagamento, garantindo que qualquer modificação ocorra de forma controlada e consistente. Dessa forma, os agregados contribuem para a clareza do modelo, o isolamento de responsabilidades e a simplificação das transações dentro do domínio.

- [Agregados](./.github/docs/content/8_aggregates.md)

---

## Repositório e Serviços

No **Domain-Driven Design (DDD)**, os **Repositórios** representam um mecanismo essencial para o gerenciamento e recuperação de agregados e entidades do domínio. Eles atuam como uma **camada de abstração entre o domínio e a infraestrutura de persistência**, permitindo que o código de negócio não dependa diretamente de detalhes técnicos, como consultas SQL ou APIs externas. Assim, o domínio interage com coleções de objetos em memória, sem precisar conhecer como os dados são armazenados ou recuperados. Essa separação favorece a testabilidade e a flexibilidade, pois torna possível trocar a tecnologia de persistência sem impactar a lógica do domínio. Um repositório bem projetado deve seguir o princípio da **simplicidade**, expondo apenas operações relevantes ao negócio — como salvar, buscar ou remover agregados — e mantendo o restante da lógica encapsulada no próprio domínio.

Os **Serviços de Domínio** são elementos que encapsulam **comportamentos ou operações que não pertencem naturalmente a uma entidade ou objeto de valor específico**, mas que ainda fazem parte das regras de negócio. Diferente de um serviço de aplicação, que orquestra fluxos entre camadas, o serviço de domínio concentra a lógica que envolve múltiplos agregados ou objetos e que não se encaixa de forma coerente em nenhum deles. Por exemplo, o cálculo de juros sobre diferentes tipos de transações pode ser responsabilidade de um serviço de domínio. Esses serviços devem ser **sem estado** e operar exclusivamente sobre os elementos do domínio, mantendo a coesão e evitando a dispersão da lógica de negócio. Dessa forma, contribuem para um modelo mais limpo, expressivo e alinhado com os princípios do DDD.

- [Repositório e Serviços](./.github/docs/content/9_repository-and-services.md)

---

## Integração e Aplicação

Na etapa de **Integração e Aplicação** dentro de uma **Arquitetura Hexagonal**, o foco está em conectar o núcleo do domínio — que contém entidades como **Paciente** e **Médico** — aos serviços externos de forma desacoplada e controlada. Essa integração é feita por meio de **portas (ports)** e **adaptadores (adapters)**, permitindo que o domínio permaneça independente de detalhes de infraestrutura, como APIs, bancos de dados ou sistemas de mensageria. Nesse contexto, são implementados serviços essenciais, como o **serviço de disponibilidade médica**, responsável por validar horários de atendimento conforme as regras de negócio, e o **serviço de notificação**, que comunica pacientes sobre consultas agendadas. Além disso, o **serviço de agendamento** atua como orquestrador, combinando essas funcionalidades para garantir uma experiência fluida e coerente entre os componentes, reforçando o princípio de isolamento e modularidade característico do DDD e da arquitetura hexagonal.

---

## Conceitos Avançados

### Bounded Context

O **Contexto Delimitado** (*Bounded Context*) é um dos conceitos centrais do **Domain-Driven Design (DDD)** e representa uma **fronteira clara** dentro da qual um **modelo de domínio específico é definido, aplicado e mantido de forma consistente**. Essa delimitação garante que a linguagem ubíqua, as entidades, agregados e regras de negócio tenham significados bem definidos, evitando ambiguidade e conflitos entre diferentes partes do sistema. Em projetos complexos, é comum existirem múltiplos contextos delimitados, cada um responsável por um subconjunto do domínio — por exemplo, “Agendamento” e “Faturamento” em um sistema de saúde. Essa separação favorece a modularidade, facilita a evolução independente de cada contexto e permite que equipes trabalhem de forma paralela sem comprometer a integridade do modelo geral. Além disso, define **contratos de comunicação explícitos** entre contextos, fortalecendo a coesão interna e reduzindo o acoplamento entre diferentes áreas do sistema.

- [Contexto Delimitado (Bounded Context)](./.github/docs/content/10_bounded-context.md)

### Anticorruption Layer

A **Anticorruption Layer (ACL)**, ou **Camada Anticorrupção**, é um padrão arquitetural do **Domain-Driven Design (DDD)** que tem como propósito **proteger o modelo de domínio interno** contra influências e dependências indesejadas de sistemas externos ou legados. Essa camada atua como uma barreira de tradução, garantindo que dados e comportamentos vindos de outras aplicações sejam adaptados antes de interagir com o domínio principal. Dessa forma, o modelo interno mantém sua **consistência, pureza conceitual e integridade sem ser “corrompido”** por estruturas, terminologias ou regras incompatíveis de outros sistemas. A ACL normalmente é implementada por meio de adaptadores, tradutores e serviços intermediários, que convertem formatos e significados conforme necessário. Esse isolamento permite que o domínio evolua de maneira independente, preservando sua lógica de negócio e evitando o acoplamento excessivo entre contextos distintos.

- [Camada Anticorrupção - Anticorruption Layer (ACL)](./.github/docs/content/11_anticorruption-layer.md)
