function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

export class Fraction {
  readonly num: number;
  readonly den: number;

  constructor(num: number, den: number = 1) {
    if (den === 0) throw new Error("Denominatore zero");
    if (den < 0) {
      num = -num;
      den = -den;
    }
    const g = gcd(num, den);
    this.num = num / g;
    this.den = den / g;
  }

  static from(value: number | Fraction): Fraction {
    if (value instanceof Fraction) return value;
    if (Number.isInteger(value)) return new Fraction(value, 1);
    // convert decimal to fraction (up to 6 decimal places)
    const scale = 1e6;
    return new Fraction(Math.round(value * scale), scale);
  }

  static parse(text: string): Fraction {
    const t = text.trim().replace(",", ".");
    if (t === "") throw new Error("Valore vuoto");
    if (t.includes("/")) {
      const [n, d] = t.split("/");
      return new Fraction(parseFloat(n), parseFloat(d));
    }
    return Fraction.from(parseFloat(t));
  }

  add(o: Fraction): Fraction {
    return new Fraction(this.num * o.den + o.num * this.den, this.den * o.den);
  }

  sub(o: Fraction): Fraction {
    return new Fraction(this.num * o.den - o.num * this.den, this.den * o.den);
  }

  mul(o: Fraction): Fraction {
    return new Fraction(this.num * o.num, this.den * o.den);
  }

  div(o: Fraction): Fraction {
    if (o.num === 0) throw new Error("Divisione per zero");
    return new Fraction(this.num * o.den, this.den * o.num);
  }

  neg(): Fraction {
    return new Fraction(-this.num, this.den);
  }

  isZero(): boolean {
    return this.num === 0;
  }

  equals(o: Fraction): boolean {
    return this.num === o.num && this.den === o.den;
  }

  toNumber(): number {
    return this.num / this.den;
  }

  toString(): string {
    if (this.den === 1) return `${this.num}`;
    return `${this.num}/${this.den}`;
  }
}

export const F = (n: number, d = 1) => new Fraction(n, d);
export const ZERO = new Fraction(0);
export const ONE = new Fraction(1);
