import { OfferModel } from "../models/Offer";

export async function list() {
  return OfferModel.find().sort({ createdAt: -1 }).limit(200).exec();
}

export async function create(input: {
  title: string;
  detail?: string;
  active?: boolean;
  startsAt?: Date;
  endsAt?: Date;
}) {
  return OfferModel.create(input);
}

export async function deleteById(id: string) {
  return OfferModel.findByIdAndDelete(id).exec();
}
