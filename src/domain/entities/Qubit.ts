import { QuantumState } from "../value-objects/QuantumState";
import { ComplexNumber } from "../value-objects/ComplexNumber";
import {
  IQuantumMeasurement,
  IRandomNumberGenerator,
} from "../interfaces/IQuantumOperations";

/**
 * Represents a single qubit entity
 */
export class Qubit {
  private state: QuantumState;

  constructor(
    state?: QuantumState,
    private measurementService?: IQuantumMeasurement,
    private randomGenerator?: IRandomNumberGenerator
  ) {
    this.state = state || QuantumState.zero();
  }

  /**
   * Creates a qubit in the |0⟩ state
   */
  static zero(): Qubit {
    return new Qubit(QuantumState.zero());
  }

  /**
   * Creates a qubit in the |1⟩ state
   */
  static one(): Qubit {
    return new Qubit(QuantumState.one());
  }

  /**
   * Creates a qubit in the |+⟩ state (superposition)
   */
  static plus(): Qubit {
    return new Qubit(QuantumState.plus());
  }

  /**
   * Creates a qubit in the |-⟩ state
   */
  static minus(): Qubit {
    return new Qubit(QuantumState.minus());
  }

  /**
   * Creates a qubit with custom amplitudes
   */
  static fromAmplitudes(alpha: ComplexNumber, beta: ComplexNumber): Qubit {
    const state = new QuantumState([alpha, beta]);
    return new Qubit(state);
  }

  /**
   * Gets the current quantum state
   */
  getState(): QuantumState {
    return this.state;
  }

  /**
   * Sets a new quantum state
   */
  setState(newState: QuantumState): void {
    if (newState.getQubitCount() !== 1) {
      throw new Error("Single qubit can only have a 2-dimensional state");
    }
    this.state = newState;
  }

  /**
   * Gets the amplitude for |0⟩ state (alpha)
   */
  getAlpha(): ComplexNumber {
    return this.state.getAmplitude(0);
  }

  /**
   * Gets the amplitude for |1⟩ state (beta)
   */
  getBeta(): ComplexNumber {
    return this.state.getAmplitude(1);
  }

  /**
   * Gets the probability of measuring |0⟩
   */
  getProbabilityZero(): number {
    return this.state.getProbability(0);
  }

  /**
   * Gets the probability of measuring |1⟩
   */
  getProbabilityOne(): number {
    return this.state.getProbability(1);
  }

  /**
   * Measures the qubit and collapses it to |0⟩ or |1⟩
   */
  measure(): number {
    if (!this.measurementService || !this.randomGenerator) {
      // Simple measurement implementation if services not injected
      const probZero = this.getProbabilityZero();
      const random = Math.random();
      const result = random < probZero ? 0 : 1;

      // Collapse the state
      this.state = result === 0 ? QuantumState.zero() : QuantumState.one();
      return result;
    }

    const measurement = this.measurementService.measureQubit(this.state, 0);
    this.state = measurement.collapsedState;
    return measurement.result;
  }

  /**
   * Gets measurement probabilities without collapsing the state
   */
  getMeasurementProbabilities(): [number, number] {
    return [this.getProbabilityZero(), this.getProbabilityOne()];
  }

  /**
   * Checks if the qubit is in a pure state (either |0⟩ or |1⟩)
   */
  isPureState(): boolean {
    const probZero = this.getProbabilityZero();
    const tolerance = 1e-10;
    return Math.abs(probZero - 1) < tolerance || Math.abs(probZero) < tolerance;
  }

  /**
   * Checks if the qubit is in superposition
   */
  isInSuperposition(): boolean {
    return !this.isPureState();
  }

  /**
   * Creates a copy of the qubit
   */
  clone(): Qubit {
    return new Qubit(
      new QuantumState(this.state.getAmplitudes()),
      this.measurementService,
      this.randomGenerator
    );
  }

  /**
   * String representation of the qubit
   */
  toString(): string {
    return this.state.toString();
  }

  /**
   * Checks if two qubits have the same state
   */
  equals(other: Qubit, tolerance: number = 1e-10): boolean {
    return this.state.equals(other.state, tolerance);
  }
}
