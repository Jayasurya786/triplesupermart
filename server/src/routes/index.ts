import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { customerRoutes } from "./customerRoutes";
import { productRoutes } from "./productRoutes";
import { offerRoutes } from "./offerRoutes";
import { loyaltyRoutes } from "./loyaltyRoutes";
import { adminRoutes } from "./adminRoutes";
import { notificationRoutes } from "./notificationRoutes";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/customers", customerRoutes);
apiRouter.use("/products", productRoutes);
apiRouter.use("/offers", offerRoutes);
apiRouter.use("/loyalty", loyaltyRoutes);
apiRouter.use("/admin", adminRoutes);
apiRouter.use("/notifications", notificationRoutes);
