import express, { Request, Response} from "express";
import { body } from 'express-validator';
import { NotFoundError, requireAuth, validateRequest, BadRequestError, OrderStatus } from "@snymanje/common";
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order, OrderAttrs } from '../models/order';
import { natsWrapper } from './../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(`/api/orders`, requireAuth, [
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided')
],validateRequest, async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying ti order in the Database
    const ticket = await Ticket.findById(ticketId);
    if(!ticket) {
        throw new NotFoundError();
    }

    // Make sure the ticket is not already reserved
    const isReserved = await ticket.isReserved();

    if(isReserved) {
        throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save to Database
    const newOrder: OrderAttrs = {
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    };

    const order = await Order.create(newOrder);
    await order.save();
    
    // Publish an event saying that an order was created 
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    })

    res.status(201).send(order);
})

export { router as newOrderRouter }