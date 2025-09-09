import { QKits, Gates } from "../src/index";

console.log("🚀 QUBIT SIMULATOR - DEMOSTRACIÓN COMPLETA\n");

// ========================================
// 1. EJEMPLO BÁSICO: SUPERPOSICIÓN
// ========================================
console.log("1️⃣ SUPERPOSICIÓN CUÁNTICA:");
const qubit = QKits.createQubit();
console.log(
  `   Estado inicial: P(|0⟩)=${qubit
    .getProbabilityZero()
    .toFixed(3)}, P(|1⟩)=${qubit.getProbabilityOne().toFixed(3)}`
);

// Aplicar Hadamard
const H = Gates.H();
qubit.setState(H.apply(qubit.getState()));
console.log(
  `   Después de H: P(|0⟩)=${qubit
    .getProbabilityZero()
    .toFixed(3)}, P(|1⟩)=${qubit.getProbabilityOne().toFixed(3)}`
);
console.log(`   ¿En superposición?: ${qubit.isInSuperposition()}\n`);

// ========================================
// 2. ENTRELAZAMIENTO CUÁNTICO (ESTADO DE BELL)
// ========================================
console.log("2️⃣ ENTRELAZAMIENTO CUÁNTICO (Estado de Bell):");
const bellCircuit = QKits.createCircuit(2);

// Crear estado |Φ+⟩ = (|00⟩ + |11⟩)/√2
bellCircuit.applyGate(Gates.H(), 0);
bellCircuit.applyCNOT(0, 1);

const bellProbs = bellCircuit.getMeasurementProbabilities();
console.log(
  `   Probabilidades: |00⟩=${bellProbs[0].toFixed(
    3
  )}, |01⟩=${bellProbs[1].toFixed(3)}, |10⟩=${bellProbs[2].toFixed(
    3
  )}, |11⟩=${bellProbs[3].toFixed(3)}`
);
console.log(`   Solo |00⟩ y |11⟩ tienen probabilidad = ENTRELAZADOS ✨\n`);

// ========================================
// 3. ALGORITMO CUÁNTICO: ESTADO GHZ
// ========================================
console.log("3️⃣ ALGORITMO GHZ (3 qubits entrelazados):");
const ghzCircuit = QKits.createCircuit(3);

// Crear |GHZ⟩ = (|000⟩ + |111⟩)/√2
ghzCircuit.applyGate(Gates.H(), 0);
ghzCircuit.applyCNOT(0, 1);
ghzCircuit.applyCNOT(1, 2);

const ghzProbs = ghzCircuit.getMeasurementProbabilities();
console.log(`   Estados con probabilidad no-cero:`);
ghzProbs.forEach((prob, index) => {
  if (prob > 0.001) {
    const binaryState = index.toString(2).padStart(3, "0");
    console.log(`   |${binaryState}⟩: ${prob.toFixed(3)}`);
  }
});
console.log(`   Los 3 qubits están entrelazados 🔗\n`);

// ========================================
// 4. ROTACIONES CUÁNTICAS
// ========================================
console.log("4️⃣ ROTACIONES CUÁNTICAS:");
const rotQubit = QKits.createQubit();

// Rotación Ry(π/3) - 60 grados
const ryGate = Gates.Ry(Math.PI / 3);
rotQubit.setState(ryGate.apply(rotQubit.getState()));

console.log(`   Después de Ry(π/3):`);
console.log(`   P(|0⟩) = ${rotQubit.getProbabilityZero().toFixed(3)}`);
console.log(`   P(|1⟩) = ${rotQubit.getProbabilityOne().toFixed(3)}`);
console.log(`   Ángulo controlado con precisión ⚖️\n`);

// ========================================
// 5. VALIDACIÓN FÍSICA
// ========================================
console.log("5️⃣ VALIDACIÓN FÍSICA CUÁNTICA:");

// Verificar unitariedad
const gates = [Gates.H(), Gates.X(), Gates.Rx(Math.PI / 4)];
console.log(`   Compuertas unitarias:`);
gates.forEach((gate) => {
  console.log(`   ${gate.name}: ${gate.isUnitary() ? "✅" : "❌"}`);
});

// Verificar conservación de probabilidad
const conservationCircuit = QKits.createCircuit(2);
conservationCircuit.applyGate(Gates.H(), 0);
conservationCircuit.applyGate(Gates.Ry(Math.PI / 6), 1);
conservationCircuit.applyCNOT(0, 1);

const finalProbs = conservationCircuit.getMeasurementProbabilities();
const totalProbability = finalProbs.reduce((sum, p) => sum + p, 0);
console.log(
  `   Suma de probabilidades: ${totalProbability.toFixed(10)} (debe ser 1.0)`
);
console.log(
  `   Conservación: ${Math.abs(totalProbability - 1) < 1e-10 ? "✅" : "❌"}\n`
);

// ========================================
// 6. SIMULACIÓN ESTADÍSTICA
// ========================================
console.log("6️⃣ SIMULACIÓN ESTADÍSTICA (1000 mediciones):");
const statCircuit = QKits.createCircuit(2);
statCircuit.applyGate(Gates.H(), 0);
statCircuit.applyCNOT(0, 1);

const measurements = { "00": 0, "11": 0 };
for (let i = 0; i < 1000; i++) {
  // Crear nueva copia para cada medición
  const tempCircuit = QKits.createCircuit(2);
  tempCircuit.applyGate(Gates.H(), 0);
  tempCircuit.applyCNOT(0, 1);

  const result = tempCircuit.measureAll();
  measurements[result as "00" | "11"]++;
}

console.log(`   Resultados después de 1000 mediciones:`);
console.log(
  `   |00⟩: ${measurements["00"]} veces (${(measurements["00"] / 10).toFixed(
    1
  )}%)`
);
console.log(
  `   |11⟩: ${measurements["11"]} veces (${(measurements["11"] / 10).toFixed(
    1
  )}%)`
);
console.log(`   Esperado: ~50% cada uno (distribución cuántica real) 📊\n`);

// ========================================
// 7. LÍMITES Y ADVERTENCIAS
// ========================================
console.log("7️⃣ DEMOSTRACIÓN DE LÍMITES DE SEGURIDAD:");

try {
  console.log(`   Creando circuito de 20 qubits (debería advertir):`);
  const bigCircuit = QKits.createCircuit(20);
  console.log(`   ✅ Creado exitosamente con advertencia de memoria`);
} catch (error) {
  console.log(`   ❌ Error: ${error.message}`);
}

try {
  console.log(`   Intentando crear circuito de 30 qubits (debería fallar):`);
  const tooLargeCircuit = QKits.createCircuit(30);
  console.log(`   ❌ NO debería llegar aquí`);
} catch (error) {
  console.log(`   ✅ Correctamente bloqueado: "${error.message}"`);
}

console.log("\n🎉 DEMOSTRACIÓN COMPLETADA");
console.log("");
console.log("📚 Esta librería simula correctamente:");
console.log("   • Estados cuánticos matemáticamente exactos");
console.log("   • Entrelazamiento cuántico real");
console.log("   • Mediciones probabilísticas auténticas");
console.log("   • Conservación de probabilidades");
console.log("   • Compuertas unitarias verificadas");
console.log("");
console.log("⚠️  Limitaciones (inherentes a simulación clásica):");
console.log("   • Crecimiento exponencial: RAM = 2^n × 16 bytes");
console.log("   • Máximo recomendado: 25 qubits (~512 MB)");
console.log('   • Sin ruido cuántico (estados "perfectos")');
console.log("");
console.log("🎯 Ideal para: educación, prototipado, algoritmos pequeños");
