import { QKits, Gates, Qubit, ComplexNumber } from '../src/index';

/**
 * Test simple para verificar las funcionalidades principales
 */
console.log('=== Tests de QKits Simulator ===\n');

let passedTests = 0;
let totalTests = 0;

function test(name: string, condition: boolean): void {
  totalTests++;
  if (condition) {
    console.log(`✅ ${name}`);
    passedTests++;
  } else {
    console.log(`❌ ${name}`);
  }
}

// Test 1: Crear qubit en estado |0⟩
const qubit0 = QKits.createQubit();
test('Qubit |0⟩ tiene probabilidad 1 para |0⟩', Math.abs(qubit0.getProbabilityZero() - 1) < 1e-10);
test('Qubit |0⟩ tiene probabilidad 0 para |1⟩', Math.abs(qubit0.getProbabilityOne() - 0) < 1e-10);

// Test 2: Crear qubit en estado |1⟩
const qubit1 = Qubit.one();
test('Qubit |1⟩ tiene probabilidad 0 para |0⟩', Math.abs(qubit1.getProbabilityZero() - 0) < 1e-10);
test('Qubit |1⟩ tiene probabilidad 1 para |1⟩', Math.abs(qubit1.getProbabilityOne() - 1) < 1e-10);

// Test 3: Compuerta Hadamard
const qubitH = QKits.createQubit();
const hGate = Gates.H();
const stateAfterH = hGate.apply(qubitH.getState());
qubitH.setState(stateAfterH);
test('Hadamard en |0⟩ da 50% probabilidad para |0⟩', Math.abs(qubitH.getProbabilityZero() - 0.5) < 1e-10);
test('Hadamard en |0⟩ da 50% probabilidad para |1⟩', Math.abs(qubitH.getProbabilityOne() - 0.5) < 1e-10);
test('Qubit después de Hadamard está en superposición', qubitH.isInSuperposition());

// Test 4: Compuerta X (NOT)
const qubitX = QKits.createQubit();
const xGate = Gates.X();
const stateAfterX = xGate.apply(qubitX.getState());
qubitX.setState(stateAfterX);
test('X|0⟩ = |1⟩', Math.abs(qubitX.getProbabilityOne() - 1) < 1e-10);

// Test 5: Propiedades unitarias
test('Hadamard es unitaria', hGate.isUnitary());
test('X es unitaria', xGate.isUnitary());
test('Y es unitaria', Gates.Y().isUnitary());
test('Z es unitaria', Gates.Z().isUnitary());

// Test 6: Números complejos
const c1 = new ComplexNumber(3, 4);
const c2 = new ComplexNumber(1, 2);
const sum = c1.add(c2);
test('Suma de números complejos', sum.real === 4 && sum.imaginary === 6);
test('Magnitud de número complejo', Math.abs(c1.magnitude() - 5) < 1e-10);

// Test 7: Circuito cuántico básico
const circuit = QKits.createCircuit(2);
test('Circuito 2-qubit inicia en |00⟩', Math.abs(circuit.getMeasurementProbabilities()[0] - 1) < 1e-10);

// Test 8: Estado de Bell
const bellCircuit = QKits.createCircuit(2);
bellCircuit.applyGate(hGate, 0);
bellCircuit.applyCNOT(0, 1);
const bellProbs = bellCircuit.getMeasurementProbabilities();
test('Estado de Bell: P(|00⟩) = 0.5', Math.abs(bellProbs[0] - 0.5) < 1e-10);
test('Estado de Bell: P(|01⟩) = 0', Math.abs(bellProbs[1] - 0) < 1e-10);
test('Estado de Bell: P(|10⟩) = 0', Math.abs(bellProbs[2] - 0) < 1e-10);
test('Estado de Bell: P(|11⟩) = 0.5', Math.abs(bellProbs[3] - 0.5) < 1e-10);

// Test 9: Normalización de estados
const alpha = new ComplexNumber(0.6, 0);
const beta = new ComplexNumber(0.8, 0);
const customQubit = Qubit.fromAmplitudes(alpha, beta);
const totalProb = customQubit.getProbabilityZero() + customQubit.getProbabilityOne();
test('Estado cuántico está normalizado', Math.abs(totalProb - 1) < 1e-10);

// Test 10: Rotaciones
const rxGate = Gates.Rx(Math.PI);
const qubitRx = QKits.createQubit();
const stateAfterRx = rxGate.apply(qubitRx.getState());
qubitRx.setState(stateAfterRx);
test('Rx(π) es unitaria', rxGate.isUnitary());
// Rx(π)|0⟩ debería dar una combinación compleja

// Test 11: Estado GHZ
const ghzCircuit = QKits.createCircuit(3);
ghzCircuit.applyGate(hGate, 0);
ghzCircuit.applyCNOT(0, 1);
ghzCircuit.applyCNOT(1, 2);
const ghzProbs = ghzCircuit.getMeasurementProbabilities();
test('Estado GHZ: P(|000⟩) = 0.5', Math.abs(ghzProbs[0] - 0.5) < 1e-10);
test('Estado GHZ: P(|111⟩) = 0.5', Math.abs(ghzProbs[7] - 0.5) < 1e-10);

// Test 12: Conservación de probabilidad
let totalProbGHZ = 0;
for (let i = 0; i < ghzProbs.length; i++) {
  totalProbGHZ += ghzProbs[i];
}
test('Probabilidades se conservan en GHZ', Math.abs(totalProbGHZ - 1) < 1e-10);

// Resumen
console.log(`\n=== Resumen de Tests ===`);
console.log(`Tests pasados: ${passedTests}/${totalTests}`);
console.log(`Porcentaje de éxito: ${(passedTests/totalTests*100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log(`🎉 ¡Todos los tests pasaron! La librería QKits funciona correctamente.`);
} else {
  console.log(`⚠️  Algunos tests fallaron. Revisar la implementación.`);
}

export { };  // Para hacer que este archivo sea un módulo
