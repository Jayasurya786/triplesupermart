import { ProductModel } from "../models/Product";

export async function list() {
  return ProductModel.find().limit(50).exec();
}

export async function create(input: { name: string; category: string }) {
  return ProductModel.create(input);
}
