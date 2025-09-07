// Domain exports
export { ComplexNumber } from "./domain/value-objects/ComplexNumber";
export { QuantumState } from "./domain/value-objects/QuantumState";
export { Qubit } from "./domain/entities/Qubit";
export { QuantumCircuit } from "./domain/entities/QuantumCircuit";

// Domain interfaces
export type {
  IQuantumGate,
  IQuantumMeasurement,
  IRandomNumberGenerator,
  IMatrixOperations,
} from "./domain/interfaces/IQuantumOperations";

// Infrastructure exports
export { MatrixOperations } from "./infrastructure/math/MatrixOperations";
export {
  BaseQuantumGate,
  GenericGate,
  XGate,
  YGate,
  ZGate,
  HGate,
  IGate,
  SGate,
  TGate,
  RxGate,
  RyGate,
  RzGate,
  CNOTGate,
  CZGate,
  SWAPGate,
} from "./infrastructure/quantum-gates/QuantumGates";
export { GateFactory } from "./infrastructure/quantum-gates/GateFactory";

// Application services
export {
  QuantumMeasurementService,
  DefaultRandomGenerator,
} from "./application/services/QuantumMeasurementService";

// Application use cases
export {
  QubitUseCase,
  QuantumCircuitUseCase,
  QuantumAlgorithmUseCase,
} from "./application/use-cases/QuantumUseCases";

// Convenience factory for creating pre-configured instances
import { MatrixOperations } from "./infrastructure/math/MatrixOperations";
import { GateFactory } from "./infrastructure/quantum-gates/GateFactory";
import { QuantumMeasurementService } from "./application/services/QuantumMeasurementService";
import {
  QubitUseCase,
  QuantumCircuitUseCase,
} from "./application/use-cases/QuantumUseCases";
import { Qubit } from "./domain/entities/Qubit";
import { QuantumCircuit } from "./domain/entities/QuantumCircuit";

/**
 * Pre-configured Gates instance with all standard quantum gates
 */
export const Gates = (() => {
  const matrixOps = new MatrixOperations();
  return new GateFactory(matrixOps);
})();

/**
 * QKits main factory class for creating quantum computing components
 */
export class QKits {
  private static matrixOperations = new MatrixOperations();
  private static measurementService = new QuantumMeasurementService();
  private static gateFactory = new GateFactory(QKits.matrixOperations);

  /**
   * Creates a new qubit in the |0⟩ state
   */
  static createQubit(): Qubit {
    return new Qubit(undefined, QKits.measurementService);
  }

  /**
   * Creates a quantum circuit with the specified number of qubits
   */
  static createCircuit(qubitCount: number): QuantumCircuit {
    return new QuantumCircuit(
      qubitCount,
      QKits.matrixOperations,
      QKits.measurementService
    );
  }

  /**
   * Gets the gate factory for creating quantum gates
   */
  static get gates(): GateFactory {
    return QKits.gateFactory;
  }

  /**
   * Gets the matrix operations service
   */
  static get math(): MatrixOperations {
    return QKits.matrixOperations;
  }

  /**
   * Gets the measurement service
   */
  static get measurement(): QuantumMeasurementService {
    return QKits.measurementService;
  }

  /**
   * Creates use case instances
   */
  static createUseCases() {
    return {
      qubit: new QubitUseCase(QKits.measurementService),
      circuit: new QuantumCircuitUseCase(
        QKits.matrixOperations,
        QKits.measurementService
      ),
    };
  }
}

// Default export for convenience
export default QKits;
