import { ApiError } from "../utils/apiError";
import { formatCustomerId } from "../utils/id";
import * as customerRepository from "../repositories/customerRepository";
import * as counterRepository from "../repositories/counterRepository";

interface CreateCustomerInput {
  name: string;
  email?: string;
  phone: string;
}

function getDuplicateKey(error: unknown): string | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const candidate = error as { code?: number; keyPattern?: Record<string, number> };
  if (candidate.code !== 11000 || !candidate.keyPattern) {
    return null;
  }

  const [key] = Object.keys(candidate.keyPattern);
  return key ?? null;
}

export async function createCustomer(input: CreateCustomerInput) {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const normalizedEmail = input.email?.trim().toLowerCase() || undefined;

  if (!name) {
    throw new ApiError(400, "Customer name is required");
  }

  if (!phone) {
    throw new ApiError(400, "Customer phone is required");
  }

  if (normalizedEmail) {
    const existing = await customerRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new ApiError(409, "Email already registered for another customer");
    }
  }

  // Retry a few times in case the counter-generated ID collides with existing data.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const sequence = await counterRepository.next("customer");
    const customerId = formatCustomerId(sequence);
    const createPayload = {
      name,
      phone,
      customerId,
      tier: "Fresh" as const,
      points: 0,
      ...(normalizedEmail ? { email: normalizedEmail } : {}),
    };

    try {
      return await customerRepository.create(createPayload);
    } catch (error) {
      const duplicateKey = getDuplicateKey(error);

      if (duplicateKey === "email") {
        throw new ApiError(409, "Email already registered for another customer");
      }

      if (duplicateKey === "customerId") {
        if (attempt < 2) {
          continue;
        }
        throw new ApiError(409, "Could not allocate a unique customer ID. Please try again.");
      }

      throw error;
    }
  }

  throw new ApiError(409, "Could not create customer. Please try again.");
}

export async function listCustomers() {
  return customerRepository.list();
}

export async function getCustomerById(customerId: string) {
  const customer = await customerRepository.findByCustomerId(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return customer;
}
