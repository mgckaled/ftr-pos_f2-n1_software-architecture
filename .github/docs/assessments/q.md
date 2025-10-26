# Questionário Avaliativo - DDD e Arquitetura Hexagonal

## Questão 01/12

**Pergunta:** O que são entidades, de acordo com o livro Domínio do Design de Eric Evans?

**Resposta:** Objetos dentro do sistema que possuem uma identidade única

**Justificativa:** Entidades no DDD são objetos com identidade contínua e única ao longo do ciclo de vida do sistema, diferente de Value Objects que não possuem identidade única e são comparados por seus atributos.

---

## Questão 02/12

**Pergunta:** Qual a responsabilidade dos repositórios?

**Resposta:** Responsáveis por persistir e recuperar entidades ou quantidades

**Justificativa:** Repositórios no DDD encapsulam a lógica de persistência e recuperação de dados, agindo como abstrações que isolam o domínio da infraestrutura de banco de dados, permitindo que entidades sejam armazenadas e obtidas sem expor detalhes de acesso a dados.

---

## Questão 03/12

**Pergunta:** Qual adaptador é crucial para a persistência de dados na arquitetura hexagonal, segundo as aulas?

**Resposta:** Repositórios

**Justificativa:** Na arquitetura hexagonal, os repositórios funcionam como adaptadores que conectam o domínio (núcleo) à camada de persistência, traduzindo operações de domínio em operações de banco de dados, mantendo a independência entre camadas.

---

## Questão 04/12

**Pergunta:** O que os serviços encapsulam?

**Resposta:** Serviços encapsulam a lógica de negócio

**Justificativa:** Serviços no DDD encapsulam operações e lógica de negócio que não pertencem naturalmente a uma entidade ou value object específico, coordenando comportamentos entre múltiplos objetos do domínio e orquestrando processos complexos.

---

## Questão 05/12

**Pergunta:** Na arquitetura hexagonal, o que os adaptadores fazem?

**Resposta:** Implementam as portas

**Justificativa:** Adaptadores na arquitetura hexagonal são implementações concretas que realizam as interfaces (portas) definidas, conectando o domínio (núcleo) a tecnologias externas como bancos de dados, APIs e frameworks, permitindo a flexibilidade e testabilidade da arquitetura.

---

## Questão 06/12

**Pergunta:** O que são agregados no contexto de modelagem de domínio?

**Resposta:** Blocos de código ou entidades que relacionam objetos de valor com entidades

**Justificativa:** Agregados no DDD são agrupamentos coesos de entidades e value objects que formam uma unidade de consistência transacional, com uma entidade raiz (root) que controla o acesso e mantém as invariantes do agregado, garantindo integridade do domínio.

---

## Questão 07/12

**Pergunta:** O que é a linguagem ubíqua no contexto do DDD?

**Resposta:** Uma linguagem universal ao contexto do projeto, que surge do relacionamento entre as partes

**Justificativa:** Linguagem ubíqua no DDD é um vocabulário comum compartilhado entre desenvolvedores, especialistas de domínio e stakeholders, emergindo do diálogo contínuo e refletido no código, documentação e comunicação, garantindo compreensão alinhada sobre o domínio do negócio.

---

## Questão 08/12

**Pergunta:** Para qual tipo de projeto a arquitetura hexagonal é mais recomendada, segundo as aulas?

**Resposta:** Projetos de grande porte

**Justificativa:** A arquitetura hexagonal é mais recomendada para projetos de grande porte porque fornece estrutura robusta, separação clara de responsabilidades, facilita testes, escalabilidade e manutenção em sistemas complexos com múltiplas dependências externas e requisitos evolucionários.

---

## Questão 09/12

**Pergunta:** Qual é o principal problema de comunicação que a Linguagem Ubíqua (ou Linguagem Onipresente) busca resolver, conforme explicado na aula?

**Resposta:** A diferença de linguagem e jargões entre desenvolvedores e especialistas de domínio

**Justificativa:** A Linguagem Ubíqua resolve o problema de comunicação entre desenvolvedores e especialistas de negócio, que frequentemente usam vocabulários diferentes, criando um idioma comum refletido no código para evitar mal-entendidos e alinhar compreensão sobre o domínio do projeto.

---

## Questão 10/12

**Pergunta:** Qual a principal diferença entre entidades e objetos de valor?

**Resposta:** Entidades possuem identidade única, enquanto objetos de valor são definidos unicamente por seus atributos

**Justificativa:** Entidades no DDD têm identidade contínua independente de seus atributos e perseveram ao longo do tempo, enquanto Value Objects são imutáveis e comparados apenas pelo conteúdo de seus atributos, sem identidade própria, sendo intercambiáveis quando seus valores são iguais.

---

## Questão 11/12

**Pergunta:** Qual o objetivo principal da arquitetura hexagonal, segundo a aula?

**Resposta:** Evitar que as regras de negócio fiquem presas a frameworks

**Justificativa:** O objetivo principal da arquitetura hexagonal é isolar o domínio (lógica de negócio) de dependências externas como frameworks, bibliotecas e tecnologias, permitindo que as regras de negócio permaneçam independentes e testáveis, facilitando mudanças tecnológicas futuras sem impactar o núcleo da aplicação.

---

## Questão 12/12

**Pergunta:** Qual é um dos principais benefícios do DDD, conforme as aulas?

**Resposta:** Alinhar o software com o problema do cliente

**Justificativa:** Um dos principais benefícios do DDD é alinhar o software com a realidade do negócio do cliente através da Linguagem Ubíqua e modelagem do domínio, garantindo que o código reflita as necessidades e processos reais do negócio, reduzindo retrabalho e melhorando a qualidade da solução entregue.
