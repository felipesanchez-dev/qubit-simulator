# 📦 Guía Completa de Instalación y Uso

## 🚀 **INSTALACIÓN DESDE NPM** (Una vez publicado)

### Instalación básica:
```bash
npm install qubit-simulator
```

### Para TypeScript:
```bash
npm install qubit-simulator
npm install -D @types/node  # Si usas Node.js
```

### Para proyectos ES6/ESM:
```json
// package.json
{
  "type": "module"
}
```

## 🎯 **GUÍA DE USO PASO A PASO**

### **1. Importación Básica**

```javascript
// CommonJS (Node.js tradicional)
const { QKits, Gates, Qubit, ComplexNumber } = require('qubit-simulator');

// ES6 Modules (moderno)
import { QKits, Gates, Qubit, ComplexNumber } from 'qubit-simulator';

// TypeScript
import { 
  QKits, 
  Gates, 
  Qubit, 
  QuantumCircuit, 
  ComplexNumber,
  QuantumState 
} from 'qubit-simulator';
```

### **2. Ejemplos Progresivos**

#### **Nivel 1: Qubit Individual**
```typescript
import { QKits, Gates } from 'qubit-simulator';

// Crear qubit en |0⟩
const qubit = QKits.createQubit();
console.log(`Probabilidad |0⟩: ${qubit.getProbabilityZero()}`); // 1.0

// Aplicar Hadamard -> superposición
const hadamard = Gates.H();
const newState = hadamard.apply(qubit.getState());
qubit.setState(newState);

console.log(`Después de H - P(|0⟩): ${qubit.getProbabilityZero()}`); // 0.5
console.log(`Después de H - P(|1⟩): ${qubit.getProbabilityOne()}`);  // 0.5

// Medir
const result = qubit.measure();
console.log(`Medición: ${result}`); // 0 o 1 aleatoriamente
```

#### **Nivel 2: Entrelazamiento (Estado de Bell)**
```typescript
import { QKits, Gates } from 'qubit-simulator';

// Crear circuito de 2 qubits
const circuit = QKits.createCircuit(2);

// Crear estado de Bell |Φ+⟩ = (|00⟩ + |11⟩)/√2
circuit.applyGate(Gates.H(), 0);  // Hadamard al qubit 0
circuit.applyCNOT(0, 1);          // CNOT: control=0, target=1

// Verificar entrelazamiento
const probs = circuit.getMeasurementProbabilities();
console.log('Probabilidades:', probs);
// [0.5, 0, 0, 0.5] -> Solo |00⟩ y |11⟩ tienen probabilidad

// Medir todo el sistema
const result = circuit.measureAll();
console.log(`Resultado: ${result.result}`); // "00" o "11" con 50% cada uno
```

#### **Nivel 3: Algoritmos Cuánticos**
```typescript
import { QKits, Gates } from 'qubit-simulator';

// Estado GHZ con 3 qubits: |GHZ⟩ = (|000⟩ + |111⟩)/√2
const circuit = QKits.createCircuit(3);

circuit.applyGate(Gates.H(), 0);   // Superposición
circuit.applyCNOT(0, 1);           // Entrelazar 0-1
circuit.applyCNOT(1, 2);           // Entrelazar 1-2

// Todos los qubits están entrelazados
const finalProbs = circuit.getMeasurementProbabilities();
console.log('Estado GHZ:', finalProbs);
// [0.5, 0, 0, 0, 0, 0, 0, 0.5] -> Solo |000⟩ y |111⟩
```

### **3. Todas las Compuertas Disponibles**

```typescript
import { Gates } from 'qubit-simulator';

// Compuertas básicas (Pauli)
Gates.X()  // NOT cuántica
Gates.Y()  // Pauli-Y
Gates.Z()  // Pauli-Z

// Hadamard y control
Gates.H()  // Hadamard (superposición)
Gates.I()  // Identidad

// Fases
Gates.S()  // Fase π/2
Gates.T()  // Fase π/4

// Rotaciones paramétricas
Gates.Rx(Math.PI/4)  // Rotación X
Gates.Ry(Math.PI/3)  // Rotación Y  
Gates.Rz(Math.PI/2)  // Rotación Z

// Aplicar a circuito
const circuit = QKits.createCircuit(2);
circuit.applyGate(Gates.Rx(Math.PI/4), 0);
circuit.applyCNOT(0, 1);
```

### **4. Números Complejos Personalizados**

```typescript
import { ComplexNumber, Qubit } from 'qubit-simulator';

// Crear números complejos
const real = ComplexNumber.fromReal(0.6);        // 0.6 + 0i
const imag = ComplexNumber.fromImaginary(0.8);   // 0 + 0.8i
const complex = new ComplexNumber(0.3, 0.4);     // 0.3 + 0.4i

// Operaciones
const sum = real.add(complex);
const product = complex.multiply(imag);
const magnitude = complex.magnitude();

// Crear qubit personalizado
const alpha = new ComplexNumber(0.6, 0);  // Amplitud para |0⟩
const beta = new ComplexNumber(0.8, 0);   // Amplitud para |1⟩
const customQubit = Qubit.fromAmplitudes(alpha, beta);

console.log(`P(|0⟩): ${customQubit.getProbabilityZero()}`); // 0.36
console.log(`P(|1⟩): ${customQubit.getProbabilityOne()}`);  // 0.64
```

## ⚠️ **LÍMITES Y RECOMENDACIONES**

### **Límites de Rendimiento:**
```typescript
// ✅ RECOMENDADO: 1-15 qubits
const smallCircuit = QKits.createCircuit(10);  // ~16 KB RAM

// ⚠️ PRECAUCIÓN: 16-25 qubits  
const mediumCircuit = QKits.createCircuit(20); // ~16 MB RAM
// Aparecerá advertencia automática

// ❌ PROHIBIDO: 26+ qubits
try {
  const largeCircuit = QKits.createCircuit(30); // Error automático
} catch (error) {
  console.error(error.message); // "limited to 25 qubits"
}
```

### **Monitoreo de Memoria:**
```typescript
// Verificar uso de memoria
const circuit = QKits.createCircuit(20);
const memoryUsage = process.memoryUsage();
console.log(`Memoria usada: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
```

## 🔬 **VALIDACIÓN FÍSICA CUÁNTICA**

Todas las operaciones son físicamente coherentes:

```typescript
import { QKits, Gates } from 'qubit-simulator';

// ✅ Estados normalizados
const qubit = QKits.createQubit();
const state = qubit.getState();
console.log(`Norma: ${state.norm()}`); // Siempre 1.0

// ✅ Compuertas unitarias
const hadamard = Gates.H();
console.log(`H es unitaria: ${hadamard.isUnitary()}`); // true

// ✅ Conservación de probabilidad
const circuit = QKits.createCircuit(3);
circuit.applyGate(Gates.H(), 0);
circuit.applyCNOT(0, 1);

const probs = circuit.getMeasurementProbabilities();
const totalProb = probs.reduce((sum, p) => sum + p, 0);
console.log(`Probabilidad total: ${totalProb}`); // Siempre 1.0
```

## 📊 **CASOS DE USO TÍPICOS**

1. **Educación**: Aprender conceptos de mecánica cuántica
2. **Prototipado**: Probar algoritmos cuánticos pequeños
3. **Investigación**: Simular circuitos cuánticos específicos
4. **Desarrollo**: Preparar código para computadoras cuánticas reales

## 🚨 **LIMITACIONES IMPORTANTES**

- **No es una computadora cuántica real**: Es simulación clásica
- **Escala exponencial**: RAM crece como 2^n con n qubits
- **Sin ruido cuántico**: Estados "perfectos" sin decoherencia
- **Sin corrección de errores**: No simula errores cuánticos reales
