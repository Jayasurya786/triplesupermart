import { asyncHandler } from "../utils/asyncHandler";
import * as customerService from "../services/customerService";

export const listCustomers = asyncHandler(async (_req, res) => {
  const customers = await customerService.listCustomers();
  res.status(200).json({ customers });
});

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  res.status(200).json({ customer });
});

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(req.body);
  res.status(201).json({ customer });
});
