import { CustomerModel } from "../models/Customer";

export async function findByEmail(email?: string) {
  if (!email) return null;
  return CustomerModel.findOne({ email }).exec();
}

export async function findByCustomerId(customerId: string) {
  return CustomerModel.findOne({ customerId }).exec();
}

export async function create(input: {
  name: string;
  email?: string;
  phone: string;
  customerId: string;
  tier: string;
  points: number;
}) {
  return CustomerModel.create(input);
}

export async function list() {
  return CustomerModel.find().limit(100).exec();
}

export async function adjustPoints(customerId: string, points: number) {
  return CustomerModel.findOneAndUpdate(
    { customerId },
    { $inc: { points } },
    { new: true }
  ).exec();
}
