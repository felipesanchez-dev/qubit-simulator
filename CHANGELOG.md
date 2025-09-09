# Changelog

Todos los cambios notables a este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere al [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2025-09-07

### Corregido
- ✅ Nombre del paquete corregido de "qubit-simulator" a "qkits-simulator"
- ✅ Referencias en README.md actualizadas
- ✅ package-lock.json regenerado con el nombre correcto

## [0.0.1] - 2025-09-07

### Agregado
- ✅ Implementación completa de la librería QKits Simulator
- ✅ Arquitectura limpia con separación de responsabilidades
- ✅ Soporte completo para números complejos (`ComplexNumber`)
- ✅ Estados cuánticos matemáticamente rigurosos (`QuantumState`)
- ✅ Entidad Qubit con todas las operaciones básicas
- ✅ Circuitos cuánticos multi-qubit (`QuantumCircuit`)
- ✅ Compuertas cuánticas estándar:
  - Pauli-X, Y, Z (compuertas Pauli)
  - Hadamard (H) para crear superposición
  - Identity (I)
  - Phase (S) y T gates
  - Rotaciones Rx, Ry, Rz parametrizadas
  - CNOT (Controlled-NOT)
  - Controlled-Z (CZ)
  - SWAP gate
- ✅ Sistema de medición cuántica con colapso de estado
- ✅ Operaciones matriciales optimizadas
- ✅ Factory pattern para creación de compuertas
- ✅ Servicios de aplicación para casos de uso complejos
- ✅ Soporte dual: CommonJS y ESM
- ✅ Documentación completa con ejemplos
- ✅ Tests de funcionalidad básica

### Características Matemáticas
- ✅ Estados cuánticos siempre normalizados
- ✅ Compuertas verificadas como unitarias
- ✅ Productos tensoriales para múltiples qubits
- ✅ Medición probabilística correcta
- ✅ Entrelazamiento cuántico (estados de Bell, GHZ)

### Ejemplos Incluidos
- ✅ Operaciones básicas con qubits individuales
- ✅ Circuitos cuánticos con múltiples qubits
- ✅ Creación de estados de Bell
- ✅ Estados GHZ de 3 qubits
- ✅ Tests de validación funcional

### Infraestructura
- ✅ TypeScript con tipado fuerte
- ✅ Configuración tsup para dual build
- ✅ Scripts NPM para build y testing
- ✅ Estructura de proyecto escalable

### Documentación
- ✅ README.md completo con ejemplos
- ✅ Documentación de arquitectura
- ✅ Ejemplos comentados
- ✅ API documentation

## Planes Futuros (v1.1.0)

### Candidatos para Próximas Versiones
- [ ] Tests unitarios con framework de testing (Jest/Vitest)
- [ ] Más compuertas cuánticas (Toffoli, Fredkin)
- [ ] Algoritmos cuánticos clásicos (Deutsch-Jozsa, Grover completo)
- [ ] Visualización de circuitos
- [ ] Optimizaciones de performance
- [ ] Soporte para ruido cuántico
- [ ] Export a formatos de circuitos estándar (QASM)

### Mejoras Técnicas Futuras
- [ ] Lazy evaluation para circuitos grandes
- [ ] Paralelización de operaciones matriciales
- [ ] Soporte para sparse matrices
- [ ] Benchmarking y profiling
- [ ] Plugin system para extensiones

---
## [0.0.2] - 2025-09-09
### Documentación
- [✅] Actualización de la documentación de instalación, uso y análisis de rendimiento; incluye ejemplos y validaciones
- [✅] Implementación de validaciones de límites en QuantumCircuit y compuertas cuánticas
- [✅] Añadidas pruebas para límites de qubits y validaciones de compuertas


**Nota**: Esta es la primera versión 0.0.1 de QKits Simulator. La API se considera estable y seguirá semantic versioning para cambios futuros.
