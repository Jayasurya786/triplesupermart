import { asyncHandler } from "../utils/asyncHandler";
import * as offerService from "../services/offerService";

export const listOffers = asyncHandler(async (_req, res) => {
  const offers = await offerService.listOffers();
  res.status(200).json({ offers });
});

export const createOffer = asyncHandler(async (req, res) => {
  const offer = await offerService.createOffer(req.body);
  res.status(201).json({ offer });
});

export const deleteOffer = asyncHandler(async (req, res) => {
  await offerService.removeOffer(req.params.offerId);
  res.status(200).json({ message: "Offer removed" });
});
