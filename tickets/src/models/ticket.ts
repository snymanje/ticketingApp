import mongoose, { Document } from "mongoose";

export interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends TicketAttrs, Document {}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        delete ret._id;
      },
    },
  }
);

const Ticket = mongoose.model<TicketDoc>("Ticket", ticketSchema);

export { Ticket };
