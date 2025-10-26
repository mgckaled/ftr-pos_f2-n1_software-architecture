# Source Code Structure

Este diretório contém a implementação de um sistema de gerenciamento de pacientes seguindo os princípios de **Domain-Driven Design (DDD)** e **Arquitetura em Camadas**.

## Estrutura de Pastas

```plaintext
src/
├── domain/              # Camada de Domínio (regras de negócio)
│   ├── entities/        # Entidades do domínio
│   ├── value-objects/   # Objetos de valor imutáveis
│   ├── services/        # Serviços de domínio
│   └── repositories/    # Interfaces de repositórios
│
├── infrastructure/      # Camada de Infraestrutura
│   └── persistence/     # Implementações de persistência de dados
│
└── interfaces/          # Camada de Interface/Apresentação
    └── controllers/     # Controladores HTTP/API
```

## Camadas

### Domain (Domínio)

Contém toda a lógica de negócio da aplicação, independente de frameworks ou tecnologias:

- **Patient**: Entidade principal representando um paciente
- **Value Objects**: Address, EmergencyContact, Allergy, MedicalRecord, Diagnosis, Medication, Treatment
- **PatientService**: Lógica de negócio relacionada a pacientes
- **Repository**: Interface que define o contrato de persistência

### Infrastructure (Infraestrutura)

Implementações concretas de tecnologias específicas:

- **PatientRepository**: Implementação da persistência de pacientes

### Interfaces (Apresentação)

Pontos de entrada da aplicação:

- **PatientController**: Controlador para operações de pacientes via API

## Princípios Aplicados

- **Separation of Concerns**: Separação clara entre camadas
- **Dependency Inversion**: Infraestrutura depende do domínio
- **Value Objects**: Conceitos do domínio encapsulados como objetos imutáveis
- **Repository Pattern**: Abstração do acesso a dados
