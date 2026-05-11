import { apiFetch } from "@/api/client";

export interface OfferRecord {
  _id: string;
  title: string;
  detail?: string;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function listOffers() {
  return apiFetch<{ offers: OfferRecord[] }>("/offers");
}

export async function createOffer(payload: {
  title: string;
  detail?: string;
  active?: boolean;
  startsAt?: string;
  endsAt?: string;
}) {
  return apiFetch<{ offer: OfferRecord }>("/offers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteOffer(offerId: string) {
  return apiFetch<{ message: string }>(`/offers/${offerId}`, {
    method: "DELETE",
  });
}
