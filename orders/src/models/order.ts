import { Document, Schema, model } from "mongoose";
import { TicketDoc } from './ticket';
import { OrderStatus } from '@snymanje/common';

export { OrderStatus };

export interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrdersDoc extends OrderAttrs, Document {}

const ordersSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: Schema.Types.Date
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    }
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

const Order = model<OrdersDoc>("Order", ordersSchema);

export { Order };
