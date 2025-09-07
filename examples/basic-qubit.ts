import { QKits, Gates, Qubit, ComplexNumber } from '../src/index';

/**
 * Ejemplo básico de operaciones con qubits individuales
 */
console.log('=== QKits Simulator - Ejemplo Básico de Qubits ===\n');

// 1. Crear un qubit en estado |0⟩
console.log('1. Creando qubit en estado |0⟩:');
const qubit0 = QKits.createQubit();
console.log(`Estado inicial: ${qubit0.toString()}`);
console.log(`Probabilidad |0⟩: ${qubit0.getProbabilityZero().toFixed(3)}`);
console.log(`Probabilidad |1⟩: ${qubit0.getProbabilityOne().toFixed(3)}\n`);

// 2. Crear un qubit en estado |1⟩
console.log('2. Creando qubit en estado |1⟩:');
const qubit1 = Qubit.one();
console.log(`Estado: ${qubit1.toString()}`);
console.log(`Probabilidad |0⟩: ${qubit1.getProbabilityZero().toFixed(3)}`);
console.log(`Probabilidad |1⟩: ${qubit1.getProbabilityOne().toFixed(3)}\n`);

// 3. Aplicar compuerta Hadamard para crear superposición
console.log('3. Aplicando compuerta Hadamard al qubit |0⟩:');
const qubitSuperposition = QKits.createQubit();
const hadamardGate = Gates.H();
const newState = hadamardGate.apply(qubitSuperposition.getState());
qubitSuperposition.setState(newState);

console.log(`Estado después de H: ${qubitSuperposition.toString()}`);
console.log(`Probabilidad |0⟩: ${qubitSuperposition.getProbabilityZero().toFixed(3)}`);
console.log(`Probabilidad |1⟩: ${qubitSuperposition.getProbabilityOne().toFixed(3)}`);
console.log(`¿Está en superposición? ${qubitSuperposition.isInSuperposition()}\n`);

// 4. Aplicar compuerta X (NOT cuántica)
console.log('4. Aplicando compuerta X (NOT cuántica) al qubit |0⟩:');
const qubitX = QKits.createQubit();
const xGate = Gates.X();
const stateAfterX = xGate.apply(qubitX.getState());
qubitX.setState(stateAfterX);

console.log(`Estado después de X: ${qubitX.toString()}`);
console.log(`Probabilidad |0⟩: ${qubitX.getProbabilityZero().toFixed(3)}`);
console.log(`Probabilidad |1⟩: ${qubitX.getProbabilityOne().toFixed(3)}\n`);

// 5. Crear qubit con amplitudes personalizadas
console.log('5. Creando qubit con amplitudes personalizadas:');
const alpha = new ComplexNumber(0.6, 0);      // 60% probabilidad para |0⟩
const beta = new ComplexNumber(0.8, 0);       // 80% probabilidad para |1⟩
const customQubit = Qubit.fromAmplitudes(alpha, beta);

console.log(`Estado personalizado: ${customQubit.toString()}`);
console.log(`Probabilidad |0⟩: ${customQubit.getProbabilityZero().toFixed(3)}`);
console.log(`Probabilidad |1⟩: ${customQubit.getProbabilityOne().toFixed(3)}\n`);

// 6. Simulación de mediciones múltiples
console.log('6. Simulando 1000 mediciones del qubit en superposición:');
let count0 = 0;
let count1 = 0;

for (let i = 0; i < 1000; i++) {
  const qubitCopy = QKits.createQubit();
  const hState = hadamardGate.apply(qubitCopy.getState());
  qubitCopy.setState(hState);
  
  const measurement = qubitCopy.measure();
  if (measurement === 0) {
    count0++;
  } else {
    count1++;
  }
}

console.log(`Resultados después de 1000 mediciones:`);
console.log(`|0⟩: ${count0} veces (${(count0/1000*100).toFixed(1)}%)`);
console.log(`|1⟩: ${count1} veces (${(count1/1000*100).toFixed(1)}%)`);
console.log(`Esperado: ~50% cada uno\n`);

// 7. Operaciones con compuertas de rotación
console.log('7. Aplicando rotaciones Rx, Ry, Rz:');
const rotQubit = QKits.createQubit();

// Rotación de π/4 radianes alrededor del eje X
const rxGate = Gates.Rx(Math.PI / 4);
const stateAfterRx = rxGate.apply(rotQubit.getState());
rotQubit.setState(stateAfterRx);

console.log(`Estado después de Rx(π/4): ${rotQubit.toString()}`);
console.log(`Probabilidad |0⟩: ${rotQubit.getProbabilityZero().toFixed(3)}`);
console.log(`Probabilidad |1⟩: ${rotQubit.getProbabilityOne().toFixed(3)}\n`);

// 8. Verificar que las compuertas son unitarias
console.log('8. Verificando propiedades unitarias de las compuertas:');
console.log(`Hadamard es unitaria: ${hadamardGate.isUnitary()}`);
console.log(`X es unitaria: ${xGate.isUnitary()}`);
console.log(`Rx(π/4) es unitaria: ${rxGate.isUnitary()}\n`);

console.log('=== Ejemplo completado ===');

export { };  // Para hacer que este archivo sea un módulo
