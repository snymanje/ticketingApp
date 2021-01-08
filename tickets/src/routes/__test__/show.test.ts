import request from "supertest";
import { app } from "../../app";

it('retuens a 404 if the ticket is not found', async () => {
    await request(app)
        .get('/api/tickets/sdfsfsdfsdf')
        .send()
        .expect(404);
})

it('returns the ticket if the ticket is found', async () => {
    
    const title = "ticket1"
    const price = 30

    const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title, price
    })
    .expect(201);

    const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
})