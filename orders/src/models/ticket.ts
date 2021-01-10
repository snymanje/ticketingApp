import mongoose, { Document } from "mongoose";
import { Order, OrderStatus } from '../models/order';

export interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends TicketAttrs, Document {
  isReserved(): Promise<boolean>;
}

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

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: <TicketDoc>this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.Awaitingpayment, OrderStatus.Complete],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc>("Ticket", ticketSchema);

export { Ticket };
