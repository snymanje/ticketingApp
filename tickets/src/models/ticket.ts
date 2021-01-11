import mongoose, { Document } from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends TicketAttrs, Document {
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
    userId: {
      type: String,
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket = mongoose.model<TicketDoc>("Ticket", ticketSchema);

export { Ticket };
