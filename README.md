# Qubit Simulator

Una librería completa de simulación cuántica para JavaScript/TypeScript que permite simular qubits y compuertas cuánticas de manera matemáticamente coherente y funcional.

## 🌟 Características

- ✅ **Matemáticamente riguroso**: Basado en vectores de estado y matrices unitarias
- ✅ **TypeScript completo**: Tipado fuerte y IntelliSense completo
- ✅ **Arquitectura limpia**: Separación clara entre dominio, aplicación e infraestructura
- ✅ **Soporte completo de compuertas**: X, Y, Z, H, CNOT, rotaciones Rx/Ry/Rz, y más
- ✅ **Simulación de múltiples qubits**: Productos tensoriales y entrelazamiento
- ✅ **Medición cuántica**: Colapso de estado con probabilidades correctas
- ✅ **Formatos duales**: CommonJS y ESM

## 📦 Instalación

```bash
npm install qkits-simulator
```

## 🚀 Uso rápido

### Ejemplo básico con qubit individual

```typescript
import { QKits, Gates } from 'qkits-simulator';

// Crear un qubit en estado |0⟩
const qubit = QKits.createQubit();

// Aplicar compuerta Hadamard para crear superposición
const hadamardGate = Gates.H();
const newState = hadamardGate.apply(qubit.getState());
qubit.setState(newState);

// Medir el qubit
const result = qubit.measure();
console.log(`Resultado: ${result}`); // 0 o 1 con 50% probabilidad cada uno
```

### Ejemplo con circuito cuántico de 2 qubits

```typescript
import { QKits, Gates } from 'qkits-simulator';

// Crear circuito de 2 qubits
const circuit = QKits.createCircuit(2);

// Aplicar Hadamard al primer qubit
circuit.applyGate(Gates.H(), 0);

// Aplicar CNOT (control=0, target=1)
circuit.applyCNOT(0, 1);

// Medir todo el circuito
const result = circuit.measureAll();
console.log(result); // "00" o "11" con 50% probabilidad cada uno (estado de Bell)
```

## 📖 API completa

### Clases principales

#### `QKits` - Factory principal
```typescript
// Crear componentes
const qubit = QKits.createQubit();
const circuit = QKits.createCircuit(3);

// Acceder a servicios
const gates = QKits.gates;
const math = QKits.math;
const measurement = QKits.measurement;
```

#### `Qubit` - Representación de un qubit individual
```typescript
import { Qubit, ComplexNumber } from 'qkits-simulator';

// Crear qubits en diferentes estados
const zero = Qubit.zero();           // |0⟩
const one = Qubit.one();             // |1⟩
const plus = Qubit.plus();           // |+⟩ = (|0⟩ + |1⟩)/√2
const minus = Qubit.minus();         // |-⟩ = (|0⟩ - |1⟩)/√2

// Crear con amplitudes personalizadas
const alpha = new ComplexNumber(0.6, 0);
const beta = new ComplexNumber(0.8, 0);
const custom = Qubit.fromAmplitudes(alpha, beta);

// Obtener información
console.log(qubit.getProbabilityZero());  // Probabilidad de medir |0⟩
console.log(qubit.getProbabilityOne());   // Probabilidad de medir |1⟩
console.log(qubit.isInSuperposition());   // ¿Está en superposición?
```

#### `QuantumCircuit` - Circuito con múltiples qubits
```typescript
const circuit = QKits.createCircuit(3);

// Aplicar compuertas a qubits específicos
circuit.applyGate(Gates.H(), 0);     // Hadamard al qubit 0
circuit.applyGate(Gates.X(), 1);     // Pauli-X al qubit 1
circuit.applyGate(Gates.Rz(Math.PI/4), 2); // Rotación Z al qubit 2

// Compuertas de dos qubits
circuit.applyCNOT(0, 1);             // CNOT control=0, target=1

// Medición
const singleResult = circuit.measureQubit(0);    // Medir qubit específico
const allResults = circuit.measureAll();         // Medir todos los qubits

// Obtener probabilidades sin colapsar el estado
const probs = circuit.getMeasurementProbabilities();
```

### Compuertas cuánticas disponibles

#### Compuertas de un solo qubit
```typescript
import { Gates } from 'qkits-simulator';

// Compuertas Pauli
Gates.X()    // Pauli-X (NOT cuántica)
Gates.Y()    // Pauli-Y
Gates.Z()    // Pauli-Z

// Hadamard y otras
Gates.H()    // Hadamard (crea superposición)
Gates.I()    // Identidad
Gates.S()    // Compuerta de fase
Gates.T()    // Compuerta T (π/8)

// Rotaciones parametrizadas
Gates.Rx(angle)  // Rotación alrededor del eje X
Gates.Ry(angle)  // Rotación alrededor del eje Y
Gates.Rz(angle)  // Rotación alrededor del eje Z
```

#### Compuertas de dos qubits
```typescript
// Usar directamente en el circuito
circuit.applyCNOT(control, target);

// O crear las compuertas
Gates.CNOT()  // Controlled-NOT
Gates.CZ()    // Controlled-Z
Gates.SWAP()  // Intercambio de qubits
```

### Números complejos
```typescript
import { ComplexNumber } from 'qkits-simulator';

const c1 = new ComplexNumber(3, 4);           // 3 + 4i
const c2 = ComplexNumber.fromReal(5);         // 5 + 0i
const c3 = ComplexNumber.fromImaginary(2);    // 0 + 2i

// Operaciones
const sum = c1.add(c2);
const product = c1.multiply(c2);
const conjugate = c1.conjugate();
const magnitude = c1.magnitude();
```

## 🧮 Ejemplos avanzados

### Estado de Bell (entrelazamiento)
```typescript
const circuit = QKits.createCircuit(2);

// Crear estado de Bell |Φ+⟩ = (|00⟩ + |11⟩)/√2
circuit.applyGate(Gates.H(), 0);
circuit.applyCNOT(0, 1);

// Verificar entrelazamiento
const probs = circuit.getMeasurementProbabilities();
console.log(probs); // [0.5, 0, 0, 0.5] - Solo |00⟩ y |11⟩ tienen probabilidad
```

### Estado GHZ (3 qubits entrelazados)
```typescript
const circuit = QKits.createCircuit(3);

// Crear estado GHZ |GHZ⟩ = (|000⟩ + |111⟩)/√2
circuit.applyGate(Gates.H(), 0);
circuit.applyCNOT(0, 1);
circuit.applyCNOT(1, 2);

console.log(circuit.toString()); // Ver la representación del estado
```

### Rotaciones y fases
```typescript
const qubit = QKits.createQubit();

// Rotación de π/3 radianes alrededor del eje Y
const ryGate = Gates.Ry(Math.PI / 3);
const newState = ryGate.apply(qubit.getState());
qubit.setState(newState);

console.log(qubit.getProbabilityZero()); // ~0.75
console.log(qubit.getProbabilityOne());  // ~0.25
```

## 🏗️ Arquitectura

La librería sigue los principios de **Clean Architecture** con clara separación de responsabilidades:

### Capa de Dominio
- `ComplexNumber`: Números complejos para amplitudes cuánticas
- `QuantumState`: Estados cuánticos como vectores complejos
- `Qubit`: Entidad de qubit individual
- `QuantumCircuit`: Entidad de circuito con múltiples qubits

### Capa de Aplicación
- `QuantumMeasurementService`: Lógica de medición cuántica
- `QubitUseCase`: Casos de uso para operaciones con qubits
- `QuantumCircuitUseCase`: Casos de uso para circuitos

### Capa de Infraestructura
- `MatrixOperations`: Operaciones matemáticas con matrices
- `QuantumGates`: Implementaciones de compuertas cuánticas
- `GateFactory`: Factory para crear compuertas

## 🧪 Validación matemática

Todas las operaciones son matemáticamente rigurosas:

- ✅ Los estados cuánticos están siempre normalizados (|α|² + |β|² = 1)
- ✅ Las compuertas son matrices unitarias (U × U† = I)
- ✅ Las mediciones conservan la probabilidad total
- ✅ Los productos tensoriales implementan correctamente el entrelazamiento
- ✅ Las rotaciones utilizan las fórmulas correctas de mecánica cuántica

## 📝 Scripts disponibles

```bash
npm run build     # Compilar TypeScript a JavaScript
npm run dev       # Compilar en modo watch
npm test          # Ejecutar tests (cuando estén implementados)
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

ISC License

## 🙏 Agradecimientos

Esta librería implementa los principios fundamentales de la mecánica cuántica y computación cuántica de manera educativa y práctica, siguiendo las mejores prácticas de desarrollo de software moderno. Tambien quiero aclarar que si las operaciones matematicas fallan o tienen errores, haganmelo saber ya que apenas estoy comenzando en este mundo de la computacion cuantica y se me ocurrio esta idea de hacer esta libreria para aprender mas sobre este fascinante mundo de la computacion cuantica.

---

**QKits Simulator** - Llevando la computación cuántica al mundo de JavaScript/TypeScript 🚀
