import { QuantumState } from "../value-objects/QuantumState";
import { ComplexNumber } from "../value-objects/ComplexNumber";
import {
  IQuantumGate,
  IQuantumMeasurement,
  IMatrixOperations,
} from "../interfaces/IQuantumOperations";

/**
 * Represents a quantum circuit with multiple qubits
 */
export class QuantumCircuit {
  private state: QuantumState;
  private readonly qubitCount: number;

  constructor(
    qubitCount: number,
    private matrixOperations?: IMatrixOperations,
    private measurementService?: IQuantumMeasurement,
    initialState?: QuantumState
  ) {
    if (qubitCount <= 0) {
      throw new Error("Quantum circuit must have at least 1 qubit");
    }

    this.qubitCount = qubitCount;

    if (initialState) {
      if (initialState.getQubitCount() !== qubitCount) {
        throw new Error(`Initial state must have ${qubitCount} qubits`);
      }
      this.state = initialState;
    } else {
      // Initialize all qubits to |0⟩ state
      const dimension = Math.pow(2, qubitCount);
      const amplitudes = Array(dimension)
        .fill(null)
        .map((_, index) => ComplexNumber.fromReal(index === 0 ? 1 : 0));
      this.state = new QuantumState(amplitudes);
    }
  }

  /**
   * Gets the current quantum state of the circuit
   */
  getState(): QuantumState {
    return this.state;
  }

  /**
   * Gets the number of qubits in the circuit
   */
  getQubitCount(): number {
    return this.qubitCount;
  }

  /**
   * Applies a single-qubit gate to a specific qubit
   */
  applyGate(gate: IQuantumGate, targetQubit: number): void {
    if (gate.qubitCount !== 1) {
      throw new Error("Use applyMultiQubitGate for multi-qubit gates");
    }

    this.validateQubitIndex(targetQubit);

    if (!this.matrixOperations) {
      throw new Error("Matrix operations service not provided");
    }

    // Build the full gate matrix for the entire circuit
    const fullGateMatrix = this.buildSingleQubitGateMatrix(gate, targetQubit);

    // Apply the gate to the state
    const newAmplitudes = this.matrixOperations.multiplyVector(
      fullGateMatrix,
      this.state.getAmplitudes()
    );

    this.state = new QuantumState(newAmplitudes);
  }

  /**
   * Applies a multi-qubit gate to specific qubits
   */
  applyMultiQubitGate(gate: IQuantumGate, targetQubits: number[]): void {
    if (gate.qubitCount !== targetQubits.length) {
      throw new Error(
        `Gate requires ${gate.qubitCount} qubits, but ${targetQubits.length} provided`
      );
    }

    targetQubits.forEach((qubit) => this.validateQubitIndex(qubit));

    if (!this.matrixOperations) {
      throw new Error("Matrix operations service not provided");
    }

    // For multi-qubit gates, we need to build the full circuit matrix
    const fullGateMatrix = this.buildMultiQubitGateMatrix(gate, targetQubits);

    // Apply the gate to the state
    const newAmplitudes = this.matrixOperations.multiplyVector(
      fullGateMatrix,
      this.state.getAmplitudes()
    );

    this.state = new QuantumState(newAmplitudes);
  }

  /**
   * Applies a CNOT gate (controlled-NOT)
   */
  applyCNOT(controlQubit: number, targetQubit: number): void {
    this.validateQubitIndex(controlQubit);
    this.validateQubitIndex(targetQubit);

    if (controlQubit === targetQubit) {
      throw new Error("Control and target qubits must be different");
    }

    // CNOT implementation using proper bit manipulation
    const newAmplitudes = [...this.state.getAmplitudes()];
    const dimension = this.state.getDimension();

    // We need to iterate through all basis states and apply CNOT logic
    for (let i = 0; i < dimension; i++) {
      const controlBit = (i >> (this.qubitCount - 1 - controlQubit)) & 1;

      if (controlBit === 1) {
        // Flip the target bit
        const targetBitPosition = this.qubitCount - 1 - targetQubit;
        const flippedIndex = i ^ (1 << targetBitPosition);

        // Swap the amplitudes
        if (i < flippedIndex) {
          [newAmplitudes[i], newAmplitudes[flippedIndex]] = [
            newAmplitudes[flippedIndex],
            newAmplitudes[i],
          ];
        }
      }
    }

    this.state = new QuantumState(newAmplitudes);
  }

  /**
   * Measures a specific qubit
   */
  measureQubit(qubitIndex: number): number {
    this.validateQubitIndex(qubitIndex);

    if (!this.measurementService) {
      // Simple measurement implementation
      const probabilities = this.calculateSingleQubitProbabilities(qubitIndex);
      const random = Math.random();
      const result = random < probabilities[0] ? 0 : 1;

      // Collapse the state
      this.collapseQubit(qubitIndex, result);
      return result;
    }

    const measurement = this.measurementService.measureQubit(
      this.state,
      qubitIndex
    );
    this.state = measurement.collapsedState;
    return measurement.result;
  }

  /**
   * Measures all qubits
   */
  measureAll(): string {
    if (!this.measurementService) {
      // Simple measurement implementation
      let result = "";
      for (let i = 0; i < this.qubitCount; i++) {
        result += this.measureQubit(i).toString();
      }
      return result;
    }

    const measurement = this.measurementService.measureAll(this.state);
    this.state = measurement.collapsedState;
    return measurement.result;
  }

  /**
   * Gets measurement probabilities for all computational basis states
   */
  getMeasurementProbabilities(): number[] {
    return this.state.getProbabilities();
  }

  /**
   * Resets the circuit to all qubits in |0⟩ state
   */
  reset(): void {
    const dimension = Math.pow(2, this.qubitCount);
    const amplitudes = Array(dimension)
      .fill(null)
      .map((_, index) => ComplexNumber.fromReal(index === 0 ? 1 : 0));
    this.state = new QuantumState(amplitudes);
  }

  /**
   * Creates a copy of the quantum circuit
   */
  clone(): QuantumCircuit {
    return new QuantumCircuit(
      this.qubitCount,
      this.matrixOperations,
      this.measurementService,
      new QuantumState(this.state.getAmplitudes())
    );
  }

  /**
   * Validates qubit index
   */
  private validateQubitIndex(qubitIndex: number): void {
    if (qubitIndex < 0 || qubitIndex >= this.qubitCount) {
      throw new Error(
        `Qubit index ${qubitIndex} out of range [0, ${this.qubitCount - 1}]`
      );
    }
  }

  /**
   * Builds the full gate matrix for a single-qubit gate
   */
  private buildSingleQubitGateMatrix(
    gate: IQuantumGate,
    targetQubit: number
  ): ComplexNumber[][] {
    if (!this.matrixOperations) {
      throw new Error("Matrix operations service not provided");
    }

    let result = this.matrixOperations.identity(1);

    for (let i = 0; i < this.qubitCount; i++) {
      const matrix =
        i === targetQubit ? gate.matrix : this.matrixOperations.identity(2);
      result = this.matrixOperations.tensorProduct(result, matrix);
    }

    return result;
  }

  /**
   * Builds the full gate matrix for a multi-qubit gate
   */
  private buildMultiQubitGateMatrix(
    gate: IQuantumGate,
    targetQubits: number[]
  ): ComplexNumber[][] {
    // This is a simplified implementation
    // A full implementation would need to handle arbitrary qubit arrangements
    throw new Error(
      "Multi-qubit gate matrix construction not fully implemented"
    );
  }

  /**
   * Calculates probabilities for measuring a single qubit
   */
  private calculateSingleQubitProbabilities(
    qubitIndex: number
  ): [number, number] {
    const amplitudes = this.state.getAmplitudes();
    let prob0 = 0;
    let prob1 = 0;

    for (let i = 0; i < amplitudes.length; i++) {
      const bit = (i >> (this.qubitCount - 1 - qubitIndex)) & 1;
      const probability = amplitudes[i].magnitudeSquared();

      if (bit === 0) {
        prob0 += probability;
      } else {
        prob1 += probability;
      }
    }

    return [prob0, prob1];
  }

  /**
   * Collapses the state after measuring a qubit
   */
  private collapseQubit(qubitIndex: number, result: number): void {
    const amplitudes = this.state.getAmplitudes();
    const newAmplitudes = [...amplitudes];
    let norm = 0;

    // Zero out amplitudes that don't match the measurement result
    for (let i = 0; i < amplitudes.length; i++) {
      const bit = (i >> (this.qubitCount - 1 - qubitIndex)) & 1;
      if (bit !== result) {
        newAmplitudes[i] = ComplexNumber.fromReal(0);
      } else {
        norm += amplitudes[i].magnitudeSquared();
      }
    }

    // Normalize the remaining amplitudes
    const normalizationFactor = 1 / Math.sqrt(norm);
    for (let i = 0; i < newAmplitudes.length; i++) {
      newAmplitudes[i] = newAmplitudes[i].multiplyByScalar(normalizationFactor);
    }

    this.state = new QuantumState(newAmplitudes);
  }

  /**
   * String representation of the quantum circuit
   */
  toString(): string {
    return `QuantumCircuit(${
      this.qubitCount
    } qubits): ${this.state.toString()}`;
  }
}
