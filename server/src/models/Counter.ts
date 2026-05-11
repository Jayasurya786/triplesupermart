import { Schema, model, type Document } from "mongoose";

interface CounterDocument extends Document {
  name: string;
  seq: number;
}

const CounterSchema = new Schema<CounterDocument>({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, required: true, default: 0 },
});

export const CounterModel = model<CounterDocument>("Counter", CounterSchema);
