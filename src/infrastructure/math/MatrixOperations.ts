import { ComplexNumber } from "../../domain/value-objects/ComplexNumber";
import { IMatrixOperations } from "../../domain/interfaces/IQuantumOperations";

/**
 * Implementation of matrix operations for quantum computing
 */
export class MatrixOperations implements IMatrixOperations {
  /**
   * Multiplies two matrices
   */
  multiply(a: ComplexNumber[][], b: ComplexNumber[][]): ComplexNumber[][] {
    const rowsA = a.length;
    const colsA = a[0].length;
    const rowsB = b.length;
    const colsB = b[0].length;

    if (colsA !== rowsB) {
      throw new Error(
        `Cannot multiply matrices: ${rowsA}x${colsA} and ${rowsB}x${colsB}`
      );
    }

    const result: ComplexNumber[][] = Array(rowsA)
      .fill(null)
      .map(() => Array(colsB).fill(ComplexNumber.fromReal(0)));

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        let sum = ComplexNumber.fromReal(0);
        for (let k = 0; k < colsA; k++) {
          sum = sum.add(a[i][k].multiply(b[k][j]));
        }
        result[i][j] = sum;
      }
    }

    return result;
  }

  /**
   * Multiplies a matrix by a vector
   */
  multiplyVector(
    matrix: ComplexNumber[][],
    vector: ComplexNumber[]
  ): ComplexNumber[] {
    const rows = matrix.length;
    const cols = matrix[0].length;

    if (cols !== vector.length) {
      throw new Error(
        `Cannot multiply matrix and vector: matrix is ${rows}x${cols}, vector length is ${vector.length}`
      );
    }

    const result: ComplexNumber[] = Array(rows);

    for (let i = 0; i < rows; i++) {
      let sum = ComplexNumber.fromReal(0);
      for (let j = 0; j < cols; j++) {
        sum = sum.add(matrix[i][j].multiply(vector[j]));
      }
      result[i] = sum;
    }

    return result;
  }

  /**
   * Calculates the tensor product (Kronecker product) of two matrices
   */
  tensorProduct(a: ComplexNumber[][], b: ComplexNumber[][]): ComplexNumber[][] {
    const rowsA = a.length;
    const colsA = a[0].length;
    const rowsB = b.length;
    const colsB = b[0].length;

    const resultRows = rowsA * rowsB;
    const resultCols = colsA * colsB;

    const result: ComplexNumber[][] = Array(resultRows)
      .fill(null)
      .map(() => Array(resultCols).fill(ComplexNumber.fromReal(0)));

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsA; j++) {
        for (let k = 0; k < rowsB; k++) {
          for (let l = 0; l < colsB; l++) {
            const resultRow = i * rowsB + k;
            const resultCol = j * colsB + l;
            result[resultRow][resultCol] = a[i][j].multiply(b[k][l]);
          }
        }
      }
    }

    return result;
  }

  /**
   * Calculates the conjugate transpose of a matrix
   */
  conjugateTranspose(matrix: ComplexNumber[][]): ComplexNumber[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;

    const result: ComplexNumber[][] = Array(cols)
      .fill(null)
      .map(() => Array(rows).fill(ComplexNumber.fromReal(0)));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        result[j][i] = matrix[i][j].conjugate();
      }
    }

    return result;
  }

  /**
   * Creates an identity matrix of given size
   */
  identity(size: number): ComplexNumber[][] {
    const result: ComplexNumber[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(ComplexNumber.fromReal(0)));

    for (let i = 0; i < size; i++) {
      result[i][i] = ComplexNumber.fromReal(1);
    }

    return result;
  }

  /**
   * Checks if a matrix is unitary (U * U† = I)
   */
  isUnitary(matrix: ComplexNumber[][], tolerance: number = 1e-10): boolean {
    const rows = matrix.length;
    const cols = matrix[0].length;

    if (rows !== cols) {
      return false; // Must be square
    }

    const adjoint = this.conjugateTranspose(matrix);
    const product = this.multiply(matrix, adjoint);
    const identity = this.identity(rows);

    // Check if product equals identity within tolerance
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!product[i][j].equals(identity[i][j], tolerance)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Calculates the determinant of a 2x2 matrix
   */
  determinant2x2(matrix: ComplexNumber[][]): ComplexNumber {
    if (matrix.length !== 2 || matrix[0].length !== 2) {
      throw new Error(
        "Determinant calculation only implemented for 2x2 matrices"
      );
    }

    return matrix[0][0]
      .multiply(matrix[1][1])
      .subtract(matrix[0][1].multiply(matrix[1][0]));
  }

  /**
   * Creates a matrix from a 2D array of numbers
   */
  fromNumbers(numbers: number[][]): ComplexNumber[][] {
    return numbers.map((row) => row.map((num) => ComplexNumber.fromReal(num)));
  }

  /**
   * Converts a matrix to a 2D array of numbers (real parts only)
   */
  toNumbers(matrix: ComplexNumber[][]): number[][] {
    return matrix.map((row) => row.map((complex) => complex.real));
  }

  /**
   * Prints a matrix in a readable format
   */
  printMatrix(matrix: ComplexNumber[][], label?: string): void {
    if (label) {
      console.log(`${label}:`);
    }

    matrix.forEach((row) => {
      const rowStr = row.map((complex) => complex.toString()).join("\t");
      console.log(rowStr);
    });

    console.log("");
  }
}
