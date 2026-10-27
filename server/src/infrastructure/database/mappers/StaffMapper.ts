import { Staff, StaffRole } from "../../../domain/entities/Staff";
import { DocumentNumber } from "../../../domain/value-objects/DocumentNumber";
import { Email } from "../../../domain/value-objects/Email";
import { IUserDocument } from "../schemas/UserSchema";

export class StaffMapper {
  public static toDomain(doc: IUserDocument): Staff {
    const emailResult = Email.create(doc.email);
    if (emailResult.isFailure) {
      throw new Error(`Corrupt staff document email: ${doc._id}`);
    }

    let documentNumber: DocumentNumber | undefined;
    if (doc.documentNumber) {
      const docResult = DocumentNumber.create(doc.documentNumber);
      if (docResult.isSuccess) {
        documentNumber = docResult.getValue();
      }
    }

    const role: StaffRole =
      doc.staffRole || (doc.email === "admin@helartico.com" ? "ADMIN" : "EMPLOYEE");

    return new Staff({
      id: doc._id.toString(),
      name: doc.name,
      email: emailResult.getValue(),
      phone: doc.phone || "",
      documentNumber,
      passwordHash: doc.passwordHash,
      role,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(staff: Staff): Partial<IUserDocument> {
    const data: Partial<IUserDocument> = {
      name: staff.name,
      email: staff.email.value,
      phone: staff.phone || "",
      passwordHash: staff.passwordHash,
      role: "STAFF",
      staffRole: staff.role,
      isActive: staff.isActive,
    };

    if (staff.documentNumber) {
      data.documentNumber = staff.documentNumber.value;
    }

    return data;
  }
}
