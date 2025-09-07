import { QKits, Gates } from '../src/index';

/**
 * Ejemplo de circuitos cuánticos con múltiples qubits
 */
console.log('=== QKits Simulator - Ejemplo de Circuitos Cuánticos ===\n');

// 1. Crear un circuito cuántico de 2 qubits
console.log('1. Creando circuito cuántico de 2 qubits:');
const circuit2 = QKits.createCircuit(2);
console.log(`Estado inicial: ${circuit2.toString()}`);
console.log(`Número de qubits: ${circuit2.getQubitCount()}`);

// Ver las probabilidades iniciales
const initialProbs = circuit2.getMeasurementProbabilities();
console.log('Probabilidades de los estados computacionales:');
console.log(`|00⟩: ${initialProbs[0].toFixed(3)}`);
console.log(`|01⟩: ${initialProbs[1].toFixed(3)}`);
console.log(`|10⟩: ${initialProbs[2].toFixed(3)}`);
console.log(`|11⟩: ${initialProbs[3].toFixed(3)}\n`);

// 2. Aplicar compuerta Hadamard al primer qubit
console.log('2. Aplicando Hadamard al primer qubit (índice 0):');
const hGate = Gates.H();
circuit2.applyGate(hGate, 0);
console.log(`Estado después de H₀: ${circuit2.toString()}`);

const probsAfterH = circuit2.getMeasurementProbabilities();
console.log('Probabilidades después de Hadamard:');
console.log(`|00⟩: ${probsAfterH[0].toFixed(3)}`);
console.log(`|01⟩: ${probsAfterH[1].toFixed(3)}`);
console.log(`|10⟩: ${probsAfterH[2].toFixed(3)}`);
console.log(`|11⟩: ${probsAfterH[3].toFixed(3)}\n`);

// 3. Aplicar CNOT para crear entrelazamiento
console.log('3. Aplicando CNOT (control=0, target=1):');
circuit2.applyCNOT(0, 1);
console.log(`Estado después de CNOT: ${circuit2.toString()}`);

const probsAfterCNOT = circuit2.getMeasurementProbabilities();
console.log('Probabilidades después de CNOT (Estado de Bell):');
console.log(`|00⟩: ${probsAfterCNOT[0].toFixed(3)}`);
console.log(`|01⟩: ${probsAfterCNOT[1].toFixed(3)}`);
console.log(`|10⟩: ${probsAfterCNOT[2].toFixed(3)}`);
console.log(`|11⟩: ${probsAfterCNOT[3].toFixed(3)}\n`);

// 4. Simular múltiples mediciones del estado de Bell
console.log('4. Simulando 1000 mediciones del estado de Bell:');
const bellResults = new Map<string, number>();

for (let i = 0; i < 1000; i++) {
  const circuitCopy = circuit2.clone();
  const result = circuitCopy.measureAll();
  
  const count = bellResults.get(result) || 0;
  bellResults.set(result, count + 1);
}

console.log('Resultados de medición:');
for (const [state, count] of bellResults.entries()) {
  console.log(`|${state}⟩: ${count} veces (${(count/1000*100).toFixed(1)}%)`);
}
console.log('Esperado: ~50% |00⟩ y ~50% |11⟩ (estados entrelazados)\n');

// 5. Crear un circuito de 3 qubits (Estado GHZ)
console.log('5. Creando estado GHZ con 3 qubits:');
const circuit3 = QKits.createCircuit(3);

// Aplicar H al primer qubit
circuit3.applyGate(hGate, 0);

// Aplicar CNOTs para crear entrelazamiento de 3 qubits
circuit3.applyCNOT(0, 1);
circuit3.applyCNOT(1, 2);

console.log(`Estado GHZ: ${circuit3.toString()}`);

const ghzProbs = circuit3.getMeasurementProbabilities();
console.log('Probabilidades del estado GHZ:');
for (let i = 0; i < 8; i++) {
  const binaryState = i.toString(2).padStart(3, '0');
  console.log(`|${binaryState}⟩: ${ghzProbs[i].toFixed(3)}`);
}
console.log();

// 6. Medición de qubits individuales
console.log('6. Midiendo qubits individuales:');
const testCircuit = QKits.createCircuit(3);

// Crear superposición en el primer qubit
testCircuit.applyGate(hGate, 0);

// Medir solo el primer qubit
const measurement0 = testCircuit.measureQubit(0);
console.log(`Medición del qubit 0: ${measurement0}`);
console.log(`Estado después de medir qubit 0: ${testCircuit.toString()}\n`);

// 7. Aplicar múltiples compuertas en secuencia
console.log('7. Secuencia de compuertas:');
const seqCircuit = QKits.createCircuit(2);

// Secuencia: H₀ → X₁ → CNOT₀₁ → H₁
seqCircuit.applyGate(hGate, 0);
console.log(`Después de H₀: ${seqCircuit.toString()}`);

const xGate = Gates.X();
seqCircuit.applyGate(xGate, 1);
console.log(`Después de X₁: ${seqCircuit.toString()}`);

seqCircuit.applyCNOT(0, 1);
console.log(`Después de CNOT₀₁: ${seqCircuit.toString()}`);

seqCircuit.applyGate(hGate, 1);
console.log(`Después de H₁: ${seqCircuit.toString()}\n`);

// 8. Comparar con estados teóricos esperados
console.log('8. Verificación de estados teóricos:');

// Crear estado |+⟩ = H|0⟩
const plusCircuit = QKits.createCircuit(1);
plusCircuit.applyGate(hGate, 0);
const plusProbs = plusCircuit.getMeasurementProbabilities();
console.log(`Estado |+⟩ - P(|0⟩): ${plusProbs[0].toFixed(3)}, P(|1⟩): ${plusProbs[1].toFixed(3)}`);

// Verificar que es aproximadamente 0.5, 0.5
const isCorrectPlus = Math.abs(plusProbs[0] - 0.5) < 0.001 && Math.abs(plusProbs[1] - 0.5) < 0.001;
console.log(`¿Es correcto el estado |+⟩? ${isCorrectPlus}\n`);

console.log('=== Ejemplo de circuitos completado ===');

export { };  // Para hacer que este archivo sea un módulo
