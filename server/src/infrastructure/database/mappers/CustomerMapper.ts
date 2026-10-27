import { Customer } from "../../../domain/entities/Customer";
import { DocumentNumber } from "../../../domain/value-objects/DocumentNumber";
import { Email } from "../../../domain/value-objects/Email";
import { Points } from "../../../domain/value-objects/Points";
import { IUserDocument } from "../schemas/UserSchema";

export class CustomerMapper {
  public static toDomain(doc: IUserDocument): Customer {
    if (!doc.documentNumber || !doc.phone) {
      throw new Error(`Corrupt customer document: ${doc._id}`);
    }

    const emailResult = Email.create(doc.email);
    const docResult = DocumentNumber.create(doc.documentNumber);
    const pointsResult = Points.create(doc.pointsBalance);

    if (emailResult.isFailure || docResult.isFailure || pointsResult.isFailure) {
      throw new Error(`Corrupt customer document: ${doc._id}`);
    }

    return new Customer({
      id: doc._id.toString(),
      name: doc.name,
      email: emailResult.getValue(),
      phone: doc.phone,
      documentNumber: docResult.getValue(),
      passwordHash: doc.passwordHash,
      pointsBalance: pointsResult.getValue(),
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(customer: Customer): Partial<IUserDocument> {
    return {
      name: customer.name,
      email: customer.email.value,
      phone: customer.phone,
      documentNumber: customer.documentNumber.value,
      passwordHash: customer.passwordHash,
      role: "CUSTOMER",
      pointsBalance: customer.pointsBalance.value,
      isActive: customer.isActive,
    };
  }
}
