import { Qubit } from "../../domain/entities/Qubit";
import { QuantumCircuit } from "../../domain/entities/QuantumCircuit";
import { QuantumState } from "../../domain/value-objects/QuantumState";
import { ComplexNumber } from "../../domain/value-objects/ComplexNumber";
import {
  IQuantumGate,
  IMatrixOperations,
  IQuantumMeasurement,
} from "../../domain/interfaces/IQuantumOperations";

/**
 * Use case for creating and manipulating single qubits
 */
export class QubitUseCase {
  constructor(private measurementService: IQuantumMeasurement) {}

  /**
   * Creates a qubit in the |0⟩ state
   */
  createZeroQubit(): Qubit {
    return new Qubit(QuantumState.zero(), this.measurementService);
  }

  /**
   * Creates a qubit in the |1⟩ state
   */
  createOneQubit(): Qubit {
    return new Qubit(QuantumState.one(), this.measurementService);
  }

  /**
   * Creates a qubit in superposition |+⟩ = (|0⟩ + |1⟩)/√2
   */
  createPlusQubit(): Qubit {
    return new Qubit(QuantumState.plus(), this.measurementService);
  }

  /**
   * Creates a qubit with custom amplitudes
   */
  createCustomQubit(alpha: ComplexNumber, beta: ComplexNumber): Qubit {
    const state = new QuantumState([alpha, beta]);
    return new Qubit(state, this.measurementService);
  }

  /**
   * Applies a gate to a qubit
   */
  applyGateToQubit(qubit: Qubit, gate: IQuantumGate): void {
    if (gate.qubitCount !== 1) {
      throw new Error("Gate must be a single-qubit gate");
    }

    const newState = gate.apply(qubit.getState());
    qubit.setState(newState);
  }

  /**
   * Measures a qubit multiple times to estimate probabilities
   */
  estimateProbabilities(
    qubit: Qubit,
    measurements: number
  ): {
    zeroCount: number;
    oneCount: number;
    probabilityZero: number;
    probabilityOne: number;
  } {
    let zeroCount = 0;
    let oneCount = 0;

    for (let i = 0; i < measurements; i++) {
      const qubitCopy = qubit.clone();
      const result = qubitCopy.measure();

      if (result === 0) {
        zeroCount++;
      } else {
        oneCount++;
      }
    }

    return {
      zeroCount,
      oneCount,
      probabilityZero: zeroCount / measurements,
      probabilityOne: oneCount / measurements,
    };
  }
}

/**
 * Use case for creating and manipulating quantum circuits
 */
export class QuantumCircuitUseCase {
  constructor(
    private matrixOperations: IMatrixOperations,
    private measurementService: IQuantumMeasurement
  ) {}

  /**
   * Creates a quantum circuit with all qubits in |0⟩ state
   */
  createCircuit(qubitCount: number): QuantumCircuit {
    return new QuantumCircuit(
      qubitCount,
      this.matrixOperations,
      this.measurementService
    );
  }

  /**
   * Creates a quantum circuit with a custom initial state
   */
  createCircuitWithState(state: QuantumState): QuantumCircuit {
    return new QuantumCircuit(
      state.getQubitCount(),
      this.matrixOperations,
      this.measurementService,
      state
    );
  }

  /**
   * Creates a Bell state (maximally entangled 2-qubit state)
   */
  createBellState(gate: IQuantumGate): QuantumCircuit {
    const circuit = this.createCircuit(2);

    // Apply Hadamard to first qubit
    circuit.applyGate(gate, 0); // Assuming gate is Hadamard

    // Apply CNOT
    circuit.applyCNOT(0, 1);

    return circuit;
  }

  /**
   * Creates a GHZ state (3-qubit entangled state)
   */
  createGHZState(hGate: IQuantumGate): QuantumCircuit {
    const circuit = this.createCircuit(3);

    // Apply Hadamard to first qubit
    circuit.applyGate(hGate, 0);

    // Apply CNOT gates to create entanglement
    circuit.applyCNOT(0, 1);
    circuit.applyCNOT(1, 2);

    return circuit;
  }

  /**
   * Runs multiple measurements on a circuit to estimate probabilities
   */
  estimateCircuitProbabilities(
    circuit: QuantumCircuit,
    measurements: number
  ): Map<string, number> {
    const results = new Map<string, number>();

    for (let i = 0; i < measurements; i++) {
      const circuitCopy = circuit.clone();
      const result = circuitCopy.measureAll();

      const count = results.get(result) || 0;
      results.set(result, count + 1);
    }

    // Convert counts to probabilities
    const probabilities = new Map<string, number>();
    for (const [outcome, count] of results.entries()) {
      probabilities.set(outcome, count / measurements);
    }

    return probabilities;
  }

  /**
   * Performs quantum teleportation protocol
   */
  quantumTeleportation(
    stateToTeleport: QuantumState,
    hGate: IQuantumGate,
    xGate: IQuantumGate,
    zGate: IQuantumGate
  ): {
    classicalBits: [number, number];
    finalState: QuantumState;
  } {
    // Create 3-qubit circuit: qubit to teleport + Bell pair
    const circuit = this.createCircuit(3);

    // Prepare the state to teleport in qubit 0
    circuit
      .getState()
      .getAmplitudes()
      .forEach((_, index) => {
        // This is a simplified implementation
        // In practice, we'd need to properly set the state
      });

    // Create Bell pair between qubits 1 and 2
    circuit.applyGate(hGate, 1);
    circuit.applyCNOT(1, 2);

    // Bell measurement on qubits 0 and 1
    circuit.applyCNOT(0, 1);
    circuit.applyGate(hGate, 0);

    const bit0 = circuit.measureQubit(0);
    const bit1 = circuit.measureQubit(1);

    // Apply corrections to qubit 2 based on measurement results
    if (bit1 === 1) {
      circuit.applyGate(xGate, 2);
    }
    if (bit0 === 1) {
      circuit.applyGate(zGate, 2);
    }

    return {
      classicalBits: [bit0, bit1],
      finalState: circuit.getState(),
    };
  }
}

/**
 * Use case for quantum algorithms
 */
export class QuantumAlgorithmUseCase {
  constructor(
    private matrixOperations: IMatrixOperations,
    private measurementService: IQuantumMeasurement
  ) {}

  /**
   * Implements Deutsch's algorithm
   */
  deutschAlgorithm(oracleGate: IQuantumGate, hGate: IQuantumGate): boolean {
    const circuit = new QuantumCircuit(
      2,
      this.matrixOperations,
      this.measurementService
    );

    // Initialize: |0⟩|1⟩
    circuit.applyGate(hGate, 1); // Creates |0⟩|-⟩

    // Apply Hadamard to first qubit
    circuit.applyGate(hGate, 0); // Creates |+⟩|-⟩

    // Apply oracle
    circuit.applyMultiQubitGate(oracleGate, [0, 1]);

    // Apply Hadamard to first qubit again
    circuit.applyGate(hGate, 0);

    // Measure first qubit
    const result = circuit.measureQubit(0);

    // If result is 0, function is constant; if 1, function is balanced
    return result === 1;
  }

  /**
   * Implements Grover's algorithm (simplified version)
   */
  groverAlgorithm(
    searchItems: number,
    markedItem: number,
    hGate: IQuantumGate,
    oracleGate: IQuantumGate,
    diffusionGate: IQuantumGate
  ): number {
    const qubitCount = Math.ceil(Math.log2(searchItems));
    const circuit = new QuantumCircuit(
      qubitCount,
      this.matrixOperations,
      this.measurementService
    );

    // Initialize superposition
    for (let i = 0; i < qubitCount; i++) {
      circuit.applyGate(hGate, i);
    }

    // Calculate optimal number of iterations
    const iterations = Math.floor((Math.PI / 4) * Math.sqrt(searchItems));

    // Grover iterations
    for (let i = 0; i < iterations; i++) {
      // Apply oracle
      circuit.applyMultiQubitGate(
        oracleGate,
        Array.from({ length: qubitCount }, (_, i) => i)
      );

      // Apply diffusion operator
      circuit.applyMultiQubitGate(
        diffusionGate,
        Array.from({ length: qubitCount }, (_, i) => i)
      );
    }

    // Measure and return result
    const result = circuit.measureAll();
    return parseInt(result, 2);
  }
}
