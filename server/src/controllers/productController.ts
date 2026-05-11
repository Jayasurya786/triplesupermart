import { asyncHandler } from "../utils/asyncHandler";
import * as productService from "../services/productService";

export const listProducts = asyncHandler(async (_req, res) => {
  const products = await productService.listProducts();
  res.status(200).json({ products });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({ product });
});
