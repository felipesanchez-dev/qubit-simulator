import { ComplexNumber } from "../../domain/value-objects/ComplexNumber";
import { QuantumState } from "../../domain/value-objects/QuantumState";
import {
  IQuantumGate,
  IMatrixOperations,
} from "../../domain/interfaces/IQuantumOperations";

/**
 * Base class for quantum gates
 */
export abstract class BaseQuantumGate implements IQuantumGate {
  constructor(
    public readonly name: string,
    public readonly matrix: ComplexNumber[][],
    public readonly qubitCount: number,
    protected matrixOperations: IMatrixOperations
  ) {}

  /**
   * Applies the gate to a quantum state
   */
  apply(state: QuantumState): QuantumState {
    if (state.getQubitCount() !== this.qubitCount) {
      throw new Error(
        `Gate ${this.name} requires ${
          this.qubitCount
        } qubits, but state has ${state.getQubitCount()}`
      );
    }

    const newAmplitudes = this.matrixOperations.multiplyVector(
      this.matrix,
      state.getAmplitudes()
    );

    return new QuantumState(newAmplitudes);
  }

  /**
   * Checks if the gate is unitary
   */
  isUnitary(): boolean {
    const adjoint = this.matrixOperations.conjugateTranspose(this.matrix);
    const product = this.matrixOperations.multiply(this.matrix, adjoint);
    const identity = this.matrixOperations.identity(this.matrix.length);

    const tolerance = 1e-10;
    for (let i = 0; i < product.length; i++) {
      for (let j = 0; j < product[0].length; j++) {
        if (!product[i][j].equals(identity[i][j], tolerance)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Gets the adjoint (conjugate transpose) of the gate
   */
  adjoint(): IQuantumGate {
    const adjointMatrix = this.matrixOperations.conjugateTranspose(this.matrix);
    return new GenericGate(
      `${this.name}†`,
      adjointMatrix,
      this.qubitCount,
      this.matrixOperations
    );
  }
}

/**
 * Generic quantum gate implementation
 */
export class GenericGate extends BaseQuantumGate {
  constructor(
    name: string,
    matrix: ComplexNumber[][],
    qubitCount: number,
    matrixOperations: IMatrixOperations
  ) {
    super(name, matrix, qubitCount, matrixOperations);
  }
}

/**
 * Pauli-X gate (quantum NOT)
 */
export class XGate extends BaseQuantumGate {
  constructor(matrixOperations: IMatrixOperations) {
    const matrix = [
      [ComplexNumber.fromReal(0), ComplexNumber.fromReal(1)],
      [ComplexNumber.fromReal(1), ComplexNumber.fromReal(0)],
    ];
    super("X", matrix, 1, matrixOperations);
  }
}

/**
 * Pauli-Y gate
 */
export class YGate extends BaseQuantumGate {
  constructor(matrixOperations: IMatrixOperations) {
    const matrix = [
      [ComplexNumber.fromReal(0), new ComplexNumber(0, -1)],
      [new ComplexNumber(0, 1), ComplexNumber.fromReal(0)],
    ];
    super("Y", matrix, 1, matrixOperations);
  }
}

/**
 * Pauli-Z gate
 */
export class ZGate extends BaseQuantumGate {
  constructor(matrixOperations: IMatrixOperations) {
    const matrix = [
      [ComplexNumber.fromReal(1), ComplexNumber.fromReal(0)],
      [ComplexNumber.fromReal(0), ComplexNumber.fromReal(-1)],
    ];
    super("Z", matrix, 1, matrixOperations);
  }
}

/**
 * Hadamard gate
 */
export class HGate extends BaseQuantumGate {
  constructor(matrixOperations: IMatrixOperations) {
    const inv_sqrt2 = 1 / Math.sqrt(2);
    const matrix = [
      [ComplexNumber.fromReal(inv_sqrt2), ComplexNumber.fromReal(inv_sqrt2)],
      [ComplexNumber.fromReal(inv_sqrt2), ComplexNumber.fromReal(-inv_sqrt2)],
    ];
    super("H", matrix, 1, matrixOperations);
  }
}

/**
 * Identity gate
 */
export class IGate extends BaseQuantumGate {
  constructor(matrixOperations: IMatrixOperations) {
    const matrix = [
      [ComplexNumber.fromReal(1), ComplexNumber.fromReal(0)],
      [ComplexNumber.fromReal(0), ComplexNumber.fromReal(1)],
    ];
    super("I", matrix, 1, matrixOperations);
  }
}

/**
 * Phase gate (S gate)
 */
export class SGate extends BaseQuantumGate {
  constructor(matrixOperations: IMatrixOperations) {
    const matrix = [
      [ComplexNumber.fromReal(1), ComplexNumber.fromReal(0)],
      [ComplexNumber.fromReal(0), new ComplexNumber(0, 1)],
    ];
    super("S", matrix, 1, matrixOperations);
  }
}

/**
 * T gate (π/8 gate)
 */
export class TGate extends BaseQuantumGate {
  constructor(matrixOperations: IMatrixOperations) {
    const exp_i_pi_4 = new ComplexNumber(
      Math.cos(Math.PI / 4),
      Math.sin(Math.PI / 4)
    );
    const matrix = [
      [ComplexNumber.fromReal(1), ComplexNumber.fromReal(0)],
      [ComplexNumber.fromReal(0), exp_i_pi_4],
    ];
    super("T", matrix, 1, matrixOperations);
  }
}

/**
 * Rotation around X-axis
 */
export class RxGate extends BaseQuantumGate {
  constructor(angle: number, matrixOperations: IMatrixOperations) {
    const cos_half = Math.cos(angle / 2);
    const sin_half = Math.sin(angle / 2);
    const matrix = [
      [ComplexNumber.fromReal(cos_half), new ComplexNumber(0, -sin_half)],
      [new ComplexNumber(0, -sin_half), ComplexNumber.fromReal(cos_half)],
    ];
    super(`Rx(${angle})`, matrix, 1, matrixOperations);
  }
}

/**
 * Rotation around Y-axis
 */
export class RyGate extends BaseQuantumGate {
  constructor(angle: number, matrixOperations: IMatrixOperations) {
    const cos_half = Math.cos(angle / 2);
    const sin_half = Math.sin(angle / 2);
    const matrix = [
      [ComplexNumber.fromReal(cos_half), ComplexNumber.fromReal(-sin_half)],
      [ComplexNumber.fromReal(sin_half), ComplexNumber.fromReal(cos_half)],
    ];
    super(`Ry(${angle})`, matrix, 1, matrixOperations);
  }
}

/**
 * Rotation around Z-axis
 */
export class RzGate extends BaseQuantumGate {
  constructor(angle: number, matrixOperations: IMatrixOperations) {
    const exp_neg_i_half = new ComplexNumber(
      Math.cos(-angle / 2),
      Math.sin(-angle / 2)
    );
    const exp_pos_i_half = new ComplexNumber(
      Math.cos(angle / 2),
      Math.sin(angle / 2)
    );
    const matrix = [
      [exp_neg_i_half, ComplexNumber.fromReal(0)],
      [ComplexNumber.fromReal(0), exp_pos_i_half],
    ];
    super(`Rz(${angle})`, matrix, 1, matrixOperations);
  }
}

/**
 * CNOT gate (Controlled-NOT)
 */
export class CNOTGate extends BaseQuantumGate {
  constructor(matrixOperations: IMatrixOperations) {
    const matrix = [
      [
        ComplexNumber.fromReal(1),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
      ],
      [
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(1),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
      ],
      [
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(1),
      ],
      [
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(1),
        ComplexNumber.fromReal(0),
      ],
    ];
    super("CNOT", matrix, 2, matrixOperations);
  }
}

/**
 * Controlled-Z gate
 */
export class CZGate extends BaseQuantumGate {
  constructor(matrixOperations: IMatrixOperations) {
    const matrix = [
      [
        ComplexNumber.fromReal(1),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
      ],
      [
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(1),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
      ],
      [
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(1),
        ComplexNumber.fromReal(0),
      ],
      [
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(-1),
      ],
    ];
    super("CZ", matrix, 2, matrixOperations);
  }
}

/**
 * SWAP gate
 */
export class SWAPGate extends BaseQuantumGate {
  constructor(matrixOperations: IMatrixOperations) {
    const matrix = [
      [
        ComplexNumber.fromReal(1),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
      ],
      [
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(1),
        ComplexNumber.fromReal(0),
      ],
      [
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(1),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
      ],
      [
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(0),
        ComplexNumber.fromReal(1),
      ],
    ];
    super("SWAP", matrix, 2, matrixOperations);
  }
}
