import { Router } from "express";
import { listOffers, createOffer, deleteOffer } from "../controllers/offerController";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";

export const offerRoutes = Router();

offerRoutes.get("/", listOffers);
offerRoutes.post("/", authenticate, requireRole(["admin", "staff"]), createOffer);
offerRoutes.delete("/:offerId", authenticate, requireRole(["admin", "staff"]), deleteOffer);
