import { QuantumState } from "../../domain/value-objects/QuantumState";
import { ComplexNumber } from "../../domain/value-objects/ComplexNumber";
import {
  IQuantumMeasurement,
  IRandomNumberGenerator,
} from "../../domain/interfaces/IQuantumOperations";

/**
 * Default random number generator implementation
 */
export class DefaultRandomGenerator implements IRandomNumberGenerator {
  random(): number {
    return Math.random();
  }
}

/**
 * Implementation of quantum measurement operations
 */
export class QuantumMeasurementService implements IQuantumMeasurement {
  constructor(
    private randomGenerator: IRandomNumberGenerator = new DefaultRandomGenerator()
  ) {}

  /**
   * Measures a single qubit and returns 0 or 1
   */
  measureQubit(
    state: QuantumState,
    qubitIndex: number
  ): {
    result: number;
    collapsedState: QuantumState;
  } {
    const qubitCount = state.getQubitCount();

    if (qubitIndex < 0 || qubitIndex >= qubitCount) {
      throw new Error(
        `Qubit index ${qubitIndex} out of range [0, ${qubitCount - 1}]`
      );
    }

    // Calculate probabilities for |0⟩ and |1⟩ for the target qubit
    const { prob0, prob1 } = this.calculateSingleQubitProbabilities(
      state,
      qubitIndex
    );

    // Generate random number and determine measurement result
    const random = this.randomGenerator.random();
    const result = random < prob0 ? 0 : 1;

    // Collapse the state
    const collapsedState = this.collapseSingleQubit(state, qubitIndex, result);

    return { result, collapsedState };
  }

  /**
   * Measures all qubits and returns the result as a string
   */
  measureAll(state: QuantumState): {
    result: string;
    collapsedState: QuantumState;
  } {
    const amplitudes = state.getAmplitudes();
    const probabilities = amplitudes.map((amp) => amp.magnitudeSquared());

    // Generate random number to select measurement outcome
    const random = this.randomGenerator.random();
    let cumulativeProbability = 0;
    let selectedIndex = 0;

    for (let i = 0; i < probabilities.length; i++) {
      cumulativeProbability += probabilities[i];
      if (random <= cumulativeProbability) {
        selectedIndex = i;
        break;
      }
    }

    // Convert index to binary string
    const qubitCount = state.getQubitCount();
    const result = selectedIndex.toString(2).padStart(qubitCount, "0");

    // Create collapsed state (all probability on the measured outcome)
    const newAmplitudes = amplitudes.map((_, index) =>
      index === selectedIndex
        ? ComplexNumber.fromReal(1)
        : ComplexNumber.fromReal(0)
    );
    const collapsedState = new QuantumState(newAmplitudes);

    return { result, collapsedState };
  }

  /**
   * Gets measurement probabilities without collapsing the state
   */
  getProbabilities(state: QuantumState): number[] {
    return state.getProbabilities();
  }

  /**
   * Calculates probabilities for measuring a single qubit as |0⟩ or |1⟩
   */
  private calculateSingleQubitProbabilities(
    state: QuantumState,
    qubitIndex: number
  ): { prob0: number; prob1: number } {
    const amplitudes = state.getAmplitudes();
    const qubitCount = state.getQubitCount();

    let prob0 = 0;
    let prob1 = 0;

    for (let i = 0; i < amplitudes.length; i++) {
      const bit = (i >> (qubitCount - 1 - qubitIndex)) & 1;
      const probability = amplitudes[i].magnitudeSquared();

      if (bit === 0) {
        prob0 += probability;
      } else {
        prob1 += probability;
      }
    }

    return { prob0, prob1 };
  }

  /**
   * Collapses the state after measuring a single qubit
   */
  private collapseSingleQubit(
    state: QuantumState,
    qubitIndex: number,
    result: number
  ): QuantumState {
    const amplitudes = state.getAmplitudes();
    const qubitCount = state.getQubitCount();
    const newAmplitudes = [...amplitudes];

    let norm = 0;

    // Zero out amplitudes that don't match the measurement result
    for (let i = 0; i < amplitudes.length; i++) {
      const bit = (i >> (qubitCount - 1 - qubitIndex)) & 1;
      if (bit !== result) {
        newAmplitudes[i] = ComplexNumber.fromReal(0);
      } else {
        norm += amplitudes[i].magnitudeSquared();
      }
    }

    // Normalize the remaining amplitudes
    if (norm > 0) {
      const normalizationFactor = 1 / Math.sqrt(norm);
      for (let i = 0; i < newAmplitudes.length; i++) {
        newAmplitudes[i] =
          newAmplitudes[i].multiplyByScalar(normalizationFactor);
      }
    }

    return new QuantumState(newAmplitudes);
  }

  /**
   * Measures multiple qubits simultaneously
   */
  measureQubits(
    state: QuantumState,
    qubitIndices: number[]
  ): {
    results: number[];
    collapsedState: QuantumState;
  } {
    let currentState = state;
    const results: number[] = [];

    // Measure qubits one by one (in reverse order to maintain indices)
    const sortedIndices = [...qubitIndices].sort((a, b) => b - a);

    for (const qubitIndex of sortedIndices) {
      const measurement = this.measureQubit(currentState, qubitIndex);
      results.unshift(measurement.result);
      currentState = measurement.collapsedState;
    }

    return { results, collapsedState: currentState };
  }

  /**
   * Gets the expected value of a measurement in the computational basis
   */
  getExpectedValue(state: QuantumState): number {
    const amplitudes = state.getAmplitudes();
    let expectedValue = 0;

    for (let i = 0; i < amplitudes.length; i++) {
      const probability = amplitudes[i].magnitudeSquared();
      expectedValue += i * probability;
    }

    return expectedValue;
  }

  /**
   * Calculates the variance of measurements
   */
  getVariance(state: QuantumState): number {
    const expectedValue = this.getExpectedValue(state);
    const amplitudes = state.getAmplitudes();
    let variance = 0;

    for (let i = 0; i < amplitudes.length; i++) {
      const probability = amplitudes[i].magnitudeSquared();
      variance += Math.pow(i - expectedValue, 2) * probability;
    }

    return variance;
  }
}
