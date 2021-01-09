import mongoose, { Document, Model } from "mongoose";

// An interface that describes this object
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends Document {
    title: string;
    price: number;
    userId: string;
}

interface TicketModel extends Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
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
        required: true
    }
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        delete ret._id;
      }
    }
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
