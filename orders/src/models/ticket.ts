import mongoose, { Document } from "mongoose";
import { Order, OrderStatus } from '../models/order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends TicketAttrs, Document {
  isReserved(): Promise<boolean>;
  version: number;
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
      versionKey: true,
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket = mongoose.model<TicketDoc>("Ticket", ticketSchema);

export { Ticket };
