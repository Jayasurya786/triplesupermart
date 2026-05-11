import { UserModel, type UserDocument } from "../models/User";

export async function findByEmail(email: string) {
  return UserModel.findOne({ email }).exec();
}

export async function findById(id: string) {
  return UserModel.findById(id).exec();
}

export async function create(input: {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: string;
  customerId?: string;
}) {
  return UserModel.create(input);
}

export async function updatePassword(id: string, passwordHash: string) {
  return UserModel.findByIdAndUpdate(id, { passwordHash }, { new: true }).exec();
}

export function sanitizeUser(user: UserDocument) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    customerId: user.customerId,
  };
}
