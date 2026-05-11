import * as offerRepository from "../repositories/offerRepository";
import { ApiError } from "../utils/apiError";

export async function listOffers() {
  return offerRepository.list();
}

export async function createOffer(input: {
  title: string;
  detail?: string;
  active?: boolean;
  startsAt?: string | Date;
  endsAt?: string | Date;
}) {
  const title = input.title?.trim();
  if (!title) {
    throw new ApiError(400, "Offer title is required");
  }

  const startsAt = input.startsAt ? new Date(input.startsAt) : undefined;
  const endsAt = input.endsAt ? new Date(input.endsAt) : undefined;

  if (startsAt && Number.isNaN(startsAt.getTime())) {
    throw new ApiError(400, "Invalid start date");
  }
  if (endsAt && Number.isNaN(endsAt.getTime())) {
    throw new ApiError(400, "Invalid end date");
  }
  if (startsAt && endsAt && startsAt > endsAt) {
    throw new ApiError(400, "End date must be after start date");
  }

  return offerRepository.create({
    title,
    detail: input.detail?.trim(),
    active: input.active ?? true,
    startsAt,
    endsAt,
  });
}

export async function removeOffer(offerId: string) {
  const removedOffer = await offerRepository.deleteById(offerId);
  if (!removedOffer) {
    throw new ApiError(404, "Offer not found");
  }

  return removedOffer;
}
