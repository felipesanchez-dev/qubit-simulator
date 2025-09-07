/**
 * Represents a complex number with real and imaginary parts
 */
export class ComplexNumber {
  constructor(
    public readonly real: number,
    public readonly imaginary: number = 0
  ) {}

  /**
   * Creates a complex number from real part only
   */
  static fromReal(real: number): ComplexNumber {
    return new ComplexNumber(real, 0);
  }

  /**
   * Creates a complex number from imaginary part only
   */
  static fromImaginary(imaginary: number): ComplexNumber {
    return new ComplexNumber(0, imaginary);
  }

  /**
   * Addition of two complex numbers
   */
  add(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(
      this.real + other.real,
      this.imaginary + other.imaginary
    );
  }

  /**
   * Subtraction of two complex numbers
   */
  subtract(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(
      this.real - other.real,
      this.imaginary - other.imaginary
    );
  }

  /**
   * Multiplication of two complex numbers
   */
  multiply(other: ComplexNumber): ComplexNumber {
    const real = this.real * other.real - this.imaginary * other.imaginary;
    const imaginary = this.real * other.imaginary + this.imaginary * other.real;
    return new ComplexNumber(real, imaginary);
  }

  /**
   * Scalar multiplication
   */
  multiplyByScalar(scalar: number): ComplexNumber {
    return new ComplexNumber(this.real * scalar, this.imaginary * scalar);
  }

  /**
   * Complex conjugate
   */
  conjugate(): ComplexNumber {
    return new ComplexNumber(this.real, -this.imaginary);
  }

  /**
   * Magnitude (absolute value) of the complex number
   */
  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
  }

  /**
   * Magnitude squared
   */
  magnitudeSquared(): number {
    return this.real * this.real + this.imaginary * this.imaginary;
  }

  /**
   * Phase (argument) of the complex number
   */
  phase(): number {
    return Math.atan2(this.imaginary, this.real);
  }

  /**
   * Checks if two complex numbers are equal within tolerance
   */
  equals(other: ComplexNumber, tolerance: number = 1e-10): boolean {
    return (
      Math.abs(this.real - other.real) < tolerance &&
      Math.abs(this.imaginary - other.imaginary) < tolerance
    );
  }

  /**
   * String representation
   */
  toString(): string {
    if (this.imaginary === 0) return this.real.toString();
    if (this.real === 0) return `${this.imaginary}i`;
    const sign = this.imaginary >= 0 ? "+" : "-";
    return `${this.real}${sign}${Math.abs(this.imaginary)}i`;
  }
}
