<div align="center">

# 🚀 Qubit Simulator (Qkits)

### _Simulación cuántica para JavaScript/TypeScript_

[![Version](https://img.shields.io/badge/version-0.0.1--dev-orange.svg)](https://github.com/felipesanchez-dev/qubit-simulator)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Development Status](https://img.shields.io/badge/status-in%20development-yellow.svg)](https://github.com/felipesanchez-dev/qubit-simulator)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)

```
     ┌─────┐     ┌─────┐     ┌─────┐
  |0⟩│  H  │──●──│  X  │──●──│  M  │
     └─────┘  │  └─────┘  │  └─────┘
     ┌─────┐  │  ┌─────┐  │  ┌─────┐
  |0⟩│     │──⊕──│     │──⊕──│  M  │
     └─────┘     └─────┘     └─────┘
```

_Una librería completa de simulación cuántica que permite simular qubits y compuertas cuánticas de manera matemáticamente coherente y funcional._

</div>

---

## 🌟 Características

<table align="center">
<tr>
<td align="center" width="50%">

### 🧮 **Rigor Matemático**

✅ Vectores de estado normalizados  
✅ Matrices unitarias  
✅ Productos tensoriales correctos  
✅ Conservación de probabilidades

</td>
<td align="center" width="50%">

### 💻 **Developer Experience**

✅ TypeScript completo  
✅ IntelliSense total  
✅ CommonJS y ESM  
✅ Arquitectura limpia

</td>
</tr>
<tr>
<td align="center" width="50%">

### ⚛️ **Funcionalidades Cuánticas**

✅ Compuertas básicas (X, Y, Z, H)  
✅ Rotaciones (Rx, Ry, Rz)  
✅ Compuertas CNOT, CZ, SWAP  
✅ Estados entrelazados

</td>
<td align="center" width="50%">

### 🔬 **Simulación Avanzada**

✅ Múltiples qubits  
✅ Medición cuántica  
✅ Estados de Bell y GHZ  
✅ Superposición cuántica

</td>
</tr>
</table>

## 📦 Instalación

> ⚠️ **Estado Actual**: Esta librería está en desarrollo (v0.0.1) y será publicada próximamente en npm.

### 🚀 Para desarrollo local (actual):

```bash
# Clonar el repositorio
git clone https://github.com/felipesanchez-dev/qubit-simulator.git
cd qubit-simulator

# Instalar dependencias
npm install

# Compilar el proyecto
npm run build

# Ejecutar tests
npm run test
```

### 📦 Una vez publicado en npm:

```bash
# Instalación básica
npm install qubit-simulator

# Para TypeScript
npm install qubit-simulator @types/node
```

### ⚠️ **Límites importantes de rendimiento:**

| Qubits | Estados | Memoria | Recomendación |
|--------|---------|---------|---------------|
| 1-15   | 2¹⁵     | < 1 MB  | ✅ Perfecto para uso educativo |
| 16-25  | 2²⁵     | 16-512 MB | ⚠️ Precaución: aparecerá advertencia |
| 26+    | 2²⁶+    | > 1 GB  | ❌ Bloqueado automáticamente |

```typescript
// ✅ Permitido
const smallCircuit = QKits.createCircuit(15);

// ⚠️ Con advertencia
const mediumCircuit = QKits.createCircuit(20); 
// Warning: 20-qubit simulation requires ~16.00 MB of memory

// ❌ Bloqueado automáticamente  
const largeCircuit = QKits.createCircuit(30);
// Error: limited to 25 qubits to prevent memory issues
```

## 🚀 Uso rápido

### Ejemplo básico con qubit individual

```typescript
import { QKits, Gates } from "qkits-simulator";

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
import { QKits, Gates } from "qkits-simulator";

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
import { Qubit, ComplexNumber } from "qkits-simulator";

// Crear qubits en diferentes estados
const zero = Qubit.zero(); // |0⟩
const one = Qubit.one(); // |1⟩
const plus = Qubit.plus(); // |+⟩ = (|0⟩ + |1⟩)/√2
const minus = Qubit.minus(); // |-⟩ = (|0⟩ - |1⟩)/√2

// Crear con amplitudes personalizadas
const alpha = new ComplexNumber(0.6, 0);
const beta = new ComplexNumber(0.8, 0);
const custom = Qubit.fromAmplitudes(alpha, beta);

// Obtener información
console.log(qubit.getProbabilityZero()); // Probabilidad de medir |0⟩
console.log(qubit.getProbabilityOne()); // Probabilidad de medir |1⟩
console.log(qubit.isInSuperposition()); // ¿Está en superposición?
```

#### `QuantumCircuit` - Circuito con múltiples qubits

```typescript
const circuit = QKits.createCircuit(3);

// Aplicar compuertas a qubits específicos
circuit.applyGate(Gates.H(), 0); // Hadamard al qubit 0
circuit.applyGate(Gates.X(), 1); // Pauli-X al qubit 1
circuit.applyGate(Gates.Rz(Math.PI / 4), 2); // Rotación Z al qubit 2

// Compuertas de dos qubits
circuit.applyCNOT(0, 1); // CNOT control=0, target=1

// Medición
const singleResult = circuit.measureQubit(0); // Medir qubit específico
const allResults = circuit.measureAll(); // Medir todos los qubits

// Obtener probabilidades sin colapsar el estado
const probs = circuit.getMeasurementProbabilities();
```

### Compuertas cuánticas disponibles

#### Compuertas de un solo qubit

```typescript
import { Gates } from "qkits-simulator";

// Compuertas Pauli
Gates.X(); // Pauli-X (NOT cuántica)
Gates.Y(); // Pauli-Y
Gates.Z(); // Pauli-Z

// Hadamard y otras
Gates.H(); // Hadamard (crea superposición)
Gates.I(); // Identidad
Gates.S(); // Compuerta de fase
Gates.T(); // Compuerta T (π/8)

// Rotaciones parametrizadas
Gates.Rx(angle); // Rotación alrededor del eje X
Gates.Ry(angle); // Rotación alrededor del eje Y
Gates.Rz(angle); // Rotación alrededor del eje Z
```

#### Compuertas de dos qubits

```typescript
// Usar directamente en el circuito
circuit.applyCNOT(control, target);

// O crear las compuertas
Gates.CNOT(); // Controlled-NOT
Gates.CZ(); // Controlled-Z
Gates.SWAP(); // Intercambio de qubits
```

### Números complejos

```typescript
import { ComplexNumber } from "qkits-simulator";

const c1 = new ComplexNumber(3, 4); // 3 + 4i
const c2 = ComplexNumber.fromReal(5); // 5 + 0i
const c3 = ComplexNumber.fromImaginary(2); // 0 + 2i

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
console.log(qubit.getProbabilityOne()); // ~0.25
```

## 🏗️ Arquitectura

La librería sigue los principios de **Clean Architecture** con clara separación de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                    🎯 Capa de Dominio                        │
├─────────────────────────────────────────────────────────────┤
│ • ComplexNumber     → Números complejos para amplitudes    │
│ • QuantumState      → Estados cuánticos como vectores      │
│ • Qubit             → Entidad de qubit individual          │
│ • QuantumCircuit    → Entidad de circuito múltiple         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                  🔄 Capa de Aplicación                       │
├─────────────────────────────────────────────────────────────┤
│ • QuantumMeasurementService → Lógica de medición cuántica  │
│ • QubitUseCase             → Casos de uso para qubits      │
│ • QuantumCircuitUseCase    → Casos de uso para circuitos   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                🔧 Capa de Infraestructura                    │
├─────────────────────────────────────────────────────────────┤
│ • MatrixOperations  → Operaciones matemáticas con matrices │
│ • QuantumGates      → Implementaciones de compuertas       │
│ • GateFactory       → Factory para crear compuertas        │
└─────────────────────────────────────────────────────────────┘
```

## 🧪 Validación matemática

<div align="center">

### 🎯 **Rigor Matemático Garantizado**

| Aspecto                   | Validación                           | Fórmula                        |
| ------------------------- | ------------------------------------ | ------------------------------ |
| **Normalización**         | ✅ Estados siempre normalizados      | \|α\|² + \|β\|² = 1            |
| **Unitariedad**           | ✅ Compuertas son matrices unitarias | U × U† = I                     |
| **Conservación**          | ✅ Probabilidades se conservan       | ∑P(estados) = 1                |
| **Productos Tensoriales** | ✅ Entrelazamiento correcto          | \|ψ⟩ = α\|00⟩ + β\|11⟩         |
| **Rotaciones**            | ✅ Fórmulas de mecánica cuántica     | R(θ) = cos(θ/2)I - i sin(θ/2)σ |

</div>

## 📝 Scripts disponibles

| Script       | Descripción                      | Comando         |
| ------------ | -------------------------------- | --------------- |
| 🔨 **Build** | Compilar TypeScript a JavaScript | `npm run build` |
| 👀 **Dev**   | Compilar en modo watch           | `npm run dev`   |
| 🧪 **Test**  | Ejecutar tests (próximamente)    | `npm test`      |
| 🧹 **Clean** | Limpiar archivos compilados      | `npm run clean` |

## 🤝 Contribuir

¡Las contribuciones son más que bienvenidas! Este es un proyecto educativo y toda ayuda es valiosa.

<div align="center">

### 🛠️ **Proceso de Contribución**

</div>

| Paso | Acción                         | Comando                                                       |
| ---- | ------------------------------ | ------------------------------------------------------------- |
| 1️⃣   | **Fork** el repositorio        | `git clone https://github.com/tu-usuario/qkits-simulator.git` |
| 2️⃣   | **Crear** rama para tu feature | `git checkout -b feature/nueva-funcionalidad`                 |
| 3️⃣   | **Commit** tus cambios         | `git commit -am 'Agregar nueva funcionalidad'`                |
| 4️⃣   | **Push** a la rama             | `git push origin feature/nueva-funcionalidad`                 |
| 5️⃣   | **Abrir** Pull Request         | Desde GitHub → New Pull Request                               |

### 💡 ¿Cómo puedes ayudar?

- 🐛 **Reportar bugs** matemáticos o de implementación
- 📚 **Mejorar documentación** y ejemplos
- ⚡ **Optimizar** algoritmos cuánticos
- 🧪 **Agregar tests** unitarios e integración
- 🌟 **Proponer nuevas** funcionalidades cuánticas

## 📄 Licencia

**ISC License** - Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

### 🚀 **Qubit Simulator**

_Llevando la computación cuántica al mundo de JavaScript/TypeScript_

**Hecho por [Juan Felipe Reyes Sánchez](https://github.com/felipesanchez-dev)**

[![Star this repo](https://img.shields.io/github/stars/felipesanchez-dev/qkits-simulator?style=social)](https://github.com/felipesanchez-dev/qkits-simulator)
[![Follow me](https://img.shields.io/github/followers/felipesanchez-dev?style=social)](https://github.com/felipesanchez-dev)

_Si este proyecto te ayuda en tu aprendizaje, considera darle una ⭐_

</div>

## Autor

<div align="center">

**Juan Felipe Reyes Sánchez**

[![GitHub](https://img.shields.io/badge/GitHub-felipesanchez--dev-black?style=for-the-badge&logo=github)](https://github.com/felipesanchez-dev)

_Desarrollador apasionado por la computación cuántica y las tecnologías emergentes_

</div>

---

## Agradecimientos

Esta librería implementa los principios fundamentales de la mecánica cuántica y computación cuántica de manera educativa y práctica, siguiendo las mejores prácticas de desarrollo de software moderno.

### 🌟 Reconocimientos especiales

Un agradecimiento especial a **Miguel Alfonso Martínez** y su repositorio [QuantumChicken](https://github.com/miguelalfonso-dev/QuantumChicken), que fue una fuente de inspiración y aprendizaje fundamental en mi comprensión de la computación cuántica. Su trabajo me ayudó a entender mejor los conceptos matemáticos y las implementaciones prácticas.

### 📚 Nota personal

Quiero ser transparente: **este proyecto es un esfuerzo educativo** y estoy comenzando mi viaje en el fascinante mundo de la computación cuántica. Si encuentras errores matemáticos o conceptuales, te agradecería enormemente que me los hagas saber. Estoy aquí para aprender y mejorar, y toda retroalimentación constructiva es bienvenida.

La computación cuántica es un campo complejo y en constante evolución, y aunque he puesto mi mejor esfuerzo en implementar correctamente los principios fundamentales, siempre hay espacio para mejorar y corregir. Tu experiencia y conocimientos pueden ayudar a hacer de esta librería una mejor herramienta educativa para toda la comunidad.
