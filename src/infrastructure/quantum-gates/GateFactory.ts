import {
  IQuantumGate,
  IMatrixOperations,
} from "../../domain/interfaces/IQuantumOperations";
import {
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
} from "./QuantumGates";

/**
 * Factory for creating quantum gates
 */
export class GateFactory {
  constructor(private matrixOperations: IMatrixOperations) {}

  /**
   * Creates a Pauli-X gate (quantum NOT)
   */
  X(): IQuantumGate {
    return new XGate(this.matrixOperations);
  }

  /**
   * Creates a Pauli-Y gate
   */
  Y(): IQuantumGate {
    return new YGate(this.matrixOperations);
  }

  /**
   * Creates a Pauli-Z gate
   */
  Z(): IQuantumGate {
    return new ZGate(this.matrixOperations);
  }

  /**
   * Creates a Hadamard gate
   */
  H(): IQuantumGate {
    return new HGate(this.matrixOperations);
  }

  /**
   * Creates an Identity gate
   */
  I(): IQuantumGate {
    return new IGate(this.matrixOperations);
  }

  /**
   * Creates a Phase gate (S gate)
   */
  S(): IQuantumGate {
    return new SGate(this.matrixOperations);
  }

  /**
   * Creates a T gate (π/8 gate)
   */
  T(): IQuantumGate {
    return new TGate(this.matrixOperations);
  }

  /**
   * Creates a rotation gate around X-axis
   */
  Rx(angle: number): IQuantumGate {
    return new RxGate(angle, this.matrixOperations);
  }

  /**
   * Creates a rotation gate around Y-axis
   */
  Ry(angle: number): IQuantumGate {
    return new RyGate(angle, this.matrixOperations);
  }

  /**
   * Creates a rotation gate around Z-axis
   */
  Rz(angle: number): IQuantumGate {
    return new RzGate(angle, this.matrixOperations);
  }

  /**
   * Creates a CNOT gate (Controlled-NOT)
   */
  CNOT(): IQuantumGate {
    return new CNOTGate(this.matrixOperations);
  }

  /**
   * Creates a Controlled-Z gate
   */
  CZ(): IQuantumGate {
    return new CZGate(this.matrixOperations);
  }

  /**
   * Creates a SWAP gate
   */
  SWAP(): IQuantumGate {
    return new SWAPGate(this.matrixOperations);
  }
}
