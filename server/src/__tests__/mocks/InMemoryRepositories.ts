import { AuditLog } from "../../domain/entities/AuditLog";
import { Customer } from "../../domain/entities/Customer";
import { PointsTransaction } from "../../domain/entities/PointsTransaction";
import { Product } from "../../domain/entities/Product";
import { RedemptionCode } from "../../domain/entities/RedemptionCode";
import { Staff } from "../../domain/entities/Staff";
import { PaginatedResult, PaginationHelper, PaginationOptions } from "../../core/Pagination";
import { AuditLogSearchCriteria, IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { ICustomerRepository, CustomerSearchCriteria } from "../../domain/repositories/ICustomerRepository";
import { IProductRepository, ProductSearchCriteria } from "../../domain/repositories/IProductRepository";
import { IRedemptionCodeRepository } from "../../domain/repositories/IRedemptionCodeRepository";
import { IStaffRepository, StaffSearchCriteria } from "../../domain/repositories/IStaffRepository";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { Email } from "../../domain/value-objects/Email";
import { RedemptionToken } from "../../domain/value-objects/RedemptionToken";


export class InMemoryCustomerRepository implements ICustomerRepository {
  public customers: Customer[] = [];

  async findById(id: string): Promise<Customer | null> {
    return this.customers.find((c) => c.id === id) || null;
  }
  async findByEmail(email: Email): Promise<Customer | null> {
    return this.customers.find((c) => c.email.equals(email)) || null;
  }
  async findByDocumentNumber(doc: DocumentNumber): Promise<Customer | null> {
    return this.customers.find((c) => c.documentNumber.equals(doc)) || null;
  }
  async save(customer: Customer): Promise<Customer> {
    const existingIndex = this.customers.findIndex((c) => c.id === customer.id);
    if (existingIndex >= 0) {
      this.customers[existingIndex] = customer;
      return customer;
    }
    const withId = new Customer({
      id: customer.id || `cust_${Date.now()}_${Math.random()}`,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      documentNumber: customer.documentNumber,
      passwordHash: customer.passwordHash,
      pointsBalance: customer.pointsBalance,
      isActive: customer.isActive,
    });
    this.customers.push(withId);
    return withId;
  }
  async search(criteria: CustomerSearchCriteria): Promise<PaginatedResult<Customer>> {
    const filtered = this.customers.filter((c) => {
      if (criteria.isActive !== undefined && c.isActive !== criteria.isActive) return false;
      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase();
        return (
          c.name.toLowerCase().includes(term) ||
          c.email.value.includes(term) ||
          c.documentNumber.value.includes(term)
        );
      }
      return true;
    });

    const { page, limit, skip } = PaginationHelper.normalize(
      { page: criteria.page, limit: criteria.limit },
      10
    );
    const items = filtered.slice(skip, skip + limit);
    return PaginationHelper.createPaginatedResult(items, filtered.length, page, limit);
  }
}

export class InMemoryStaffRepository implements IStaffRepository {
  public staffList: Staff[] = [];

  async findById(id: string): Promise<Staff | null> {
    return this.staffList.find((s) => s.id === id) || null;
  }
  async findByEmail(email: Email): Promise<Staff | null> {
    return this.staffList.find((s) => s.email.equals(email)) || null;
  }
  async findByDocumentNumber(doc: DocumentNumber): Promise<Staff | null> {
    return this.staffList.find((s) => s.documentNumber && s.documentNumber.equals(doc)) || null;
  }
  async findAll(criteria?: StaffSearchCriteria): Promise<PaginatedResult<Staff>> {
    const filtered = this.staffList.filter((s) => {
      if (criteria?.isActive !== undefined && s.isActive !== criteria.isActive) return false;
      if (criteria?.role && s.role !== criteria.role) return false;
      if (criteria?.searchTerm) {
        const term = criteria.searchTerm.toLowerCase();
        return (
          s.name.toLowerCase().includes(term) ||
          s.email.value.includes(term) ||
          (s.documentNumber && s.documentNumber.value.includes(term))
        );
      }
      return true;
    });

    const { page, limit, skip } = PaginationHelper.normalize(
      { page: criteria?.page, limit: criteria?.limit },
      10
    );
    const items = filtered.slice(skip, skip + limit);
    return PaginationHelper.createPaginatedResult(items, filtered.length, page, limit);
  }
  async save(staff: Staff): Promise<Staff> {
    const existing = this.staffList.findIndex((s) => s.id === staff.id);
    if (existing >= 0) {
      this.staffList[existing] = staff;
      return staff;
    }
    const withId = new Staff({
      id: staff.id || `staff_${Date.now()}`,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      documentNumber: staff.documentNumber,
      passwordHash: staff.passwordHash,
      role: staff.role,
      isActive: staff.isActive,
    });
    this.staffList.push(withId);
    return withId;
  }
  async delete(id: string): Promise<void> {
    this.staffList = this.staffList.filter((s) => s.id !== id);
  }
}

export class InMemoryProductRepository implements IProductRepository {
  public products: Product[] = [];

  async findById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) || null;
  }
  async findAll(
    criteria?: ProductSearchCriteria | boolean
  ): Promise<PaginatedResult<Product>> {
    const options: ProductSearchCriteria =
      typeof criteria === "boolean" ? { onlyActive: criteria } : criteria || {};

    const filtered = this.products.filter((p) => {
      if (options.onlyActive && !p.isActive) return false;
      if (options.searchTerm) {
        const term = options.searchTerm.toLowerCase();
        return p.name.toLowerCase().includes(term);
      }
      return true;
    });

    const { page, limit, skip } = PaginationHelper.normalize(
      { page: options.page, limit: options.limit },
      12
    );
    const items = filtered.slice(skip, skip + limit);
    return PaginationHelper.createPaginatedResult(items, filtered.length, page, limit);
  }
  async save(product: Product): Promise<Product> {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      this.products[index] = product;
      return product;
    }
    const withId = new Product({
      id: product.id || `prod_${Date.now()}`,
      name: product.name,
      imageUrl: product.imageUrl,
      pointsRequired: product.pointsRequired,
      isActive: product.isActive,
    });
    this.products.push(withId);
    return withId;
  }
  async delete(id: string): Promise<void> {
    this.products = this.products.filter((p) => p.id !== id);
  }
}

export class InMemoryRedemptionCodeRepository implements IRedemptionCodeRepository {
  public codes: RedemptionCode[] = [];

  async findById(id: string): Promise<RedemptionCode | null> {
    return this.codes.find((c) => c.id === id) || null;
  }
  async findByCode(code: RedemptionToken): Promise<RedemptionCode | null> {
    return this.codes.find((c) => c.code.value === code.value) || null;
  }
  async findByCustomerId(
    customerId: string,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<RedemptionCode>> {
    const filtered = this.codes.filter((c) => c.customerId === customerId);
    const { page, limit, skip } = PaginationHelper.normalize(pagination, 10);
    const items = filtered.slice(skip, skip + limit);
    return PaginationHelper.createPaginatedResult(items, filtered.length, page, limit);
  }
  async save(redemption: RedemptionCode): Promise<RedemptionCode> {
    const idx = this.codes.findIndex((c) => c.id === redemption.id);
    if (idx >= 0) {
      this.codes[idx] = redemption;
      return redemption;
    }
    const withId = new RedemptionCode({
      id: redemption.id || `red_${Date.now()}`,
      code: redemption.code,
      customerId: redemption.customerId,
      productId: redemption.productId,
      pointsSpent: redemption.pointsSpent,
      status: redemption.status,
      expiresAt: redemption.expiresAt,
      consumedAt: redemption.consumedAt,
      consumedByStaffId: redemption.consumedByStaffId,
      createdAt: redemption.createdAt,
    });
    this.codes.push(withId);
    return withId;
  }
}

export class InMemoryTransactionRepository implements ITransactionRepository {
  public transactions: PointsTransaction[] = [];

  async save(tx: PointsTransaction): Promise<PointsTransaction> {
    this.transactions.push(tx);
    return tx;
  }
  async findByCustomerId(customerId: string): Promise<PointsTransaction[]> {
    return this.transactions.filter((t) => t.customerId === customerId);
  }
}

export class InMemoryAuditLogRepository implements IAuditLogRepository {
  public logs: AuditLog[] = [];

  async save(auditLog: AuditLog): Promise<AuditLog> {
    const withId = new AuditLog({
      id: auditLog.id || `audit_${Date.now()}_${Math.random()}`,
      action: auditLog.action,
      category: auditLog.category,
      actorId: auditLog.actorId,
      actorName: auditLog.actorName,
      actorEmail: auditLog.actorEmail,
      actorRole: auditLog.actorRole,
      targetId: auditLog.targetId,
      targetName: auditLog.targetName,
      targetType: auditLog.targetType,
      description: auditLog.description,
      details: auditLog.details,
      createdAt: auditLog.createdAt,
    });
    this.logs.unshift(withId);
    return withId;
  }

  async search(criteria: AuditLogSearchCriteria): Promise<PaginatedResult<AuditLog>> {
    const filtered = this.logs.filter((log) => {
      if (criteria.category && log.category !== criteria.category) return false;
      if (criteria.action && log.action !== criteria.action) return false;
      if (criteria.actorRole && log.actorRole !== criteria.actorRole) return false;
      if (criteria.actorId && log.actorId !== criteria.actorId) return false;
      if (criteria.targetId && log.targetId !== criteria.targetId) return false;
      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase();
        const matchesActor = log.actorName.toLowerCase().includes(term);
        const matchesTarget = log.targetName ? log.targetName.toLowerCase().includes(term) : false;
        const matchesDesc = log.description.toLowerCase().includes(term);
        const matchesEmail = log.actorEmail ? log.actorEmail.toLowerCase().includes(term) : false;
        if (!matchesActor && !matchesTarget && !matchesDesc && !matchesEmail) {
          return false;
        }
      }
      return true;
    });

    const { page, limit, skip } = PaginationHelper.normalize(criteria, 15);
    const items = filtered.slice(skip, skip + limit);
    return PaginationHelper.createPaginatedResult(items, filtered.length, page, limit);
  }
}
