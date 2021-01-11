import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket, TicketAttrs } from '../../models/ticket';

const buildTciket = async () => {
    const ticket = new Ticket({
        title: 'concert',
        price: 360
    });
    await ticket.save();

    return ticket;
}
 
it('fetches orders for a particular user', async () => {
    // Create three Ticket
    const ticketOne = await buildTciket();
    const ticketTwo = await buildTciket();
    const ticketThree = await buildTciket();

    const userOne = global.signin();
    const userTwo = global.signin();

    // Create one order as User #1
    const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id})
    .expect(201);

    // Create two orders as User #2
    const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id})
    .expect(201);

    const { body: orderThree } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id})
    .expect(201);

    // Make request to get orders for user #2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);
    // Make sure we only get the orders for User #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderTwo.id)
    expect(response.body[1].id).toEqual(orderThree.id)

    expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
    expect(response.body[1].ticket.id).toEqual(ticketThree.id)
})