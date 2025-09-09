import { QKits, Gates } from "../src/index";

console.log("=== Tests de Límites y Validaciones ===\n");

// Test 1: Límite de qubits
console.log("1. Probando límites de qubits:");
try {
  const smallCircuit = QKits.createCircuit(15);
  console.log("✅ 15 qubits: OK (sin advertencia)");
} catch (error) {
  console.log("❌ 15 qubits falló:", error.message);
}

try {
  const mediumCircuit = QKits.createCircuit(20);
  console.log("✅ 20 qubits: OK (con advertencia esperada)");
} catch (error) {
  console.log("❌ 20 qubits falló:", error.message);
}

try {
  const largeCircuit = QKits.createCircuit(30);
  console.log("❌ 30 qubits: NO debería funcionar");
} catch (error) {
  console.log("✅ 30 qubits correctamente bloqueado:", error.message);
}

console.log("\n2. Probando validaciones de ángulos:");
try {
  const validRotation = Gates.Rx(Math.PI / 4);
  console.log("✅ Ángulo válido (π/4): OK");
} catch (error) {
  console.log("❌ Ángulo válido falló:", error.message);
}

try {
  const invalidRotation = Gates.Rx(NaN);
  console.log("❌ Ángulo NaN: NO debería funcionar");
} catch (error) {
  console.log("✅ Ángulo NaN correctamente bloqueado:", error.message);
}

try {
  const infiniteRotation = Gates.Rx(Infinity);
  console.log("❌ Ángulo infinito: NO debería funcionar");
} catch (error) {
  console.log("✅ Ángulo infinito correctamente bloqueado:", error.message);
}

console.log("\n3. Probando conservación física:");

// Estado de Bell
const circuit = QKits.createCircuit(2);
circuit.applyGate(Gates.H(), 0);
circuit.applyCNOT(0, 1);

const probs = circuit.getMeasurementProbabilities();
const totalProb = probs.reduce((sum, p) => sum + p, 0);

console.log(`Probabilidades: [${probs.map((p) => p.toFixed(3)).join(", ")}]`);
console.log(`Suma total: ${totalProb.toFixed(10)}`);

if (Math.abs(totalProb - 1.0) < 1e-10) {
  console.log("✅ Conservación de probabilidad: OK");
} else {
  console.log("❌ Conservación de probabilidad: FALLO");
}

// Verificar normalización del estado
const state = circuit.getState();
const probs2 = state.getProbabilities();
const norm = Math.sqrt(probs2.reduce((sum, p) => sum + p, 0));
console.log(`Norma del estado: ${norm.toFixed(10)}`);

if (Math.abs(norm - 1.0) < 1e-10) {
  console.log("✅ Estado normalizado: OK");
} else {
  console.log("❌ Estado normalizado: FALLO");
}

console.log("\n4. Probando unitariedad de compuertas:");
const gates = [
  { name: "H", gate: Gates.H() },
  { name: "X", gate: Gates.X() },
  { name: "Y", gate: Gates.Y() },
  { name: "Z", gate: Gates.Z() },
  { name: "Rx(π/3)", gate: Gates.Rx(Math.PI / 3) },
  { name: "Ry(π/4)", gate: Gates.Ry(Math.PI / 4) },
  { name: "Rz(π/6)", gate: Gates.Rz(Math.PI / 6) },
];

gates.forEach(({ name, gate }) => {
  const isUnitary = gate.isUnitary();
  console.log(`${isUnitary ? "✅" : "❌"} ${name} es unitaria: ${isUnitary}`);
});

console.log("\n=== Tests de límites completados ===");
