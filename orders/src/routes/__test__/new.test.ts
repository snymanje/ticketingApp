import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket, TicketAttrs } from "../../models/ticket";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const newTicket: TicketAttrs = {
    title: "concert",
    price: 123,
  };
  const ticket = new Ticket(newTicket);
  await ticket.save();

  const newOrder = {
    ticket,
    userId: "laskdflkajsdf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  };
  const order = new Order(newOrder);
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const newTicket: TicketAttrs = {
    title: "concert",
    price: 123,
  };
  const ticket = new Ticket(newTicket);
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo("emits an order created event");
