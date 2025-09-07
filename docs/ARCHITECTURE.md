# Estructura del Proyecto QKits Simulator

```
qkits-simulator/
├── src/                           # Código fuente TypeScript
│   ├── domain/                    # Capa de dominio (Clean Architecture)
│   │   ├── entities/              # Entidades de negocio
│   │   │   ├── Qubit.ts          # Entidad qubit individual
│   │   │   └── QuantumCircuit.ts # Entidad circuito cuántico
│   │   ├── value-objects/         # Objetos de valor
│   │   │   ├── ComplexNumber.ts  # Números complejos
│   │   │   └── QuantumState.ts   # Estados cuánticos
│   │   └── interfaces/            # Interfaces del dominio
│   │       └── IQuantumOperations.ts # Contratos de operaciones cuánticas
│   ├── application/               # Capa de aplicación
│   │   ├── services/              # Servicios de aplicación
│   │   │   └── QuantumMeasurementService.ts # Servicio de medición
│   │   └── use-cases/             # Casos de uso
│   │       └── QuantumUseCases.ts # Casos de uso principales
│   ├── infrastructure/            # Capa de infraestructura
│   │   ├── math/                  # Operaciones matemáticas
│   │   │   └── MatrixOperations.ts # Operaciones con matrices
│   │   └── quantum-gates/         # Implementación de compuertas
│   │       ├── QuantumGates.ts   # Definiciones de compuertas
│   │       └── GateFactory.ts    # Factory de compuertas
│   └── index.ts                   # Punto de entrada principal
├── examples/                      # Ejemplos de uso
│   ├── basic-qubit.ts            # Ejemplo básico con qubits
│   ├── quantum-circuit.ts        # Ejemplo de circuitos cuánticos
│   ├── test-functionality.ts     # Tests de funcionalidad
│   └── README.md                 # Documentación de ejemplos
├── dist/                         # Código compilado
│   ├── index.js                  # CommonJS build
│   ├── index.mjs                 # ESM build
│   ├── index.d.ts               # TypeScript declarations
│   └── ...                      # Otros archivos compilados
├── package.json                  # Configuración del paquete NPM
├── tsconfig.json                # Configuración TypeScript
├── tsup.config.ts              # Configuración del bundler
└── README.md                   # Documentación principal
```

## Principios de Clean Architecture Aplicados

### 1. Capa de Dominio (Más Interna)
- **Entidades**: `Qubit`, `QuantumCircuit` - Lógica de negocio central
- **Objetos de Valor**: `ComplexNumber`, `QuantumState` - Inmutables y sin identidad
- **Interfaces**: Contratos que definen comportamientos sin implementación

### 2. Capa de Aplicación
- **Servicios**: Orquestan operaciones complejas
- **Casos de Uso**: Implementan flujos específicos de trabajo

### 3. Capa de Infraestructura (Más Externa)
- **Implementaciones**: Operaciones matemáticas concretas
- **Factories**: Creación de objetos complejos

## Ventajas de esta Arquitectura

1. **Separación de Responsabilidades**: Cada capa tiene un propósito específico
2. **Testabilidad**: Las dependencias apuntan hacia adentro
3. **Flexibilidad**: Fácil cambio de implementaciones sin afectar el dominio
4. **Mantenibilidad**: Código organizado y fácil de entender
5. **Escalabilidad**: Estructura preparada para crecimiento
