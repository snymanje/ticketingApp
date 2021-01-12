import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("fecthes the order", async () => {

    const ticket = Ticket.build({
        id: '32434',
        title: 'concert',
        price: 360
    });
    await ticket.save();

    const user = global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    const { body: fetchedOder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOder.id).toEqual(order.id);
})