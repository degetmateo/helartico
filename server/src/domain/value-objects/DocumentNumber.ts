import { Result } from "../../core/Result";

export class DocumentNumber {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public get value(): string {
    return this._value;
  }

  public static create(doc: string): Result<DocumentNumber> {
    if (!doc || typeof doc !== "string") {
      return Result.fail<DocumentNumber>("El número de documento es obligatorio.");
    }
    const cleanDoc = doc.trim().replace(/[\.\-\s]/g, "");
    if (cleanDoc.length < 5 || cleanDoc.length > 20) {
      return Result.fail<DocumentNumber>(
        "El número de documento debe tener entre 5 y 20 caracteres."
      );
    }
    return Result.ok<DocumentNumber>(new DocumentNumber(cleanDoc));
  }

  public equals(other?: DocumentNumber): boolean {
    if (!other) return false;
    return this._value === other._value;
  }
}
