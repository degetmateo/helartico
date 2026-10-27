import { MongoConnection } from "./MongoConnection";
import { UserModel } from "./schemas/UserSchema";
import { ProductModel } from "./schemas/ProductSchema";
import { BcryptPasswordHasher } from "../security/BcryptPasswordHasher";

async function seed(): Promise<void> {
  console.log("[Seed] Connecting to database...");
  await MongoConnection.connect();

  const existingStaff = await UserModel.findOne({ role: "STAFF" });
  if (!existingStaff) {
    console.log("[Seed] Creating initial Staff administrator...");
    const passwordHash = await BcryptPasswordHasher.hash("admin1234");
    await UserModel.create({
      name: "Administrador Helartico",
      email: "admin@helartico.com",
      phone: "+5491100000000",
      documentNumber: "00000000",
      passwordHash,
      role: "STAFF",
      staffRole: "ADMIN",
      isActive: true,
      pointsBalance: 0,
    });
    console.log("[Seed] Initial staff created: admin@helartico.com / admin1234 (ADMIN)");
  } else {
    if (!existingStaff.staffRole) {
      existingStaff.staffRole = "ADMIN";
      await existingStaff.save();
      console.log("[Seed] Existing staff updated with staffRole: ADMIN.");
    } else {
      console.log("[Seed] Staff administrator already exists.");
    }
  }

  const existingCustomer = await UserModel.findOne({ role: "CUSTOMER" });
  if (!existingCustomer) {
    console.log("[Seed] Creating sample test customer...");
    const customerPasswordHash = await BcryptPasswordHasher.hash("cliente1234");
    await UserModel.create({
      name: "Cliente Prueba",
      email: "cliente@helartico.com",
      phone: "+5491144445555",
      documentNumber: "35123456",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      isActive: true,
      pointsBalance: 350,
    });
    console.log("[Seed] Sample customer created: cliente@helartico.com / cliente1234 (350 pts)");
  } else {
    console.log("[Seed] Sample customers already exist.");
  }

  const existingProducts = await ProductModel.countDocuments();
  if (existingProducts === 0) {
    console.log("[Seed] Creating initial redeemable products...");
    await ProductModel.insertMany([
      {
        name: "Cucurucho Artesanal 2 Bochas",
        imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=60",
        pointsRequired: 150,
        isActive: true,
      },
      {
        name: "Café Latte Especial con Arte",
        imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=60",
        pointsRequired: 80,
        isActive: true,
      },
      {
        name: "Helado 1/4 Kg Sabores a Elección",
        imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60",
        pointsRequired: 220,
        isActive: true,
      },
      {
        name: "Capuchino Italiano + Medialuna",
        imageUrl: "https://images.unsplash.com/photo-1572442388796-11668ba67e53?w=500&auto=format&fit=crop&q=60",
        pointsRequired: 100,
        isActive: true,
      },
      {
        name: "Sundae de Chocolate Belga & Frutos Rojos",
        imageUrl: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500&auto=format&fit=crop&q=60",
        pointsRequired: 180,
        isActive: true,
      },
    ]);
    console.log("[Seed] Sample redeemable products created.");
  } else {
    console.log("[Seed] Products already present in catalog.");
  }

  await MongoConnection.disconnect();
  console.log("[Seed] Seeding finished successfully.");
}

seed().catch((err) => {
  console.error("[Seed] Error executing seed script:", err);
  process.exit(1);
});
