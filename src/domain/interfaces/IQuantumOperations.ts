import { ComplexNumber } from "../value-objects/ComplexNumber";
import { QuantumState } from "../value-objects/QuantumState";

/**
 * Interface for quantum gate operations
 */
export interface IQuantumGate {
  readonly name: string;
  readonly matrix: ComplexNumber[][];
  readonly qubitCount: number;

  /**
   * Applies the gate to a quantum state
   */
  apply(state: QuantumState): QuantumState;

  /**
   * Checks if the gate is unitary (U * U† = I)
   */
  isUnitary(): boolean;

  /**
   * Gets the adjoint (conjugate transpose) of the gate
   */
  adjoint(): IQuantumGate;
}

/**
 * Interface for measurement operations
 */
export interface IQuantumMeasurement {
  /**
   * Measures a single qubit and returns 0 or 1
   */
  measureQubit(
    state: QuantumState,
    qubitIndex: number
  ): {
    result: number;
    collapsedState: QuantumState;
  };

  /**
   * Measures all qubits and returns the result as a string
   */
  measureAll(state: QuantumState): {
    result: string;
    collapsedState: QuantumState;
  };

  /**
   * Gets measurement probabilities without collapsing the state
   */
  getProbabilities(state: QuantumState): number[];
}

/**
 * Interface for random number generation
 */
export interface IRandomNumberGenerator {
  /**
   * Generates a random number between 0 and 1
   */
  random(): number;
}

/**
 * Interface for mathematical operations on matrices
 */
export interface IMatrixOperations {
  /**
   * Multiplies two matrices
   */
  multiply(a: ComplexNumber[][], b: ComplexNumber[][]): ComplexNumber[][];

  /**
   * Multiplies a matrix by a vector
   */
  multiplyVector(
    matrix: ComplexNumber[][],
    vector: ComplexNumber[]
  ): ComplexNumber[];

  /**
   * Calculates the tensor product (Kronecker product) of two matrices
   */
  tensorProduct(a: ComplexNumber[][], b: ComplexNumber[][]): ComplexNumber[][];

  /**
   * Calculates the conjugate transpose of a matrix
   */
  conjugateTranspose(matrix: ComplexNumber[][]): ComplexNumber[][];

  /**
   * Creates an identity matrix of given size
   */
  identity(size: number): ComplexNumber[][];
}
