import { PaginatedResult, PaginationHelper } from "../../core/Pagination";
import { Customer } from "../../domain/entities/Customer";
import {
  CustomerSearchCriteria,
  ICustomerRepository,
} from "../../domain/repositories/ICustomerRepository";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { Email } from "../../domain/value-objects/Email";
import { CustomerMapper } from "../database/mappers/CustomerMapper";
import { UserModel } from "../database/schemas/UserSchema";

export class MongoCustomerRepository implements ICustomerRepository {
  public async findById(id: string): Promise<Customer | null> {
    const doc = await UserModel.findOne({ _id: id, role: "CUSTOMER" });
    return doc ? CustomerMapper.toDomain(doc) : null;
  }

  public async findByEmail(email: Email): Promise<Customer | null> {
    const doc = await UserModel.findOne({ email: email.value, role: "CUSTOMER" });
    return doc ? CustomerMapper.toDomain(doc) : null;
  }

  public async findByDocumentNumber(documentNumber: DocumentNumber): Promise<Customer | null> {
    const doc = await UserModel.findOne({
      documentNumber: documentNumber.value,
      role: "CUSTOMER",
    });
    return doc ? CustomerMapper.toDomain(doc) : null;
  }

  public async save(customer: Customer): Promise<Customer> {
    const persistenceData = CustomerMapper.toPersistence(customer);
    if (customer.id) {
      const updated = await UserModel.findByIdAndUpdate(
        customer.id,
        { $set: persistenceData },
        { new: true }
      );
      if (!updated) throw new Error(`Customer with id ${customer.id} not found.`);
      return CustomerMapper.toDomain(updated);
    }

    const created = await UserModel.create(persistenceData);
    return CustomerMapper.toDomain(created);
  }

  public async search(criteria: CustomerSearchCriteria): Promise<PaginatedResult<Customer>> {
    const query: Record<string, any> = { role: "CUSTOMER" };
    if (criteria.isActive !== undefined) {
      query.isActive = criteria.isActive;
    }
    if (criteria.searchTerm) {
      const regex = new RegExp(criteria.searchTerm.trim(), "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { documentNumber: regex },
        { phone: regex },
      ];
    }

    const { page, limit, skip } = PaginationHelper.normalize(
      { page: criteria.page, limit: criteria.limit },
      10
    );

    const [total, docs] = await Promise.all([
      UserModel.countDocuments(query),
      UserModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    const items = docs.map((doc) => CustomerMapper.toDomain(doc));
    return PaginationHelper.createPaginatedResult(items, total, page, limit);
  }
}

