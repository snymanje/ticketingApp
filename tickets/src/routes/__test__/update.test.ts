import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("has a route handler to /api/tickets for put request", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "232423",
      price: 45,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/tickets/${id}`)
      .send({
        title: "232423",
        price: 45,
      })
      .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {

});

it("returns a 400 if user provides invalid title or price", async () => {

});

it("creates a ticket with valid inputs", async () => {

});
