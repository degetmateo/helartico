import { PaginatedResult, PaginationHelper } from "../../core/Pagination";
import { Staff } from "../../domain/entities/Staff";
import {
  IStaffRepository,
  StaffSearchCriteria,
} from "../../domain/repositories/IStaffRepository";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { Email } from "../../domain/value-objects/Email";
import { StaffMapper } from "../database/mappers/StaffMapper";
import { UserModel } from "../database/schemas/UserSchema";

export class MongoStaffRepository implements IStaffRepository {
  public async findById(id: string): Promise<Staff | null> {
    const doc = await UserModel.findOne({ _id: id, role: "STAFF" });
    return doc ? StaffMapper.toDomain(doc) : null;
  }

  public async findByEmail(email: Email): Promise<Staff | null> {
    const doc = await UserModel.findOne({ email: email.value, role: "STAFF" });
    return doc ? StaffMapper.toDomain(doc) : null;
  }

  public async findByDocumentNumber(documentNumber: DocumentNumber): Promise<Staff | null> {
    const doc = await UserModel.findOne({
      documentNumber: documentNumber.value,
      role: "STAFF",
    });
    return doc ? StaffMapper.toDomain(doc) : null;
  }

  public async findAll(criteria?: StaffSearchCriteria): Promise<PaginatedResult<Staff>> {
    const query: Record<string, any> = { role: "STAFF" };

    if (criteria?.isActive !== undefined) {
      query.isActive = criteria.isActive;
    }

    if (criteria?.role) {
      query.staffRole = criteria.role;
    }

    if (criteria?.searchTerm) {
      const regex = new RegExp(criteria.searchTerm.trim(), "i");
      query.$or = [{ name: regex }, { email: regex }, { documentNumber: regex }];
    }

    const { page, limit, skip } = PaginationHelper.normalize(
      { page: criteria?.page, limit: criteria?.limit },
      10
    );

    const [total, docs] = await Promise.all([
      UserModel.countDocuments(query),
      UserModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    const items = docs.map((doc) => StaffMapper.toDomain(doc));
    return PaginationHelper.createPaginatedResult(items, total, page, limit);
  }

  public async save(staff: Staff): Promise<Staff> {
    const persistenceData = StaffMapper.toPersistence(staff);
    if (staff.id) {
      const updated = await UserModel.findByIdAndUpdate(
        staff.id,
        { $set: persistenceData },
        { new: true }
      );
      if (!updated) throw new Error(`Staff with id ${staff.id} not found.`);
      return StaffMapper.toDomain(updated);
    }

    const created = await UserModel.create(persistenceData);
    return StaffMapper.toDomain(created);
  }

  public async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
}
