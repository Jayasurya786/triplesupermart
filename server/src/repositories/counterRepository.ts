import { CounterModel } from "../models/Counter";

export async function next(name: string) {
  const counter = await CounterModel.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).exec();

  return counter.seq;
}
