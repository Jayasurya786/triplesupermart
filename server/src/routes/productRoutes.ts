import { Router } from "express";
import { listProducts, createProduct } from "../controllers/productController";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";

export const productRoutes = Router();

productRoutes.get("/", listProducts);
productRoutes.post("/", authenticate, requireRole(["admin", "staff"]), createProduct);
