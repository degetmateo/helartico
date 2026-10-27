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
      return Result.fail<DocumentNumber>("Document number is required.");
    }
    const cleanDoc = doc.trim().replace(/[\.\-\s]/g, "");
    if (cleanDoc.length < 5 || cleanDoc.length > 20) {
      return Result.fail<DocumentNumber>(
        "Document number must be between 5 and 20 alphanumeric characters."
      );
    }
    return Result.ok<DocumentNumber>(new DocumentNumber(cleanDoc));
  }

  public equals(other?: DocumentNumber): boolean {
    if (!other) return false;
    return this._value === other._value;
  }
}
