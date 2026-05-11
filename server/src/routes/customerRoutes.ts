import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { listCustomers, getCustomer, createCustomer } from "../controllers/customerController";

export const customerRoutes = Router();

customerRoutes.get("/", authenticate, requireRole(["admin", "staff"]), listCustomers);
customerRoutes.get("/:customerId", authenticate, getCustomer);
customerRoutes.post("/", authenticate, requireRole(["admin", "staff"]), createCustomer);
