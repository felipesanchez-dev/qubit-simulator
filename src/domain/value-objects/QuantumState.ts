import { ComplexNumber } from "./ComplexNumber";

/**
 * Represents a quantum state as a vector of complex amplitudes
 */
export class QuantumState {
  private readonly amplitudes: ComplexNumber[];
  private readonly tolerance = 1e-10;

  constructor(amplitudes: ComplexNumber[]) {
    if (
      amplitudes.length === 0 ||
      (amplitudes.length & (amplitudes.length - 1)) !== 0
    ) {
      throw new Error(
        "Quantum state must have a power of 2 number of amplitudes"
      );
    }

    this.amplitudes = [...amplitudes];
    this.validateNormalization();
  }

  /**
   * Creates a quantum state from an array of real numbers
   */
  static fromRealArray(values: number[]): QuantumState {
    return new QuantumState(values.map((v) => ComplexNumber.fromReal(v)));
  }

  /**
   * Creates the |0⟩ state
   */
  static zero(): QuantumState {
    return new QuantumState([
      ComplexNumber.fromReal(1),
      ComplexNumber.fromReal(0),
    ]);
  }

  /**
   * Creates the |1⟩ state
   */
  static one(): QuantumState {
    return new QuantumState([
      ComplexNumber.fromReal(0),
      ComplexNumber.fromReal(1),
    ]);
  }

  /**
   * Creates a superposition state |+⟩ = (|0⟩ + |1⟩)/√2
   */
  static plus(): QuantumState {
    const amplitude = ComplexNumber.fromReal(1 / Math.sqrt(2));
    return new QuantumState([amplitude, amplitude]);
  }

  /**
   * Creates a superposition state |-⟩ = (|0⟩ - |1⟩)/√2
   */
  static minus(): QuantumState {
    const sqrt2inv = 1 / Math.sqrt(2);
    return new QuantumState([
      ComplexNumber.fromReal(sqrt2inv),
      ComplexNumber.fromReal(-sqrt2inv),
    ]);
  }

  /**
   * Gets the amplitude at a specific index
   */
  getAmplitude(index: number): ComplexNumber {
    if (index < 0 || index >= this.amplitudes.length) {
      throw new Error(`Index ${index} out of bounds for quantum state`);
    }
    return this.amplitudes[index];
  }

  /**
   * Gets all amplitudes
   */
  getAmplitudes(): ComplexNumber[] {
    return [...this.amplitudes];
  }

  /**
   * Gets the dimension of the quantum state (number of qubits = log2(dimension))
   */
  getDimension(): number {
    return this.amplitudes.length;
  }

  /**
   * Gets the number of qubits
   */
  getQubitCount(): number {
    return Math.log2(this.amplitudes.length);
  }

  /**
   * Gets the probability of measuring a specific state
   */
  getProbability(index: number): number {
    return this.getAmplitude(index).magnitudeSquared();
  }

  /**
   * Gets all probabilities
   */
  getProbabilities(): number[] {
    return this.amplitudes.map((amp) => amp.magnitudeSquared());
  }

  /**
   * Validates that the state is normalized (sum of probability amplitudes = 1)
   */
  private validateNormalization(): void {
    const norm = this.calculateNorm();
    if (Math.abs(norm - 1) > this.tolerance) {
      throw new Error(`Quantum state is not normalized. Norm: ${norm}`);
    }
  }

  /**
   * Calculates the norm of the quantum state
   */
  private calculateNorm(): number {
    return Math.sqrt(
      this.amplitudes.reduce((sum, amp) => sum + amp.magnitudeSquared(), 0)
    );
  }

  /**
   * Normalizes the quantum state
   */
  normalize(): QuantumState {
    const norm = this.calculateNorm();
    if (norm === 0) {
      throw new Error("Cannot normalize zero state");
    }

    const normalizedAmplitudes = this.amplitudes.map((amp) =>
      amp.multiplyByScalar(1 / norm)
    );

    return new QuantumState(normalizedAmplitudes);
  }

  /**
   * Checks if two quantum states are equal within tolerance
   */
  equals(other: QuantumState, tolerance: number = 1e-10): boolean {
    if (this.amplitudes.length !== other.amplitudes.length) {
      return false;
    }

    return this.amplitudes.every((amp, index) =>
      amp.equals(other.amplitudes[index], tolerance)
    );
  }

  /**
   * String representation of the quantum state
   */
  toString(): string {
    const terms = this.amplitudes
      .map((amp, index) => {
        if (amp.magnitude() < this.tolerance) return "";
        const binaryState = index
          .toString(2)
          .padStart(this.getQubitCount(), "0");
        return `${amp.toString()}|${binaryState}⟩`;
      })
      .filter((term) => term !== "");

    return terms.join(" + ").replace(/\+ -/g, "- ") || "0";
  }
}
