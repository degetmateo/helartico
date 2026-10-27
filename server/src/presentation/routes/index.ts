import { Router } from "express";
import { AuthenticateUserUseCase } from "../../application/auth/AuthenticateUserUseCase";
import { CreateStaffUseCase } from "../../application/auth/CreateStaffUseCase";
import { RegisterCustomerUseCase } from "../../application/auth/RegisterCustomerUseCase";
import { AddPointsUseCase } from "../../application/customers/AddPointsUseCase";
import { GetCustomerByIdUseCase } from "../../application/customers/GetCustomerByIdUseCase";
import { ListCustomersUseCase } from "../../application/customers/ListCustomersUseCase";
import { UpdateCustomerUseCase } from "../../application/customers/UpdateCustomerUseCase";
import { CreateProductUseCase } from "../../application/products/CreateProductUseCase";
import { DeleteProductUseCase } from "../../application/products/DeleteProductUseCase";
import { ListProductsUseCase } from "../../application/products/ListProductsUseCase";
import { UpdateProductUseCase } from "../../application/products/UpdateProductUseCase";
import { GetCustomerRedemptionsUseCase } from "../../application/redemptions/GetCustomerRedemptionsUseCase";
import { RedeemProductUseCase } from "../../application/redemptions/RedeemProductUseCase";
import { ValidateCodeUseCase } from "../../application/redemptions/ValidateCodeUseCase";
import { DeleteStaffUseCase } from "../../application/staff/DeleteStaffUseCase";
import { ListStaffUseCase } from "../../application/staff/ListStaffUseCase";
import { UpdateStaffUseCase } from "../../application/staff/UpdateStaffUseCase";
import { MongoCustomerRepository } from "../../infrastructure/repositories/MongoCustomerRepository";
import { MongoProductRepository } from "../../infrastructure/repositories/MongoProductRepository";
import { MongoRedemptionCodeRepository } from "../../infrastructure/repositories/MongoRedemptionCodeRepository";
import { MongoStaffRepository } from "../../infrastructure/repositories/MongoStaffRepository";
import { MongoTransactionRepository } from "../../infrastructure/repositories/MongoTransactionRepository";
import { CloudinaryImageStorageService } from "../../infrastructure/storage/CloudinaryImageStorageService";
import { AuthController } from "../controllers/AuthController";
import { CustomerController } from "../controllers/CustomerController";
import { ProductController } from "../controllers/ProductController";
import { RedemptionController } from "../controllers/RedemptionController";
import { StaffController } from "../controllers/StaffController";
import { UploadController } from "../controllers/UploadController";
import { createAuthRouter } from "./authRoutes";
import { createCustomerRouter } from "./customerRoutes";
import { createProductRouter } from "./productRoutes";
import { createRedemptionRouter } from "./redemptionRoutes";
import { createStaffRouter } from "./StaffRoutes";
import { createUploadRouter } from "./uploadRoutes";

export function createApiRouter(): Router {
  const router = Router();

  // Repositories & Services
  const customerRepo = new MongoCustomerRepository();
  const staffRepo = new MongoStaffRepository();
  const productRepo = new MongoProductRepository();
  const redemptionRepo = new MongoRedemptionCodeRepository();
  const transactionRepo = new MongoTransactionRepository();
  const imageStorageService = new CloudinaryImageStorageService();

  // Use Cases
  const authUseCase = new AuthenticateUserUseCase(customerRepo, staffRepo);
  const registerUseCase = new RegisterCustomerUseCase(customerRepo);
  const createStaffUseCase = new CreateStaffUseCase(staffRepo);
  const listStaffUseCase = new ListStaffUseCase(staffRepo);
  const updateStaffUseCase = new UpdateStaffUseCase(staffRepo);
  const deleteStaffUseCase = new DeleteStaffUseCase(staffRepo);

  const listCustomersUseCase = new ListCustomersUseCase(customerRepo);
  const getCustomerByIdUseCase = new GetCustomerByIdUseCase(customerRepo);
  const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepo);
  const addPointsUseCase = new AddPointsUseCase(customerRepo, transactionRepo);

  const listProductsUseCase = new ListProductsUseCase(productRepo);
  const createProductUseCase = new CreateProductUseCase(productRepo);
  const updateProductUseCase = new UpdateProductUseCase(productRepo, imageStorageService);
  const deleteProductUseCase = new DeleteProductUseCase(productRepo, imageStorageService);

  const redeemProductUseCase = new RedeemProductUseCase(
    customerRepo,
    productRepo,
    redemptionRepo,
    transactionRepo
  );
  const validateCodeUseCase = new ValidateCodeUseCase(redemptionRepo, customerRepo, productRepo);
  const getCustomerRedemptionsUseCase = new GetCustomerRedemptionsUseCase(
    redemptionRepo,
    productRepo
  );

  // Controllers
  const authController = new AuthController(
    authUseCase,
    registerUseCase,
    createStaffUseCase,
    customerRepo,
    staffRepo
  );
  const staffController = new StaffController(
    listStaffUseCase,
    createStaffUseCase,
    updateStaffUseCase,
    deleteStaffUseCase
  );
  const customerController = new CustomerController(
    listCustomersUseCase,
    getCustomerByIdUseCase,
    updateCustomerUseCase,
    addPointsUseCase,
    registerUseCase
  );
  const productController = new ProductController(
    listProductsUseCase,
    createProductUseCase,
    updateProductUseCase,
    deleteProductUseCase
  );
  const redemptionController = new RedemptionController(
    redeemProductUseCase,
    validateCodeUseCase,
    getCustomerRedemptionsUseCase
  );
  const uploadController = new UploadController(imageStorageService);

  // Mount routes
  router.use("/auth", createAuthRouter(authController));
  router.use("/customers", createCustomerRouter(customerController));
  router.use("/staff", createStaffRouter(staffController));
  router.use("/products", createProductRouter(productController));
  router.use("/redemptions", createRedemptionRouter(redemptionController));
  router.use("/upload", createUploadRouter(uploadController));

  return router;
}
