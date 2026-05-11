import * as productRepository from "../repositories/productRepository";

export async function listProducts() {
  return productRepository.list();
}

export async function createProduct(input: { name: string; category: string }) {
  return productRepository.create(input);
}
